import type { Config } from 'tailwindcss';

/**
 * Design tokens live here so the whole site shares one palette/type scale.
 * Tweak `accent`/`ink` to re-skin the portfolio in one place.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep "space" background ramp
        ink: {
          950: '#05060a',
          900: '#0a0c14',
          800: '#11131d',
          700: '#1a1d2b',
          600: '#272b3d',
        },
        // Cyan → indigo → violet accent (used sparingly for glow/CTAs)
        accent: {
          DEFAULT: '#6366f1',
          cyan: '#22d3ee',
          indigo: '#6366f1',
          violet: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '72rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
