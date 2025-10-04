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
        <Form onSubmit={submitForm} className="space-y-6 px-2 py-2">
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="userEmail" value={userEmail} />
            <div>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    label="Name"
                    required
                    className="w-full"
                />
            </div>
            <div>
                <span className="block mb-2 font-medium text-text-secondary">
                    Are you a:
                </span>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-text-secondary font-ui text-ui bg-gray-50 px-3 py-2 rounded shadow-sm hover:bg-gray-100 transition">
                        <input
                            type="radio"
                            name="role"
                            value="founder"
                            required
                            className="accent-primary"
                        />
                        Founder
                    </label>
                    <label className="flex items-center gap-2 text-text-secondary font-ui text-ui bg-gray-50 px-3 py-2 rounded shadow-sm hover:bg-gray-100 transition">
                        <input
                            type="radio"
                            name="role"
                            value="investor"
                            required
                            className="accent-primary"
                        />
                        Investor
                    </label>
                </div>
            </div>
            <Button type="submit" className="w-full mt-2">
                Submit
            </Button>
        </Form>
    );
}
