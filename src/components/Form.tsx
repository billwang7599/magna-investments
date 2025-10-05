import React, { FormEvent, ReactNode, forwardRef } from "react";

type FormProps = {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
    className?: string;
};

const Form = forwardRef<HTMLFormElement, FormProps>(
    ({ onSubmit, children, className }, ref) => (
        <form
            ref={ref}
            onSubmit={onSubmit}
            className={`rounded-md border border-border p-6 bg-surface ${className ?? ""}`}
        >
            {children}
        </form>
    ),
);

Form.displayName = "Form";

export default Form;
