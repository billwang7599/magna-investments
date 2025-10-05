"use client";
import { useEffect, useState } from "react";
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

    const handleRoundCreated = (newRound: Round) => {
        setShowForm(false);
        setRounds((prev) => [newRound, ...prev]);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* "Your Rounds" Section */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-50">
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
                    <div className="mb-6">
                        <NewRoundForm
                            userId={userId}
                            onRoundCreated={handleRoundCreated}
                        />
                    </div>
                )}
                <div>
                    {loading ? (
                        <div className="text-center text-gray-400 py-8">
                            Loading rounds...
                        </div>
                    ) : (
                        <RoundList
                            rounds={rounds}
                            emptyText="No rounds yet. Create your first round!"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
