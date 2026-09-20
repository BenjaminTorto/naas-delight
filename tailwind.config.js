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
          DEFAULT: 'var(--bg-page)',
          2: 'var(--bg-surface)',
          3: 'var(--bg-surface-3)',
          4: 'var(--border-grid)',
          5: 'var(--bg-surface-alt)',
        },
        cream: 'var(--cream)',
        muted: 'var(--muted)',
      },
      fontFamily: {
  serif: ['Archivo', 'sans-serif'],
  sans: ['Archivo', 'sans-serif'],
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
