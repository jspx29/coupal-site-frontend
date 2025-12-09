/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        periwinkle: '#c3c8ff',
        softpink: '#ffb6d9',
        lavender: '#a68cff',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        anniversary: {
          primary: '#ffb6d9', // pink
          secondary: '#a68cff', // purple
          accent: '#c3c8ff',
          neutral: '#f8f7fb',
          'base-100': '#ffffff',
        },
      },
    ],
  },
};
