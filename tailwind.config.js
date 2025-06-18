/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // 파란색
          light: '#3b82f6',
          dark: '#1e40af',
        },
        secondary: {
          DEFAULT: '#7c3aed', // 보라색
          light: '#a78bfa',
          dark: '#5b21b6',
        },
        success: {
          DEFAULT: '#22c55e', // 초록색
          light: '#4ade80',
          dark: '#15803d',
        },
        warning: {
          DEFAULT: '#f59e42', // 주황색
          light: '#fbbf24',
          dark: '#b45309',
        },
        error: {
          DEFAULT: '#ef4444', // 빨간색
          light: '#f87171',
          dark: '#991b1b',
        },
        neutral: {
          DEFAULT: '#64748b', // 회색
          light: '#cbd5e1',
          dark: '#334155',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        xs: ['0.75rem', '1.2'],
        sm: ['0.875rem', '1.4'],
        base: ['1rem', '1.6'],
        lg: ['1.125rem', '1.7'],
        xl: ['1.25rem', '1.8'],
        '2xl': ['1.5rem', '2'],
        '3xl': ['1.875rem', '2.2'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(37, 99, 235, 0.08)',
        'focus': '0 0 0 2px #2563eb33',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease',
        slideUp: 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1)',
      },
      screens: {
        xs: '400px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
} 