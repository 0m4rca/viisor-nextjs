/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-dark": "var(--color-primary-dark)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
      },
      animation: {
        moveInLeft: "moveInLeft 1s ease-out forwards",
        moveInRight: "moveInRight 1s ease-out forwards",
      },
      keyframes: {
        moveInLeft: {
          "0%": { opacity: 0, transform: "translateX(-100px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        moveInRight: {
          "0%": { opacity: 0, transform: "translateX(100px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      backgroundImage: (theme) => ({
        "gradient-to-r-primary": `linear-gradient(to right, ${theme(
          "colors.primary-light"
        )}, ${theme("colors.primary-dark")})`,
        "gradient-to-l-primary": `linear-gradient(to left, ${theme(
          "colors.primary-light"
        )}, ${theme("colors.primary-dark")})`,
      }),
    },
  },
  plugins: [],
};
