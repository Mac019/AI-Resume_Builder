'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DomainSelection = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const router = useRouter();

  const handleDomainSelect = () => {
    if (selectedDomain) {
      // Redirect to AI Interview page with the selected domain
      router.push(`/ai-interview/interview?domain=${selectedDomain}`);
    } else {
      alert("Please select a domain to proceed.");
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Choose Your Interview Domain</h1>

      <div className="space-y-4">
        <button className="w-full bg-blue-600 text-white p-4 rounded" onClick={() => setSelectedDomain('React')}>React</button>
        <button className="w-full bg-green-600 text-white p-4 rounded" onClick={() => setSelectedDomain('Node.js')}>Node.js</button>
        <button className="w-full bg-purple-600 text-white p-4 rounded" onClick={() => setSelectedDomain('Full-Stack')}>Full-Stack</button>
        <button className="w-full bg-yellow-600 text-white p-4 rounded" onClick={() => setSelectedDomain('MongoDB')}>MongoDB</button>

        <div className="mt-6">
          <button
            className="w-full bg-gray-700 text-white p-4 rounded"
            onClick={handleDomainSelect}
          >
            Start Interview for {selectedDomain || "a domain"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default DomainSelection;