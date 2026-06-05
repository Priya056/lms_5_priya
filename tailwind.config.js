/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080812',
          surface: '#111128',
          'surface-2': '#181830',
          sidebar: '#0c0c1e',
          code: '#0a0a1a',
        },
        accent: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
        },
        text: {
          primary: '#f0efff',
          muted: '#7070a0',
        },
        success: '#10b981',
        error: '#f43f5e',
        border: {
          DEFAULT: '#1e1e3a',
          active: '#8b5cf6',
          '2': '#2a2a4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'bounce-dot': 'bounceDot 1.4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'toast-in': 'toastIn 300ms ease-out',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'typing-bounce': 'typingBounce 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        typingBounce: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
