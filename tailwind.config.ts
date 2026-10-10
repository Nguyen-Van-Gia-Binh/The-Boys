import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "var(--brand-bg)",
          surface: "var(--brand-surface)",
          "surface-alt": "var(--brand-surface-alt)",
          border: "var(--brand-border)",
          text: "var(--brand-text)",
          heading: "var(--brand-heading)",
          muted: "var(--brand-muted)",
          primary: "#315444",
          "primary-hover": "#254034",
          accent: "#df8143",
          "accent-hover": "#c96f34",
          gold: "#e6b057",
        },
      },
      fontFamily: {
        sans: ['"Roboto"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Roboto"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
