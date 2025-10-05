import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Card from "@/components/Card";
import InviteForm from "./InviteForm";
import ContributorsTable from "./ContributorsTable";
import RoundStatusSection from "./RoundStatusSection";
import { getRoundById } from "@/lib/actions/round";
import { getInvitesByRound } from "@/lib/actions/invites";
import { getCommitmentsByRoundId } from "@/lib/actions/commitment";
import { getAllDownloadUrls } from "@/lib/actions/file";
import PublicToggle from "./PublicToggle";

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
        redirect("/auth/login");
    }

    const roundId = params.slug;
    const round = await getRoundById(roundId);

    if (!round) {
        notFound();
    }

    // Only allow access if the current user is the creator
    if (round.companyUserId !== user.id) {
        notFound();
    }

    // --- Round status is now handled in a separate server component (RoundStatusSection) ---

    const commitments = await getCommitmentsByRoundId(roundId);

    // Fetch files for each commitment
    const filesByCommitment = await Promise.all(
        commitments.map(async (commitment) => {
            const files = await getAllDownloadUrls("documents", commitment.id);
            return {
                commitment,
                files,
            };
        }),
    );

    // Calculate totals
    const fundedTotal = commitments
        .filter((c) => c.status === "FUNDED")
        .reduce((sum, c) => sum + (c.amountCommitted || 0), 0);

    const approvedTotal = commitments
        .filter((c) => c.status === "APPROVED")
        .reduce((sum, c) => sum + (c.amountCommitted || 0), 0);

    const expectedTotal = commitments
        .filter((c) => c.status === "APPROVED" || c.status === "FUNDED")
        .reduce((sum, c) => sum + (c.amountCommitted || 0), 0);

    const invites = await getInvitesByRound(roundId);

    return (
        <div className="max-w-3xl mx-auto py-10 flex flex-col gap-10">
            <Link
                href="/dashboard"
                className="mb-4 inline-block text-accent underline font-medium hover:text-accent-dark transition-colors"
            >
                ← Back to Dashboard
            </Link>
            <Card>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-1">
                                {round.name}
                            </h2>
                            <div className="mt-2 mb-2">
                                <PublicToggle
                                    roundId={round.id}
                                    initialPublic={round.public}
                                />
                            </div>
                            <div className="text-ui text-text-secondary mb-1">
                                Target Amount
                            </div>
                            <div className="font-bold text-lg text-text-primary mb-2">
                                {round.currency}{" "}
                                {round.targetAmount.toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[220px]">
                            <div className="flex items-center gap-2">
                                <RoundStatusSection
                                    roundId={round.id}
                                    initialStatus={round.status}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-ui text-text-secondary">
                                    Created:
                                </span>
                                <span className="font-medium">
                                    {new Date(
                                        round.createdAt,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-ui text-text-secondary">
                            Min Contribution:{" "}
                            <span className="font-medium text-text-primary">
                                {round.currency}{" "}
                                {round.minContributionAmount.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-ui text-text-secondary">
                            Max Contribution:{" "}
                            <span className="font-medium text-text-primary">
                                {round.currency}{" "}
                                {round.maxContributionAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                        <div className="bg-surface rounded-md p-4 border border-border flex flex-col">
                            <span className="text-ui text-text-secondary mb-1">
                                Total Funded
                            </span>
                            <span className="font-medium text-lg">
                                {round.currency} {fundedTotal.toLocaleString()}
                            </span>
                            <span className="text-xs text-text-secondary mt-1">
                                Funded contributions
                            </span>
                        </div>
                        <div className="bg-surface rounded-md p-4 border border-border flex flex-col">
                            <span className="text-ui text-text-secondary mb-1">
                                Total Approved
                            </span>
                            <span className="font-medium text-lg">
                                {round.currency}{" "}
                                {approvedTotal.toLocaleString()}
                            </span>
                            <span className="text-xs text-text-secondary mt-1">
                                Approved contributions
                            </span>
                        </div>
                        <div className="bg-surface rounded-md p-4 border border-border flex flex-col">
                            <span className="text-ui text-text-secondary mb-1">
                                Total Expected
                            </span>
                            <span className="font-medium text-lg">
                                {round.currency}{" "}
                                {expectedTotal.toLocaleString()}
                            </span>
                            <span className="text-xs text-text-secondary mt-1">
                                Approved + Funded
                            </span>
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
                </div>
            </Card>
            <Card title="Contributors">
                <ContributorsTable
                    roundId={roundId}
                    filesByCommitment={filesByCommitment}
                />
            </Card>
        </div>
    );
}
