/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Ini memastikan Tailwind membaca file App.jsx Anda
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}