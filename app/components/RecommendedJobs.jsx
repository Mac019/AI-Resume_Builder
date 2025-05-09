"use client";

import { useEffect, useState } from "react";

export default function RecommendedJobs({ skills }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch(`/api/jobs/recommend?skills=${skills.join(",")}`);
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    if (skills?.length > 0) {
      fetchJobs();
    }
  }, [skills]);

  return (
    <div className="mt-8 p-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-3 transform transition duration-300 hover:scale-105">
        <span className="text-yellow-400">🚀</span>
        Recommended Jobs
      </h2>
      {loading ? (
        <div className="flex justify-center items-center space-x-2 text-white">
          <svg
            className="h-8 w-8 animate-spin text-blue-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-lg text-gray-300">Loading job recommendations...</p>
        </div>
      ) : jobs.length > 0 ? (
        <ul className="space-y-6">
          {jobs.slice(0, 6).map((job, index) => (
            <li
              key={index}
              className="flex flex-col bg-gradient-to-r from-blue-800 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105"
            >
              <div className="mb-4">
                <p className="text-2xl font-semibold text-white">{job.title}</p>
                <p className="text-sm text-gray-200">{job.company} — {job.location}</p>
              </div>
              <a
                href={job.link}
                target="_blank"
                className="text-indigo-200 hover:text-indigo-400 text-sm mt-2 font-medium transform transition duration-300 hover:scale-110"
                rel="noopener noreferrer"
              >
                View Job
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white italic">No jobs found based on your resume skills.</p>
      )}
    </div>
  );
}
