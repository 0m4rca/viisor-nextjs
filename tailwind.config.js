/** @type {import('tailwindcss').Config} */
export default {
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

        "secondary-light": "var(--color-secondary-light)",
        "secondary-dark": "var(--color-secondary-dark)",

        "tertiary-light": "var(--color-tertiary-light)",
        "tertiary-dark": "var(--color-tertiary-dark)",

        "grey-light-1": "var(--color-grey-light-1)",
        "grey-light-2": "var(--color-grey-light-2)",
        "grey-dark": "var(--color-grey-dark)",
        "grey-dark-2": "var(--color-grey-dark-2)",
        "grey-dark-3": "var(--color-grey-dark-3)",
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
