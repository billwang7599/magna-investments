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
                        "text-content-tertiary font-medium mb-1",
                        labelClassName,
                    )}
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={clsx(
                    "bg-surface-100 border border-accent text-content-primary rounded-md px-4 py-2 transition-colors duration-150 outline-none shadow-sm",
                    "focus:border-accent focus:ring-2 focus:ring-accent placeholder-content-tertiary",
                    "hover:bg-gradient-brand/10",
                    className,
                )}
                {...props}
            />
        </div>
    );
};

export default Input;
