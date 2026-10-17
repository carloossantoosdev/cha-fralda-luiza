/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6F0',
        blush: '#F5D0D8',
        butter: '#F5E6B8',
        ink: '#3F2E2A',
        rose: '#A85D6E',
        gold: '#C4A36A',
        ivory: '#F7F1E8',
        mist: '#F3E6E2',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 50px -28px rgba(63, 46, 42, 0.45)',
      },
    },
  },
  plugins: [],
}
