import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'media',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
