import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
    children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    children,
    className,
    ...props
}) => {
    const base =
        "font-sans font-medium text-sm rounded-lg px-6 py-2 transition-all duration-200 focus:outline-none focus:ring-2 shadow-sm transform";
    const variants = {
        primary:
            // Gradient background, fuchsia-violet, glowing shadow, fuchsia-500 accent, always white text
            "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white border border-fuchsia-500 shadow-lg shadow-fuchsia-500/50 hover:brightness-110 hover:scale-[1.03] active:scale-95 active:brightness-95 focus:ring-fuchsia-500",
        secondary:
            // Glassmorphism style, subtle border, fuchsia accent on hover, always white text
            "bg-white/10 border border-white/10 text-white hover:bg-fuchsia-500/10 hover:border-fuchsia-500 hover:text-white hover:shadow-md hover:scale-[1.03] active:scale-95 active:shadow focus:ring-fuchsia-500",
    };

    return (
        <button className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};

export default Button;
