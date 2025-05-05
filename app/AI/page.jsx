// pages/ai-interview/domain-selection.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DomainSelection() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const router = useRouter();

  const handleDomainSelect = () => {
    if (selectedDomain) {
      router.push(`/ai-interview/interview?domain=${selectedDomain}`);
    } else {
      alert('Please select a domain to proceed.');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Choose Your Interview Domain</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={() => setSelectedDomain('React')}>React</button>
        <button onClick={() => setSelectedDomain('Node.js')}>Node.js</button>
        <button onClick={() => setSelectedDomain('Full-Stack')}>Full-Stack</button>
        <button onClick={() => setSelectedDomain('MongoDB')}>MongoDB</button>
        <button onClick={handleDomainSelect} style={{ marginTop: '2rem' }}>
          Start Interview for {selectedDomain || 'a domain'}
        </button>
      </div>
    </main>
  );
}
