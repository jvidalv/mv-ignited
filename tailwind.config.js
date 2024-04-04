/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx", "./src/**/*.ts"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          high: "rgb(var(--surface-high) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "#e6720e",
        },
      },
    },
  },
  plugins: [],
};
