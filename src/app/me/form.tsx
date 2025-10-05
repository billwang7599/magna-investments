"use client";
import React from "react";
import { useRoleStore } from "@/lib/stores/roleStore";
import { createUser } from "@/lib/actions/users";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

type FormProps = {
    userId: string;
    userEmail: string;
};

export default function ProfileForm({ userId, userEmail }: FormProps) {
    const { setRole } = useRoleStore();
    const router = useRouter();

    function submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const role = formData.get("role") as "founder" | "investor";
        const email = formData.get("userEmail") as string;
        setRole(role);
        createUser(userId, name, email).then(() => {
            router.push("/dashboard");
        });
    }

    return (
        <Form
            onSubmit={submitForm}
            className="flex flex-col gap-6 bg-surface rounded-lg border border-border p-6"
        >
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="userEmail" value={userEmail} />
            <Input
                id="name"
                name="name"
                type="text"
                label="Name"
                required
                className="w-full"
                placeholder="Your name"
            />
            <div>
                <span className="block mb-2 text-sm font-medium text-tertiary">
                    Are you a:
                </span>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-4 py-2 shadow-sm hover:bg-fuchsia-500/10 hover:border-fuchsia-500 transition-all cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="founder"
                            required
                            className="accent-fuchsia-500"
                        />
                        <span className="text-white font-medium">Founder</span>
                    </label>
                    <label className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-4 py-2 shadow-sm hover:bg-fuchsia-500/10 hover:border-fuchsia-500 transition-all cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="investor"
                            required
                            className="accent-fuchsia-500"
                        />
                        <span className="text-white font-medium">Investor</span>
                    </label>
                </div>
            </div>
            <Button type="submit" variant="primary" className="w-full mt-2">
                Submit
            </Button>
        </Form>
    );
}
