import Card from "@/components/Card";
import { Round } from "@/generated/prisma";
import Link from "next/link";

type Props = {
    rounds: Round[];
    emptyText?: string;
};

const RoundList = ({ rounds, emptyText = "No rounds found." }: Props) => {
    if (!rounds || rounds.length === 0) {
        return (
            <div className="text-center text-text-secondary py-8">
                {emptyText}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {rounds.map((round) => (
                <Link
                    key={round.id}
                    href={`/dashboard/round/${round.id}`}
                    className="hover:no-underline"
                >
                    <Card className="w-full hover:border-primary transition-colors cursor-pointer">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <div className="font-heading font-bold text-h3 text-text-primary">
                                    {round.name}
                                </div>
                                <div className="text-ui font-ui text-text-secondary">
                                    Target:{" "}
                                    <span className="font-medium text-text-primary">
                                        ${round.targetAmount.toLocaleString()}
                                    </span>
                                </div>
                                {round.status && (
                                    <div className="text-xs mt-1 text-text-secondary">
                                        Status:{" "}
                                        <span className="font-semibold text-text-primary">
                                            {round.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {round.createdAt && (
                                <div className="text-xs text-text-secondary text-right">
                                    Created:{" "}
                                    {new Date(
                                        round.createdAt,
                                    ).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
};

export default RoundList;
