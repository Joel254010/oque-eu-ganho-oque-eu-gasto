/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#a78bfa",   // violeta claro
          DEFAULT: "#7c3aed", // violeta principal
          dark: "#5b21b6",    // violeta escuro
        }
      }
    },
  },
  plugins: [],
}
