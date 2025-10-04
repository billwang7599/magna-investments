import React, { FormEvent, ReactNode } from "react";

type FormProps = {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
    className?: string;
};

const Form: React.FC<FormProps> = ({ onSubmit, children, className }) => (
    <form
        onSubmit={onSubmit}
        className={`rounded-md border border-border p-6 bg-surface ${className ?? ""}`}
    >
        {children}
    </form>
);

export default Form;
