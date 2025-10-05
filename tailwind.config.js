// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                // Backgrounds
                background: "#F3F4F6",
                surface: "#FFFFFF",

                // Text
                "text-primary": "#F9FAFB", // Tailwind text-gray-50
                "text-secondary": "#D1D5DB", // Tailwind text-gray-300
                "text-tertiary": "#9CA3AF", // Tailwind text-gray-400

                // Accent
                accent: {
                    DEFAULT: "#4F46E5", // Tailwind indigo-600
                    hover: "#6366F1", // Tailwind indigo-500
                },

                // Status
                success: "#22C55E", // Tailwind green-500
                info: "#3B82F6", // Tailwind blue-500
                warning: "#F59E42", // Tailwind orange-400
                error: "#EF4444", // Tailwind red-500

                // Border
                border: "#374151", // Tailwind border-gray-700
            },
            fontSize: {
                "2xl": ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }], // Page Titles
                lg: ["1.125rem", { lineHeight: "1.75rem", fontWeight: "600" }], // Card Titles
                "3xl": [
                    "1.875rem",
                    { lineHeight: "2.25rem", fontWeight: "700" },
                ], // Key Data Points
                sm: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }], // Labels
                xs: ["0.75rem", { lineHeight: "1rem", fontWeight: "600" }], // Badges
            },
            borderRadius: {
                lg: "0.75rem", // 12px for softer corners
                full: "9999px", // For badges
            },
            spacing: {
                6: "1.5rem",
                8: "2rem",
            },
        },
    },
    plugins: [],
};
