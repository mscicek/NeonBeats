/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#d946ef', // fuchsia-500
          blue: '#0ea5e9',   // sky-500
          green: '#22c55e',  // green-500
        },
        dark: {
          bg: '#09090b',     // zinc-950
          surface: '#18181b' // zinc-900
        }
      },
      fontFamily: {
        cyber: ['"Orbitron"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.1s ease-in-out',
        'glow': 'glow 0.2s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-2px, 2px)' },
          '50%': { transform: 'translate(2px, -2px)' },
          '75%': { transform: 'translate(-2px, -2px)' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.5) drop-shadow(0 0 5px rgba(217, 70, 239, 0.5))' },
        }
      }
    },
    gridTemplateColumns: {
      '16': 'repeat(16, minmax(0, 1fr))',
    },
  },
}
