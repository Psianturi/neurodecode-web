'use client';

import React, { useEffect, useRef } from 'react';

const features = [
  {
    id: 'multimodal',
    size: 'large',
    title: 'Multimodal Real-Time Processing',
    description:
      'Simultaneously analyzes camera feed (facial expression, body language, environment) and audio stream (vocal patterns, ambient sound) for comprehensive behavioral context.',
    color: '#7A9E7E',
    bg: 'rgba(122,158,126,0.07)',
    border: 'rgba(122,158,126,0.2)',
    badge: 'REAL-TIME',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    visual: (
      <div className="flex items-end gap-1 h-12">
        {[0.3, 0.6, 0.4, 0.8, 0.9, 0.7, 0.5, 0.95, 0.8, 0.6, 0.4, 0.7].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm animate-pulse"
            style={{
              height: `${h * 48}px`,
              background: `rgba(122,158,126,${h * 0.7})`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'keras',
    size: 'small',
    title: 'Behavioral Pattern Recognition',
    description:
      '94.7% accuracy on crisis pattern detection. Custom-trained on 50k+ ASD behavioral sequences.',
    color: '#FF6F00',
    bg: 'rgba(255,111,0,0.06)',
    border: 'rgba(255,111,0,0.18)',
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
        />
      </svg>
    ),
    stat: { value: '94.7%', label: 'Detection accuracy' },
  },
  {
    id: 'gemini',
    size: 'small',
    title: 'AI Voice Guidance',
    description:
      'Natural language intervention guidance delivered in real-time audio. Responds in under 1.5 seconds.',
    color: '#4285F4',
    bg: 'rgba(66,133,244,0.06)',
    border: 'rgba(66,133,244,0.18)',
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
    stat: { value: '<1.5s', label: 'Voice response latency' },
  },
  {
    id: 'profile',
    size: 'small',
    title: 'Personalized Child Profile',
    description:
      "Each child's behavioral history builds a unique model — triggers, successful interventions, emotional patterns.",
    color: '#5B7FA6',
    bg: 'rgba(91,127,166,0.07)',
    border: 'rgba(91,127,166,0.2)',
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    stat: { value: '∞', label: 'Adaptive learning sessions' },
  },
  {
    id: 'privacy',
    size: 'small',
    title: 'Privacy-First Architecture',
    description:
      'On-device inference for sensitive data. Only anonymized behavioral metadata is stored securely in the cloud.',
    color: '#7A9E7E',
    bg: 'rgba(122,158,126,0.07)',
    border: 'rgba(122,158,126,0.2)',
    badge: null,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    stat: { value: 'E2E', label: 'Encrypted + on-device' },
  },
];

const techStack = [
  {
    name: 'Multimodal AI',
    role: 'Voice intervention & NLP',
    color: '#4285F4',
    bg: 'rgba(66,133,244,0.08)',
    border: 'rgba(66,133,244,0.2)',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
      </svg>
    ),
  },
  {
    name: 'Behavioral Models',
    role: 'Pattern recognition engine',
    color: '#FF6F00',
    bg: 'rgba(255,111,0,0.08)',
    border: 'rgba(255,111,0,0.2)',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    name: 'Cloud Backend',
    role: 'Serverless inference backend',
    color: '#1A73E8',
    bg: 'rgba(26,115,232,0.08)',
    border: 'rgba(26,115,232,0.2)',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
    ),
  },
  {
    name: 'Secure Database',
    role: 'Real-time session & profile DB',
    color: '#FBBC04',
    bg: 'rgba(251,188,4,0.08)',
    border: 'rgba(251,188,4,0.2)',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>
    ),
  },
  {
    name: 'Mobile App',
    role: 'iOS & Android caregiver app',
    color: '#02569B',
    bg: 'rgba(2,86,155,0.08)',
    border: 'rgba(2,86,155,0.2)',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
        />
      </svg>
    ),
  },
  {
    name: 'Reactive State',
    role: 'App state management',
    color: '#7A9E7E',
    bg: 'rgba(122,158,126,0.08)',
    border: 'rgba(122,158,126,0.2)',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    name: 'Auth & Privacy',
    role: 'Secure user authentication',
    color: '#E8A87C',
    bg: 'rgba(232,168,124,0.08)',
    border: 'rgba(232,168,124,0.2)',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    name: 'Edge Inference',
    role: 'On-device privacy processing',
    color: '#FF6F00',
    bg: 'rgba(255,111,0,0.08)',
    border: 'rgba(255,111,0,0.2)',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
        />
      </svg>
    ),
  },
];

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="features" ref={sectionRef} className="py-16 sm:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20 reveal">
          <span
            className="inline-block text-xs font-mono font-semibold text-amber tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-amber-pale border border-amber/20"
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            Capabilities
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-slate tracking-tight mb-5"
            style={{ fontFamily: 'Plus Jakarta Sans' }}
          >
            Built for the
            <br />
            <span className="text-gradient-warm">hardest moments.</span>
          </h2>
          <p className="text-base sm:text-lg text-mid-slate font-light leading-relaxed">
            Every feature is designed around the realities of ASD caregiving — speed,
            personalization, and privacy.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {/* Large card */}
          <div
            className="sm:col-span-2 reveal rounded-3xl p-6 sm:p-8 border hover-lift"
            style={{ background: features[0].bg, borderColor: features[0].border }}
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `${features[0].color}20`, color: features[0].color }}
              >
                {features[0].icon}
              </div>
              <span
                className="tech-badge"
                style={{
                  color: features[0].color,
                  borderColor: `${features[0].color}40`,
                  backgroundColor: `${features[0].color}10`,
                }}
              >
                {features[0].badge}
              </span>
            </div>
            <h3
              className="text-lg sm:text-xl font-bold text-dark-slate mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              {features[0].title}
            </h3>
            <p className="text-sm text-mid-slate leading-relaxed mb-6">{features[0].description}</p>
            {features[0].visual}
          </div>

          {/* Small cards */}
          {features.slice(1).map((feature, i) => (
            <div
              key={feature.id}
              className="reveal rounded-3xl p-5 sm:p-6 border hover-lift flex flex-col"
              style={{
                background: feature.bg,
                borderColor: feature.border,
                transitionDelay: `${(i + 1) * 0.08}s`,
              }}
            >
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-4 sm:mb-5"
                style={{ background: `${feature.color}20`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-sm sm:text-base font-bold text-dark-slate mb-2"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                {feature.title}
              </h3>
              <p className="text-xs text-mid-slate leading-relaxed mb-4 sm:mb-5 flex-1">
                {feature.description}
              </p>
              {feature.stat && (
                <div
                  className="mt-auto pt-4 border-t"
                  style={{ borderColor: `${feature.color}25` }}
                >
                  <div
                    className="text-xl sm:text-2xl font-bold font-heading"
                    style={{ color: feature.color, fontFamily: 'JetBrains Mono' }}
                  >
                    {feature.stat.value}
                  </div>
                  <div className="text-xs text-light-slate mt-0.5">{feature.stat.label}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Feature Highlight — Session History */}
        <div className="reveal mb-12 sm:mb-16">
          <div className="rounded-3xl border border-border-subtle overflow-hidden bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Session History */}
              <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-border-subtle">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(91,127,166,0.1)', color: '#5B7FA6' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-sm sm:text-base font-bold text-dark-slate"
                      style={{ fontFamily: 'Plus Jakarta Sans' }}
                    >
                      Session History & Logging
                    </h3>
                    <p className="text-xs text-light-slate">Automatic post-session summaries</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      time: '14:32',
                      event: 'Sensory overload detected',
                      duration: '3.2 min',
                      outcome: 'Resolved',
                      color: '#7A9E7E',
                    },
                    {
                      time: '11:15',
                      event: 'Routine disruption — meltdown',
                      duration: '6.8 min',
                      outcome: 'Resolved',
                      color: '#7A9E7E',
                    },
                    {
                      time: '09:04',
                      event: 'Social overwhelm at school',
                      duration: '4.1 min',
                      outcome: 'Resolved',
                      color: '#7A9E7E',
                    },
                  ].map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-slate-blue-pale/40 border border-border-blue"
                    >
                      <span
                        className="text-xs font-mono text-light-slate flex-shrink-0"
                        style={{ fontFamily: 'JetBrains Mono' }}
                      >
                        {session.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-dark-slate truncate">
                          {session.event}
                        </div>
                        <div className="text-2xs text-light-slate" style={{ fontSize: '10px' }}>
                          {session.duration}
                        </div>
                      </div>
                      <span
                        className="text-2xs font-mono font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          color: session.color,
                          background: `${session.color}15`,
                          fontFamily: 'JetBrains Mono',
                          fontSize: '10px',
                        }}
                      >
                        {session.outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Adaptive Learning */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(122,158,126,0.1)', color: '#7A9E7E' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-sm sm:text-base font-bold text-dark-slate"
                      style={{ fontFamily: 'Plus Jakarta Sans' }}
                    >
                      Adaptive Learning Over Time
                    </h3>
                    <p className="text-xs text-light-slate">
                      Each session improves future guidance
                    </p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      label: 'Session Awareness',
                      desc: 'Tracks what triggers each child and what helps them calm down',
                      color: '#7A9E7E',
                    },
                    {
                      label: 'Child Profile',
                      desc: 'Builds a personalized behavioral model unique to your child',
                      color: '#5B7FA6',
                    },
                    {
                      label: 'AI Guidance',
                      desc: 'Learns from past sessions to give better, faster suggestions',
                      color: '#4285F4',
                    },
                    {
                      label: 'Pattern Detection',
                      desc: 'Recognizes recurring triggers before they escalate',
                      color: '#FF6F00',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-sage-pale/40 border border-sage-200/50"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-dark-slate">{item.label}</div>
                        <div
                          className="text-2xs text-light-slate mt-0.5"
                          style={{ fontSize: '10px' }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-sage-pale border border-sage-200">
                  <p className="text-xs text-sage-700 leading-relaxed">
                    <span className="font-semibold">Every session matters.</span> NeuroDecode
                    continuously refines its understanding of your child — so guidance becomes more
                    accurate and personalized over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="reveal">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="h-px flex-1 bg-border-subtle" />
            <span
              className="text-xs font-mono font-semibold text-light-slate tracking-widest uppercase"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Tech Stack
            </span>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {techStack.map((tech, i) => (
              <div
                key={tech.name}
                className="rounded-2xl p-3 sm:p-4 border hover-lift text-center"
                style={{
                  background: tech.bg,
                  borderColor: tech.border,
                  transitionDelay: `${i * 0.06}s`,
                }}
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
                  style={{ background: `${tech.color}15`, color: tech.color }}
                >
                  {tech.icon}
                </div>
                <div
                  className="text-xs font-bold text-dark-slate mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  {tech.name}
                </div>
                <div
                  className="text-light-slate leading-tight hidden sm:block"
                  style={{ fontSize: '10px' }}
                >
                  {tech.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
