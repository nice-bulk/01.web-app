/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nerv: {
          black: '#050505',
          dark: '#0a0a0a',
          panel: '#0f0f0f',
          border: '#1a1a1a',
          orange: '#ff6600',
          'orange-dim': '#cc4400',
          red: '#cc0000',
          'red-bright': '#ff0000',
          amber: '#ffaa00',
          green: '#00ff41',
          cyan: '#00ccff',
          text: '#cccccc',
          'text-dim': '#666666',
          'text-bright': '#eeeeee',
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        display: ['"Noto Serif JP"', '"Times New Roman"', 'serif'],
        ui: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'pulse-orange': 'pulseOrange 2s ease-in-out infinite',
        'glitch': 'glitch 0.5s step-end infinite',
        'type': 'typing 0.05s steps(1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 5px #ff6600, 0 0 10px #ff6600' },
          '50%': { boxShadow: '0 0 20px #ff6600, 0 0 40px #ff6600' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
