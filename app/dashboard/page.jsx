"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ResumeUploadForm from "../components/ResumeUploadForm";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [errorLoadingFiles, setErrorLoadingFiles] = useState(null);

  function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    return (bytes / 1024).toFixed(2) + " KB";
  }

  const handleDelete = async (filename) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      });

      if (res.ok) {
        alert("File deleted successfully!");
        // Refresh the uploaded files list
        const response = await fetch("/api/uploads");
        if (response.ok) {
          const data = await response.json();
          setUploadedFiles(data.files || []);
        } else {
          console.error("Failed to refresh file list after delete.");
          setErrorLoadingFiles("Failed to refresh file list.");
        }
      } else {
        alert("Failed to delete file. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file.");
    }
  };

  useEffect(() => {
    async function fetchFiles() {
      setIsLoadingFiles(true);
      setErrorLoadingFiles(null);
      try {
        const response = await fetch("/api/uploads");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUploadedFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching uploaded files:", error);
        setErrorLoadingFiles("Failed to load uploaded files.");
        setUploadedFiles([]);
      } finally {
        setIsLoadingFiles(false);
      }
    }

    if (session) {
      fetchFiles();
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading user session...</p>;
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user.name}</h1>
      <p className="mb-8">Email: {session.user.email}</p>

      <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
      <ResumeUploadForm onFileUpload={async () => {
        // After a successful upload, refresh the file list
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure file is written
        const response = await fetch("/api/uploads");
        if (response.ok) {
          const data = await response.json();
          setUploadedFiles(data.files || []);
        } else {
          console.error("Failed to refresh file list after upload");
          setErrorLoadingFiles("Failed to refresh file list.");
        }
      }} />

      <h2 className="text-2xl font-semibold mt-8 mb-2">Your Uploaded Resumes</h2>

      {isLoadingFiles ? (
        <p>Loading uploaded resumes...</p>
      ) : errorLoadingFiles ? (
        <p className="text-red-500">{errorLoadingFiles}</p>
      ) : uploadedFiles.length > 0 ? (
        <ul>
          {uploadedFiles.map((file) => (
            <li key={file.name} className="flex items-center gap-4 mb-2">
              <span>{file.name} ({formatFileSize(file.size)})</span>
              <a
                href={`/uploads/${file.name}`}
                download
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Download
              </a>
              <button
                onClick={() => handleDelete(file.name)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No uploaded resumes found.</p>
      )}
    </div>
  );
}