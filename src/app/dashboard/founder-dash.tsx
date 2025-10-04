"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import RoundList from "@/app/dashboard/round/RoundList";
import NewRoundForm from "@/app/dashboard/round/NewRoundForm";
import { getRoundsByFounder } from "@/lib/actions/round";
import { Round } from "@/generated/prisma";
import { Button } from "@/components/Button";

export default function FounderDash({ userId }: { userId: string }) {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        async function fetchRounds() {
            if (userId) {
                setLoading(true);
                const result = await getRoundsByFounder(userId);
                setRounds(result || []);
                setLoading(false);
            }
        }
        fetchRounds();
    }, [userId]);

    // Removed handleCreateRound; logic now handled inside NewRoundForm

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
                        <NewRoundForm userId={userId} />
                    </Card>
                )}
                <Card>
                    {loading ? (
                        <div className="text-center text-text-secondary py-8">
                            Loading rounds...
                        </div>
                    ) : (
                        <RoundList
                            rounds={rounds}
                            emptyText="No rounds yet. Create your first round!"
                        />
                    )}
                </Card>
            </div>
        </div>
    );
}
