"""
NeuroDecod FastAPI — Stats & Insights Routes
============================================
Add this file to your backend as:  app/routers/stats.py
Then register it in main.py with:
    from app.routers.stats import router as stats_router
    app.include_router(stats_router, prefix="/stats", tags=["stats"])

Requires:
  - google-cloud-firestore  (already in your requirements)
  - fastapi, pydantic        (already in your requirements)

Firestore collection assumed: "session_events"
Adjust COLLECTION_NAME if your collection is named differently.
"""

from __future__ import annotations

import os
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from google.cloud import firestore
from pydantic import BaseModel

# ── Config ────────────────────────────────────────────────────────────────────

COLLECTION_NAME = os.getenv("FIRESTORE_COLLECTION", "session_events")

router = APIRouter()

# ── Firestore client (lazy singleton) ────────────────────────────────────────

_db: Optional[firestore.AsyncClient] = None


def get_db() -> firestore.AsyncClient:
    global _db
    if _db is None:
        _db = firestore.AsyncClient()
    return _db


# ── Pydantic response models ──────────────────────────────────────────────────


class SessionStats(BaseModel):
    total_sessions: int
    avg_resolution_minutes: float
    resolution_rate: float          # percentage 0–100
    active_caregivers: int
    notification_rate: float        # % sessions where caregiver was notified
    avg_severity: float             # average severity level 1–5
    follow_up_rate: float           # % sessions requiring follow-up


class TriggerItem(BaseModel):
    trigger: str
    count: int
    pct: float


class SessionDataPoint(BaseModel):
    month: str
    sessions: int
    resolved: int


class ResolutionDataPoint(BaseModel):
    week: str
    avgMin: float


class InterventionItem(BaseModel):
    type: str
    success: float
    count: int


class SessionHistoryItem(BaseModel):
    id: str
    timestamp: str
    trigger: str
    resolution_time_min: float
    intervention: str
    resolved: bool
    emotion_state: Optional[str] = None
    severity_level: Optional[int] = None
    ai_summary: Optional[str] = None
    caregiver_notified: bool = False


class InsightsSummary(BaseModel):
    stats: SessionStats
    triggers: list[TriggerItem]
    session_trend: list[SessionDataPoint]
    resolution_trend: list[ResolutionDataPoint]
    interventions: list[InterventionItem]
    recent_sessions: list[SessionHistoryItem]
    last_updated: str
    total_documents: int


# ── Helper functions ──────────────────────────────────────────────────────────


def _get_timestamp(doc: dict[str, Any]) -> str:
    for field in ("started_at", "created_at", "timestamp", "timestamp_utc"):
        val = doc.get(field)
        if val:
            if hasattr(val, "isoformat"):
                return val.isoformat()
            return str(val)
    return ""


def _get_trigger(doc: dict[str, Any]) -> str:
    return (
        doc.get("trigger")
        or doc.get("trigger_type")
        or doc.get("trigger_modality")
        or doc.get("metadata", {}).get("trigger")
        or "Unknown"
    )


def _get_intervention(doc: dict[str, Any]) -> str:
    return (
        doc.get("intervention")
        or doc.get("intervention_type")
        or doc.get("metadata", {}).get("intervention")
        or "AI Guidance"
    )


def _get_resolution_min(doc: dict[str, Any]) -> float:
    if isinstance(doc.get("resolution_time_min"), (int, float)):
        return float(doc["resolution_time_min"])
    if isinstance(doc.get("duration_minutes"), (int, float)):
        return float(doc["duration_minutes"])
    if isinstance(doc.get("duration_seconds"), (int, float)):
        return doc["duration_seconds"] / 60.0
    # Derive from timestamps
    start_raw = doc.get("started_at") or doc.get("created_at") or doc.get("timestamp")
    end_raw = doc.get("ended_at") or doc.get("updated_at")
    if start_raw and end_raw:
        try:
            start = start_raw if isinstance(start_raw, datetime) else datetime.fromisoformat(str(start_raw))
            end = end_raw if isinstance(end_raw, datetime) else datetime.fromisoformat(str(end_raw))
            diff = (end - start).total_seconds() / 60.0
            if diff > 0:
                return round(diff, 1)
        except Exception:
            pass
    return 0.0


