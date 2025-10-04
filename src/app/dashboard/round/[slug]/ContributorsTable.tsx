"use server";
import { getCommitmentsByRoundId } from "@/lib/actions/commitment";
import { getUserById } from "@/lib/actions/users";
import { $Enums } from "@/generated/prisma";
import React from "react";
import Contributers from "./Contributors";

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

async function getCommitmentsAndUsers(roundId: string) {
    const commitments: Commitment[] = await getCommitmentsByRoundId(roundId);
    const userIds = Array.from(
        new Set(commitments.map((c) => c.investorUserId)),
    );
    const usersArr = await Promise.all(userIds.map(getUserById));
    const users: Record<string, User> = Object.fromEntries(
        usersArr
            .filter(Boolean)
            .map((u) => [
                u!.id,
                { id: u!.id, name: u!.name ?? null, email: u!.email ?? null },
            ]),
    );
    return { commitments, users };
}

export default async function ContributorsTable({
    roundId,
}: {
    roundId: string;
}) {
    const { commitments, users } = await getCommitmentsAndUsers(roundId);

    if (!commitments.length) {
        return (
            <div className="text-text-secondary text-center py-4">
                No contributors yet.
            </div>
        );
    }

    return <Contributers initialCommitments={commitments} userMap={users} />;
}
