"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { $Enums } from "@/generated/prisma";
import { setRoundStatus } from "@/lib/actions/round";

type Props = {
    roundId: string;
    initialStatus: $Enums.RoundStatus;
    // onSave?: (newStatus: $Enums.RoundStatus) => Promise<void>;
};

export default function RoundStatusDropdown({ roundId, initialStatus }: Props) {
    const [status, setStatus] = useState<$Enums.RoundStatus>(initialStatus);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const hasChanged = status !== initialStatus;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as $Enums.RoundStatus);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setRoundStatus(roundId, status);
            // Revalidate/reload the page after saving
            router.refresh();
        } catch {
            // Optionally handle error
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <select
                value={status}
                onChange={handleChange}
                className="border border-border rounded px-2 py-1"
                disabled={saving}
            >
                {Object.values($Enums.RoundStatus).map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
            {hasChanged && (
                <Button
                    type="button"
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            )}
        </div>
    );
}
