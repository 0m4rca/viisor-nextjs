/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3AC9A8", // no alpha
        secondary: "#F1FAF5 ",
        tertiary: "#145C58",
      },
    },
  },
  plugins: [],
};
