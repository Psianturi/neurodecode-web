// ── Raw session shape from backend (dev branch schema) ───────────────────────

export interface RawSession {
  id: string;
  session_id?: string;
  user_id?: string;
  child_id?: string;
  // Timestamps
  started_at?: string;
  ended_at?: string;
  created_at?: string;
  updated_at?: string;
  timestamp?: string;
  // Trigger fields
  trigger?: string;
  trigger_type?: string; // "visual" | "audio" | "tactile" | "olfactory"
  trigger_modality?: string;
  // Intervention fields
  intervention?: string;
  intervention_type?: string;
  intervention_success?: boolean;
  // Duration / resolution
  resolution_time_min?: number;
  duration_seconds?: number;
  duration_minutes?: number;
  resolved?: boolean;
  status?: string; // "resolved" | "ongoing" | "escalated" | "pending"
  // Session content
  summary?: string;
  notes?: string;
  // ── NEW dev branch fields ────────────────────────────────────────────────
  ai_summary?: string; // Post-crisis AI-generated summary text
  emotion_state?: string; // "calm" | "distressed" | "escalating" | "recovering"
  severity_level?: number; // 1–5 scale
  severity?: string; // "low" | "medium" | "high" | "critical"
  caregiver_notified?: boolean; // Whether Telegram push was sent
  push_sent?: boolean; // Alias for caregiver_notified
  follow_up_required?: boolean; // Whether a follow-up was flagged
  follow_up_delivered?: boolean;
  model_used?: string; // "gemini-2.0-flash-live" | etc.
  transcript_available?: boolean;
  audio_chunks?: number; // Number of audio batches processed
  visual_frames?: number; // Number of visual frames processed
  input_tokens?: number;
  output_tokens?: number;
  agent_actions?: string[]; // List of actions taken by AI agent
  [key: string]: unknown;
}

// ── Derived / transformed types (used by UI) ─────────────────────────────────

export interface InsightsStats {
  total_sessions: number;
  avg_resolution_minutes: number;
  resolution_rate: number;
  active_caregivers: number;
  // New derived stats from dev branch fields
  notification_rate: number; // % sessions where caregiver was notified
  avg_severity: number; // Average severity level (1–5)
  follow_up_rate: number; // % sessions requiring follow-up
}

export interface TriggerItem {
  trigger: string;
  count: number;
  pct: number;
}

export interface SessionDataPoint {
  month: string;
  sessions: number;
  resolved: number;
}

export interface ResolutionDataPoint {
  week: string;
  avgMin: number;
}

export interface InterventionItem {
  type: string;
  success: number;
  count: number;
}

export interface SessionHistoryItem {
  id: string;
  timestamp: string;
  trigger: string;
  resolution_time_min: number;
  intervention: string;
  resolved: boolean;
  // New fields from dev branch
  emotion_state?: string;
  severity_level?: number;
  ai_summary?: string;
  caregiver_notified?: boolean;
}

export interface PublicInsightsData {
  stats: InsightsStats;
  triggers: TriggerItem[];
  sessionTrend: SessionDataPoint[];
  resolutionTrend: ResolutionDataPoint[];
  interventions: InterventionItem[];
  recentSessions: SessionHistoryItem[];
  lastUpdated: string;
  /** Whether this data came from a successful fetch or is empty fallback */
  dataAvailable: boolean;
  /** Number of retry attempts made during the last fetch */
  retryCount: number;
}

// ── Retry config ─────────────────────────────────────────────────────────────

const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 800; // exponential: 800ms, 1600ms, 3200ms

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

/**
 * Fetch with exponential-backoff retry.
 * Returns { data, retries } where retries = number of extra attempts made.
 */
async function fetchWithRetry<T>(
  fetcher: () => Promise<T | null>,
  maxAttempts = RETRY_ATTEMPTS
): Promise<{ data: T | null; retries: number }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const data = await fetcher();
      return { data, retries: attempt };
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  console.warn('[insightsApi] All retry attempts exhausted:', lastError);
  return { data: null, retries: maxAttempts - 1 };
}

// ── NEW: Fetch pre-aggregated summary from /stats/summary endpoint ────────────

