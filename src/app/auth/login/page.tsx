"use client";
import { login, signup } from "@/lib/actions/auth";
import Form from "@/components/Form";
import { Button } from "@/components/Button";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const result = await login(formData);
        if (result?.success) {
            router.push("/dashboard");
        } else if (result?.error) {
            setError(result.error);
        }
    }

    async function handleSignup() {
        setError(null);
        if (!formRef.current) return;
        const formData = new FormData(formRef.current);
        const result = await signup(formData);
        if (result?.success) {
            router.push("/dashboard");
        } else if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Form
                ref={formRef}
                onSubmit={handleLogin}
                className="max-w-sm w-full space-y-6"
            >
                <h2 className="text-xl font-semibold mb-2 text-center">
                    Login or Sign Up
                </h2>
                {error && (
                    <div className="text-red-500 text-center text-sm">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="border rounded px-3 py-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="border rounded px-3 py-2"
                    />
                </div>
                <div className="flex gap-3 justify-between">
                    <Button type="submit" variant="primary" className="w-1/2">
                        Log in
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-1/2"
                        onClick={handleSignup}
                    >
                        Sign up
                    </Button>
                </div>
            </Form>
        </div>
    );
}
