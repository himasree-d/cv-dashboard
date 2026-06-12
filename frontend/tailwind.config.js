/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        accent: {
          primary: 'var(--color-accent-primary)',
          highlight: 'var(--color-accent-highlight)',
        },
        muted: 'var(--color-muted)',
        status: {
          success: 'var(--color-status-success)',
          processing: 'var(--color-status-processing)',
          failed: 'var(--color-status-failed)',
        }
      },
      fontFamily: {
        sans: ['var(--font-heading)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      }
    },
  },
  plugins: [],
}
