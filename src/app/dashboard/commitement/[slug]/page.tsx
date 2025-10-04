import { notFound } from "next/navigation";
import { getRound } from "@/lib/actions/round";
import { getCommitmentsByRoundId } from "@/lib/actions/commitment";
import { createClient } from "@/lib/supabase/server";
import CommitmentForm from "./CommitmentForm";
import Card from "@/components/Card";
import React from "react";

type Props = {
    params: { slug: string };
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function CommitmentPage({ params, searchParams }: Props) {
    // SSR: Get current user from Supabase
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    const roundId = params.slug;
    const round = await getRound(roundId);

    if (!round) {
        notFound();
    }

    // Fetch all commitments for this round, filter for this user
    const commitments = await getCommitmentsByRoundId(roundId);
    const userCommitment = commitments.find(
        (c) => c.investorUserId === user.id,
    );

    return (
        <div className="max-w-2xl mx-auto py-8 flex flex-col gap-8">
            <Card title={`Round: ${round.name}`}>
                <div className="mb-4">
                    <div className="text-ui text-text-secondary mb-1">
                        Target Amount
                    </div>
                    <div className="font-bold text-lg text-text-primary mb-2">
                        {round.currency} {round.targetAmount.toLocaleString()}
                    </div>
                    <div className="flex gap-8 flex-wrap">
                        <div>
                            <span className="text-ui text-text-secondary">
                                Min Contribution:{" "}
                            </span>
                            <span className="font-medium">
                                {round.currency}{" "}
                                {round.minContributionAmount.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-ui text-text-secondary">
                                Max Contribution:{" "}
                            </span>
                            <span className="font-medium">
                                {round.currency}{" "}
                                {round.maxContributionAmount.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-ui text-text-secondary">
                                Status:{" "}
                            </span>
                            <span className="font-medium">{round.status}</span>
                        </div>
                        <div>
                            <span className="text-ui text-text-secondary">
                                Created:{" "}
                            </span>
                            <span className="font-medium">
                                {new Date(round.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
            <Card title="Your Commitment">
                {userCommitment ? (
                    <div className="space-y-2">
                        <div>
                            <span className="text-ui text-text-secondary">
                                Amount Committed:{" "}
                            </span>
                            <span className="font-bold">
                                {round.currency}{" "}
                                {userCommitment.amountCommitted.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-ui text-text-secondary">
                                Status:{" "}
                            </span>
                            <span className="font-medium">
                                {userCommitment.status}
                            </span>
                        </div>
                        {/* No changes/new commitments allowed if already committed */}
                    </div>
                ) : (
                    // Injected form component for new commitment
                    <CommitmentForm roundId={roundId} />
                )}
            </Card>
        </div>
    );
}
