/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        sg: {
          50:  '#F2F7EC',
          100: '#DDECC8',
          200: '#BBDA91',
          300: '#8DC050',
          400: '#6BA32E',
          500: '#4A7C23',
          600: '#3D6A1A',
          700: '#2D5016',
          800: '#1E360E',
          900: '#111F08',
        },
      },
    },
  },
  plugins: [],
}
