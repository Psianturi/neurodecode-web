/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#7A9E7E',
          light: '#A8C5AB',
          pale: '#EAF2EB',
          50: '#F4F9F4',
          100: '#EAF2EB',
          200: '#C8DEC9',
          300: '#A8C5AB',
          400: '#88AC8C',
          500: '#7A9E7E',
          600: '#5E8562',
          700: '#486A4B',
          800: '#344E36',
          900: '#223424',
        },
        slate: {
          blue: '#5B7FA6',
          'blue-light': '#8AABC8',
          'blue-pale': '#E8EFF6',
        },
        'off-white': '#F7F5F0',
        'warm-white': '#FDFCFA',
        'dark-slate': '#2C3E50',
        'mid-slate': '#4A5568',
        'light-slate': '#718096',
        amber: {
          DEFAULT: '#E8A87C',
          pale: '#FDF0E6',
        },
        border: {
          subtle: '#E2E8E4',
          blue: '#D1DCE8',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '0.95' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'sage-sm': '0 2px 12px rgba(122, 158, 126, 0.15)',
        'sage-md': '0 8px 32px rgba(122, 158, 126, 0.2)',
        'sage-lg': '0 20px 60px rgba(122, 158, 126, 0.25)',
        'blue-sm': '0 2px 12px rgba(91, 127, 166, 0.15)',
        'blue-md': '0 8px 32px rgba(91, 127, 166, 0.2)',
        'card': '0 4px 24px rgba(44, 62, 80, 0.06)',
        'card-hover': '0 20px 48px rgba(44, 62, 80, 0.1)',
        'float': '0 16px 48px rgba(44, 62, 80, 0.12)',
        'inner-sage': 'inset 0 0 0 1px rgba(122, 158, 126, 0.2)',
      },
      backgroundImage: {
        'hero-gradient': `radial-gradient(ellipse 80% 60% at 20% 40%, rgba(122, 158, 126, 0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(91, 127, 166, 0.10) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 60% 80%, rgba(232, 168, 124, 0.08) 0%, transparent 50%)`,
        'sage-gradient': 'linear-gradient(135deg, #7A9E7E 0%, #5B7FA6 100%)',
        'warm-gradient': 'linear-gradient(135deg, #E8A87C 0%, #7A9E7E 60%, #5B7FA6 100%)',
      },
      animation: {
        'float-a': 'floatA 6s ease-in-out infinite',
        'float-b': 'floatB 7.5s ease-in-out infinite 1s',
        'float-c': 'floatC 9s ease-in-out infinite 2s',
        'breathe': 'breathe 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        floatA: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        floatB: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(-1.5deg)' },
        },
        floatC: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '33%': { transform: 'translateY(-6px)' },
          '66%': { transform: 'translateY(-14px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};