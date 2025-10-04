"use server";
import { createCommitment } from "@/lib/actions/commitment";
import { createClient } from "@/lib/supabase/server";

export async function submitCommitmentAction(roundId: string, amount: number) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    // You may want to add more validation here (e.g., check min/max, round status, etc.)
    return await createCommitment(roundId, user.id, amount);
}
