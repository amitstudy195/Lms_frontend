/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        slate: {
          150: '#eef2f6',
          350: '#b8c4d3',
          450: '#7e8f9f',
          550: '#52627a',
          750: '#273549',
          850: '#152033',
        },
        indigo: {
          650: '#4338ca',
          705: '#3730a3',
        },
        amber: {
          250: '#fde047',
          550: '#d97706',
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
