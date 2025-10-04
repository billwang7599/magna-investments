import React, { useState } from "react";
import Card from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { Currency } from "@/generated/prisma";

type NewRoundFormProps = {
    onCreate: (data: {
        name: string;
        targetAmount: number;
        minContributionAmount: number;
        maxContributionAmount: number;
        currency: Currency;
    }) => Promise<void>;
    loading?: boolean;
};

const NewRoundForm: React.FC<NewRoundFormProps> = ({ onCreate, loading }) => {
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

        try {
            await onCreate({
                name: name.trim(),
                targetAmount: Number(targetAmount),
                minContributionAmount: Number(minContributionAmount),
                maxContributionAmount: Number(maxContributionAmount),
                currency,
            });
            setName("");
            setTargetAmount("");
            setMinContributionAmount("");
            setMaxContributionAmount("");
            setCurrency(Currency.USDC);
        } catch (err) {
            setError("Failed to create round. Please try again.");
            console.error(err);
        }
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
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Round"}
                </Button>
            </form>
        </Card>
    );
};

export default NewRoundForm;
