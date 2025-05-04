"use client";
import React, { useState, useEffect } from "react";

export default function PlagiarismResult({ textToCheck }) {
  const [plagiarismResult, setPlagiarismResult] = useState(null);

  useEffect(() => {
    console.log("Text to check:", textToCheck); // Log the text to ensure it's passed correctly
    if (!textToCheck) return;

    // Mock Plagiarism Checking (Simulating a similarity score)
    setTimeout(() => {
      const mockSimilarityScore = Math.random() * 100; // Generate a random similarity score (0 to 100)
      const mockMatches = [
        "Match 1: Example content from a source",
        "Match 2: Another example match found",
      ]; // Simulating matched content

      setPlagiarismResult({
        similarity: Math.round(mockSimilarityScore),
        matches: mockMatches,
      });
    }, 1000); // Simulate a delay (like an API call)
  }, [textToCheck]);

  if (!plagiarismResult) return <div>Checking plagiarism...</div>; // Show loading text

  const { similarity, matches } = plagiarismResult;

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Plagiarism Check Result</h3>
      <div className="bg-gray-100 p-4 rounded shadow">
        <strong>Similarity Score:</strong> {similarity}% 
      </div>

      {matches.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-lg font-medium mb-1">Matched Content:</h4>
          <ul className="list-disc pl-6">
            {matches.map((match, index) => (
              <li key={index}>{match}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-2">No matched content found.</p>
      )}
    </section>
  );
}
