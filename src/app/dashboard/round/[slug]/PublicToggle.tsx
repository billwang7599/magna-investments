"use client";
import React, { useTransition, useState } from "react";
import { setRoundPublic } from "@/lib/actions/round";
import { Button } from "@/components/Button";

const PublicToggle = ({
    roundId,
    initialPublic,
}: {
    roundId: string;
    initialPublic: boolean;
}) => {
    const [isPublic, setIsPublic] = useState(initialPublic);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleToggle = () => {
        setError(null);
        startTransition(async () => {
            try {
                const updated = await setRoundPublic(roundId, !isPublic);
                setIsPublic(updated.public);
            } catch {
                setError("Failed to update public status.");
            }
        });
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary">
                Public:
            </span>
            <Button
                type="button"
                variant={isPublic ? "primary" : "secondary"}
                className="px-4 py-1 text-xs"
                onClick={handleToggle}
                disabled={isPending}
            >
                {isPublic ? "Public" : "Private"}
            </Button>
            {error && (
                <span className="text-xs text-red-500 ml-2">{error}</span>
            )}
        </div>
    );
};

export default PublicToggle;
