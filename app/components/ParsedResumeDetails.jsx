// components/ParsedResumeDetails.jsx

import React from "react";

export default function ParsedResumeDetails({ parsedData }) {
  if (!parsedData) return null;

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Parsed Resume Data</h3>
      <div><strong>Name:</strong> {parsedData.name || "Not Found"}</div>
      <div>
        <strong>Emails:</strong> {parsedData.emails?.length > 0 ? parsedData.emails.join(", ") : "No emails found"}
      </div>
      <div>
        <strong>Skills:</strong> {parsedData.skills?.length > 0 ? parsedData.skills.join(", ") : "No skills found"}
      </div>
      <div>
        <strong>Experience:</strong>
        <ul>
          {parsedData.experience?.length > 0
            ? parsedData.experience.map((exp, idx) => <li key={idx}>{exp}</li>)
            : <li>No experience found</li>}
        </ul>
      </div>
      <div>
        <strong>Education:</strong>
        <ul>
          {parsedData.education?.length > 0
            ? parsedData.education.map((edu, idx) => <li key={idx}>{edu}</li>)
            : <li>No education found</li>}
        </ul>
      </div>
      <div>
        <strong>Projects:</strong>
        <ul>
          {parsedData.projects?.length > 0
            ? parsedData.projects.map((proj, idx) => <li key={idx}>{proj}</li>)
            : <li>No projects found</li>}
        </ul>
      </div>
    </section>
  );
}