interface BackendSummary {
  stats: {
    total_sessions: number;
    avg_resolution_minutes: number;
    resolution_rate: number;
    active_caregivers: number;
    notification_rate: number;
    avg_severity: number;
    follow_up_rate: number;
  };
  triggers: Array<{ trigger: string; count: number; pct: number }>;
  session_trend: Array<{ month: string; sessions: number; resolved: number }>;
  resolution_trend: Array<{ week: string; avgMin: number }>;
  interventions: Array<{ type: string; success: number; count: number }>;
  recent_sessions: Array<{
    id: string;
    timestamp: string;
    trigger: string;
    resolution_time_min: number;
    intervention: string;
    resolved: boolean;
    emotion_state?: string;
    severity_level?: number;
    ai_summary?: string;
    caregiver_notified: boolean;
  }>;
  last_updated: string;
  total_documents: number;
}

async function _fetchStatsSummary(): Promise<BackendSummary | null> {
  const res = await fetchWithTimeout(`/api/proxy/stats/summary`, 15000);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json && typeof json === 'object' && 'stats' in json) return json as BackendSummary;
  return null;
}

async function fetchStatsSummary(): Promise<{ summary: BackendSummary | null; retries: number }> {
  const { data, retries } = await fetchWithRetry(() => _fetchStatsSummary());
  return { summary: data, retries };
}

async function _fetchSessions(): Promise<RawSession[]> {
  const res = await fetchWithTimeout(`/api/proxy/sessions`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (Array.isArray(json)) return json as RawSession[];
  if (Array.isArray(json?.sessions)) return json.sessions as RawSession[];
  if (Array.isArray(json?.data)) return json.data as RawSession[];
  return [];
}

async function _fetchLatestSession(): Promise<RawSession | null> {
  const res = await fetchWithTimeout(`/api/proxy/sessions/latest`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json && typeof json === 'object' && !Array.isArray(json)) return json as RawSession;
  return null;
}

async function fetchSessions(): Promise<{ sessions: RawSession[]; retries: number }> {
  const { data, retries } = await fetchWithRetry(() => _fetchSessions());
  return { sessions: data ?? [], retries };
}

async function fetchLatestSession(): Promise<{ session: RawSession | null; retries: number }> {
  const { data, retries } = await fetchWithRetry(() => _fetchLatestSession());
  return { session: data, retries };
}

// ── Normalisation helpers ────────────────────────────────────────────────────

function getTimestamp(s: RawSession): string {
  return s.started_at ?? s.created_at ?? s.timestamp ?? '';
}

function getTrigger(s: RawSession): string {
  return s.trigger ?? s.trigger_type ?? s.trigger_modality ?? 'Unknown';
}

function getIntervention(s: RawSession): string {
  return s.intervention ?? s.intervention_type ?? 'AI Guidance';
}

function getResolutionMin(s: RawSession): number {
  if (typeof s.resolution_time_min === 'number') return s.resolution_time_min;
  if (typeof s.duration_minutes === 'number') return s.duration_minutes;
  if (typeof s.duration_seconds === 'number') return s.duration_seconds / 60;
  // Derive from timestamps
  const start = s.started_at ?? s.created_at ?? s.timestamp;
  const end = s.ended_at ?? s.updated_at;
  if (start && end) {
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
    if (diff > 0) return Math.round(diff * 10) / 10;
  }
  return 0;
}

function isResolved(s: RawSession): boolean {
  if (typeof s.resolved === 'boolean') return s.resolved;
  if (typeof s.intervention_success === 'boolean') return s.intervention_success;
  if (typeof s.status === 'string') return s.status === 'resolved';
  return false;
}

function getSeverityLevel(s: RawSession): number {
  if (typeof s.severity_level === 'number') return s.severity_level;
  // Map string severity to number
  const map: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
  if (typeof s.severity === 'string') return map[s.severity.toLowerCase()] ?? 0;
  return 0;
}

function isCaregiverNotified(s: RawSession): boolean {
  if (typeof s.caregiver_notified === 'boolean') return s.caregiver_notified;
  if (typeof s.push_sent === 'boolean') return s.push_sent;
  return false;
}

function getEmotionState(s: RawSession): string | undefined {
  return s.emotion_state ?? undefined;
}

function getAiSummary(s: RawSession): string | undefined {
  return s.ai_summary ?? s.summary ?? undefined;
}

// ── Derivation logic ─────────────────────────────────────────────────────────

function deriveStats(sessions: RawSession[]): InsightsStats {
  const total = sessions.length;
  const resolvedCount = sessions.filter(isResolved).length;
  const resolution_rate = total > 0 ? Math.round((resolvedCount / total) * 1000) / 10 : 0;

  const durations = sessions.map(getResolutionMin).filter((m) => m > 0);
  const avg_resolution_minutes =
    durations.length > 0
      ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
      : 0;

  // Unique caregivers by user_id or child_id
  const uniqueUsers = new Set(sessions.map((s) => s.user_id ?? s.child_id ?? '').filter(Boolean));
  const active_caregivers = uniqueUsers.size;

  // New stats from dev branch fields
  const notifiedCount = sessions.filter(isCaregiverNotified).length;
  const notification_rate = total > 0 ? Math.round((notifiedCount / total) * 1000) / 10 : 0;

  const severities = sessions.map(getSeverityLevel).filter((v) => v > 0);
  const avg_severity =
    severities.length > 0
      ? Math.round((severities.reduce((a, b) => a + b, 0) / severities.length) * 10) / 10
      : 0;

  const followUpCount = sessions.filter((s) => s.follow_up_required === true).length;
  const follow_up_rate = total > 0 ? Math.round((followUpCount / total) * 1000) / 10 : 0;

  return {
    total_sessions: total,
    avg_resolution_minutes,
    resolution_rate,
    active_caregivers,
    notification_rate,
    avg_severity,
    follow_up_rate,
  };
}

function deriveTriggers(sessions: RawSession[]): TriggerItem[] {
  const counts: Record<string, number> = {};
  for (const s of sessions) {
    const t = getTrigger(s);
    counts[t] = (counts[t] ?? 0) + 1;
  }
  const total = sessions.length || 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([trigger, count]) => ({
      trigger,
      count,
      pct: Math.round((count / total) * 1000) / 10,
    }));
}