def _is_resolved(doc: dict[str, Any]) -> bool:
    if isinstance(doc.get("resolved"), bool):
        return doc["resolved"]
    if isinstance(doc.get("intervention_success"), bool):
        return doc["intervention_success"]
    status = doc.get("status", "")
    if isinstance(status, str):
        return status.lower() == "resolved"
    return False


def _get_severity_level(doc: dict[str, Any]) -> int:
    if isinstance(doc.get("severity_level"), (int, float)):
        return int(doc["severity_level"])
    severity_map = {"low": 1, "medium": 2, "high": 3, "critical": 4}
    sev = doc.get("severity", "")
    if isinstance(sev, str):
        return severity_map.get(sev.lower(), 0)
    return 0


def _is_caregiver_notified(doc: dict[str, Any]) -> bool:
    if isinstance(doc.get("caregiver_notified"), bool):
        return doc["caregiver_notified"]
    if isinstance(doc.get("push_sent"), bool):
        return doc["push_sent"]
    return False


# ── Route: GET /stats/summary ─────────────────────────────────────────────────


@router.get("/summary", response_model=InsightsSummary)
async def get_stats_summary(limit: int = 500) -> InsightsSummary:
    """
    Aggregate stats, trigger breakdown, session trend, resolution trend,
    intervention effectiveness, and recent session history — all in one call.
    Used by the public dashboard on the website.
    """
    db = get_db()
    try:
        docs_ref = db.collection(COLLECTION_NAME).order_by(
            "started_at", direction=firestore.Query.DESCENDING
        ).limit(limit)
        docs_snapshot = await docs_ref.get()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Firestore unavailable: {exc}") from exc

    sessions: list[dict[str, Any]] = [doc.to_dict() or {} for doc in docs_snapshot]
    # Attach document id
    for i, doc in enumerate(docs_snapshot):
        sessions[i]["_doc_id"] = doc.id

    total = len(sessions)

    # ── Stats ─────────────────────────────────────────────────────────────────
    resolved_count = sum(1 for s in sessions if _is_resolved(s))
    resolution_rate = round((resolved_count / total * 100), 1) if total else 0.0

    durations = [_get_resolution_min(s) for s in sessions]
    valid_durations = [d for d in durations if d > 0]
    avg_resolution_minutes = (
        round(sum(valid_durations) / len(valid_durations), 1) if valid_durations else 0.0
    )

    unique_users = {
        s.get("user_id") or s.get("child_id") or s.get("profile_id")
        for s in sessions
        if s.get("user_id") or s.get("child_id") or s.get("profile_id")
    }
    active_caregivers = len(unique_users)

    notified_count = sum(1 for s in sessions if _is_caregiver_notified(s))
    notification_rate = round((notified_count / total * 100), 1) if total else 0.0

    severities = [_get_severity_level(s) for s in sessions if _get_severity_level(s) > 0]
    avg_severity = round(sum(severities) / len(severities), 1) if severities else 0.0

    follow_up_count = sum(1 for s in sessions if s.get("follow_up_required") is True)
    follow_up_rate = round((follow_up_count / total * 100), 1) if total else 0.0

    stats = SessionStats(
        total_sessions=total,
        avg_resolution_minutes=avg_resolution_minutes,
        resolution_rate=resolution_rate,
        active_caregivers=active_caregivers,
        notification_rate=notification_rate,
        avg_severity=avg_severity,
        follow_up_rate=follow_up_rate,
    )

    # ── Triggers ──────────────────────────────────────────────────────────────
    trigger_counts: dict[str, int] = defaultdict(int)
    for s in sessions:
        trigger_counts[_get_trigger(s)] += 1
    triggers = [
        TriggerItem(trigger=t, count=c, pct=round(c / total * 100, 1) if total else 0.0)
        for t, c in sorted(trigger_counts.items(), key=lambda x: -x[1])[:6]
    ]

    # ── Session trend (by month) ───────────────────────────────────────────────
    month_data: dict[str, dict[str, int]] = defaultdict(lambda: {"sessions": 0, "resolved": 0})
    for s in sessions:
        ts = _get_timestamp(s)
        if not ts:
            continue
        try:
            d = datetime.fromisoformat(ts.replace("Z", "+00:00"))
            key = d.strftime("%b '%y")
            month_data[key]["sessions"] += 1
            if _is_resolved(s):
                month_data[key]["resolved"] += 1
        except Exception:
            continue

    session_trend = [
        SessionDataPoint(month=k, sessions=v["sessions"], resolved=v["resolved"])
        for k, v in sorted(month_data.items(), key=lambda x: datetime.strptime(x[0], "%b '%y"))
    ]

    # ── Resolution trend (by week) ────────────────────────────────────────────
    week_data: dict[str, list[float]] = defaultdict(list)
    for s in sessions:
        ts = _get_timestamp(s)
        if not ts:
            continue
        try:
            d = datetime.fromisoformat(ts.replace("Z", "+00:00"))
            week_num = d.isocalendar()[1]
            key = f"W{week_num}"
            dur = _get_resolution_min(s)
            if dur > 0:
                week_data[key].append(dur)
        except Exception:
            continue

    resolution_trend = [
        ResolutionDataPoint(
            week=k,
            avgMin=round(sum(v) / len(v), 1),
        )
        for k, v in sorted(week_data.items(), key=lambda x: int(x[0][1:]))
    ]

    # ── Interventions ─────────────────────────────────────────────────────────
    intervention_data: dict[str, dict[str, int]] = defaultdict(lambda: {"total": 0, "resolved": 0})
    for s in sessions:
        itype = _get_intervention(s)
        intervention_data[itype]["total"] += 1
        if _is_resolved(s):
            intervention_data[itype]["resolved"] += 1

    interventions = [
        InterventionItem(
            type=t,
            count=v["total"],
            success=round(v["resolved"] / v["total"] * 100, 1) if v["total"] else 0.0,
        )
        for t, v in sorted(intervention_data.items(), key=lambda x: -x[1]["total"])[:5]
    ]

    # ── Recent sessions ───────────────────────────────────────────────────────
    sorted_sessions = sorted(
        [s for s in sessions if _get_timestamp(s)],
        key=lambda s: _get_timestamp(s),
        reverse=True,
    )[:10]

    recent_sessions = [
        SessionHistoryItem(
            id=str(s.get("_doc_id") or s.get("id") or s.get("session_id") or ""),
            timestamp=_get_timestamp(s),
            trigger=_get_trigger(s),
            resolution_time_min=_get_resolution_min(s),
            intervention=_get_intervention(s),
            resolved=_is_resolved(s),
            emotion_state=s.get("emotion_state"),
            severity_level=_get_severity_level(s) or None,
            ai_summary=s.get("ai_summary") or s.get("summary"),
            caregiver_notified=_is_caregiver_notified(s),
        )
        for s in sorted_sessions
    ]

    return InsightsSummary(
        stats=stats,
        triggers=triggers,
        session_trend=session_trend,
        resolution_trend=resolution_trend,
        interventions=interventions,
        recent_sessions=recent_sessions,
        last_updated=datetime.now(timezone.utc).isoformat(),
        total_documents=total,
    )


