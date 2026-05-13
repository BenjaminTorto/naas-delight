/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C06E',
          dim: 'rgba(201,168,76,0.15)',
        },
        black: {
          DEFAULT: '#0C0C0C',
          2: '#111111',
          3: '#171717',
          4: '#1E1E1E',
          5: '#242424',
        },
        cream: '#F0EAD6',
        muted: '#8A7E6A',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 28s linear infinite',
      },
    },
  },
  plugins: [],
}