function deriveSessionTrend(sessions: RawSession[]): SessionDataPoint[] {
  const byMonth: Record<string, { sessions: number; resolved: number }> = {};
  for (const s of sessions) {
    const ts = getTimestamp(s);
    if (!ts) continue;
    const d = new Date(ts);
    if (isNaN(d.getTime())) continue;
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (!byMonth[key]) byMonth[key] = { sessions: 0, resolved: 0 };
    byMonth[key].sessions += 1;
    if (isResolved(s)) byMonth[key].resolved += 1;
  }
  return Object.entries(byMonth)
    .sort((a, b) => {
      const da = new Date(`01 ${a[0]}`);
      const db = new Date(`01 ${b[0]}`);
      return da.getTime() - db.getTime();
    })
    .map(([month, v]) => ({ month, ...v }));
}

function deriveResolutionTrend(sessions: RawSession[]): ResolutionDataPoint[] {
  const byWeek: Record<string, number[]> = {};
  for (const s of sessions) {
    const ts = getTimestamp(s);
    if (!ts) continue;
    const d = new Date(ts);
    if (isNaN(d.getTime())) continue;
    // ISO week key: YYYY-Www
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
    const key = `W${week}`;
    const dur = getResolutionMin(s);
    if (dur > 0) {
      if (!byWeek[key]) byWeek[key] = [];
      byWeek[key].push(dur);
    }
  }
  return Object.entries(byWeek)
    .sort((a, b) => {
      const na = parseInt(a[0].slice(1));
      const nb = parseInt(b[0].slice(1));
      return na - nb;
    })
    .map(([week, vals]) => ({
      week,
      avgMin: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10,
    }));
}

