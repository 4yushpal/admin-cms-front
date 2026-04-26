/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '2xs': '280px',
        'xs': '320px',
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px',
        '6xl': '5120px',
      },
      colors: {
        uhs: {
          maroon: '#800020',
          orange: '#F57C00',
          dark: '#333333',
          light: '#F4F4F4',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 2s ease-in-out forwards',
        'marquee': 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
}
