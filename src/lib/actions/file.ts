"use server";
import { createClient } from "@/lib/supabase/server";
import { getCommitment } from "./commitment";
import { getRoundById } from "./round";

async function buildPath(commitmentId: string) {
    const commitment = await getCommitment(commitmentId);
    const round = await getRoundById(commitment.roundId);
    return `${commitmentId}-${commitment.investorUserId}-${round.companyUserId}`;
}

export async function uploadFileCommitment(
    file: File,
    bucket: string,
    commitmentId: string,
): Promise<string | null> {
    const supabase = await createClient();
    const path = await buildPath(commitmentId);
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${path}/${file.name}`, file);

    if (error) {
        console.error("Error uploading file:", error);
        return null;
    }

    return data?.path || null;
}

export async function getDownloadUrl(
    bucket: string,
    commitmentId: string,
    fileName: string,
    expiresIn: number = 60 * 60, // default: 1 hour
): Promise<string | null> {
    const supabase = await createClient();
    const path = await buildPath(commitmentId);
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(`${path}/${fileName}`, expiresIn);

    if (error || !data?.signedUrl) {
        console.error("Error getting signed download URL:", error);
        return null;
    }

    return data.signedUrl;
}

export async function getAllDownloadUrls(
    bucket: string,
    commitmentId: string,
    expiresIn: number = 60 * 60, // default: 1 hour
): Promise<{ fileName: string; signedUrl: string | null }[]> {
    const supabase = await createClient();
    const path = await buildPath(commitmentId);

    // List all files in the folder
    const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list(path);

    if (listError || !files) {
        console.error("Error listing files:", listError);
        return [];
    }

    // Generate signed URLs for each file
    const results = await Promise.all(
        files
            .filter((file) => file.name) // skip folders
            .map(async (file) => {
                const filePath = `${path}/${file.name}`;
                const { data, error } = await supabase.storage
                    .from(bucket)
                    .createSignedUrl(filePath, expiresIn);
                return {
                    fileName: file.name,
                    signedUrl: data?.signedUrl ?? null,
                };
            }),
    );

    return results;
}
