import { getUserById } from "@/lib/actions/users";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Form from "./form";
import Card from "@/components/Card";

export default async function Page() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }
    const user = await getUserById(data.user.id);
    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Card title="My Profile" className="max-w-md w-full">
                <div className="flex flex-col items-center mb-4">
                    <div className="bg-primary/10 rounded-full p-4 mb-2">
                        <svg
                            width="40"
                            height="40"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="8" r="4" fill="#6366F1" />
                            <path
                                d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
                                fill="#6366F1"
                                fillOpacity="0.2"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-1">
                        Complete Your Profile
                    </h2>
                </div>
                <Form userId={data.user.id} userEmail={data.user.email!} />
                <p className="mt-4 text-gray-600 text-center">
                    Welcome, {data.user.email}!
                </p>
            </Card>
        </div>
    );
}