# ── Route: GET /stats/sessions ────────────────────────────────────────────────


@router.get("/sessions", response_model=list[dict])
async def get_sessions(limit: int = 200) -> list[dict]:
    """
    Return raw session documents (latest first).
    Used by the website proxy /api/proxy/sessions.
    """
    db = get_db()
    try:
        docs_ref = db.collection(COLLECTION_NAME).order_by(
            "started_at", direction=firestore.Query.DESCENDING
        ).limit(limit)
        docs_snapshot = await docs_ref.get()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Firestore unavailable: {exc}") from exc

    result = []
    for doc in docs_snapshot:
        data = doc.to_dict() or {}
        data["id"] = doc.id
        # Serialise Firestore DatetimeWithNanoseconds → ISO string
        for key, val in data.items():
            if hasattr(val, "isoformat"):
                data[key] = val.isoformat()
        result.append(data)
    return result


# ── Route: GET /stats/sessions/latest ────────────────────────────────────────


@router.get("/sessions/latest", response_model=dict)
async def get_latest_session() -> dict:
    """
    Return the single most-recent session document.
    Used by the website proxy /api/proxy/sessions/latest.
    """
    db = get_db()
    try:
        docs_ref = db.collection(COLLECTION_NAME).order_by(
            "started_at", direction=firestore.Query.DESCENDING
        ).limit(1)
        docs_snapshot = await docs_ref.get()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Firestore unavailable: {exc}") from exc

    if not docs_snapshot:
        raise HTTPException(status_code=404, detail="No sessions found")

    doc = docs_snapshot[0]
    data = doc.to_dict() or {}
    data["id"] = doc.id
    for key, val in data.items():
        if hasattr(val, "isoformat"):
            data[key] = val.isoformat()
    return data
