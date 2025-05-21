import type { Config } from "tailwindcss";

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // app directory (Next.js 13+)
    './pages/**/*.{js,ts,jsx,tsx}',     // pages directory (Next.js 12 이전)
    './components/**/*.{js,ts,jsx,tsx}',// components
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
