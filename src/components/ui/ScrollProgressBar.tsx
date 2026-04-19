'use client';

import React, { useEffect, useState } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, pct));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] transition-all duration-100 ease-out"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #7A9E7E 0%, #5B7FA6 60%, #E8A87C 100%)',
        boxShadow: '0 0 8px rgba(122,158,126,0.5)',
      }}
    />
  );
};

export default ScrollProgressBar;
