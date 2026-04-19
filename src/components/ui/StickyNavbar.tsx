'use client';

import React, { useEffect, useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

const StickyNavbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    const sections = ['solution', 'how-it-works', 'features', 'insights'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { label: 'Solution', href: '#solution', id: 'solution' },
    { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Insights', href: '#insights', id: 'insights' },
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(253,252,250,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226,232,228,0.8)',
          boxShadow: '0 4px 24px rgba(44,62,80,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group min-h-[44px]">
            <AppLogo size={34} />
            <span
              className="font-bold text-dark-slate text-sm tracking-tight group-hover:text-sage-600 transition-colors"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              NeuroDecode
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] flex items-center ${
                  activeSection === item.id
                    ? 'text-dark-slate bg-sage-pale'
                    : 'text-mid-slate hover:text-dark-slate hover:bg-sage-pale/60'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <a
              href="#insights"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-sage-md hover:scale-105 min-h-[40px]"
              style={{ background: 'linear-gradient(135deg, #7A9E7E 0%, #5B7FA6 100%)' }}
            >
              View Insights
            </a>
            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle bg-white/70 hover:bg-white transition-all duration-200"
            >
              {menuOpen ? (
                <svg
                  className="w-4.5 h-4.5 text-dark-slate"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ width: '18px', height: '18px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4.5 h-4.5 text-dark-slate"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ width: '18px', height: '18px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            borderTop: menuOpen ? '1px solid rgba(226,232,228,0.6)' : 'none',
          }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={handleNavClick}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center min-h-[48px] ${
                  activeSection === item.id
                    ? 'text-dark-slate bg-sage-pale font-semibold'
                    : 'text-mid-slate hover:text-dark-slate hover:bg-sage-pale/60'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#insights"
              onClick={handleNavClick}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white min-h-[48px]"
              style={{ background: 'linear-gradient(135deg, #7A9E7E 0%, #5B7FA6 100%)' }}
            >
              View Insights
            </a>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99] md:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default StickyNavbar;
