"use client";
import React from "react";
import { RoundStatus } from "@/generated/prisma";
import RoundStatusDropdown from "./RoundStatusDropdown";

export default function RoundStatusSection({
    roundId,
    initialStatus,
}: {
    roundId: string;
    initialStatus: RoundStatus;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-ui text-text-secondary">Status:</span>
            <RoundStatusDropdown
                roundId={roundId}
                initialStatus={initialStatus}
            />
        </div>
    );
}
