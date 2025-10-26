/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nuvolino': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#87CEEB', // Azzurro Nuvolino principale
          400: '#A8D8EA', // Azzurro cielo
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'cloud': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'accent': {
          'pink': '#FFB6C1', // Rosa pastello per notifiche
          'mint': '#B0E0B5', // Verde menta per online
          'yellow': '#FFF9C4', // Giallo tenue per evidenze
          'lavender': '#E6E6FA', // Lavanda per premium
        },
        'dark': {
          'night': '#1A1F3A', // Blu notte per dark mode
          'neon': '#00D9FF', // Azzurro neon per accenti
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-gentle': 'bounce-gentle 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'ripple': 'ripple 0.6s ease-out',
        'nuvolino-breathe': 'nuvolino-breathe 4s ease-in-out infinite',
        'nuvolino-wag': 'nuvolino-wag 0.5s ease-in-out',
        'nuvolino-sleep': 'nuvolino-sleep 2s ease-in-out infinite',
        'nuvolino-jump': 'nuvolino-jump 0.8s ease-out',
        'particle-float': 'particle-float 8s linear infinite',
        'badge-3d': 'badge-3d 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-gentle': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.05)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(135, 206, 235, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(135, 206, 235, 0.8)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'nuvolino-breathe': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.02) rotate(1deg)' },
        },
        'nuvolino-wag': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(10deg)' },
        },
        'nuvolino-sleep': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-2px) rotate(2deg)' },
        },
        'nuvolino-jump': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        'particle-float': {
          '0%': { transform: 'translateY(100vh) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(100px) rotate(360deg)', opacity: '0' },
        },
        'badge-3d': {
          '0%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'perspective(1000px) rotateX(10deg) rotateY(10deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
