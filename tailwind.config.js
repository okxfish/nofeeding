module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    maxHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
      'modal': '95vh',
    },
    extend: {
      spacing: {
        '112': '28rem',
        '128': '32rem',
        '160': '40rem',
        '176': '48rem',
        '192': '56rem',
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
