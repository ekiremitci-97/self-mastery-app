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
        // Semantic status colors
        error: {
          DEFAULT: '#E57373',
          muted: 'rgba(229, 115, 115, 0.12)',
        },
        success: {
          DEFAULT: '#5DC4A8',
          muted: 'rgba(93, 196, 168, 0.12)',
        },
        warning: {
          DEFAULT: '#E8A948',
          muted: 'rgba(232, 169, 72, 0.12)',
        },
        // Mood quadrant colors
        quadrant: {
          'high-unpleasant': {
            DEFAULT: '#E8655A',
            bg: 'rgba(232, 101, 90, 0.12)',
            border: 'rgba(232, 101, 90, 0.30)',
            light: '#F09E96',
          },
          'high-pleasant': {
            DEFAULT: '#E8A948',
            bg: 'rgba(232, 169, 72, 0.12)',
            border: 'rgba(232, 169, 72, 0.30)',
            light: '#F0C87A',
          },
          'low-unpleasant': {
            DEFAULT: '#8B9FD4',
            bg: 'rgba(139, 159, 212, 0.12)',
            border: 'rgba(139, 159, 212, 0.30)',
            light: '#B3C2E4',
          },
          'low-pleasant': {
            DEFAULT: '#5DC4A8',
            bg: 'rgba(93, 196, 168, 0.12)',
            border: 'rgba(93, 196, 168, 0.30)',
            light: '#8DD8C2',
          },
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
      },
    },
  },
  plugins: [],
};
