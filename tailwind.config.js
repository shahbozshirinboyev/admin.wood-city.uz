/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        "sm ": "1rem",
        "lg ": "2rem",
        "xl ": "4rem",
        "2xl": "6rem",
      },
    },
  },
  plugins: [require('daisyui'),],
  daisyui: { darkTheme: false, },
}