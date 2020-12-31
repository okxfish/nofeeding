module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '160': '40rem',
        '176': '48rem',
        '192': '56rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
