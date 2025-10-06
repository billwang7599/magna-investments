"use client";
import React, { useState } from "react";
import { Button } from "@/components/Button";
import { $Enums, Commitment, User } from "@/generated/prisma";
import Table from "@/components/Table";

import { useRouter } from "next/navigation";
import { updateCommitmentStatus } from "@/lib/actions/commitment";

export default function Contributers({
    initialCommitments,
    userMap,
    filesMap,
}: {
    initialCommitments: Commitment[];
    userMap: Record<string, User>;
    filesMap: Record<string, { fileName: string; signedUrl: string | null }[]>;
}) {
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

    function truncate(str: string, n: number) {
        return str.length > n ? str.slice(0, n - 1) + "…" : str;
    }

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
            header: "Files",
            render: (c: Commitment) => (
                <div className="flex flex-col gap-1">
                    {(filesMap?.[c.id] || []).map((file) => (
                        <a
                            key={file.fileName}
                            href={file.signedUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline block max-w-[120px] truncate"
                            title={file.fileName}
                        >
                            {truncate(file.fileName, 18)}
                        </a>
                    ))}
                </div>
            ),
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
