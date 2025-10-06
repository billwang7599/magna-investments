"use server";
import { Commitment, CommitmentStatus, RoundStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function createCommitment(
    roundId: string,
    userId: string,
    amount: number,
) {
    const round = await prisma.round.findUnique({
        where: { id: roundId },
        include: { commitments: true },
    });

    if (!round) throw new Error("Round not found");
    if (round.status !== RoundStatus.ACTIVE)
        throw new Error("Round is not open");

    // Enforce min/max commitment amount
    if (
        amount < round.minContributionAmount ||
        amount > round.maxContributionAmount
    ) {
        throw new Error(
            `Commitment amount must be between ${round.minContributionAmount} and ${round.maxContributionAmount}`,
        );
    }

    const commitment = await prisma.commitment.create({
        data: { roundId, investorUserId: userId, amountCommitted: amount },
    });

    return commitment as Commitment;
}

export async function updateCommitmentAmount(
    commitmentId: string,
    amount: number,
) {
    const commitment = await prisma.commitment.findUnique({
        where: { id: commitmentId },
    });

    if (!commitment) throw new Error("Commitment not found");

    const updatedCommitment = await prisma.commitment.update({
        where: { id: commitmentId },
        data: { amountCommitted: amount },
    });

    return updatedCommitment as Commitment;
}

export async function updateCommitmentStatus(
    commitmentId: string,
    status: CommitmentStatus,
) {
    console.log("Updating commitment status==========");
    console.log(commitmentId);
    const commitment = await prisma.commitment.findUnique({
        where: { id: commitmentId },
    });

    if (!commitment) throw new Error("Commitment not found");
    console.log("Commitment:", commitment);
    console.log("ID:", commitmentId);
    console.log("Status:", status);

    const updatedCommitment = await prisma.commitment.update({
        where: { id: commitmentId },
        data: { status: status },
    });

    return updatedCommitment as Commitment;
}

export async function getCommitment(id: string) {
    const commitment = await prisma.commitment.findUnique({
        where: { id },
    });

    if (!commitment) throw new Error("Commitment not found");

    return commitment as Commitment;
}

export async function getCommitmentsByRoundId(roundId: string) {
    const commitments = await prisma.commitment.findMany({
        where: { roundId },
    });
    return commitments as Commitment[];
}

export async function getCommitmentsByInvestorId(investorId: string) {
    const commitments = await prisma.commitment.findMany({
        where: { investorUserId: investorId },
    });
    return commitments as Commitment[];
}
