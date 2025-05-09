import React from "react";
import { CheckCircle } from "lucide-react"; // Requires lucide-react (npm install lucide-react)
import { scoreResume } from "../lib/scoreResume"; // Import the scoreResume function

export default function ParsedResumeDetails({ parsedData }) {
  if (!parsedData) return null;

  // Log parsedData to check structure for better debugging
  console.log("Parsed Data:", parsedData);

  // Function to safely extract the name, accounting for possible nested structures
  const getName = (data) => {
    const possibleNameFields = [
      "name",
      "fullName",
      "firstName",
      "lastName",
      "personalName",  // Sometimes 'personalName' could be used
    ];

    for (let field of possibleNameFields) {
      if (data[field]) {
        // If it's an object (e.g. { firstName: "John", lastName: "Doe" })
        if (typeof data[field] === "object") {
          if (data[field].firstName && data[field].lastName) {
            return `${data[field].firstName} ${data[field].lastName}`;
          }
          return `${data[field].firstName || ""} ${data[field].lastName || ""}`.trim();
        }

        // If it's a string (e.g. "John Doe")
        if (typeof data[field] === "string") {
          return data[field];
        }
      }
    }

    return null;
  };

  const name = getName(parsedData);

  // Check if name is found and log
  if (name) {
    console.log("Parsed Name:", name);
  } else {
    console.warn("No valid 'name' field found in parsed data. Possible missing or malformed data!");
  }

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

  // Get the resume score
  const { totalScore, breakdown } = scoreResume(parsedData);

  return (
    <section className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Parsed Resume Details</h3>

      <div className="space-y-5 text-gray-700">
        <div>
          <strong className="text-gray-800">Name:</strong>{" "}
          <span>
            {name ? (
              name
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

        {/* Display the score breakdown */}
        <div className="mt-4">
          <strong className="text-gray-800">Resume Score:</strong>
          <p className="text-xl font-bold text-blue-600">{totalScore} / 100</p>
          <div className="mt-2">
            <p className="font-semibold text-gray-800">Breakdown:</p>
            <ul className="space-y-2">
              {Object.entries(breakdown).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-medium text-gray-700 capitalize">{key}:</span>
                  <span>{value} / {key === 'certifications' ? '10' : key === 'education' ? '20' : '30'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
