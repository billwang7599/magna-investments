"use server";
import { createInvite } from "@/lib/actions/invites";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import React from "react";

export default async function InviteForm({ roundId }: { roundId: string }) {
    async function handleInvite(formData: FormData) {
        "use server";
        const email = formData.get("inviteEmail") as string;
        if (!email) return;
        await createInvite({ userEmail: email, roundId });
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
        </form>
    );
}
