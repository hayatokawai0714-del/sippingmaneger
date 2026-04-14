/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#153629',
        paper: '#f3fbf6',
        mist: '#e4f4e8',
        line: '#bfdfc8',
        accent: '#1f7a43',
        accentSoft: '#d9f2e1',
      },
    },
  },
  plugins: [],
};
