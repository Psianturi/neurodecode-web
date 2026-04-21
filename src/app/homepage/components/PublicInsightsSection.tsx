'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  fetchPublicInsights,
  type PublicInsightsData,
  type SessionDataPoint,
  type ResolutionDataPoint,
} from '@/lib/insightsApi';

const INSIGHTS_SYNC_INTERVAL_MS = 10 * 60 * 1000;

// ── Tooltip Components ──────────────────────────────────────────────────────

const SessionTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color: string; name: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 shadow-float border border-border-subtle text-xs">
        <div className="font-semibold text-dark-slate mb-2 font-heading">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-mid-slate">{p.name}:</span>
            <span className="font-bold text-dark-slate">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ResolutionTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 shadow-float border border-border-subtle text-xs">
        <div className="font-semibold text-dark-slate mb-1 font-heading">{label}</div>
        <div className="text-slate-blue font-bold">{payload[0].value} min avg</div>
      </div>
    );
  }
  return null;
};

// ── Animated Counter Hook ────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1200, active = false): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || target === 0) {
      setCount(target);
      return;
    }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, active]);

  return count;
}

// ── Animated Stat Value ──────────────────────────────────────────────────────

const AnimatedStatValue: React.FC<{
  rawValue: number;
  formatter: (n: number) => string;
  active: boolean;
  color: string;
}> = ({ rawValue, formatter, active, color }) => {
  const animated = useAnimatedCounter(rawValue, 1400, active);
  return (
    <div
      className="text-2xl font-bold text-dark-slate mb-0.5 font-heading transition-all duration-300"
      style={{ fontFamily: 'Plus Jakarta Sans', color: animated > 0 ? undefined : color }}
    >
      {formatter(animated)}
    </div>
  );
};

// ── Relative Time ────────────────────────────────────────────────────────────

function useRelativeTime(iso: string | undefined): string {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!iso) return;
    const update = () => {
      try {
        const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
        if (diff < 60) setLabel('just now');
        else if (diff < 3600) setLabel(`${Math.floor(diff / 60)}m ago`);
        else if (diff < 86400) setLabel(`${Math.floor(diff / 3600)}h ago`);
        else
          setLabel(new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
      } catch {
        setLabel('');
      }
    };
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, [iso]);

  return label;
}

// ── Skeleton ────────────────────────────────────────────────────────────────

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`rounded shimmer ${className ?? ''}`}
    style={{
      background: 'linear-gradient(90deg, #EAF2EB 0%, #f5f9f5 50%, #EAF2EB 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.6s ease-in-out infinite',
    }}
  />
);

// ── Stat Icons ───────────────────────────────────────────────────────────────

const IconSessions = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);
const IconClock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n === 0) return '—';
  return n.toLocaleString();
}

function formatPct(n: number): string {
  if (n === 0) return '—';
  return `${n.toFixed(1)}%`;
}

function formatMin(n: number): string {
  if (n === 0) return '—';
  return `${n.toFixed(1)} min`;
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    });
  } catch {
    return iso;
  }
}

// ── Error Banner ─────────────────────────────────────────────────────────────

