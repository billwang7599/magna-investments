"use server";

import { datadumpRounds, datadumpCommitments } from "@/lib/actions/datadump";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Download SVG icon (Heroicons outline style)
function DownloadIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3"
            />
        </svg>
    );
}

export default async function DatadumpPage() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/login");
    }
    const userId = data.user.id;

    // Generate CSVs on the server
    const roundsCSV = await datadumpRounds(userId);
    const commitmentsCSV = await datadumpCommitments(userId);

    // Helper for download links
    function downloadLink(csv: string, filename: string, label: string) {
        return (
            <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
                download={filename}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 text-lg"
            >
                <DownloadIcon />
                {label}
            </a>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-6">Data Export</h1>
            <p className="mb-8 text-gray-400">
                Download all your Rounds and Commitments as CSV files for your
                own records.
            </p>
            <div className="flex flex-col gap-6">
                {downloadLink(
                    roundsCSV,
                    "rounds-datadump.csv",
                    "Download Rounds CSV",
                )}
                {downloadLink(
                    commitmentsCSV,
                    "commitments-datadump.csv",
                    "Download Commitments CSV",
                )}
            </div>
        </div>
    );
}
