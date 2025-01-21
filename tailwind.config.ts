import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      textShadow: {
        soft: "0px 2px 4px rgba(0, 0, 0, 0.1)"
      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
} satisfies Config;
