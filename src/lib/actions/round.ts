"use server";
import { Round, RoundStatus, Currency } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function createRound(
    name: string,
    targetAmount: number,
    userId: string,
    minContributionAmount: number,
    maxContributionAmount: number,
    currency: Currency,
) {
    const round = await prisma.round.create({
        data: {
            name,
            targetAmount,
            companyUserId: userId,
            minContributionAmount,
            maxContributionAmount,
            currency,
        },
    });
    return round as Round;
}

export async function setRoundStatus(id: string, status: RoundStatus) {
    const round = await prisma.round.update({
        where: { id },
        data: { status },
    });
    return round as Round;
}

export async function getRoundById(id: string) {
    const round = await prisma.round.findUnique({
        where: { id },
    });
    return round as Round;
}

export async function getRoundsByFounder(userId: string) {
    const rounds = await prisma.round.findMany({
        where: { companyUserId: userId },
        orderBy: { createdAt: "desc" },
    });
    return rounds as Round[];
}
