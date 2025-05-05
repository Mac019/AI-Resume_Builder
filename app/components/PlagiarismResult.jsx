"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react"; // Optional: For icons

export default function PlagiarismResult({ textToCheck }) {
  const [plagiarismResult, setPlagiarismResult] = useState(null);

  useEffect(() => {
    if (!textToCheck) return;

    // Simulate API check
    setTimeout(() => {
      const mockSimilarityScore = Math.random() * 100;
      const mockMatches = [
        "Match 1: User has worked as a Front-End Web Developer at Efilia Technologies, specializing in ReactJS and Tailwind CSS.",
        "Match 2: User developed a React-based app for booking rooms in scenic mountain locations with a responsive interface.",
        "Match 3: Experience as a guitarist and bass player in Firodiya Karandak, enhancing performance impact.",
        "Match 4: Makarand Jagadale is passionate about creating user-centric applications, specializing in ReactJS and NodeJS.",
      ];

      setPlagiarismResult({
        similarity: Math.round(mockSimilarityScore),
        matches: mockMatches,
      });
    }, 1000);
  }, [textToCheck]);

  if (!plagiarismResult) {
    return (
      <div className="flex items-center gap-2 text-blue-600 font-medium animate-pulse">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        Checking for plagiarism...
      </div>
    );
  }

  const { similarity, matches } = plagiarismResult;
  const color =
    similarity < 30
      ? "bg-green-500"
      : similarity < 70
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-2xl">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        {similarity < 50 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <AlertTriangle className="text-red-500" />
        )}
        Plagiarism Check Result
      </h3>

      <div className="mb-4">
        <p className="text-gray-600 font-medium mb-2">Similarity Score:</p>
        <div className="relative w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className={`h-full ${color}`}
            style={{ width: `${similarity}%` }}
          ></div>
          <span className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-white">
            {similarity}%
          </span>
        </div>
      </div>

      {matches.length > 0 ? (
        <div>
          <p className="text-gray-600 font-medium mb-2">Matched Content:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            {matches.map((match, index) => (
              <li key={index} className="bg-gray-50 px-3 py-2 rounded-md border">
                {match}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 italic">No matched content found.</p>
      )}
    </section>
  );
}
