import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Telegram theme — берём из CSS переменных
        tg: {
          bg:           'var(--tg-theme-bg-color)',
          'bg-section': 'var(--tg-theme-secondary-bg-color)',
          text:         'var(--tg-theme-text-color)',
          hint:         'var(--tg-theme-hint-color)',
          link:         'var(--tg-theme-link-color)',
          button:       'var(--tg-theme-button-color)',
          'button-text':'var(--tg-theme-button-text-color)',
        },
        // Цвета платформ (фиксированные)
        telegram: '#2AABEE',
        vk:       '#4C75A3',
        forum:    '#FF4500',
        // Статусы лидов
        lead: {
          new:  '#3b82f6',
          hot:  '#f97316',
          done: '#22c55e',
          skip: '#9ca3af',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        tg: '12px',
        'tg-lg': '16px',
      },
      minHeight: {
        touch: '44px',
      },
      animation: {
        'fade-up':  'fadeUp 0.2s ease-out both',
        'pulse-bg': 'pulseBg 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseBg:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
    },
  },
  plugins: [],
} satisfies Config
