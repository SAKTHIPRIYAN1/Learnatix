/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/_components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        trans:"rgba(15, 23, 42, 0.5)",
        primary: "oklch(96.8% 0.007 247.896)",
        secondary: "oklch(70.7% 0.022 261.325)",
        header:"oklch(96.7% 0.003 264.542)",
        accent: "#00ffff",
        bg: "rgb(3,8,22)",
         'bg-body': '#0a0a0a',
        'card': '#1a1a1a',
      },
      keyframes: {
        bubble: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "95%": { transform: "translateY(-85vh) scale(1.1)", opacity: "0.8" },
          "100%": { transform: "translateY(-100vh) scale(1.2)", opacity: "0" },
        },
      },
      animation: {
        bubble: "bubble linear infinite",
        "spin-slow": "spin 1.2s linear infinite",
        "spin-slower": "spin 2s linear infinite",
      },
      zIndex: {
        'normal':'2'
      }

    },
  },
  plugins: [],
};
