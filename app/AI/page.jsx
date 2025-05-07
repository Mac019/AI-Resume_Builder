'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DomainSelection() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const router = useRouter();

  const handleDomainSelect = () => {
    if (selectedDomain) {
      router.push(`/AI/interview?domain=${selectedDomain}`);
    } else {
      alert('Please select a domain to proceed.');
    }
  };

  const domains = {
    'Software Domains': ['React', 'Node.js', 'Full-Stack', 'MongoDB'],
    'Core Domains': ['Instrumentation'],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140065] to-[#0B0B3B] text-white flex flex-col">
   
      <main className="flex-grow px-6 py-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Interview Domain</h1>

        {Object.entries(domains).map(([category, domainList]) => (
          <section key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {domainList.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    selectedDomain === domain
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-white text-black hover:bg-gray-200 border-gray-300'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center mt-10">
          <button
            onClick={handleDomainSelect}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-3 rounded-lg"
          >
            Start Interview {selectedDomain ? `for ${selectedDomain}` : ''}
          </button>
        </div>
      </main>
  
    </div>
  );
}
