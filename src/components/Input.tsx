import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    className?: string;
    labelClassName?: string;
};

export const Input: React.FC<InputProps> = ({
    label,
    className,
    labelClassName,
    id,
    ...props
}) => {
    const inputId =
        id ||
        (label
            ? `input-${label.replace(/\s+/g, "-").toLowerCase()}`
            : undefined);

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label
                    htmlFor={inputId}
                    className={clsx(
                        "text-tertiary text-sm font-medium mb-1",
                        labelClassName,
                    )}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={clsx(
                    "bg-surface border border-border text-primary rounded-lg px-4 py-2 transition-all duration-200 outline-none shadow-sm",
                    "focus:border-accent focus:ring-2 focus:ring-accent focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]",
                    "hover:bg-accent/10 hover:border-accent/70 placeholder-tertiary",
                    className,
                )}
                {...props}
            />
        </div>
    );
};

export default Input;
