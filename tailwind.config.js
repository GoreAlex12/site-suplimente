/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Asigură-te că Tailwind scanează fișierele corect
  theme: {
    extend: {}, // Poți adăuga personalizări aici
  },
  plugins: [], // Dacă vrei să folosești pluginuri Tailwind, le adaugi aici
};