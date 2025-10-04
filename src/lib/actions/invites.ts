"use server";
import prisma from "@/lib/prisma";
import { Invite, InviteStatus } from "@/generated/prisma";

/**
 * Create a new invite for a user to a round.
 * Throws if the invite already exists (unique constraint).
 */
export async function createInvite({
    userEmail,
    roundId,
    status = InviteStatus.PENDING,
}: {
    userEmail: string;
    roundId: string;
    status?: InviteStatus;
}): Promise<Invite> {
    const invite = await prisma.invite.create({
        data: {
            userEmail,
            roundId,
            status,
        },
    });
    return invite as Invite;
}

/**
 * Get all invites for a specific round.
 */
export async function getInvitesByRound(roundId: string): Promise<Invite[]> {
    return (await prisma.invite.findMany({
        where: { roundId },
        orderBy: { id: "desc" },
    })) as Invite[];
}

/**
 * Get all invites for a specific user by email.
 */
export async function getInvitesByUserEmail(
    userEmail: string,
): Promise<Invite[]> {
    return (await prisma.invite.findMany({
        where: { userEmail },
        orderBy: { id: "desc" },
    })) as Invite[];
}

/**
 * Get all invites for a list of round IDs.
 */
export async function getInvitesByRounds(
    roundIds: string[],
): Promise<Invite[]> {
    if (!roundIds.length) return [];
    return (await prisma.invite.findMany({
        where: { roundId: { in: roundIds } },
        orderBy: { id: "desc" },
    })) as Invite[];
}

/**
 * Optionally: Get a single invite by userEmail and roundId (composite unique).
 */
export async function getInviteByUserAndRound(
    userEmail: string,
    roundId: string,
): Promise<Invite | null> {
    return (await prisma.invite.findUnique({
        where: {
            userEmail_roundId: {
                userEmail,
                roundId,
            },
        },
    })) as Invite | null;
}

/**
 * Update the status of an invite (accept or reject).
 */
export async function updateInviteStatus(
    inviteId: string,
    status: InviteStatus,
): Promise<Invite> {
    const invite = await prisma.invite.update({
        where: { id: inviteId },
        data: { status },
    });
    return invite as Invite;
}
