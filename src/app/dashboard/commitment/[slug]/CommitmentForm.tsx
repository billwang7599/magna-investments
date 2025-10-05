"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import { createCommitment } from "@/lib/actions/commitment";

export default function CommitmentForm({
    roundId,
    userId,
}: {
    roundId: string;
    userId: string;
}) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setError(null);
        const amt = parseFloat(formData.get("amount") as string);
        if (isNaN(amt) || amt <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        try {
            await createCommitment(roundId, userId, amt);
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                // Show a friendlier message for min/max errors
                if (
                    err.message &&
                    err.message.includes("Commitment amount must be between")
                ) {
                    setError(err.message);
                } else {
                    setError(err.message || "An error occurred.");
                }
            } else {
                setError("An unknown error occurred.");
            }
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-4 max-w-xs">
            <Input
                id="commitment-amount"
                name="amount"
                type="number"
                label="Commitment Amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={0}
                step="any"
                required
                className="w-full"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="w-full"
            >
                {isPending ? "Submitting..." : "Submit Commitment"}
            </Button>
        </form>
    );
}
