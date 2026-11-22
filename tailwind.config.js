/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Static reference palette (day)
        lavender: '#F5F0FF',
        blush: '#FFF0F5',
        mist: '#FAF9FF',
        sage: '#E2F0D9',
        sky: '#E6F4FE',
        lilac: '#E0D4F7',
        // Static reference palette (night)
        night: '#130F26',
        indigo: '#1A162B',
        forest: '#0D1B2A',
        amber: '#FF9E64',
        gold: '#FFE082',
        firefly: '#94E2D5',
        // Semantic tokens (theme-driven via CSS vars)
        surface: 'var(--surface)',
        'surface-solid': 'var(--surface-solid)',
        line: 'var(--line)',
        body: 'var(--body)',
        muted: 'var(--muted)',
        heading: 'var(--heading)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        'accent-2': 'var(--accent-2)',
        'chip-bg': 'var(--chip-bg)',
        'chip-text': 'var(--chip-text)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'ui-serif', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        glow: 'var(--shadow-glow)',
      },
      keyframes: {
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.85', transform: 'scaleY(1.05)' },
        },
      },
      animation: {
        'gradient-pan': 'gradient-pan 12s ease infinite',
        flicker: 'flicker 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
