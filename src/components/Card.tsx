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
                "bg-gradient-radial from-surface-100 via-surface-200 to-background border-2 border-accent rounded-2xl p-6 shadow-lg",
                className,
            )}
            {...props}
        >
            {title && (
                <div className="mb-4 text-2xl font-bold text-brand">
                    {title}
                </div>
            )}
            <div>{children}</div>
            {footer && (
                <div className="pt-4 border-t border-accent">{footer}</div>
            )}
        </div>
    );
};

export default Card;
