"use client";
import ResumePreview from "../components/ResumePreview";
import ParsedResumeDetails from "../components/ParsedResumeDetails";
import PlagiarismResult from "../components/PlagiarismResult";
import DomainSelection from "../components/DomainSelection";


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import RecommendedJobs from "../components/RecommendedJobs"; 

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
  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [plagiarismResult, setPlagiarismResult] = useState(null);


  

  // Helper to format bytes → KB / MB
  function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    return (bytes / 1024).toFixed(2) + " KB";
  }
  

  useEffect(() => {
    if (!parsedData?.text) return;
  
    (async function checkPlagiarism() {
      try {
        const { token } = await fetch("/api/copyleaks/auth").then(r => r.json());
        const { result } = await fetch("/api/copyleaks/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: parsedData.text, token }),
        }).then(r => r.json());
  
        const statusRes = await fetch(
          `/api/copyleaks/status?scanId=${result.scanId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(r => r.json());
  
        const pct = Math.round(statusRes.overallSimilarity * 100);
        console.log("[DashboardPage] Plagiarism %:", pct);
  
        setPlagiarismResult({ similarity: pct, matches: statusRes.matches || [] });
      } catch (err) {
        console.error("Plagiarism check failed", err);
      }
    })();
  }, [parsedData]);

  const handlePreview = (filename) => {
    setPreviewFileUrl(`/uploads/${filename}`);
  };

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
    <div className="flex p-8 gap-8 h-full">
    {/* LEFT COLUMN: Dashboard content */}
    <div className="flex-1 max-w-1/2 overflow-hidden">
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
            <div className="p-4">
      {/* Other UI sections */}

       {/* Parsed Resume Details */}
       {parsedData && <ParsedResumeDetails parsedData={parsedData} />}

{/* Plagiarism Result */}
{parsedData?.text ? (
  <PlagiarismResult textToCheck={parsedData?.text} />
) : (
  <div>No text available to check plagiarism</div>
)}

      {/* More content below if any */}
    </div>
          </section>
        )}
  
        {/* Resume Score */}
        {resumeScore && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">
              Resume Score: {resumeScore?.totalScore} / 100
            </h3>
            <ul className="list-disc ml-6 text-sm">
              {Object.entries(resumeScore?.breakdown || {}).map(([key, val]) => (
                <li key={key}>
                  {key[0].toUpperCase() + key.slice(1)}: {val} /{" "}
                  {key === "skills"
                    ? 30
                    : key === "experience"
                    ? 30
                    : key === "education"
                    ? 20
                    : key === "projects"
                    ? 10
                    : 10}
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
              <p className="text-sm text-green-600">
                No significant ATS compatibility warnings found.
              </p>
            </div>
          </div>
        )}
  
        {/* Recommended Jobs */}
        {parsedData?.skills?.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Recommended Jobs</h2>
            <RecommendedJobs
              skills={parsedData.skills
                .flatMap((skill) => skill.split(/[,|•\-]/))
                .map((s) =>
                  s
                    .replace(/[^a-zA-Z0-9.+#]/g, "")
                    .trim()
                )
                .filter(Boolean)}
            />
          </section>
        )}
        
  
        {/* Uploaded Files List */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Your Uploaded Resumes
          </h2>
  
          {isLoadingFiles ? (
            <p>Loading resumes…</p>
          ) : errorLoadingFiles ? (
            <p className="text-red-500">{errorLoadingFiles}</p>
          ) : uploadedFiles.length > 0 ? (
            <ul className="space-y-2">
            {uploadedFiles.map(({ name, size }) => (
              <li key={name} className="flex items-center gap-4">
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => {
                    const previewUrl = `/uploads/${name}`;
                    console.log("Clicked:", name, "Preview URL:", previewUrl);
                    setPreviewFileUrl(previewUrl);
                  }}
                >
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
   {/* RIGHT COLUMN: just the PDF preview */}
   <div className="flex-1 h-full bg-gray-50 overflow-hidden">
    <ResumePreview fileUrl={previewFileUrl} />
  </div>
 
  </div>
);
}