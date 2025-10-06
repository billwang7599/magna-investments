"use server";
import { getCommitmentsByRoundId } from "@/lib/actions/commitment";
import { getUserById } from "@/lib/actions/users";
import { Commitment, User } from "@/generated/prisma";
import React from "react";
import Contributers from "./Contributors";

async function getCommitmentsAndUsers(roundId: string) {
    const commitments: Commitment[] = await getCommitmentsByRoundId(roundId);
    const userIds = Array.from(
        new Set(commitments.map((c) => c.investorUserId)),
    );
    const usersArr = await Promise.all(userIds.map(getUserById));
    const users: Record<string, User> = Object.fromEntries(
        usersArr.filter(Boolean).map((u) => [u!.id, u!]),
    );
    return { commitments, users };
}

export default async function ContributorsTable({
    roundId,
    filesByCommitment,
}: {
    roundId: string;
    filesByCommitment: {
        commitment: Commitment;
        files: { fileName: string; signedUrl: string | null }[];
    }[];
}) {
    const { commitments, users } = await getCommitmentsAndUsers(roundId);

    if (!commitments.length) {
        return (
            <div className="text-text-secondary text-center py-4">
                No contributors yet.
            </div>
        );
    }

    // Map files to commitments
    const filesMap = Object.fromEntries(
        filesByCommitment.map(({ commitment, files }) => [
            commitment.id,
            files,
        ]),
    );

    return (
        <Contributers
            initialCommitments={commitments}
            userMap={users}
            filesMap={filesMap}
        />
    );
}
