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
    },
    maxWidth: {
      '5xs': '4rem',
      '4xs': '8rem',
      '3xs': '12rem',
      '2xs': '16rem',
      'xs': '20rem',
      'sm': '24rem',
      'md': '28rem',
      'lg': '32rem',
      'xl': '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
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
