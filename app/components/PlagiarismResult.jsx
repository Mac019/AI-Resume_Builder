"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function PlagiarismResult({ textToCheck }) {
  const [plagiarismResult, setPlagiarismResult] = useState(null);

  useEffect(() => {
    if (!textToCheck) return;

    // Generate a random score between 15% and 50%
    setTimeout(() => {
      const similarity = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
      setPlagiarismResult({ similarity });
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

  const { similarity } = plagiarismResult;
  const color =
    similarity < 30
      ? "bg-green-500"
      : similarity < 40
      ? "bg-yellow-500"
      : "bg-orange-500";

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-2xl">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        {similarity < 40 ? (
          <CheckCircle className="text-green-500" />
        ) : (
          <AlertTriangle className="text-orange-500" />
        )}
        Plagiarism Check Result
      </h3>

      <div>
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
    </section>
  );
}
