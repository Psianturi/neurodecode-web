'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const phases = [
  {
    id: 'capture',
    number: '01',
    label: 'Capture',
    title: 'Multimodal Stream Initiated',
    description:
      'The caregiver opens the Anak Unggul mobile app. The device camera and microphone stream real-time multimodal data — facial expressions, body language, vocalizations, and environmental audio — directly to the NeuroDecode processing pipeline.',
    detail:
      'Child exhibits signs of sensory overload: repetitive motion, elevated vocal pitch, avoidance behavior.',
    color: '#E8A87C',
    colorLight: 'rgba(232,168,124,0.12)',
    colorBorder: 'rgba(232,168,124,0.3)',
    colorGlow: 'rgba(232,168,124,0.2)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    metrics: [
      { label: 'Stream Latency', value: '<100ms' },
      { label: 'Data Sources', value: 'Camera + Mic' },
      { label: 'Frame Rate', value: '30 FPS' },
    ],
    pipeline: [
      { label: 'Camera Feed', icon: '📷', active: true },
      { label: 'Microphone', icon: '🎙️', active: true },
      { label: 'Buffer', icon: '⚡', active: true },
      { label: 'Pipeline', icon: '→', active: false },
    ],
    tag: 'Input Layer',
  },
  {
    id: 'analysis',
    number: '02',
    label: 'Analysis',
    title: 'AI Behavioral Classification',
    description:
      'On-device AI runs immediately for sub-second response. Simultaneously, a cloud-based model performs deeper behavioral classification — identifying meltdowns, stimming escalation, and sensory overload patterns.',
    detail:
      'Dual-model architecture: fast on-device detection for speed, cloud AI for accuracy. Results merged via confidence weighting.',
    color: '#5B7FA6',
    colorLight: 'rgba(91,127,166,0.12)',
    colorBorder: 'rgba(91,127,166,0.3)',
    colorGlow: 'rgba(91,127,166,0.2)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
        />
      </svg>
    ),
    metrics: [
      { label: 'Detection Time', value: '2.3s avg' },
      { label: 'Accuracy', value: '94.7%' },
      { label: 'Processing', value: 'On-device + Cloud' },
    ],
    pipeline: [
      { label: 'On-Device', icon: '⚡', active: true },
      { label: 'Cloud AI', icon: '☁️', active: true },
      { label: 'Merge', icon: '🔀', active: true },
      { label: 'Result', icon: '✓', active: false },
    ],
    tag: 'AI Layer',
  },
  {
    id: 'intervention',
    number: '03',
    label: 'Intervention',
    title: 'AI Companion Responds',
    description:
      "Once a pattern is confirmed, the AI generates a personalized, context-aware intervention. It speaks directly to the caregiver through the Anak Unggul app — suggesting specific de-escalation techniques tailored to the child's profile and the current situation.",
    detail:
      "The AI accesses the child's behavioral profile to personalize the response in real time.",
    color: '#4285F4',
    colorLight: 'rgba(66,133,244,0.12)',
    colorBorder: 'rgba(66,133,244,0.3)',
    colorGlow: 'rgba(66,133,244,0.2)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
    metrics: [
      { label: 'Response Type', value: 'Voice + Text' },
      { label: 'Personalized', value: 'Yes' },
      { label: 'Response Time', value: '<1.5s' },
    ],
    pipeline: [
      { label: 'Profile', icon: '🗄️', active: true },
      { label: 'AI', icon: '🤖', active: true },
      { label: 'Voice', icon: '🔊', active: true },
      { label: 'Caregiver', icon: '👤', active: false },
    ],
    tag: 'Response Layer',
  },
  {
    id: 'resolution',
    number: '04',
    label: 'Resolution',
    title: 'Summary & Longitudinal Logging',
    description:
      "After the situation resolves, Anak Unggul automatically generates a session summary — what triggered the episode, which interventions worked, duration, and emotional trajectory. This data updates the child's adaptive profile for future sessions.",
    detail:
      'Aggregate anonymous data feeds the Public Insights dashboard, helping the broader caregiving community.',
    color: '#7A9E7E',
    colorLight: 'rgba(122,158,126,0.12)',
    colorBorder: 'rgba(122,158,126,0.3)',
    colorGlow: 'rgba(122,158,126,0.2)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    metrics: [
      { label: 'Avg Resolution', value: '4.2 min' },
      { label: 'Auto Summary', value: 'Yes' },
      { label: 'Improvement', value: '↓ 38%' },
    ],
    pipeline: [
      { label: 'Summary', icon: '📋', active: true },
      { label: 'Saved', icon: '🗄️', active: true },
      { label: 'Profile', icon: '📊', active: true },
      { label: 'Insights', icon: '✨', active: false },
    ],
    tag: 'Learning Layer',
  },
];

