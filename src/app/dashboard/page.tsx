"use client";
import { useRoleStore } from "@/lib/stores/roleStore";
import FounderDash from "./founder-dash";
import InvestorDash from "./investor-dash";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const supabase = createClient();
    const { role, setRole } = useRoleStore();

    useEffect(() => {
        async function fetchUser() {
            const userResponse = await supabase.auth.getUser();
            setUserId(userResponse?.data?.user?.id ?? null);
            setUserEmail(userResponse?.data?.user?.email ?? null);
        }
        fetchUser();
    }, [supabase.auth]);

    const switchRole = () => {
        setRole(role === "founder" ? "investor" : "founder");
    };

    if (!userId || !userEmail) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col px-4 py-10">
            {/* Dashboard Heading and Actions */}
            <div className="max-w-5xl w-full mx-auto flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-50 mb-2">
                            Dashboard
                        </h1>
                        <p className="text-base font-medium text-gray-400">
                            Welcome to your Magna dashboard. Manage your rounds
                            and investments here.
                        </p>
                    </div>
                    <div className="flex gap-3 mt-2 sm:mt-0">
                        <Button variant="secondary" onClick={switchRole}>
                            Switch to{" "}
                            {role === "founder" ? "Investor" : "Founder"}
                        </Button>
                    </div>
                </div>
                {/* Main Dashboard Content */}
                <div>
                    {role === "founder" ? (
                        <FounderDash userId={userId} />
                    ) : (
                        <InvestorDash userId={userId} userEmail={userEmail} />
                    )}
                </div>
            </div>
        </div>
    );
}
