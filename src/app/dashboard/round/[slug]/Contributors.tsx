"use client";
import React, { useState } from "react";
import { Button } from "@/components/Button";
import { $Enums } from "@/generated/prisma";
import Table from "@/components/Table";

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
};

import { useRouter } from "next/navigation";
import { updateCommitmentStatus } from "@/lib/actions/commitment";

export default function Contributers({ initialCommitments, userMap }: Props) {
    const [statuses, setStatuses] = useState<
        Record<string, $Enums.CommitmentStatus>
    >(() =>
        Object.fromEntries(initialCommitments.map((c) => [c.id, c.status])),
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const router = useRouter();

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
        setError(null);
        try {
            const updates = initialCommitments
                .filter((c) => statuses[c.id] !== c.status)
                .map((c) => ({ id: c.id, status: statuses[c.id] }));
            await Promise.all(
                updates.map(({ id, status }) =>
                    updateCommitmentStatus(id, status),
                ),
            );
            setSaved(true);
            router.refresh();
        } catch (error: unknown) {
            console.error(error);
            setError("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            header: "Contributor",
            render: (c: Commitment) =>
                userMap[c.investorUserId]?.name || "Unknown",
        },
        {
            header: "Email",
            render: (c: Commitment) =>
                userMap[c.investorUserId]?.email || "Unknown",
        },
        {
            header: "Amount",
            render: (c: Commitment) => c.amountCommitted.toLocaleString(),
        },
        {
            header: "Status",
            render: (c: Commitment) => (
                <select
                    value={statuses[c.id]}
                    onChange={(e) =>
                        handleStatusChange(
                            c.id,
                            e.target.value as $Enums.CommitmentStatus,
                        )
                    }
                    className="border border-border rounded px-2 py-1"
                    disabled={saving}
                >
                    {Object.values($Enums.CommitmentStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                data={initialCommitments}
                rowKey={(row) => row.id}
                emptyText="No contributors yet."
            />
            {hasChanges && !saved && (
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
                    {error && (
                        <span className="text-red-500 text-sm">{error}</span>
                    )}
                </div>
            )}
        </>
    );
}
