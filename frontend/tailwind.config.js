/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8F7F4',
        card: {
          DEFAULT: '#FFFFFF',
          hover: '#F3F2EF',
        },
        accent: {
          DEFAULT: '#C4A96A',
          muted: 'rgba(196, 169, 106, 0.15)',
        },
        'text-primary': '#2D2D2D',
        'text-secondary': '#8A8A8A',
        'text-muted': '#B5B5B5',
        border: '#E5E2DC',
        'btn-dark': {
          DEFAULT: '#2D2D2D',
          hover: '#3D3D3D',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
      },
    },
  },
  plugins: [],
};
