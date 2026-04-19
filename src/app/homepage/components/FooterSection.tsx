import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-border-subtle bg-warm-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
          {/* Logo + description */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <AppLogo size={44} />
              <div className="flex flex-col leading-none">
                <span
                  className="font-heading font-bold text-dark-slate text-base tracking-tight"
                  style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
                >
                  NeuroDecode
                </span>
                <span
                  className="font-mono text-light-slate tracking-widest uppercase"
                  style={{ fontFamily: 'JetBrains Mono', fontSize: '9px' }}
                >
                  ASD AI Copilot
                </span>
              </div>
            </div>
            <p className="text-sm text-light-slate leading-relaxed">
              Real-time multimodal AI companion for autism spectrum disorder caregivers. Built with
              Gemini 2.0, Keras, and Flutter.
            </p>
            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {['Gemini 2.0', 'Flutter 3.x', 'Keras', 'Riverpod'].map((t) => (
                <span
                  key={t}
                  className="text-2xs font-mono px-2 py-0.5 rounded bg-sage-pale border border-sage-200 text-sage-700"
                  style={{ fontFamily: 'JetBrains Mono', fontSize: '10px' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <div
              className="text-xs font-mono font-semibold text-light-slate tracking-widest uppercase mb-4"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Navigation
            </div>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Solution', href: '#solution' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Features', href: '#features' },
                { label: 'Insights', href: '#insights' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-light-slate hover:text-dark-slate transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Project links */}
          <div>
            <div
              className="text-xs font-mono font-semibold text-light-slate tracking-widest uppercase mb-4"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Project
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Psianturi/neuro-decode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-light-slate hover:text-dark-slate transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub Repository
              </a>
              <a
                href="https://github.com/Psianturi/neuro-decode/tree/dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-light-slate hover:text-dark-slate transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Dev Branch
              </a>
              <span className="flex items-center gap-2 text-sm font-medium text-light-slate">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
                Flutter App (iOS/Android)
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <div
              className="text-xs font-mono font-semibold text-light-slate tracking-widest uppercase mb-4"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              Status
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sage-pale border border-sage-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500"></span>
                </span>
                <span
                  className="text-xs font-mono text-sage-700"
                  style={{ fontFamily: 'JetBrains Mono' }}
                >
                  Cloud Run · Online
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-blue-pale border border-border-blue">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: '#5B7FA6' }}
                  ></span>
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: '#5B7FA6' }}
                  ></span>
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ fontFamily: 'JetBrains Mono', color: '#5B7FA6' }}
                >
                  Firestore · Syncing
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-pale border border-amber/20">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
                </span>
                <span
                  className="text-xs font-mono text-amber"
                  style={{ fontFamily: 'JetBrains Mono' }}
                >
                  Beta · v1.2.0-dev
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-light-slate font-medium">
            © 2026 NeuroDecode AI · 2026 · <span className="text-sage-500">Posma Janius S</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs text-light-slate hover:text-dark-slate transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-border-subtle text-xs">·</span>
            <a
              href="#"
              className="text-xs text-light-slate hover:text-dark-slate transition-colors"
            >
              Terms of Use
            </a>
            <span className="text-border-subtle text-xs">·</span>
            <span
              className="text-xs font-mono text-sage-500"
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              v1.2.0-dev
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
