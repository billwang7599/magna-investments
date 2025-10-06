"use client";
import React, { useTransition, useState } from "react";

type DeleteButtonProps = {
    id: string;
    action: (id: string) => Promise<void>;
    buttonText?: string;
    className?: string;
};

export default function DeleteButton({
    id,
    action,
    buttonText = "Delete",
    className = "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors mt-4",
}: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                await action(id);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || "Failed to delete.");
                } else {
                    setError("Failed to delete.");
                }
            }
        });
    };

    return (
        <form onSubmit={handleDelete}>
            <button type="submit" className={className} disabled={isPending}>
                {isPending ? "Deleting..." : buttonText}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
    );
}
