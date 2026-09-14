/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          dark: '#1D1D1F',
          secondary: '#6E6E73',
          muted: '#86868B',
          gray: '#F5F5F7',
          card: '#FFFFFF',
          border: '#D2D2D7',
          'border-subtle': '#E5E5E7',
          blue: '#0071E3',
          'blue-hover': '#0077ED',
          'blue-subtle': 'rgba(0, 113, 227, 0.08)',
        },
        whatsapp: {
          green: '#00C853',
          hover: '#00B048',
          dark: '#128C7E',
        }
      },
      fontFamily: {
        sans: [
          'SF Pro Text',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        display: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      letterSpacing: {
        'apple-title': '-0.028em',
        'apple-headline': '-0.022em',
        'apple-body': '-0.011em',
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      boxShadow: {
        'apple-card': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'apple-card-hover': '0 12px 32px rgba(0, 0, 0, 0.08)',
        'apple-modal': '0 20px 50px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'glass': '20px',
      }
    },
  },
  plugins: [],
};
