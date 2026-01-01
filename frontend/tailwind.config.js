/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'from-red-500',
    'via-orange-500',
    'to-yellow-500',
    'via-green-500',
    'to-blue-500',
    'via-purple-500',
    'to-red-500',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '30rem',
        'md': '48rem',
        'lg': '64rem',
        'xl': '87.5rem',
        '2xl': '96rem',
      },
      fontFamily: {
        sans: [
          '"Segoe UI"', 
          'Roboto', 
          '"Helvetica Neue"', 
          'Arial', 
          'sans-serif'
        ],
        mono: [
          'Consolas', 
          '"Courier New"', 
          'monospace'
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#132440',
          dark: '#16476A',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
        },
        accent: {
          DEFAULT: '#00aaff',
          dark: '#06b6d4',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}