"use client";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { uploadFileCommitment } from "@/lib/actions/file";
import Card from "./Card";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

type FileDropProps = {
    bucket: string;
    commitmentId: string;
};

export default function FileDrop({ bucket, commitmentId }: FileDropProps) {
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();

    const onDrop = async (acceptedFiles: File[]) => {
        setUploading(true);
        setSuccessMsg(null);
        setErrorMsg(null);

        try {
            for (const file of acceptedFiles) {
                const result = await uploadFileCommitment(
                    file,
                    bucket,
                    commitmentId,
                );
                if (result) {
                    setSuccessMsg(`Uploaded: ${file.name}`);
                    router.refresh();
                } else {
                    setErrorMsg(`Failed to upload: ${file.name}`);
                }
            }
        } catch (err) {
            setErrorMsg("Unexpected error during upload.");
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div className="max-w-lg mx-auto mt-8" title="Upload Documents">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-all duration-200 ease-out
                    will-change-transform will-change-shadow
                    ${
                        isDragActive
                            ? "border-accent bg-accent/10 shadow-xl scale-[1.025]"
                            : "border-border bg-surface hover:bg-accent/5 hover:shadow-lg hover:scale-[1.01]"
                    }`}
                style={{
                    boxShadow: isDragActive
                        ? "0 8px 32px 0 rgba(79,70,229,0.15)"
                        : undefined,
                    transition:
                        "box-shadow 0.2s, transform 0.2s, background 0.2s, border-color 0.2s",
                }}
            >
                <input {...getInputProps()} />
                <p className="text-secondary mb-2 transition-colors duration-200">
                    Drag and drop files here, or click to select files
                </p>
            </div>
            {uploading && (
                <div className="mt-4 text-secondary font-medium transition-colors duration-200">
                    Uploading files...
                </div>
            )}
            {successMsg && (
                <div className="mt-4 text-success font-medium transition-colors duration-200">
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="mt-4 text-error font-medium transition-colors duration-200">
                    {errorMsg}
                </div>
            )}
        </div>
    );
}
