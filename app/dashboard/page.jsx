"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import RecommendedJobs from "../components/RecommendedJobs"; // <-- Import the component

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [errorLoadingFiles, setErrorLoadingFiles] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [resumeScore, setResumeScore] = useState(null);
  const [atsWarnings, setAtsWarnings] = useState([]);
  const [atsScore, setAtsScore] = useState(100); // <-- new state
  const [recommendedJobsSkills, setRecommendedJobsSkills] = useState([]); // State for skills

  // Helper to format bytes → KB / MB
  function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    return (bytes / 1024).toFixed(2) + " KB";
  }

  // Fetch list of uploaded files
  const fetchFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    setErrorLoadingFiles(null);
    try {
      const res = await fetch("/api/uploads");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { files } = await res.json();
      setUploadedFiles(files || []);
    } catch (e) {
      console.error("Error fetching files:", e);
      setErrorLoadingFiles("Failed to load uploaded resumes.");
      setUploadedFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (session) fetchFiles();
  }, [session, fetchFiles]);

  // Protect route
  if (status === "loading") return <p>Loading session...</p>;
  if (!session) {
    router.push("/");
    return null;
  }

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload & parse
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setParsedData(null);
    setResumeScore(null);
    setAtsWarnings([]);
    setAtsScore(100);
    setRecommendedJobsSkills([]); // Reset skills on new upload

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);

      const { filename, parsedData: pd, resumeScore: rs, atsWarnings: aw } = await res.json();
      alert(`Uploaded ${filename} successfully!`);
      setParsedData(pd || null);
      setResumeScore(rs || null);
      setAtsWarnings(aw || []);
      const calculatedAtsScore = Math.max(100 - (aw?.length * 20), 0);
      setAtsScore(calculatedAtsScore);
      setRecommendedJobsSkills(pd?.skills || []); // Set skills for recommendations
      setFile(null);
      await fetchFiles();
    } catch (e) {
      console.error(e);
      alert("Upload error—please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const handleDelete = async (filename) => {
    if (!confirm(`Delete "${filename}"?`)) return;

    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);

      alert(`Deleted ${filename}`);
      await fetchFiles();
    } catch (e) {
      console.error(e);
      alert("Delete error—please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}</h1>
      <p className="mb-6">{session.user.email}</p>

      {/* Upload Form */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
        <form onSubmit={handleUpload} className="flex items-center gap-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="submit"
            disabled={uploading || !file}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </section>

      {/* Parsed Data */}
      {parsedData && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Parsed Resume Data</h3>
          <div>
            <strong>Name: </strong> {parsedData.name || "Not Found"}
          </div>
          <div>
            <strong>Emails: </strong> {parsedData.emails?.length > 0 ? parsedData.emails.join(", ") : "No emails found"}
          </div>
          <div>
            <strong>Skills: </strong> {parsedData.skills?.length > 0 ? parsedData.skills.join(", ") : "No skills found"}
          </div>
          <div>
            <strong>Experience: </strong>
            <ul>
              {parsedData.experience?.length > 0
                ? parsedData.experience.map((exp, idx) => <li key={idx}>{exp}</li>)
                : "No experience found"}
            </ul>
          </div>
          <div>
            <strong>Education: </strong>
            <ul>
              {parsedData.education?.length > 0
                ? parsedData.education.map((edu, idx) => <li key={idx}>{edu}</li>)
                : "No education found"}
            </ul>
          </div>
          <div>
            <strong>Projects: </strong>
            <ul>
              {parsedData.projects?.length > 0
                ? parsedData.projects.map((proj, idx) => <li key={idx}>{proj}</li>)
                : "No projects found"}
            </ul>
          </div>
        </section>
      )}

      {/* Resume Score */}
      {resumeScore && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Resume Score: {resumeScore?.totalScore} / 100</h3>
          <ul className="list-disc ml-6 text-sm">
            {Object.entries(resumeScore?.breakdown || {}).map(([key, val]) => (
              <li key={key}>
                {key[0].toUpperCase() + key.slice(1)}: {val} / {
                  key === "skills" ? 30 : key === "experience" ? 30 : key === "education" ? 20 : key === "projects" ? 10 : 10
                }
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ATS Warnings and Score */}
      {atsWarnings.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">ATS Compatibility Score</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-red-400 flex items-center justify-center text-xl font-bold text-red-700">
              {atsScore}%
            </div>
            <ul className="list-disc text-sm text-red-600">
              {atsWarnings.map((warn, idx) => (
                <li key={idx}>{warn}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {atsWarnings.length === 0 && parsedData && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">ATS Compatibility Score</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-green-400 flex items-center justify-center text-xl font-bold text-green-700">
              {atsScore}%
            </div>
            <p className="text-sm text-green-600">No significant ATS compatibility warnings found.</p>
          </div>
        </div>
      )}

// Inside your JSX rendering the job recommendations
{parsedData?.skills?.length > 0 && (
  <section className="mt-8">
    <h2 className="text-2xl font-semibold mb-2">Recommended Jobs</h2>
    <RecommendedJobs
      skills={parsedData.skills
        .flatMap(skill => skill.split(/[,|•\-]/)) // split by commas, pipes, bullets, dashes
        .map(s =>
          s
            .replace(/[^a-zA-Z0-9.+#]/g, "") // remove unwanted characters
            .trim()
        )
        .filter(Boolean)}
    />
  </section>
)}

      {/* Uploaded Files List */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Your Uploaded Resumes</h2>

        {isLoadingFiles ? (
          <p>Loading resumes…</p>
        ) : errorLoadingFiles ? (
          <p className="text-red-500">{errorLoadingFiles}</p>
        ) : uploadedFiles.length > 0 ? (
          <ul className="space-y-2">
            {uploadedFiles.map(({ name, size }) => (
              <li key={name} className="flex items-center gap-4">
                <span>
                  {name} ({formatFileSize(size)})
                </span>
                <a
                  href={`/uploads/${name}`}
                  download
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(name)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No resumes uploaded yet.</p>
        )}
      </section>
    </div>
  );
}