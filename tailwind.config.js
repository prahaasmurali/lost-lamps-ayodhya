/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'diya-gold': '#FFD700',
        'diya-orange': '#FF8C00',
        'festival-red': '#DC143C',
        'lamp-glow': '#FFA500',
      },
      animation: {
        'flicker': 'flicker 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #FFA500' },
          'to': { boxShadow: '0 0 20px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}
