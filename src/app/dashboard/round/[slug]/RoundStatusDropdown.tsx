"use client";
import React, { useState } from "react";
import { Button } from "@/components/Button";
import { $Enums } from "@/generated/prisma";
import { setRoundStatus } from "@/lib/actions/round";

export default function RoundStatusDropdown({
    roundId,
    initialStatus,
    onStatusChangeAction,
}: {
    roundId: string;
    initialStatus: $Enums.RoundStatus;
    onStatusChangeAction?: (newStatus: $Enums.RoundStatus) => void;
}) {
    const [status, setStatus] = useState<$Enums.RoundStatus>(initialStatus);
    const [dirty, setDirty] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as $Enums.RoundStatus);
        setDirty(true);
        setError(null);
    };

    const handleSave = async () => {
        setError(null);
        setDirty(false);
        try {
            if (onStatusChangeAction) onStatusChangeAction(status);
            await setRoundStatus(roundId, status);
        } catch {
            setError("Failed to update status.");
            setDirty(true); // Re-show button if error
        }
    };

    return (
        <div className="flex items-center gap-3">
            <select
                value={status}
                onChange={handleChange}
                className="border border-border rounded px-2 py-1"
            >
                {Object.values($Enums.RoundStatus).map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
            {dirty && (
                <Button
                    type="button"
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            )}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
