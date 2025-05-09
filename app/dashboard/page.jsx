"use client";
import ResumePreview from "../components/ResumePreview";
import ParsedResumeDetails from "../components/ParsedResumeDetails";
import PlagiarismResult from "../components/PlagiarismResult";
import DomainSelection from "../components/DomainSelection";
import { UploadCloud } from "lucide-react";
import RecommendedJobs from "../components/RecommendedJobs"; 


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";



export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // state





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
  <h1 className="text-4xl font-bold mb-4">Welcome, {session.user.name}</h1>
  <p className="mb-6 bg-green-500 p-3 rounded-lg text-center">{session.user.email}</p>
  
        {/* Upload Form */}
        

<section className="mb-12">
  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6">
    Upload Your Resume
  </h2>

  <form
    onSubmit={handleUpload}
   className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 max-w-3xl w-full transition-all duration-300 hover:shadow-2xl"
  >
    <label
      htmlFor="resume-upload"
      className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 rounded-xl h-56 cursor-pointer transition hover:bg-emerald-50 relative text-center"
    >
      <UploadCloud className="w-12 h-12 text-emerald-500 mb-3 animate-pulse" />
      <p className="text-lg text-gray-700 font-semibold">
        Drag & drop your resume or <span className="underline text-emerald-600">click to browse</span>
      </p>
      {file && (
        <p className="mt-3 text-sm italic font-bold text-gray-600">
          {file.name}
        </p>
      )}
      <input
        id="resume-upload"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={uploading}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </label>

    <div className="mt-6 text-center">
      <button
        type="submit"
        disabled={uploading || !file}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
    </div>
  </form>
</section>
  

         {/* ATS Warnings and Score */}
         {parsedData && (
  <div className="mt-6  mb-6 p-6 bg-white rounded-xl shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-wide">ATS Score</h3>
    <div className="flex items-center gap-8">
      {/* Circular Progress for Overall Score */}
      <div className="relative w-24 h-24">
        <svg className="absolute top-0 left-0 w-full h-full">
          <circle cx="48" cy="48" r="38" stroke="#F3F4F6" strokeWidth="8" fill="none" />
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke="#EA580C"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${atsScore * 2.3876} 238.76`} // Circumference is 2 * pi * 38 ≈ 238.76
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800 font-bold text-2xl">
          {atsScore}
        </div>
      </div>
      <div>
        <p className="text-lg text-gray-700">Your resume scored <span className="font-semibold">{atsScore}</span> out of 100.</p>
        {atsWarnings.length > 0 ? (
          <ul className="list-disc space-y-1 mt-2 text-sm text-red-600">
            {atsWarnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-green-600">No significant issues found.</p>
        )}
      </div>
    </div>
  </div>
)}

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
  <PlagiarismResult key={parsedData?.text} textToCheck={parsedData?.text} />
) : (
  <div>No text available to check plagiarism</div>
)}
      {/* More content below if any */}
    </div>
          </section>
        )}
  
        {/* Resume Score */}
        {resumeScore && (
  <div className="mt-6 p-6 bg-white rounded-xl shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-wide">Resume Score</h3>
    <div className="flex items-center gap-8">
      {/* Circular Progress for Overall Score */}
      <div className="relative w-24 h-24">
        <svg className="absolute top-0 left-0 w-full h-full">
          <circle cx="48" cy="48" r="38" stroke="#F3F4F6" strokeWidth="8" fill="none" />
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke="#EA580C"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${resumeScore?.totalScore * 2.3876} 238.76`}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800 font-bold text-2xl">
          {resumeScore?.totalScore}
        </div>
      </div>
      <div>
        <p className="text-lg text-gray-700">Your resume scored <span className="font-semibold">{resumeScore?.totalScore}</span> out of 100.</p>
        {resumeScore?.breakdown && Object.keys(resumeScore.breakdown).length > 0 && (
          <ul className="list-disc space-y-1 mt-2 text-sm text-gray-600">
            {Object.entries(resumeScore.breakdown).map(([key, val]) => {
              let maxScore = 10;
              if (key === "skills") {
                maxScore = 30;
              } else if (key === "experience") {
                maxScore = 30;
              } else if (key === "education") {
                maxScore = 20;
              } else if (key === "projects") {
                maxScore = 10;
              }
              return (
                <li key={key}>
                  {key[0].toUpperCase() + key.slice(1)}: <span className="font-semibold">{val}</span> / {maxScore}
                </li>
              );
            })}
          </ul>
        )}
      </div>
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
  <h2 className="text-4xl font-extrabold text-white mb-8">Your Uploaded Resumes</h2>

  {isLoadingFiles ? (
    <div className="text-center text-gray-600">Loading resumes…</div>
  ) : errorLoadingFiles ? (
    <div className="text-center text-red-600">{errorLoadingFiles}</div>
  ) : uploadedFiles.length > 0 ? (
    <ul className="space-y-6">
      {uploadedFiles.map(({ name, size }) => (
        <li
          key={name}
          className="flex items-center justify-between p-6 border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl bg-white transition-all duration-300 ease-in-out"
        >
          <div className="flex-1">
            <span
              className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-emerald-600 transition-colors duration-300"
              onClick={() => {
                const previewUrl = `/uploads/${name}`;
                console.log("Clicked:", name, "Preview URL:", previewUrl);
                setPreviewFileUrl(previewUrl);
              }}
            >
              {name}
            </span>
            <p className="text-sm text-gray-500 mt-1">{formatFileSize(size)}</p>
          </div>

          <div className="flex space-x-4 items-center">
            <a
              href={`/uploads/${name}`}
              download
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-teal-600 hover:to-cyan-500 transition duration-300 transform hover:scale-105"
            >
              Download
            </a>
            <button
              onClick={() => handleDelete(name)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-purple-600 hover:to-indigo-500 transition duration-300 transform hover:scale-105"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-center text-gray-600">No resumes uploaded yet.</div>
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