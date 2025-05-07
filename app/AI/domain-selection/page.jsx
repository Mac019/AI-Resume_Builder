'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const DomainSelection = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const router = useRouter();

  const handleDomainSelect = () => {
    if (selectedDomain) {
      router.push(`/ai-interview/interview?domain=${selectedDomain}`);
    } else {
      alert("Please select a domain to proceed.");
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Choose Your Interview Domain</h1>

      {/* Software Development Domains */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Software Domains</h2>
      <div className="space-y-4">
        <button className="w-full bg-blue-600 text-white p-4 rounded" onClick={() => setSelectedDomain('React')}>React</button>
        <button className="w-full bg-green-600 text-white p-4 rounded" onClick={() => setSelectedDomain('Node.js')}>Node.js</button>
        <button className="w-full bg-purple-600 text-white p-4 rounded" onClick={() => setSelectedDomain('Full-Stack')}>Full-Stack</button>
        <button className="w-full bg-yellow-600 text-white p-4 rounded" onClick={() => setSelectedDomain('MongoDB')}>MongoDB</button>
      </div>

      {/* Core Engineering Domains */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Core Domains</h2>
      <div className="space-y-4">
        <button className="w-full bg-red-600 text-white p-4 rounded" onClick={() => setSelectedDomain('Instrumentation')}>Instrumentation</button>
      </div>

      <div className="mt-6">
        <button
          className="w-full bg-gray-700 text-white p-4 rounded"
          onClick={handleDomainSelect}
        >
          Start Interview for {selectedDomain || "a domain"}
        </button>
      </div>
    </main>
  );
};

export default DomainSelection;
