/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#19101c",
        "surface-container-lowest": "#140b16",
        "surface-container-low": "#221824",
        "surface-container": "#261c28",
        "surface-container-high": "#312733",
        "on-surface": "#eeddee",
        "on-surface-variant": "#d5c0d7",
        primary: "#ecb1ff",
        "primary-container": "#bf00ff",
        outline: "#9d8ba0",
        "outline-variant": "#514254",
        wedding: {
          canvas: "#FFFDF8",
          surface: "#F8F4E8",
          muted: "#E9E0CF",
          "text-primary": "#1F1F1A",
          "text-secondary": "#38382F",
          "text-muted": "#7A786B",
          "border-delicate": "#E4DAC8",
          gold: "#D8C49A",
          sage: "#AAB58C",
          "sage-subtle": "#DDE5C8",
        },
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        playfair: ["'Playfair Display'", "serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      spacing: {
        "container-max": "1440px",
        gutter: "24px",
        "margin-mobile": "20px",
        "margin-desktop": "80px",
      },
      boxShadow: {
        purple: "0 0 18px rgba(191, 0, 255, 0.45)",
      },
    },
  },
  plugins: [],
};
