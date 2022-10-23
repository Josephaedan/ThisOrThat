// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif',
      ...defaultTheme.fontFamily.sans]
    },
    extend: {},
  },
  daisyui: {
    themes: [
      {
        default: {
          "primary": "#6d28d9",
          "secondary": "#ea580c",  
          "accent": "#c4b5fd",
          "neutral": "#111827",
          "base-100": "#0B111D",
          "info": "#3ABFF8",
          "success": "#16a34a",
          "warning": "#FBBD23",
          "error": "#e11d48",
        }
      }]
  },
  plugins: [require("daisyui")],
};
