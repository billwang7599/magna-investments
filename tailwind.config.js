// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                background: "#18192A", // deep blue-black, less harsh than pure black
                "surface-100": "#23243A", // slightly lighter, with a hint of blue
                "surface-200": "#2E3050", // even lighter, for cards/containers
                brand: {
                    DEFAULT: "#C64EFF",
                    light: "#D47AFF",
                    dark: "#A93ADF",
                },
                accent: {
                    DEFAULT: "#4EFFF8", // teal/cyan accent for vibrancy
                    light: "#7AFFF9",
                    dark: "#3ADFD6",
                },
                content: {
                    primary: "#FFFFFF",
                    secondary: "#E0E0E0",
                    tertiary: "#A0A0A0",
                },
                border: "#3A3B5A", // blue-tinted border
                success: "#00C48C",
                warning: "#FFD600",
                error: "#FF4E4E",
                info: "#4E8FFF",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-brand":
                    "linear-gradient(90deg, #C64EFF 0%, #4EFFF8 100%)",
            },
        },
    },
    plugins: [],
};
