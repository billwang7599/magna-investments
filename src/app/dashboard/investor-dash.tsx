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
import { getRound } from "@/lib/actions/round";
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!userEmail) return;
            setLoading(true);
            console.log("before");
            const invitesRes = await getInvitesByUserEmail(userEmail);
            console.log("after");
            console.log("Invites:", invitesRes);
            // Fetch round info for each invite
            const rounds = await Promise.all(
                invitesRes.map((invite) => getRound(invite.roundId)),
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
                <h2 className="text-h2 font-heading font-bold text-text-primary mb-2">
                    Investor Dashboard
                </h2>
                <p className="text-ui font-ui text-text-secondary mb-6">
                    Welcome to your investor dashboard. Here you can view and
                    manage your investments.
                </p>
            </div>
            <Card title="Rounds You're Invited To">
                {invites.length === 0 ? (
                    <div className="text-text-secondary text-center py-4">
                        No invites yet.
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {invites.map((invite) => (
                            <li
                                key={invite.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-2"
                            >
                                <div>
                                    <span className="font-medium text-text-primary">
                                        Round:{" "}
                                        {invite.round ? (
                                            <span>{invite.round.name}</span>
                                        ) : (
                                            <span className="text-text-secondary">
                                                Unknown
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {invite.status === InviteStatus.PENDING && (
                                    <div className="flex gap-2">
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
                                    </div>
                                )}
                                {invite.status === InviteStatus.ACCEPTED &&
                                    invite.round && (
                                        <div>
                                            <Link
                                                href={`/dashboard/commitement/${invite.round.id}`}
                                                className="text-primary underline"
                                            >
                                                Go to Commitment Page
                                            </Link>
                                        </div>
                                    )}
                                <div className="w-full sm:w-auto">
                                    {invite.commitment ? (
                                        <div className="text-sm text-text-primary">
                                            Contribution:{" "}
                                            <span className="font-semibold">
                                                {
                                                    invite.commitment
                                                        .amountCommitted
                                                }
                                            </span>
                                            <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 border border-border">
                                                {invite.commitment.status}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-text-secondary">
                                            No contribution yet.
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
