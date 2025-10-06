"use server";

import { getRoundsByFounder } from "./round";
import { getCommitmentsByInvestorId } from "./commitment";
import { Round, Commitment } from "@/generated/prisma";

/**
 * Converts an array of objects to a CSV string.
 * @param rows Array of objects to convert.
 * @param headers Optional: Array of headers (field names) to use/order.
 */
function toCSV<T extends Record<string, unknown>>(
    rows: T[],
    headers?: string[],
): string {
    if (!rows.length) return "";
    const cols = headers || Object.keys(rows[0]);
    const escape = (
        val: string | number | Date | boolean | null | undefined,
    ) => {
        if (val === null || val === undefined) return "";
        if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
        if (typeof val === "number") return val.toString();
        if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
        if (val instanceof Date) return val.toISOString();
        return "";
    };
    const headerLine = cols.join(",");
    const lines = rows.map((row) =>
        cols
            .map((col) =>
                escape(
                    row[col] as
                        | string
                        | number
                        | Date
                        | boolean
                        | null
                        | undefined,
                ),
            )
            .join(","),
    );
    return [headerLine, ...lines].join("\n");
}

/**
 * Get all rounds associated with a userId (as founder) and output as CSV.
 */
export async function datadumpRounds(userId: string): Promise<string> {
    const rounds: Round[] = await getRoundsByFounder(userId);
    const roundHeaders = [
        "id",
        "name",
        "status",
        "createdAt",
        "updatedAt",
        "companyUserId",
        "currency",
        "maxContributionAmount",
        "minContributionAmount",
        "targetAmount",
        "public",
    ];
    const roundRows = rounds.map((r) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        companyUserId: r.companyUserId,
        currency: r.currency,
        maxContributionAmount: r.maxContributionAmount,
        minContributionAmount: r.minContributionAmount,
        targetAmount: r.targetAmount,
        public: r.public,
    }));
    return toCSV(roundRows, roundHeaders);
}

/**
 * Get all commitments associated with a userId (as investor) and output as CSV.
 */
export async function datadumpCommitments(userId: string): Promise<string> {
    const commitments: Commitment[] = await getCommitmentsByInvestorId(userId);
    const commitmentHeaders = [
        "id",
        "roundId",
        "investorUserId",
        "amountCommitted",
        "status",
        "createdAt",
        "updatedAt",
    ];
    const commitmentRows = commitments.map((c) => ({
        id: c.id,
        roundId: c.roundId,
        investorUserId: c.investorUserId,
        amountCommitted: c.amountCommitted,
        status: c.status,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
    }));
    return toCSV(commitmentRows, commitmentHeaders);
}
