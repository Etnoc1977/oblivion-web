/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { 500: '#1e3a8a', 600: '#1e2f6a', 700: '#162554', 800: '#0f1b3d', 900: '#0a1128' },
        teal: { 400: '#1db4c8', 500: '#179aad' },
        dark: { 50: '#1a1d2e', 100: '#151828', 200: '#111422', 300: '#0d101c', 400: '#090c16' },
      },
    },
  },
  plugins: [],
};
