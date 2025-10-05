import React from "react";
import clsx from "clsx";

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: React.ReactNode;
    footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
    children,
    className = "",
    title,
    footer,
    ...props
}) => {
    return (
        <div
            className={clsx(
                // Glassmorphism: semi-transparent, backdrop blur, glowing border, subtle shadow
                "bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg p-8 shadow-lg shadow-fuchsia-500/10 transition-all duration-200",
                "hover:shadow-2xl hover:border-fuchsia-500",
                className,
            )}
            {...props}
        >
            {title && (
                <div className="mb-4 text-2xl font-extrabold tracking-tight text-gray-50">
                    {title}
                </div>
            )}
            <div className="text-gray-50">{children}</div>
            {footer && (
                <div className="pt-4 border-t border-white/10 text-gray-400">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
