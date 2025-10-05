"use server";
import { notFound } from "next/navigation";
import { getRoundById } from "@/lib/actions/round";
import { getCommitmentsByRoundId } from "@/lib/actions/commitment";
import { createClient } from "@/lib/supabase/server";
import CommitmentForm from "./CommitmentForm";
import FileDrop from "@/components/FileDrop";
import Card from "@/components/Card";
import { getAllDownloadUrls } from "@/lib/actions/file";
import React from "react";
import Link from "next/link";

type Props = {
    params: { slug: string };
};

export default async function CommitmentPage({ params }: Props) {
    // SSR: Get current user from Supabase
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    const roundId = params.slug;
    const round = await getRoundById(roundId);

    if (!round) {
        notFound();
    }

    // Fetch all commitments for this round, filter for this user
    const commitments = await getCommitmentsByRoundId(roundId);
    const userCommitment = commitments.find(
        (c) => c.investorUserId === user.id,
    );

    let fileList: { fileName: string; signedUrl: string | null }[] = [];
    if (userCommitment) {
        fileList = await getAllDownloadUrls("documents", userCommitment.id);
    }

    return (
        <div className="max-w-2xl mx-auto py-8 flex flex-col gap-8">
            <Link
                href="/dashboard"
                className="mb-4 inline-block text-accent underline font-medium hover:text-accent-dark transition-colors"
            >
                ← Back to Dashboard
            </Link>
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
                    <div className="space-y-4">
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
                        <FileDrop
                            bucket="documents"
                            commitmentId={userCommitment.id}
                        />
                    </div>
                ) : (
                    // Injected form component for new commitment
                    <CommitmentForm roundId={roundId} userId={user.id} />
                )}
            </Card>
            {userCommitment && (
                <Card title="Your Uploaded Files">
                    {fileList.length === 0 ? (
                        <div className="text-content-secondary">
                            No files found.
                        </div>
                    ) : (
                        <ul className="divide-y divide-border bg-surface-100 rounded-lg border border-border">
                            {fileList.map((file) => (
                                <li
                                    key={file.fileName}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gradient-brand/10 transition-colors"
                                >
                                    {/* File icon */}
                                    <span className="text-xl">📄</span>
                                    {/* File link */}
                                    <a
                                        href={file.signedUrl || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent underline font-medium hover:text-accent-dark transition-colors"
                                        title={file.fileName}
                                    >
                                        {file.fileName}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            )}
        </div>
    );
}
