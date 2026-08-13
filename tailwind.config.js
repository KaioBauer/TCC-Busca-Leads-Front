/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          bg: '#F0FDFA',
          bg2: '#CCFBF1',
        },
        success: '#10B981',
        amber: {
          DEFAULT: '#F59E0B',
        },
        surface: '#F1F5F9',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A',
          soft: '#64748B',
        },
        border: '#E2E8F0',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
      },
    },
  },
  plugins: [],
}
