"use client";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
    const supabase = createClient();

    return <button onClick={() => supabase.auth.signOut()}>Sign Out</button>;
}
