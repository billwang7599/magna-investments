module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0B12",
        surface: "#1A1821",
        primary: "#D946EF",
        "text-primary": "#F5F5F5",
        "text-secondary": "#A09FA6",
        border: "#302D3A",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Inter", "sans-serif"],
        ui: ["Inter", "sans-serif"],
      },
      fontWeight: {
        heading: "700",
        body: "400",
        ui: "500",
      },
      fontSize: {
        h1: "48px",
        h2: "36px",
        h3: "24px",
        body: "16px",
        ui: "14px",
      },
      borderRadius: {
        md: "8px",
      },
      spacing: {
        3: "24px", // 3 units = 24px
      },
    },
  },
  plugins: [],
};
