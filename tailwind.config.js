/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // add paths to your component files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50', // example custom colors
        secondary: '#2196F3',
      },
    },
  },
  plugins: [],
};
