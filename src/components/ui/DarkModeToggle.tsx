'use client';

import React, { useEffect, useState } from 'react';

const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('nd-dark-mode');
    if (stored === 'true') {
      setDark(true);
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('nd-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('nd-dark-mode', 'false');
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-10 h-10 rounded-full flex items-center justify-center border border-border-subtle bg-white/70 hover:bg-white hover:border-sage-300 transition-all duration-200"
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? (
        <svg
          className="w-4.5 h-4.5 text-amber-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          style={{ width: '18px', height: '18px' }}
        >
          <path
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="w-4.5 h-4.5 text-slate-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ width: '18px', height: '18px' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
