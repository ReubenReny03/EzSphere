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
    },
  },
  plugins: [],
};
