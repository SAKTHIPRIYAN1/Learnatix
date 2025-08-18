/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/_components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "oklch(96.8% 0.007 247.896)",
        secondary: "oklch(70.7% 0.022 261.325)",
        header:"oklch(96.7% 0.003 264.542)",
        accent: "#00ffff",
        bg: "rgb(3,8,22)",
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
      },
    },
  },
  plugins: [],
};