const ErrorBanner = ({
  retryCount,
  onRetry,
  isRetrying,
}: {
  retryCount: number;
  onRetry: () => void;
  isRetrying: boolean;
}) => (
  <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/60 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-100">
        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-red-700">Backend unreachable</p>
        <p className="text-xs text-red-500 mt-0.5">
          {retryCount > 0
            ? `Failed after ${retryCount} retry attempt${retryCount > 1 ? 's' : ''}. The Cloud Run backend may be temporarily unavailable.`
            : 'Could not connect to the data backend. Charts will show empty state.'}
        </p>
      </div>
    </div>
    <button
      onClick={onRetry}
      disabled={isRetrying}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #7A9E7E 0%, #5B7FA6 100%)' }}
    >
      {isRetrying ? (
        <>
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retrying…
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retry
        </>
      )}
    </button>
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────

const EmptyChartState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8">
    <svg className="w-8 h-8 text-sage-pale" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
    <p className="text-xs text-light-slate text-center">{message}</p>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────

const PublicInsightsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<PublicInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async (isManualRetry = false) => {
    if (isManualRetry) {
      setIsRetrying(true);
    } else {
      setLoading(true);
    }
    setError(false);
    try {
      const result = await fetchPublicInsights();
      setData(result);
      setRetryCount(result.retryCount);
      if (!result.dataAvailable) {
        // Data fetched but empty — not a hard error, just no sessions yet
        setError(false);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, []);

  const handleManualRetry = useCallback(() => {
    loadData(true);
  }, [loadData]);

  useEffect(() => {
    const syncWhenActive = () => {
      if (document.visibilityState === 'visible') {
        void loadData();
      }
    };

    void loadData();
    const interval = window.setInterval(syncWhenActive, INSIGHTS_SYNC_INTERVAL_MS);
    window.addEventListener('focus', syncWhenActive);
    document.addEventListener('visibilitychange', syncWhenActive);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', syncWhenActive);
      document.removeEventListener('visibilitychange', syncWhenActive);
    };
  }, [loadData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            setVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    sectionRef.current
      ?.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = data?.stats;
  const triggers = data?.triggers ?? [];
  const sessionTrend: SessionDataPoint[] = data?.sessionTrend ?? [];
  const resolutionTrend: ResolutionDataPoint[] = data?.resolutionTrend ?? [];
  const interventions = data?.interventions ?? [];
  const recentSessions = data?.recentSessions ?? [];
  const lastUpdated = data?.lastUpdated;
  const dataAvailable = data?.dataAvailable ?? false;
  const relativeTime = useRelativeTime(lastUpdated);

  const growthLabel = (() => {
    if (sessionTrend.length < 2) return null;
    const first = sessionTrend[0].sessions;
    const last = sessionTrend[sessionTrend.length - 1].sessions;
    if (!first) return null;
    const pct = Math.round(((last - first) / first) * 100);
    return `+${pct}% growth`;
  })();

  const resolutionImprovement = (() => {
    if (resolutionTrend.length < 2) return null;
    const first = resolutionTrend[0].avgMin;
    const last = resolutionTrend[resolutionTrend.length - 1].avgMin;
    if (!first) return null;
    const pct = Math.round(((first - last) / first) * 100);
    return `↓ ${pct}%`;
  })();

  const currentAvgMin =
    resolutionTrend.length > 0
      ? resolutionTrend[resolutionTrend.length - 1].avgMin
      : (stats?.avg_resolution_minutes ?? 0);

  const totalTriggerEvents = triggers.reduce((sum, t) => sum + t.count, 0);

  const statCards = [
    {
      label: 'Total Sessions',
      value: loading ? null : formatNumber(stats?.total_sessions ?? 0),
      rawValue: stats?.total_sessions ?? 0,
      formatter: formatNumber,
      sub: 'Since beta launch',
      color: '#7A9E7E',
      icon: <IconSessions />,
    },
    {
      label: 'Avg Resolution Time',
      value: loading ? null : formatMin(currentAvgMin),
      rawValue: 0,
      formatter: formatNumber,
      sub: resolutionImprovement
        ? `${resolutionImprovement} from baseline`
        : 'Crisis-to-calm duration',
      color: '#5B7FA6',
      icon: <IconClock />,
      customValue: loading ? null : formatMin(currentAvgMin),
    },
    {
      label: 'Resolution Rate',
      value: loading ? null : formatPct(stats?.resolution_rate ?? 0),
      rawValue: 0,
      formatter: formatNumber,
      sub: 'Sessions fully resolved',
      color: '#E8A87C',
      icon: <IconCheck />,
      customValue: loading ? null : formatPct(stats?.resolution_rate ?? 0),
    },
    {
      label: 'Active Caregivers',
      value: loading ? null : formatNumber(stats?.active_caregivers ?? 0),
      rawValue: stats?.active_caregivers ?? 0,
      formatter: formatNumber,
      sub: 'Registered users',
      color: '#7A9E7E',
      icon: <IconUsers />,
    },
  ];

  return (
    <section id="insights" ref={sectionRef} className="py-28 section-blue">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10 reveal">
          <div>
            <span
              className="inline-block text-xs font-mono font-semibold text-slate-blue tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-slate-blue-pale border border-slate-blue/20"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Public Dashboard
            </span>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-dark-slate tracking-tight mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              Aggregate Insights
              <br />
              <span className="text-gradient-sage">from the community.</span>
            </h2>
            <p className="text-base text-mid-slate font-light max-w-lg">
              Anonymous, aggregated data from NeuroDecode sessions — no PII, no individual tracking.
              Live from Cloud Run backend.
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border-subtle">
              {loading || isRetrying ? (
                <>
                  <svg
                    className="w-3 h-3 animate-spin text-slate-blue"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span
                    className="text-xs font-mono font-medium text-mid-slate"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    {isRetrying ? 'Retrying…' : 'Fetching live data…'}
                  </span>
                </>
              ) : error ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                  </span>
                  <span
                    className="text-xs font-mono font-medium text-red-400"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    Backend unreachable
                  </span>
                </>
              ) : !dataAvailable ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                  </span>
                  <span
                    className="text-xs font-mono font-medium text-amber-500"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    No sessions yet
                  </span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500" />
                  </span>
                  <span
                    className="text-xs font-mono font-medium text-sage-700"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    LIVE
                  </span>
                </>
              )}
            </div>
            {/* Last updated timestamp */}
            {!loading && !error && lastUpdated && (
              <span
                className="text-xs font-mono text-light-slate"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                Last updated {relativeTime}
              </span>
            )}
          </div>
        </div>

        {/* Error Banner — shown when fetch failed */}
        {error && !loading && (
          <ErrorBanner
            retryCount={retryCount}
            onRetry={handleManualRetry}
            isRetrying={isRetrying}
          />
        )}

        {/* No data notice — backend reachable but empty */}
        {!loading && !error && !dataAvailable && (
          <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50/50 px-5 py-4 flex items-center gap-3">
            <svg
              className="w-4 h-4 text-amber-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xs text-amber-700">
              Backend is reachable but no session data has been recorded yet. Charts will populate
              automatically once sessions begin.
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal rounded-2xl p-6 bg-white border border-border-subtle hover-lift"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
              {stat.value === null ? (
                <Skeleton className="h-7 w-24 mb-1" />
              ) : stat.customValue !== undefined ? (
                <div
                  className="text-2xl font-bold text-dark-slate mb-0.5 font-heading"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  {stat.customValue}
                </div>
              ) : (
                <AnimatedStatValue
                  rawValue={stat.rawValue}
                  formatter={stat.formatter}
                  active={visible}
                  color={stat.color}
                />
              )}
              <div className="text-xs text-light-slate mb-1">{stat.label}</div>
              <div
                className="text-xs font-mono font-medium"
                style={{ color: stat.color, fontFamily: 'JetBrains Mono' }}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart 1: Monthly Sessions */}
          <div className="lg:col-span-2 reveal rounded-3xl p-7 bg-white border border-border-subtle hover-lift">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3
                  className="text-lg font-bold text-dark-slate mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  Monthly Sessions
                </h3>
                <p className="text-xs text-light-slate">Total vs. successfully resolved sessions</p>
              </div>
              {growthLabel && (
                <span
                  className="tech-badge"
                  style={{
                    color: '#7A9E7E',
                    borderColor: 'rgba(122,158,126,0.3)',
                    backgroundColor: 'rgba(122,158,126,0.08)',
                  }}
                >
                  {growthLabel}
                </span>
              )}
            </div>
            {loading ? (
              <Skeleton className="h-[220px] w-full rounded-xl" />
            ) : sessionTrend.length === 0 ? (
              <EmptyChartState
                message={
                  error ? 'Data unavailable — backend unreachable' : 'No session trend data yet'
                }
              />
            ) : (
              visible && (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart
                    data={sessionTrend}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7A9E7E" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#7A9E7E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B7FA6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#5B7FA6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E4" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: '#718096', fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#718096', fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<SessionTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      name="Total Sessions"
                      stroke="#7A9E7E"
                      strokeWidth={2.5}
                      fill="url(#colorSessions)"
                      dot={{ fill: '#7A9E7E', r: 3 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Resolved"
                      stroke="#5B7FA6"
                      strokeWidth={2}
                      fill="url(#colorResolved)"
                      dot={{ fill: '#5B7FA6', r: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )
            )}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 rounded-full bg-sage-500" />
                <span className="text-xs text-light-slate">Total Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 rounded-full" style={{ background: '#5B7FA6' }} />
                <span className="text-xs text-light-slate">Resolved</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Top Triggers */}
          <div className="reveal rounded-3xl p-7 bg-white border border-border-subtle hover-lift">
            <div className="mb-6">
              <h3
                className="text-lg font-bold text-dark-slate mb-1"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                Top Triggers
              </h3>
              <p className="text-xs text-light-slate">Most common behavioral crisis causes</p>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Skeleton key={n} className="h-8 w-full rounded" />
                ))}
              </div>
            ) : triggers.length === 0 ? (
              <EmptyChartState
                message={error ? 'Data unavailable — backend unreachable' : 'No trigger data yet'}
              />
            ) : (
              <div className="space-y-4">
                {triggers.map((item, i) => (
                  <div key={item.trigger}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-mid-slate">{item.trigger}</span>
                      <span
                        className="text-xs font-mono font-semibold"
                        style={{
                          fontFamily: 'JetBrains Mono',
                          color: i === 0 ? '#7A9E7E' : '#718096',
                        }}
                      >
                        {item.pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-sage-pale overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: visible ? `${item.pct}%` : '0%',
                          background:
                            i === 0
                              ? 'linear-gradient(90deg, #7A9E7E, #5B7FA6)'
                              : i === 1
                                ? '#A8C5AB'
                                : '#C8DEC9',
                          transitionDelay: `${i * 0.15}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <div className="text-xs text-light-slate">Total events analyzed</div>
              <div
                className="text-xl font-bold text-dark-slate font-heading"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                {loading ? (
                  <Skeleton className="h-6 w-20 inline-block" />
                ) : (
                  formatNumber(totalTriggerEvents)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Second row: Resolution Time + Intervention Success */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Chart 3: Resolution Time Trend */}
          <div className="reveal rounded-3xl p-7 bg-white border border-border-subtle hover-lift">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3
                  className="text-lg font-bold text-dark-slate mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  Avg. Resolution Time
                </h3>
                <p className="text-xs text-light-slate">
                  Weekly average crisis-to-calm duration (minutes)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className="text-2xl font-bold font-mono"
                    style={{ color: '#5B7FA6', fontFamily: 'JetBrains Mono' }}
                  >
                    {loading ? (
                      <Skeleton className="h-7 w-16 inline-block" />
                    ) : (
                      formatMin(currentAvgMin)
                    )}
                  </div>
                  <div className="text-xs text-light-slate">Current average</div>
                </div>
                {resolutionImprovement && (
                  <div
                    className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
                    style={{
                      background: 'rgba(122,158,126,0.1)',
                      color: '#7A9E7E',
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    {resolutionImprovement}
                  </div>
                )}
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-[180px] w-full rounded-xl" />
            ) : resolutionTrend.length === 0 ? (
              <EmptyChartState
                message={
                  error ? 'Data unavailable — backend unreachable' : 'No resolution trend data yet'
                }
              />
            ) : (
              visible && (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart
                    data={resolutionTrend}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#E8A87C" />
                        <stop offset="50%" stopColor="#7A9E7E" />
                        <stop offset="100%" stopColor="#5B7FA6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8E4" />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 10, fill: '#718096', fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      interval={Math.max(0, Math.floor(resolutionTrend.length / 6) - 1)}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#718096', fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}m`}
                    />
                    <Tooltip content={<ResolutionTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="avgMin"
                      stroke="url(#lineGradient)"
                      strokeWidth={3}
                      dot={{ fill: '#5B7FA6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#5B7FA6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )
            )}
          </div>

          {/* Chart 4: Intervention Success Rates */}
          <div className="reveal rounded-3xl p-7 bg-white border border-border-subtle hover-lift">
            <div className="mb-6">
              <h3
                className="text-lg font-bold text-dark-slate mb-1"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                Intervention Success Rates
              </h3>
              <p className="text-xs text-light-slate">AI-recommended techniques by effectiveness</p>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Skeleton key={n} className="h-8 w-full rounded" />
                ))}
              </div>
            ) : interventions.length === 0 ? (
              <EmptyChartState
                message={
                  error ? 'Data unavailable — backend unreachable' : 'No intervention data yet'
                }
              />
            ) : (
              <div className="space-y-4">
                {interventions.map((item, i) => (
                  <div key={item.type} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-mid-slate truncate">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span
                            className="text-xs font-mono font-semibold"
                            style={{
                              fontFamily: 'JetBrains Mono',
                              color: item.success >= 85 ? '#7A9E7E' : '#5B7FA6',
                            }}
                          >
                            {item.success}%
                          </span>
                          <span className="text-light-slate" style={{ fontSize: '10px' }}>
                            {item.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-sage-pale overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: visible ? `${item.success}%` : '0%',
                            background:
                              item.success >= 88
                                ? 'linear-gradient(90deg, #7A9E7E, #5B7FA6)'
                                : 'linear-gradient(90deg, #5B7FA6, #8AABC8)',
                            transitionDelay: `${i * 0.12}s`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-border-subtle flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-sage-500" />
              <span className="text-xs text-light-slate">
                Success rate = caregiver-confirmed de-escalation within session
              </span>
            </div>
          </div>
        </div>

        {/* Recent Sessions History */}
        {(loading || recentSessions.length > 0) && (
          <div className="reveal rounded-3xl p-7 bg-white border border-border-subtle mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3
                  className="text-lg font-bold text-dark-slate mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  Latest Session History
                </h3>
                <p className="text-xs text-light-slate">
                  Most recent anonymous sessions from the backend
                </p>
              </div>
              {!loading && (
                <span
                  className="tech-badge"
                  style={{
                    color: '#5B7FA6',
                    borderColor: 'rgba(91,127,166,0.3)',
                    backgroundColor: 'rgba(91,127,166,0.08)',
                  }}
                >
                  {recentSessions.length} sessions
                </span>
              )}
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <EmptyChartState message="No session history available yet" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left pb-3 text-light-slate font-medium pr-4">Time</th>
                      <th className="text-left pb-3 text-light-slate font-medium pr-4">Trigger</th>
                      <th className="text-left pb-3 text-light-slate font-medium pr-4">
                        Intervention
                      </th>
                      <th className="text-right pb-3 text-light-slate font-medium pr-4">
                        Duration
                      </th>
                      <th className="text-right pb-3 text-light-slate font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((s) => (
                      <tr key={s.id} className="border-b border-border-subtle/50 last:border-0">
                        <td
                          className="py-3 pr-4 font-mono text-light-slate"
                          style={{ fontFamily: 'JetBrains Mono' }}
                        >
                          {formatTimestamp(s.timestamp)}
                        </td>
                        <td className="py-3 pr-4 text-mid-slate font-medium">{s.trigger}</td>
                        <td className="py-3 pr-4 text-mid-slate">{s.intervention}</td>
                        <td
                          className="py-3 pr-4 text-right font-mono"
                          style={{ fontFamily: 'JetBrains Mono', color: '#5B7FA6' }}
                        >
                          {s.resolution_time_min.toFixed(1)} min
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold"
                            style={{
                              fontSize: '10px',
                              background: s.resolved
                                ? 'rgba(122,158,126,0.12)'
                                : 'rgba(232,168,124,0.12)',
                              color: s.resolved ? '#7A9E7E' : '#E8A87C',
                            }}
                          >
                            {s.resolved ? '✓ Resolved' : '⚠ Ongoing'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Privacy note */}
        <div className="reveal flex items-center gap-3 p-4 rounded-2xl bg-white/60 border border-border-subtle">
          <svg
            className="w-4 h-4 flex-shrink-0 text-sage-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-xs text-light-slate leading-relaxed">
            Data aggregated from anonymous sessions. No personally identifiable information is
            collected or stored. On-device inference ensures sensitive behavioral data never leaves
            the device. Privacy-first by design.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PublicInsightsSection;
