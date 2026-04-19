'use client';

import React, { useEffect, useRef } from 'react';

const problems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    text: 'Crisis moments feel overwhelming — caregivers lack real-time guidance when meltdowns begin.',
    tag: 'No real-time support',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    text: "Every child's ASD profile is unique — generic advice from apps doesn't account for individual behavioral patterns.",
    tag: 'One-size-fits-all',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    text: 'Therapists are unavailable 24/7 — caregivers are left alone during the most critical moments.',
    tag: 'Limited availability',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    text: 'Behavioral data is scattered — no unified system to track patterns, triggers, and effective interventions over time.',
    tag: 'Fragmented data',
  },
];

const solutions = [
  {
    label: 'Real-Time Detection',
    desc: 'AI models detect behavioral patterns (meltdowns, sensory overload, stimming) within 2.3 seconds via camera feed.',
    color: '#7A9E7E',
    metric: '2.3s',
    metricLabel: 'detection',
  },
  {
    label: 'Personalized AI Guidance',
    desc: "Context-aware, child-specific intervention scripts delivered through natural voice interaction — tailored to your child's unique profile.",
    color: '#5B7FA6',
    metric: '<1.5s',
    metricLabel: 'voice response',
  },
  {
    label: '24/7 AI Copilot',
    desc: 'Always-on companion running on iOS and Android — available whenever and wherever you need it.',
    color: '#E8A87C',
    metric: '99.9%',
    metricLabel: 'uptime',
  },
  {
    label: 'Longitudinal Insights',
    desc: 'Session history builds a behavioral profile over time, surfacing trends and improvement metrics to share with therapists.',
    color: '#7A9E7E',
    metric: '∞',
    metricLabel: 'sessions tracked',
  },
];

const comparisonRows = [
  { feature: 'Real-time crisis detection', without: false, with: true },
  { feature: 'Personalized child profile', without: false, with: true },
  { feature: 'Voice-guided intervention', without: false, with: true },
  { feature: '24/7 availability', without: false, with: true },
  { feature: 'Longitudinal behavioral data', without: false, with: true },
  { feature: 'On-device privacy (TFLite)', without: false, with: true },
];

const ProblemSolutionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
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

  return (
    <section id="solution" ref={sectionRef} className="py-16 sm:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20 reveal">
          <span
            className="inline-block text-xs font-mono font-semibold text-sage-600 tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-sage-pale border border-sage-200"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Problem → Solution
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-slate tracking-tight mb-5"
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            Caregiving is hard.
            <br />
            <span className="text-gradient-sage">AI makes it manageable.</span>
          </h2>
          <p className="text-base sm:text-lg text-mid-slate font-light leading-relaxed">
            1 in 36 children is diagnosed with ASD in the US. Caregivers face daily crises with
            little real-time support. NeuroDecode changes that.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start mb-12 sm:mb-16">
          {/* Problems Column */}
          <div className="reveal-left">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(232,168,124,0.15)' }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: '#E8A87C' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3
                className="text-lg sm:text-xl font-bold text-dark-slate"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                The Challenge
              </h3>
            </div>

            <div className="space-y-3">
              {problems.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-amber-pale border border-amber/20 hover-lift group"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(232,168,124,0.15)', color: '#E8A87C' }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-2xs font-mono font-semibold text-amber tracking-wider uppercase mb-1.5 px-2 py-0.5 rounded bg-amber/10"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                    >
                      {item.tag}
                    </span>
                    <p className="text-sm text-mid-slate leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stat callout */}
            <div className="mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl border border-border-subtle bg-white/80 flex items-center gap-4 sm:gap-5">
              <div
                className="text-3xl sm:text-4xl font-extrabold text-dark-slate font-heading flex-shrink-0"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                72%
              </div>
              <p className="text-sm text-light-slate leading-relaxed">
                of caregivers report feeling unprepared when a behavioral crisis occurs at home —{' '}
                <em>Journal of Autism & Developmental Disorders, 2024</em>
              </p>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="reveal-right">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-sage-pale">
                <svg
                  className="w-4 h-4 text-sage-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3
                className="text-lg sm:text-xl font-bold text-dark-slate"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                The NeuroDecode Approach
              </h3>
            </div>

            <div className="space-y-3">
              {solutions.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-border-subtle hover-lift"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1"
                      style={{ background: item.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between mb-1 gap-2">
                      <div
                        className="text-sm font-semibold text-dark-slate"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className="text-sm font-bold font-mono"
                          style={{ color: item.color, fontFamily: 'JetBrains Mono' }}
                        >
                          {item.metric}
                        </span>
                        <span
                          className="text-2xs text-light-slate ml-1"
                          style={{ fontSize: '10px' }}
                        >
                          {item.metricLabel}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-mid-slate leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stat callout */}
            <div className="mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl border border-sage-200 bg-sage-pale flex items-center gap-4 sm:gap-5">
              <div
                className="text-3xl sm:text-4xl font-extrabold text-sage-700 font-heading flex-shrink-0"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                4.2x
              </div>
              <p className="text-sm text-sage-800 leading-relaxed">
                faster crisis resolution compared to caregiver-only interventions in NeuroDecode
                beta trials, March 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="reveal">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="h-px flex-1 bg-border-subtle" />
            <span
              className="text-xs font-mono font-semibold text-light-slate tracking-widest uppercase text-center"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Without vs. With NeuroDecode
            </span>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>
          <div className="comparison-table-wrapper rounded-3xl border border-border-subtle overflow-hidden bg-white">
            <div className="comparison-table-header grid grid-cols-3 bg-sage-pale/50 border-b border-border-subtle">
              <div
                className="comparison-col-header p-3 sm:p-4 text-xs sm:text-sm font-semibold text-mid-slate"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                Capability
              </div>
              <div
                className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-center"
                style={{ color: '#E8A87C', fontFamily: 'Plus Jakarta Sans' }}
              >
                Without AI
              </div>
              <div
                className="comparison-col-with p-3 sm:p-4 text-xs sm:text-sm font-semibold text-center"
                style={{ color: '#7A9E7E', fontFamily: 'Plus Jakarta Sans' }}
              >
                With NeuroDecode
              </div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className="comparison-table-row grid grid-cols-3 border-b border-border-subtle last:border-0 hover:bg-sage-pale/20 transition-colors"
              >
                <div className="comparison-col-capability p-3 sm:p-4 text-xs sm:text-sm text-mid-slate">
                  {row.feature}
                </div>
                <div className="p-3 sm:p-4 flex items-center justify-center">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(232,168,124,0.15)' }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      style={{ color: '#E8A87C' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-3 sm:p-4 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-sage-pale">
                    <svg
                      className="w-3.5 h-3.5 text-sage-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
