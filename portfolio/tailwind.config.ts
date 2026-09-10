import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--ink)',
        ink2: 'var(--ink2)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        surface: 'var(--surface)',
      },
      fontFamily: {
        display: ['"Clash Display"', 'Satoshi', 'sans-serif'],
        sans: ['Satoshi', '"Segoe UI"', 'sans-serif'],
        mono: ['var(--font-jbmono)', '"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      maxWidth: {
        sheet: '76rem',
      },
    },
  },
  plugins: [],
}
export default config
