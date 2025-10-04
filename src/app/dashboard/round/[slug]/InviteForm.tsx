"use client";
import { createInvite } from "@/lib/actions/invites";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import React from "react";

export default function InviteForm({ roundId }: { roundId: string }) {
    const [error, setError] = React.useState<string | null>(null);

    async function handleInvite(formData: FormData) {
        const email = formData.get("inviteEmail") as string;
        if (!email) return;
        setError(null);
        try {
            await createInvite({ userEmail: email, roundId });
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                err.message.includes("User not found")
            ) {
                setError("User not found. Invite them to use the app!");
            } else {
                setError("Failed to send invite.");
            }
        }
    }

    return (
        <form action={handleInvite} className="flex gap-2 items-end mb-4">
            <Input
                id="inviteEmail"
                name="inviteEmail"
                type="email"
                label="Invite by Email"
                placeholder="user@example.com"
                required
                className="w-64"
            />
            <Button type="submit" variant="primary">
                Invite
            </Button>
            {error && <div className="text-red-500 text-sm ml-2">{error}</div>}
        </form>
    );
}
