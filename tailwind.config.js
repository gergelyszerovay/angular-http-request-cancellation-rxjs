/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{html,ts,md}'],
  theme: {
    extend: {},
  },
  plugins: [],
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    black: colors.black,
    gray: colors.gray,
    slate: colors.slate,
    white: colors.white,
    emerald: colors.emerald
  }
};
