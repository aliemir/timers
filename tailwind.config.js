const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Major Mono Display", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
