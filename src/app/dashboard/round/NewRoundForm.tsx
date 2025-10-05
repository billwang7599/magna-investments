import React, { useState, useTransition } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Currency, Round } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { createRound } from "@/lib/actions/round";

type NewRoundFormProps = {
    userId: string;
    onRoundCreated?: (round: Round) => void;
};

const NewRoundForm: React.FC<NewRoundFormProps> = ({
    userId,
    onRoundCreated,
}) => {
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState<number | "">("");
    const [minContributionAmount, setMinContributionAmount] = useState<
        number | ""
    >("");
    const [maxContributionAmount, setMaxContributionAmount] = useState<
        number | ""
    >("");
    const [currency, setCurrency] = useState<Currency>(Currency.USDC);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (
            !name.trim() ||
            !targetAmount ||
            Number(targetAmount) <= 0 ||
            !minContributionAmount ||
            Number(minContributionAmount) <= 0 ||
            !maxContributionAmount ||
            Number(maxContributionAmount) < Number(minContributionAmount)
        ) {
            setError("Please provide valid values for all fields.");
            return;
        }

        startTransition(async () => {
            try {
                const newRound = await createRound(
                    name.trim(),
                    Number(targetAmount),
                    userId,
                    Number(minContributionAmount),
                    Number(maxContributionAmount),
                    currency,
                );
                setName("");
                setTargetAmount("");
                setMinContributionAmount("");
                setMaxContributionAmount("");
                setCurrency(Currency.USDC);
                if (onRoundCreated) onRoundCreated(newRound);
            } catch {
                setError("Failed to create round. Please try again.");
            }
        });
    };

    return (
        <Card title="Create New Round" className="mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    id="round-name"
                    name="round-name"
                    type="text"
                    label="Round Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                    placeholder="Seed, Series A, etc."
                    required
                />
                <Input
                    id="target-amount"
                    name="target-amount"
                    type="number"
                    label="Target Amount"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full"
                    placeholder="100000"
                    required
                />
                <Input
                    id="min-contribution"
                    name="min-contribution"
                    type="number"
                    label="Min Contribution"
                    value={minContributionAmount}
                    onChange={(e) =>
                        setMinContributionAmount(Number(e.target.value))
                    }
                    className="w-full"
                    placeholder="1000"
                    required
                />
                <Input
                    id="max-contribution"
                    name="max-contribution"
                    type="number"
                    label="Max Contribution"
                    value={maxContributionAmount}
                    onChange={(e) =>
                        setMaxContributionAmount(Number(e.target.value))
                    }
                    className="w-full"
                    placeholder="50000"
                    required
                />
                <div>
                    <label
                        htmlFor="currency"
                        className="block text-sm font-medium mb-1"
                    >
                        Currency
                    </label>
                    <select
                        id="currency"
                        name="currency"
                        value={currency}
                        onChange={(e) =>
                            setCurrency(e.target.value as Currency)
                        }
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        {Object.values(Currency).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    disabled={isPending}
                >
                    {isPending ? "Creating..." : "Create Round"}
                </Button>
            </form>
        </Card>
    );
};

export default NewRoundForm;
