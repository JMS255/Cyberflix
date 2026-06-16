import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg:          '#0a051b',
          card:        '#141125',
          cardHover:   '#181828',
          border:      '#2d1b5e',
          accent:      '#8b5cf6',
          accentDark:  '#6d28d9',
          accentLight: '#a78bfa',
          neon:        '#c084fc',
          muted:       '#4c1d95',
          teal:        '#54b9c5',   /* Netflix's "Explore All" teal-blue */
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeUp 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
