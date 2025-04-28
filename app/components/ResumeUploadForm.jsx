"use client";

import { useState } from "react";

export default function ResumeUploadForm({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);

    const res = await fetch("/api/upload", { method: "POST", body: formData });

    setUploading(false);

    if (res.ok) {
      alert("Resume uploaded successfully!");
      setFile(null);
      if (onFileUpload) {
        await onFileUpload(); // <<<< trigger the refresh after upload
      }
    } else {
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="border p-2"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </form>
  );
}
