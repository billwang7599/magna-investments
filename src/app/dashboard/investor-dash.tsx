"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import Link from "next/link";
import {
    getInvitesByUserEmail,
    updateInviteStatus,
} from "@/lib/actions/invites";
import { getCommitmentsByInvestorId } from "@/lib/actions/commitment";
import { getRoundById } from "@/lib/actions/round";
import { Invite, Commitment, InviteStatus, Round } from "@/generated/prisma";

export default function InvestorDash({
    userId,
    userEmail,
}: {
    userId: string;
    userEmail: string;
}) {
    const [invites, setInvites] = useState<
        (Invite & { round: Round | null; commitment: Commitment | null })[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!userEmail) return;
            setLoading(true);
            const invitesRes = await getInvitesByUserEmail(userEmail);
            // Fetch round info for each invite
            const rounds = await Promise.all(
                invitesRes.map((invite) => getRoundById(invite.roundId)),
            );
            // Fetch commitments for this user for each round
            const commitments = await getCommitmentsByInvestorId(userId);
            setInvites(
                invitesRes.map((invite, i) => ({
                    ...invite,
                    round: rounds[i],
                    commitment:
                        commitments.find((c) => c.roundId === invite.roundId) ||
                        null,
                })),
            );
            setLoading(false);
        }
        fetchData();
    }, [userEmail, userId]);

    async function handleInviteAction(
        inviteId: string,
        action: "ACCEPTED" | "REJECTED",
    ) {
        setLoading(true);
        await updateInviteStatus(inviteId, action as InviteStatus);
        setInvites((prev) =>
            prev.map((invite) =>
                invite.id === inviteId ? { ...invite, status: action } : invite,
            ),
        );
        setLoading(false);
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-50 mb-2">
                    Investor Dashboard
                </h2>
                <p className="text-base font-sans text-gray-400 mb-6">
                    Welcome to your investor dashboard. Here you can view and
                    manage your investments.
                </p>
            </div>
            <Card title="Rounds You're Invited To">
                {loading ? (
                    <div className="text-text-secondary text-center py-4">
                        Loading invites...
                    </div>
                ) : invites.length === 0 ? (
                    <div className="text-text-secondary text-center py-4">
                        No invites yet.
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {invites.map((invite) => (
                            <li
                                key={invite.id}
                                className="border-b border-border pb-2"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                    {/* Round Name */}
                                    <div className="md:col-span-4 col-span-12 font-semibold text-gray-400">
                                        Round:{" "}
                                        {invite.round ? (
                                            <span className="text-gray-50">
                                                {invite.round.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">
                                                Unknown
                                            </span>
                                        )}
                                    </div>
                                    {/* Commitment Page Link or Invite Actions */}
                                    <div className="md:col-span-4 col-span-12 flex flex-wrap gap-2 justify-start md:justify-center">
                                        {invite.status ===
                                            InviteStatus.PENDING && (
                                            <>
                                                <Button
                                                    variant="primary"
                                                    disabled={loading}
                                                    onClick={() =>
                                                        handleInviteAction(
                                                            invite.id,
                                                            "ACCEPTED",
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    disabled={loading}
                                                    onClick={() =>
                                                        handleInviteAction(
                                                            invite.id,
                                                            "REJECTED",
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {invite.status ===
                                            InviteStatus.ACCEPTED &&
                                            invite.round && (
                                                <Link
                                                    href={`/dashboard/commitment/${invite.round.id}`}
                                                    className="text-accent underline hover:text-fuchsia-400 transition-colors"
                                                >
                                                    Go to Commitment Page
                                                </Link>
                                            )}
                                    </div>
                                    {/* Contribution */}
                                    <div className="md:col-span-4 col-span-12 flex flex-col md:items-end items-start">
                                        {invite.commitment ? (
                                            <div className="text-sm text-gray-400">
                                                Contribution:{" "}
                                                <span className="font-semibold text-gray-50">
                                                    {
                                                        invite.commitment
                                                            .amountCommitted
                                                    }
                                                </span>
                                                <span className="ml-2 text-xs px-2 py-1 rounded bg-white/10 border border-border text-gray-50">
                                                    {invite.commitment.status}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400">
                                                No contribution yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
