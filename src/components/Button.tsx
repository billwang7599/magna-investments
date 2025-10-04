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
        "font-sans font-medium text-[14px] rounded-md px-6 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent shadow-md";
    const variants = {
        primary:
            "bg-gradient-brand text-content-primary border border-transparent hover:brightness-110 active:brightness-90 shadow-lg shadow-accent/30",
        secondary:
            "bg-surface-200 text-accent border border-accent hover:bg-accent hover:text-background active:bg-accent-dark active:text-background",
    };

    return (
        <button className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};
