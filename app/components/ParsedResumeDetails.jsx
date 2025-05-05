import React from "react";
import { CheckCircle } from "lucide-react"; // Requires lucide-react (npm install lucide-react)

export default function ParsedResumeDetails({ parsedData }) {
  if (!parsedData) return null;

  // Log parsedData to check structure
  console.log(parsedData);

  const renderList = (items, emptyMessage = "Not found") => {
    return items?.length > 0 ? (
      <ul className="list-none pl-0 space-y-1 mt-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start space-x-2">
            <CheckCircle className="text-green-500 w-4 h-4 mt-1" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 italic">{emptyMessage}</p>
    );
  };

  return (
    <section className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Parsed Resume Details</h3>

      <div className="space-y-5 text-gray-700">
        <div>
          <strong className="text-gray-800">Name:</strong>{" "}
          <span>
            {parsedData.name ? (
              parsedData.name
            ) : (
              <span className="italic text-gray-400">Not Found</span>
            )}
          </span>
        </div>

        <div>
          <strong className="text-gray-800">Emails:</strong>
          {renderList(parsedData.emails, "No emails found")}
        </div>

        <div>
          <strong className="text-gray-800">Skills:</strong>
          {renderList(parsedData.skills, "No skills found")}
        </div>

        <div>
          <strong className="text-gray-800">Experience:</strong>
          {renderList(parsedData.experience, "No experience found")}
        </div>

        <div>
          <strong className="text-gray-800">Education:</strong>
          {renderList(parsedData.education, "No education found")}
        </div>

        <div>
          <strong className="text-gray-800">Projects:</strong>
          {renderList(parsedData.projects, "No projects found")}
        </div>
      </div>
    </section>
  );
}
