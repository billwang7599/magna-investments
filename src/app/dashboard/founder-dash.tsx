"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import RoundList from "@/components/RoundList";
import NewRoundForm from "@/components/NewRoundForm";
import { getRoundsByFounder, createRound } from "@/lib/actions/round";
import { Round, Currency } from "@/generated/prisma";
import { Button } from "@/components/Button";

export default function FounderDash({ userId }: { userId: string }) {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        async function fetchRounds() {
            if (userId) {
                const result = await getRoundsByFounder(userId);
                setRounds(result || []);
            }
        }
        fetchRounds();
    }, [userId]);

    const handleCreateRound = async (data: {
        name: string;
        targetAmount: number;
        minContributionAmount: number;
        maxContributionAmount: number;
        currency: Currency;
    }) => {
        if (!userId) return;
        setLoading(true);
        await createRound(
            data.name,
            data.targetAmount,
            userId,
            data.minContributionAmount,
            data.maxContributionAmount,
            data.currency as Currency,
        );
        const updatedRounds = await getRoundsByFounder(userId);
        setRounds(updatedRounds || []);
        setLoading(false);
        setShowForm(false);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* "Your Rounds" Section */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="text-h2 font-heading font-bold text-text-primary">
                        Your Rounds
                    </h2>
                    <Button
                        variant={showForm ? "secondary" : "primary"}
                        className="w-fit"
                        onClick={() => setShowForm((v) => !v)}
                    >
                        {showForm ? "Cancel" : "Create New Round"}
                    </Button>
                </div>
                {showForm && (
                    <Card className="mb-6">
                        <NewRoundForm
                            onCreate={handleCreateRound}
                            loading={loading}
                        />
                    </Card>
                )}
                <Card>
                    <RoundList
                        rounds={rounds}
                        emptyText="No rounds yet. Create your first round!"
                    />
                </Card>
            </div>
        </div>
    );
}
