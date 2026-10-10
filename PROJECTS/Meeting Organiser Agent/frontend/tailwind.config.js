/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    colors: {
      paper: "var(--paper)",
      surface: "var(--surface)",
      tint: "var(--tint)",
      ink: "var(--ink)",
      soft: "var(--ink-soft)",
      faint: "var(--ink-faint)",
      rule: "var(--rule)",
      "rule-strong": "var(--rule-strong)",
      accent: "var(--accent)",
      "accent-wash": "var(--accent-wash)",
      ok: "var(--ok)",
      warn: "var(--warn)",
      transparent: "transparent",
      current: "currentColor",
    },
    fontFamily: {
      serif: ["Libre Baskerville", "Georgia", "serif"],
      sans: ["Jost", "Helvetica Neue", "Arial", "sans-serif"],
      mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
    },
    borderRadius: {
      none: "0",
      DEFAULT: "2px",
      sm: "2px",
    },
    boxShadow: {
      menu: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    extend: {
      spacing: {
        "72ch": "72ch",
        "68ch": "68ch",
      },
    },
  },
  plugins: [],
};
