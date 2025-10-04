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
        "font-sans font-medium text-[14px] rounded-md px-6 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary";
    const variants = {
        primary:
            "bg-primary text-text-primary border border-transparent hover:bg-[#e05cf1] active:bg-[#b93ecb]",
        secondary:
            "bg-transparent text-primary border border-primary hover:bg-primary hover:text-text-primary active:bg-[#b93ecb] active:text-text-primary",
    };

    return (
        <button className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
};
