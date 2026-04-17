/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        'deep-black': "#0a0a0a",
        'rich-black': "#111111",
        'accent-gold': "#D4AF37",
        'soft-gold': "#E5D3A3",
        'dark-gray': "#141414",
        'text-primary': "#FFFFFF",
        'text-secondary': "#9A9A9A",
        'liquid-gold': "#D4AF37",
        luxury: {
          black: "#050505",
          navy: "#0a0c14",
          gold: {
            light: "#f3d082",
            DEFAULT: "#D4AF37",
            dark: "#b8860b",
          },
          emerald: "#008080",
          purple: "#6b21a8",
          teal: "#14b8a6",
          accent: "#c5a059",
        },
      },
      animation: {
        'shine': 'shine 1.5s ease-in-out infinite',
        'liquid-glow': 'liquid-glow 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
        'liquid-glow': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.3, filter: 'blur(40px)' },
          '50%': { opacity: 0.6, filter: 'blur(60px)' },
        },
      },
      fontFamily: {
        premium: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
