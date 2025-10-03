import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/lib/components/logout-button";

export default async function PrivatePage() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }

    return (
        <div>
            <p>Welcome, {data.user.email}!</p>
            <p>Your account is active.</p>
            <LogoutButton />
        </div>
    );
}
