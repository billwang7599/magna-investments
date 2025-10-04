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
  const inputId = id || (label ? `input-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            "text-text-secondary font-ui text-ui font-medium mb-1",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          "bg-surface border border-border text-text-primary font-body text-body rounded-md px-4 py-2 transition-colors duration-150 outline-none",
          "focus:border-primary focus:ring-2 focus:ring-primary",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default Input;