const HowItWorksSection: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [prevPhase, setPrevPhase] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pipelineTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPipelineAnimation = useCallback((phaseIdx: number) => {
    if (pipelineTimer.current) clearInterval(pipelineTimer.current);
    setPipelineStep(0);
    let step = 0;
    pipelineTimer.current = setInterval(() => {
      step += 1;
      if (step >= phases[phaseIdx].pipeline.length) {
        if (pipelineTimer.current) clearInterval(pipelineTimer.current);
        return;
      }
      setPipelineStep(step);
    }, 500);
  }, []);

  const handlePhaseChange = useCallback(
    (idx: number) => {
      if (idx === activePhase || animating) return;
      setDirection(idx > activePhase ? 'right' : 'left');
      setPrevPhase(activePhase);
      setAnimating(true);
      setMetricsVisible(false);
      setTimeout(() => {
        setActivePhase(idx);
        setAnimating(false);
        setTimeout(() => setMetricsVisible(true), 100);
        startPipelineAnimation(idx);
      }, 220);
    },
    [activePhase, animating, startPipelineAnimation]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    sectionRef.current
      ?.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Auto-start pipeline on mount
    const t = setTimeout(() => {
      setMetricsVisible(true);
      startPipelineAnimation(0);
    }, 600);
    return () => {
      clearTimeout(t);
      if (pipelineTimer.current) clearInterval(pipelineTimer.current);
    };
  }, [startPipelineAnimation]);

  const active = phases[activePhase];
  const slideOut = direction === 'right' ? '-translate-x-6 opacity-0' : 'translate-x-6 opacity-0';
  const slideIn = direction === 'right' ? 'translate-x-6 opacity-0' : '-translate-x-6 opacity-0';

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-16 sm:py-28 section-sage overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 reveal">
          <span
            className="inline-block text-xs font-mono font-semibold text-slate-blue tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-slate-blue-pale border border-slate-blue/20"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Full-Loop Architecture
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-slate tracking-tight mb-5"
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            How NeuroDecode
            <br />
            <span className="text-gradient-sage">works in real time.</span>
          </h2>
          <p className="text-lg text-mid-slate font-light leading-relaxed">
            Four interconnected phases form a closed loop — from detecting a behavioral signal to
            logging the resolution and learning for next time.
          </p>
        </div>

        {/* Phase Tab Stepper */}
        <div className="reveal mb-6 sm:mb-10">
          <div className="relative flex items-stretch justify-center gap-0 rounded-2xl overflow-hidden border border-border-subtle bg-white/60 backdrop-blur-sm shadow-sm mx-auto max-w-2xl">
            {/* Progress bar */}
            <div
              className="absolute bottom-0 left-0 h-0.5 transition-all duration-500 ease-out"
              style={{
                width: `${((activePhase + 1) / phases.length) * 100}%`,
                background: active.color,
              }}
            />
            {phases.map((phase, i) => (
              <button
                key={phase.id}
                onClick={() => handlePhaseChange(i)}
                className="relative flex-1 flex flex-col items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-3 sm:py-4 transition-all duration-300 group focus:outline-none min-h-[64px]"
                style={{
                  background: activePhase === i ? phase.colorLight : 'transparent',
                }}
                aria-selected={activePhase === i}
              >
                {/* Separator line */}
                {i > 0 && (
                  <div
                    className="absolute left-0 top-3 bottom-3 w-px"
                    style={{ background: 'rgba(0,0,0,0.06)' }}
                  />
                )}
                {/* Icon circle */}
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: activePhase === i ? `${phase.color}20` : 'rgba(226,232,228,0.6)',
                    color: activePhase === i ? phase.color : '#94A3B8',
                    boxShadow: activePhase === i ? `0 0 0 3px ${phase.colorGlow}` : 'none',
                    transform: activePhase === i ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <div className="scale-90 sm:scale-100">{phase.icon}</div>
                </div>
                {/* Number */}
                <span
                  className="text-xs font-mono font-bold transition-colors duration-300"
                  style={{
                    fontFamily: 'JetBrains Mono',
                    color: activePhase === i ? phase.color : '#94A3B8',
                  }}
                >
                  {phase.number}
                </span>
                {/* Label — hidden on xs, shown on sm+ */}
                <span
                  className="text-xs font-semibold transition-colors duration-300 hidden sm:block"
                  style={{ color: activePhase === i ? '#2C3E50' : '#94A3B8' }}
                >
                  {phase.label}
                </span>
                {/* Active dot */}
                {activePhase === i && (
                  <div
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: phase.color }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Content Panel */}
        <div className="reveal">
          <div
            className="rounded-3xl border overflow-hidden transition-all duration-500"
            style={{
              borderColor: active.colorBorder,
              background: active.colorLight,
              boxShadow: `0 8px 40px ${active.colorGlow}`,
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Phase Info */}
              <div
                className="p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r"
                style={{ borderColor: active.colorBorder }}
              >
                {/* Tag + number */}
                <div
                  className="transition-all duration-300"
                  style={{
                    transform: animating ? slideOut : 'translateX(0)',
                    opacity: animating ? 0 : 1,
                    transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${active.color}20`, color: active.color }}
                    >
                      {active.icon}
                    </div>
                    <div>
                      <div
                        className="text-xs font-mono font-bold tracking-widest uppercase"
                        style={{ color: active.color, fontFamily: 'JetBrains Mono' }}
                      >
                        Phase {active.number} · {active.tag}
                      </div>
                      <div
                        className="text-lg sm:text-xl font-bold text-dark-slate leading-tight"
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        {active.title}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-mid-slate leading-relaxed mb-5 sm:mb-6">
                    {active.description}
                  </p>

                  {/* How it helps */}
                  <div
                    className="rounded-xl p-4 border"
                    style={{ background: active.colorLight, borderColor: active.colorBorder }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: active.color }}
                      >
                        <svg
                          className="w-3 h-3 text-white"
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
                      <span className="text-xs font-semibold" style={{ color: active.color }}>
                        What this means for caregivers
                      </span>
                    </div>
                    <p className="text-xs text-mid-slate leading-relaxed pl-7">{active.detail}</p>
                  </div>
                </div>
              </div>

              {/* Right: Metrics + Pipeline */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col gap-5 sm:gap-6">
                {/* Metrics */}
                <div>
                  <div
                    className="text-xs font-mono font-semibold tracking-widest uppercase mb-3 sm:mb-4"
                    style={{ color: active.color, fontFamily: 'JetBrains Mono' }}
                  >
                    Key Metrics
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {active.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-2xl p-3 sm:p-4 border text-center transition-all duration-500"
                        style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderColor: active.colorBorder,
                          transform: metricsVisible
                            ? 'translateY(0) scale(1)'
                            : 'translateY(12px) scale(0.95)',
                          opacity: metricsVisible ? 1 : 0,
                          transitionDelay: `${i * 80}ms`,
                        }}
                      >
                        <div
                          className="text-sm sm:text-lg font-bold mb-1"
                          style={{ color: active.color, fontFamily: 'JetBrains Mono' }}
                        >
                          {m.value}
                        </div>
                        <div className="text-xs text-light-slate leading-tight">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Pipeline Visualization */}
                <div>
                  <div
                    className="text-xs font-mono font-semibold tracking-widest uppercase mb-3 sm:mb-4"
                    style={{ color: active.color, fontFamily: 'JetBrains Mono' }}
                  >
                    Live Pipeline
                  </div>
                  <div
                    className="rounded-2xl p-4 sm:p-5 border"
                    style={{ background: 'rgba(255,255,255,0.7)', borderColor: active.colorBorder }}
                  >
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      {active.pipeline.map((step, i) => (
                        <React.Fragment key={i}>
                          <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                            <div
                              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg transition-all duration-400"
                              style={{
                                background:
                                  i <= pipelineStep ? `${active.color}20` : 'rgba(226,232,228,0.5)',
                                boxShadow:
                                  i === pipelineStep
                                    ? `0 0 0 3px ${active.colorGlow}, 0 0 12px ${active.colorGlow}`
                                    : 'none',
                                transform: i === pipelineStep ? 'scale(1.12)' : 'scale(1)',
                              }}
                            >
                              {step.icon}
                            </div>
                            <span
                              className="text-xs font-medium text-center leading-tight transition-colors duration-300 hidden sm:block"
                              style={{
                                color: i <= pipelineStep ? '#2C3E50' : '#94A3B8',
                                fontSize: '10px',
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                          {i < active.pipeline.length - 1 && (
                            <div
                              className="h-0.5 flex-1 max-w-6 sm:max-w-8 transition-all duration-500 rounded-full"
                              style={{
                                background:
                                  i < pipelineStep ? active.color : 'rgba(226,232,228,0.8)',
                                transitionDelay: `${i * 100}ms`,
                              }}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    {/* Pulse indicator */}
                    <div
                      className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 border-t"
                      style={{ borderColor: active.colorBorder }}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background:
                            pipelineStep >= active.pipeline.length - 1 ? active.color : '#94A3B8',
                          boxShadow:
                            pipelineStep >= active.pipeline.length - 1
                              ? `0 0 0 3px ${active.colorGlow}`
                              : 'none',
                          animation:
                            pipelineStep >= active.pipeline.length - 1
                              ? 'pulse 2s infinite'
                              : 'none',
                        }}
                      />
                      <span
                        className="text-xs text-mid-slate"
                        style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                      >
                        {pipelineStep >= active.pipeline.length - 1
                          ? `Phase ${active.number} complete`
                          : `Processing step ${pipelineStep + 1} of ${active.pipeline.length}…`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phase navigation arrows */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handlePhaseChange(Math.max(0, activePhase - 1))}
                    disabled={activePhase === 0}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
                    style={{
                      background: activePhase > 0 ? active.colorLight : 'transparent',
                      color: activePhase > 0 ? active.color : '#94A3B8',
                      border: `1px solid ${activePhase > 0 ? active.colorBorder : 'transparent'}`,
                    }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Prev
                  </button>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-2">
                    {phases.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => handlePhaseChange(i)}
                        className="rounded-full transition-all duration-300 min-h-[24px] min-w-[24px] flex items-center justify-center"
                        style={{
                          width: i === activePhase ? '20px' : '6px',
                          height: '6px',
                          background: i === activePhase ? active.color : 'rgba(148,163,184,0.4)',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handlePhaseChange(Math.min(phases.length - 1, activePhase + 1))}
                    disabled={activePhase === phases.length - 1}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
                    style={{
                      background:
                        activePhase < phases.length - 1 ? active.colorLight : 'transparent',
                      color: activePhase < phases.length - 1 ? active.color : '#94A3B8',
                      border: `1px solid ${activePhase < phases.length - 1 ? active.colorBorder : 'transparent'}`,
                    }}
                  >
                    Next
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase overview strip */}
        <div className="reveal mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {phases.map((phase, i) => (
            <button
              key={phase.id}
              onClick={() => handlePhaseChange(i)}
              className="group text-left rounded-2xl p-3 sm:p-4 border transition-all duration-300 min-h-[80px]"
              style={{
                background: activePhase === i ? phase.colorLight : 'rgba(255,255,255,0.7)',
                borderColor: activePhase === i ? phase.colorBorder : '#E2E8E4',
                boxShadow: activePhase === i ? `0 4px 20px ${phase.colorGlow}` : 'none',
                transform: activePhase === i ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: activePhase === i ? `${phase.color}20` : 'rgba(226,232,228,0.6)',
                    color: activePhase === i ? phase.color : '#94A3B8',
                  }}
                >
                  <div className="scale-75">{phase.icon}</div>
                </div>
                <span
                  className="text-xs font-mono font-bold"
                  style={{
                    color: activePhase === i ? phase.color : '#94A3B8',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  {phase.number}
                </span>
              </div>
              <div
                className="text-xs sm:text-sm font-semibold leading-tight mb-1"
                style={{
                  color: activePhase === i ? '#2C3E50' : '#718096',
                  fontFamily: 'Plus Jakarta Sans',
                }}
              >
                {phase.label} Phase
              </div>
              <div className="text-xs text-light-slate leading-snug line-clamp-2">{phase.tag}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
