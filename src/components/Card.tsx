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
                "bg-surface border border-border rounded-md p-6",
                className,
            )}
            {...props}
        >
            {title && (
                <div className="mb-4 text-h3 font-heading text-text-primary">
                    {title}
                </div>
            )}
            <div>{children}</div>
            {footer && (
                <div className="pt-4 border-t border-border">{footer}</div>
            )}
        </div>
    );
};

export default Card;