function deriveInterventions(sessions: RawSession[]): InterventionItem[] {
  const counts: Record<string, { total: number; resolved: number }> = {};
  for (const s of sessions) {
    const t = getIntervention(s);
    if (!counts[t]) counts[t] = { total: 0, resolved: 0 };
    counts[t].total += 1;
    if (isResolved(s)) counts[t].resolved += 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)
    .map(([type, v]) => ({
      type,
      count: v.total,
      success: v.total > 0 ? Math.round((v.resolved / v.total) * 1000) / 10 : 0,
    }));
}

function deriveRecentSessions(
  sessions: RawSession[],
  latest: RawSession | null
): SessionHistoryItem[] {
  // Merge latest session if not already in list
  let all = [...sessions];
  if (latest && !all.find((s) => s.id === latest.id && s.session_id === latest.session_id)) {
    all = [latest, ...all];
  }
  return all
    .filter((s) => getTimestamp(s))
    .sort((a, b) => new Date(getTimestamp(b)).getTime() - new Date(getTimestamp(a)).getTime())
    .slice(0, 10)
    .map((s) => ({
      id: String(s.id ?? s.session_id ?? Math.random()),
      timestamp: getTimestamp(s),
      trigger: getTrigger(s),
      resolution_time_min: getResolutionMin(s),
      intervention: getIntervention(s),
      resolved: isResolved(s),
      emotion_state: getEmotionState(s),
      severity_level: getSeverityLevel(s) || undefined,
      ai_summary: getAiSummary(s),
      caregiver_notified: isCaregiverNotified(s),
    }));
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function fetchPublicInsights(): Promise<PublicInsightsData> {
  // Strategy: try the pre-aggregated /stats/summary endpoint first (faster, less client-side work).
  // If that endpoint is not yet deployed, fall back to fetching raw sessions and deriving locally.
  const { summary, retries: summaryRetries } = await fetchStatsSummary();

  if (summary) {
    // Backend has the new /stats/summary endpoint — use it directly
    return {
      stats: {
        total_sessions: summary.stats.total_sessions,
        avg_resolution_minutes: summary.stats.avg_resolution_minutes,
        resolution_rate: summary.stats.resolution_rate,
        active_caregivers: summary.stats.active_caregivers,
        notification_rate: summary.stats.notification_rate,
        avg_severity: summary.stats.avg_severity,
        follow_up_rate: summary.stats.follow_up_rate,
      },
      triggers: summary.triggers,
      sessionTrend: summary.session_trend,
      resolutionTrend: summary.resolution_trend,
      interventions: summary.interventions,
      recentSessions: summary.recent_sessions.map((s) => ({
        id: s.id,
        timestamp: s.timestamp,
        trigger: s.trigger,
        resolution_time_min: s.resolution_time_min,
        intervention: s.intervention,
        resolved: s.resolved,
        emotion_state: s.emotion_state,
        severity_level: s.severity_level,
        ai_summary: s.ai_summary,
        caregiver_notified: s.caregiver_notified,
      })),
      lastUpdated: summary.last_updated,
      dataAvailable: summary.total_documents > 0,
      retryCount: summaryRetries,
    };
  }

  // Fallback: derive everything client-side from raw session list
  const [sessionsResult, latestResult] = await Promise.all([fetchSessions(), fetchLatestSession()]);

  const { sessions, retries: sessionRetries } = sessionsResult;
  const { session: latest, retries: latestRetries } = latestResult;
  const totalRetries = summaryRetries + sessionRetries + latestRetries;

  // Merge latest into sessions list if it's not already there
  let allSessions = [...sessions];
  if (latest) {
    const exists = allSessions.some(
      (s) => s.id === latest.id || s.session_id === latest.session_id
    );
    if (!exists) allSessions = [latest, ...allSessions];
  }

  const dataAvailable = allSessions.length > 0;

  return {
    stats: deriveStats(allSessions),
    triggers: deriveTriggers(allSessions),
    sessionTrend: deriveSessionTrend(allSessions),
    resolutionTrend: deriveResolutionTrend(allSessions),
    interventions: deriveInterventions(allSessions),
    recentSessions: deriveRecentSessions(allSessions, null),
    lastUpdated: new Date().toISOString(),
    dataAvailable,
    retryCount: totalRetries,
  };
}
