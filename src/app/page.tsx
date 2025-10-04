"use client";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md flex flex-col items-center gap-6 py-12">
                <h1 className="text-h1 font-heading font-bold text-primary mb-2 text-center">
                    Welcome to Magna Investments
                </h1>
                <p className="text-ui font-ui text-text-secondary text-center mb-6">
                    Explore our investment opportunities and grow your portfolio
                    with confidence.
                </p>
                <Button
                    variant="primary"
                    className="w-full text-[18px] py-3"
                    onClick={() => router.push("/auth/login")}
                >
                    Get Started
                </Button>
            </Card>
        </div>
    );
}
