/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        dark: '#191919',
        dark_g: '#326E29',
        gray_l: '#333333',
        light_g: '#72FC5E',
        light: '#A5E69C',
        white: '#EFEFEF'
      },
      textColor: {
        dark: '#191919',
        dark_g: '#326E29',
        gray_l: '#333333',
        light_g: '#72FC5E',
        light: '#A5E69C',
        white: '#EFEFEF'
      },
      borderColor: {
        dark: '#191919',
        dark_g: '#326E29',
        gray_l: '#333333',
        light_g: '#72FC5E',
        light: '#A5E69C',
        white: '#EFEFEF'
      },
      fontFamily: {
        main: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}

