import { notFound } from "next/navigation";
import { getRound } from "@/lib/actions/round";
import { getInvitesByRound } from "@/lib/actions/invites";
import Card from "@/components/Card";
import React from "react";
import { createClient } from "@/lib/supabase/server";

// Abstracted client/server components
import InviteForm from "./InviteForm";
import ContributorsTable from "./ContributorsTable";

type Props = {
    params: { slug: string };
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function RoundDetailsPage({ params }: Props) {
    // SSR: Get current user from Supabase
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // Not logged in
        notFound();
    }

    const roundId = params.slug;
    const round = await getRound(roundId);

    if (!round) {
        notFound();
    }

    // Only allow access if the current user is the creator
    if (round.companyUserId !== user.id) {
        notFound();
    }

    const invites = await getInvitesByRound(roundId);

    return (
        <div className="max-w-3xl mx-auto py-8 flex flex-col gap-8">
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
                <div className="mt-6">
                    <InviteForm roundId={roundId} />
                    <div className="mb-2 font-semibold text-text-primary">
                        Invited Users
                    </div>
                    {invites.length === 0 ? (
                        <div className="text-text-secondary mb-4">
                            No invites yet.
                        </div>
                    ) : (
                        <ul className="mb-4">
                            {invites.map((invite) => (
                                <li
                                    key={invite.id}
                                    className="flex gap-2 items-center text-ui"
                                >
                                    <span>{invite.userEmail}</span>
                                    <span className="text-xs px-2 py-1 rounded bg-gray-100 border border-border text-black">
                                        {invite.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Card>
            <Card title="Contributors">
                <ContributorsTable roundId={roundId} />
            </Card>
        </div>
    );
}
