import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserById } from "@/lib/actions/users";
import Link from "next/link";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }

    const user = await getUserById(data.user.id);
    if (!user) {
        redirect("/me");
    }
    return (
        <div className="flex h-screen bg-background font-sans text-text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-border flex flex-col py-8 px-6 h-full">
                <div className="mb-8 text-h2 font-heading font-bold text-primary">
                    Magna
                </div>
                <nav className="flex flex-col gap-4">
                    {/* Example nav items, replace with your actual links */}
                    <Link
                        href="/dashboard"
                        className="text-text-primary hover:text-primary font-ui text-ui transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/profile"
                        className="text-text-secondary hover:text-primary font-ui text-ui transition-colors"
                    >
                        Profile
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="text-text-secondary hover:text-primary font-ui text-ui transition-colors"
                    >
                        Settings
                    </Link>
                </nav>
                <div className="mt-auto pt-8 border-t border-border">
                    <a
                        href="/auth/logout"
                        className="text-text-secondary hover:text-primary font-ui text-ui transition-colors"
                    >
                        Logout
                    </a>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-8 bg-background h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
