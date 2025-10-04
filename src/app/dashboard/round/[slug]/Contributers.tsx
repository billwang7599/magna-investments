"use client";
import React, { useState } from "react";
import { Button } from "@/components/Button";
import { $Enums } from "@/generated/prisma";

type Commitment = {
    id: string;
    investorUserId: string;
    amountCommitted: number;
    status: $Enums.CommitmentStatus;
};

type User = {
    id: string;
    name: string | null;
    email: string | null;
};

type Props = {
    initialCommitments: Commitment[];
    userMap: Record<string, User>;
    onSave: (
        updates: { id: string; status: $Enums.CommitmentStatus }[],
    ) => Promise<void>;
};

export default function Contributers({
    initialCommitments,
    userMap,
    onSave,
}: Props) {
    const [statuses, setStatuses] = useState<
        Record<string, $Enums.CommitmentStatus>
    >(() =>
        Object.fromEntries(initialCommitments.map((c) => [c.id, c.status])),
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const hasChanges = initialCommitments.some(
        (c) => statuses[c.id] !== c.status,
    );

    const handleStatusChange = (
        commitmentId: string,
        newStatus: $Enums.CommitmentStatus,
    ) => {
        setStatuses((prev) => ({
            ...prev,
            [commitmentId]: newStatus,
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const updates = initialCommitments
                .filter((c) => statuses[c.id] !== c.status)
                .map((c) => ({ id: c.id, status: statuses[c.id] }));
            await onSave(updates);
            setSaved(true);
        } catch (e) {
            // Optionally handle error
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-border rounded-md">
                <thead>
                    <tr className="bg-surface">
                        <th className="px-4 py-2 text-left">Contributor</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {initialCommitments.map((c) => {
                        const user = userMap[c.investorUserId];
                        return (
                            <tr key={c.id} className="border-t border-border">
                                <td className="px-4 py-2">
                                    {user?.name || "Unknown"}
                                </td>
                                <td className="px-4 py-2">
                                    {user?.email || "Unknown"}
                                </td>
                                <td className="px-4 py-2">
                                    {c.amountCommitted.toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        value={statuses[c.id]}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                c.id,
                                                e.target
                                                    .value as $Enums.CommitmentStatus,
                                            )
                                        }
                                        className="border border-border rounded px-2 py-1"
                                        disabled={saving}
                                    >
                                        {Object.values(
                                            $Enums.CommitmentStatus,
                                        ).map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {hasChanges && (
                <div className="mt-4 flex items-center gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="px-4 py-2"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    {saved && (
                        <span className="text-green-600 text-sm">
                            Changes saved!
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
