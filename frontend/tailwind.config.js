/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        surface: '#151922',
        surface2: '#1c2230',
        border: '#2a3242',
        text: '#e6e9ef',
        muted: '#8b93a7',

        env: '#22c55e',
        social: '#3b82f6',
        gov: '#a855f7',
        game: '#f97316',

        success: '#22c55e',
        info: '#3b82f6',
        warning: '#f59e0b',
        danger: '#ef4444',
        review: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        lg: '0.625rem',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 1px 3px 0 rgb(0 0 0 / 0.15)',
        elevated: '0 12px 32px -8px rgb(0 0 0 / 0.5), 0 4px 12px -4px rgb(0 0 0 / 0.3)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
