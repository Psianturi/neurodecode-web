'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

const APK_FILE_ID = '11WR0eTD-XPzhXxgxvYzy9cRV45WfDwYB';
const APK_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${APK_FILE_ID}`;
const APK_VIEW_URL = `https://drive.google.com/file/d/${APK_FILE_ID}/view?usp=sharing`;

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('.animate-in');
    els?.forEach((el) => {
      (el as HTMLElement).style.animationPlayState = 'running';
    });
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col overflow-hidden hero-gradient"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Parallax Ambient Orbs — hidden on mobile for performance */}
      <div
        className="hidden sm:block absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(122,158,126,0.14) 0%, transparent 70%)',
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -15}px)`,
        }}
      />
      <div
        className="hidden sm:block absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(91,127,166,0.12) 0%, transparent 70%)',
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 20}px)`,
        }}
      />
      <div
        className="hidden sm:block absolute top-2/3 left-1/2 w-72 h-72 rounded-full pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(232,168,124,0.09) 0%, transparent 70%)',
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <AppLogo size={50} />
            <div className="flex flex-col leading-none">
              <span
                className="font-heading font-bold text-dark-slate text-base sm:text-lg tracking-tight"
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
              >
                NeuroDecode
              </span>
              <span
                className="hidden sm:block font-mono text-light-slate tracking-widest uppercase"
                style={{ fontFamily: 'JetBrains Mono', fontSize: '9px' }}
              >
                ASD · AI Copilot
              </span>
            </div>
          </div>

          {/* Nav Links — desktop only */}
          <div className="hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-sm border border-border-subtle rounded-full px-2 py-1.5">
            {[
              { label: 'Solution', href: '#solution' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Features', href: '#features' },
              { label: 'Insights', href: '#insights' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-mid-slate hover:text-dark-slate hover:bg-white/80 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-pale border border-sage-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500"></span>
              </span>
              <span
                className="text-2xs font-mono text-sage-700 font-medium tracking-wide"
                style={{ fontFamily: 'JetBrains Mono', fontSize: '11px' }}
              >
                LIVE · 247 sessions
              </span>
            </div>
            <DarkModeToggle />
            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Download AnakUnggul APK (Android)"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-mid-slate border border-border-subtle bg-white/70 hover:bg-white hover:border-sage-300 transition-all duration-200 min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 16v-8m0 8l-3-3m3 3l3-3m4 5H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2z"
                />
              </svg>
              AnakUnggul App
            </a>
            <a
              href={APK_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex text-xs text-light-slate hover:text-dark-slate transition-colors"
            >
              Drive mirror
            </a>
            <a
              href="#solution"
              className="px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-sage-md hover:scale-105 min-h-[44px] flex items-center"
              style={{ background: 'linear-gradient(135deg, #7A9E7E 0%, #5B7FA6 100%)' }}
            >
              Explore
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Left: Text Content */}
            <div className="lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="animate-in animate-in-delay-1 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sage-200 bg-sage-pale">
                <span
                  className="text-xs font-mono text-sage-700 tracking-wider uppercase"
                  style={{ fontFamily: 'JetBrains Mono' }}
                >
                  ASD Caregiving Copilot
                </span>
                <span className="w-px h-3 bg-sage-300" />
                <span className="text-xs text-slate-blue font-medium">Real-Time AI Assistance</span>
              </div>

              {/* Headline */}
              <div className="animate-in animate-in-delay-2 space-y-2">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-dark-slate tracking-tight"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  Your calm
                  <br />
                  <span className="text-gradient-sage">AI companion</span>
                  <br />
                  in every
                  <br />
                  <span className="relative inline-block">
                    moment.
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      height="6"
                      viewBox="0 0 200 6"
                      fill="none"
                    >
                      <path
                        d="M0 3 Q50 0 100 3 Q150 6 200 3"
                        stroke="#7A9E7E"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="animate-in animate-in-delay-3 text-base sm:text-lg text-mid-slate leading-relaxed max-w-xl font-light mx-auto lg:mx-0">
                NeuroDecode uses real-time multimodal AI — voice, vision, and behavioral pattern
                recognition — to help caregivers navigate autism spectrum disorder with confidence
                and clarity.
              </p>

              {/* CTAs */}
              <div className="animate-in animate-in-delay-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a
                  href="#solution"
                  className="group flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-white font-semibold text-base transition-all duration-300 hover:shadow-sage-lg hover:scale-105 min-h-[52px]"
                  style={{ background: 'linear-gradient(135deg, #7A9E7E 0%, #5B7FA6 100%)' }}
                >
                  See How It Works
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <a
                  href="#insights"
                  className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-dark-slate font-semibold text-base border border-border-subtle bg-white/80 hover:bg-white hover:border-sage-300 transition-all duration-300 min-h-[52px]"
                >
                  <svg
                    className="w-4 h-4 text-sage-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Public Insights
                </a>
              </div>

              {/* Tech Stack Pills */}
              <div className="animate-in animate-in-delay-5 space-y-3">
                <p
                  className="text-2xs font-mono text-light-slate tracking-widest uppercase"
                  style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                >
                  Built with
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {[
                    { label: 'Multimodal AI', color: '#4285F4' },
                    { label: 'Behavioral Models', color: '#FF6F00' },
                    { label: 'Cloud Backend', color: '#1A73E8' },
                    { label: 'Secure Database', color: '#FBBC04' },
                    { label: 'Mobile App', color: '#02569B' },
                    { label: 'Reactive State', color: '#7A9E7E' },
                    { label: 'Auth & Privacy', color: '#E8A87C' },
                  ].map((tech) => (
                    <span
                      key={tech.label}
                      className="tech-badge"
                      style={{
                        color: tech.color,
                        borderColor: `${tech.color}40`,
                        backgroundColor: `${tech.color}0D`,
                      }}
                    >
                      {tech.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Floating Visual Cards — hidden on mobile, shown on lg+ */}
            <div className="hidden lg:flex lg:w-1/2 relative h-[560px] items-center justify-center">
              {/* Central breathing orb */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-56 h-56 breathe">
                  <div
                    className="absolute inset-0 rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #7A9E7E 0%, transparent 70%)' }}
                  />
                  <div
                    className="absolute inset-4 rounded-full opacity-25"
                    style={{ background: 'radial-gradient(circle, #5B7FA6 0%, transparent 70%)' }}
                  />
                  <div
                    className="absolute inset-8 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(122,158,126,0.12) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </div>

              {/* Center Neural Illustration */}
              <div className="relative w-44 h-44 glass-card rounded-3xl shadow-float flex items-center justify-center z-10">
                <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
                  {/* Brain outline */}
                  <path
                    d="M40 10C27 10 17 20 17 30c0 5 2 9.5 5 12.5L19 54l10-3.5c3 1.5 6.5 2.5 11 2.5 13 0 23-10 23-20S53 10 40 10z"
                    stroke="#7A9E7E"
                    strokeWidth="1.5"
                    fill="rgba(122,158,126,0.06)"
                    strokeLinecap="round"
                  />
                  {/* Neural nodes */}
                  <circle cx="30" cy="27" r="3" fill="#5B7FA6" opacity="0.9" />
                  <circle cx="40" cy="22" r="3" fill="#7A9E7E" opacity="0.9" />
                  <circle cx="50" cy="27" r="3" fill="#5B7FA6" opacity="0.9" />
                  <circle cx="35" cy="37" r="3" fill="#E8A87C" opacity="0.9" />
                  <circle cx="45" cy="37" r="3" fill="#7A9E7E" opacity="0.9" />
                  <circle cx="40" cy="46" r="2.5" fill="#5B7FA6" opacity="0.7" />
                  {/* Connections */}
                  <line
                    x1="30"
                    y1="27"
                    x2="40"
                    y2="22"
                    stroke="#7A9E7E"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                  <line
                    x1="40"
                    y1="22"
                    x2="50"
                    y2="27"
                    stroke="#5B7FA6"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                  <line
                    x1="30"
                    y1="27"
                    x2="35"
                    y2="37"
                    stroke="#E8A87C"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                  <line
                    x1="50"
                    y1="27"
                    x2="45"
                    y2="37"
                    stroke="#7A9E7E"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                  <line
                    x1="35"
                    y1="37"
                    x2="45"
                    y2="37"
                    stroke="#5B7FA6"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                  <line
                    x1="35"
                    y1="37"
                    x2="40"
                    y2="46"
                    stroke="#7A9E7E"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                  <line
                    x1="45"
                    y1="37"
                    x2="40"
                    y2="46"
                    stroke="#5B7FA6"
                    strokeWidth="1.2"
                    opacity="0.4"
                  />
                  {/* Pulse rings */}
                  <circle cx="40" cy="22" r="6" stroke="#7A9E7E" strokeWidth="0.8" opacity="0.2" />
                  <circle cx="35" cy="37" r="6" stroke="#E8A87C" strokeWidth="0.8" opacity="0.2" />
                </svg>
              </div>

              {/* Floating Card 1 — Live Session */}
              <div className="float-a absolute top-6 left-0 glass-card rounded-2xl p-4 shadow-float w-56 z-20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-sage-400" />
                    <div className="absolute inset-0 rounded-full bg-sage-400 animate-ping opacity-50" />
                  </div>
                  <span
                    className="text-xs font-mono font-medium text-sage-700 tracking-wide"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    LIVE SESSION
                  </span>
                </div>
                <div className="text-2xl font-bold text-dark-slate font-heading mb-0.5">247</div>
                <div className="text-xs text-light-slate">Active caregivers right now</div>
                <div className="mt-3 h-1.5 rounded-full bg-sage-pale overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sage-400 to-slate-blue-light"
                    style={{ width: '68%' }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xs text-light-slate" style={{ fontSize: '10px' }}>
                    68% capacity
                  </span>
                  <span
                    className="text-2xs font-mono text-sage-600"
                    style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                  >
                    ↑ 12% today
                  </span>
                </div>
              </div>

              {/* Floating Card 2 — Crisis Detection */}
              <div className="float-b absolute top-16 right-0 glass-card rounded-2xl p-4 shadow-float w-52 z-20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-light-slate">Crisis Detected</span>
                  <span
                    className="text-xs font-mono text-amber font-semibold"
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    2.3s
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-dark-slate">Meltdown Pattern</div>
                    <div className="text-xs text-light-slate">Keras CNN · 94.7% conf.</div>
                  </div>
                </div>
                <div className="flex gap-1 items-end">
                  {[0.4, 0.7, 0.5, 0.9, 0.8, 0.6, 0.95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${h * 28}px`, background: `rgba(232,168,124,${h * 0.8})` }}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Card 3 — Gemini Intervention */}
              <div className="float-c absolute bottom-20 left-0 glass-card rounded-2xl p-4 shadow-float w-64 z-20">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4285F4, #7A9E7E)' }}
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-dark-slate">Gemini 2.5 Live</span>
                  <span
                    className="ml-auto text-2xs font-mono text-slate-blue"
                    style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                  >
                    INTERVENING
                  </span>
                </div>
                <div className="bg-sage-pale rounded-xl p-3 text-xs text-dark-slate leading-relaxed">
                  &ldquo;Try the deep pressure technique — place both hands gently on shoulders and
                  breathe together...&rdquo;
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full animate-pulse"
                      style={{
                        background: i <= 3 ? '#7A9E7E' : '#E2E8E4',
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Card 4 — Resolution */}
              <div className="float-b absolute bottom-8 right-2 glass-card rounded-2xl p-4 shadow-float w-48 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-sage-pale flex-shrink-0">
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
                  <span className="text-xs font-semibold text-sage-700">Resolved</span>
                </div>
                <div className="text-2xl font-bold text-dark-slate font-heading">4.2 min</div>
                <div className="text-xs text-light-slate">Avg. resolution time</div>
                <div
                  className="mt-2 text-xs font-mono text-sage-600"
                  style={{ fontFamily: 'JetBrains Mono' }}
                >
                  ↓ 38% vs. baseline
                </div>
              </div>

              {/* Floating Card 5 — Child Profile */}
              <div
                className="float-a absolute top-1/2 -translate-y-1/2 right-0 glass-card rounded-2xl p-3 shadow-float w-44 z-20"
                style={{ animationDelay: '3s' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(91,127,166,0.15)' }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      style={{ color: '#5B7FA6' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-dark-slate">Child Profile</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Sensory', val: 72 },
                    { label: 'Social', val: 45 },
                    { label: 'Routine', val: 88 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-2xs text-light-slate" style={{ fontSize: '10px' }}>
                          {item.label}
                        </span>
                        <span
                          className="text-2xs font-mono text-mid-slate"
                          style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                        >
                          {item.val}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-sage-pale overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.val}%`,
                            background: 'linear-gradient(90deg, #7A9E7E, #5B7FA6)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <a
          href="#solution"
          className="flex flex-col items-center gap-2 text-light-slate hover:text-sage-500 transition-colors"
        >
          <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-border-subtle flex items-start justify-center pt-2">
            <div className="w-1.5 h-2.5 rounded-full bg-sage-400 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
