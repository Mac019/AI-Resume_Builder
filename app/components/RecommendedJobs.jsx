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
    <div className="mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Recommended Jobs</h2>
      {loading ? (
        <p>Loading job recommendations...</p>
      ) : jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="border-b pb-2">
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm">{job.company} — {job.location}</p>
              <a
                href={job.link}
                target="_blank"
                className="text-blue-600 underline text-sm"
                rel="noopener noreferrer"
              >
                View Job
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found based on your resume skills.</p>
      )}
    </div>
  );
}
