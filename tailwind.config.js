const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        yello: colors.amber,
        coldGray: colors.blueGray,
        gray: colors.trueGray,
        red: colors.red,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
