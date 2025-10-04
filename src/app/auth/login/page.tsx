"use client";
import { login, signup } from "@/lib/actions/auth";
import Form from "@/components/Form";
import { Button } from "@/components/Button";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Form onSubmit={() => {}} className="max-w-sm w-full space-y-6">
                <h2 className="text-xl font-semibold mb-2 text-center">
                    Login or Sign Up
                </h2>
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
                    <Button
                        type="submit"
                        formAction={login}
                        variant="primary"
                        className="w-1/2"
                    >
                        Log in
                    </Button>
                    <Button
                        type="submit"
                        formAction={signup}
                        variant="secondary"
                        className="w-1/2"
                    >
                        Sign up
                    </Button>
                </div>
            </Form>
        </div>
    );
}
