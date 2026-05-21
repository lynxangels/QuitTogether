/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'green-dark': '#3A6147',
        'green-mid': '#4A7C59',
        'green-light': '#5BA86A',
        'green-pale': '#EDF5E8',
        'brown-dark': '#8B5E3C',
        'brown-mid': '#8B7355',
        'brown-light': '#C8B89A',
        'cream': '#F7F3EE',
        'cream-dark': '#EDE7DC',
        'text-primary': '#1A1A1A',
        'text-muted': '#8B7355',
        'amber': '#F5C542',
        'sky-top': '#C8DFF5',
        'sky-bot': '#A8CBEA',
        'grass': '#5A9A6A',
        'rose': '#E07070',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      }
    },
  },
  plugins: [],
}
