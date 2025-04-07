// tailwind.config.ts (if using Tailwind v4)
const config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00d084',
        muted: '#1e293b',
        background: '#0f172a',
        border: '#334155',
        card: '#1e293b',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
};

export default config;
