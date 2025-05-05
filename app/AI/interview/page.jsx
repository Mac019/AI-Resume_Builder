'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Interview = () => {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain');

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (domain) {
      // Mocked domain-wise questions (replace this with actual AI response later)
      const mockQuestions = {
        React: [
          "What are hooks in React?",
          "Explain the virtual DOM.",
          "What is the use of useEffect?"
        ],
        'Node.js': [
          "What is middleware in Express?",
          "Explain event-driven architecture in Node.",
        ],
        'Full-Stack': [
          "How do frontend and backend communicate?",
          "What is REST API?",
        ],
        MongoDB: [
          "Difference between MongoDB and SQL databases?",
          "Explain schema design in MongoDB."
        ]
      };
      setQuestions(mockQuestions[domain] || []);
    }
  }, [domain]);

  // Speech Recognition Setup
  let recognition;
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      setIsListening(false);
    };

    recognition.onerror = (err) => {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    };
  }

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setAnswer('');
      recognition.start();
    } else {
      alert('Speech Recognition not supported in this browser.');
    }
  };

  const handleNextQuestion = () => {
    setAnswer('');
    setQuestionIndex((prev) => prev + 1);
  };

  const currentQuestion = questions[questionIndex];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Interview - {domain}</h1>

      {currentQuestion ? (
        <>
          <div className="bg-gray-100 p-4 rounded mb-4 shadow">
            <p className="text-lg font-medium">Q{questionIndex + 1}: {currentQuestion}</p>
          </div>

          <button
            onClick={startListening}
            className={`mb-4 px-6 py-2 rounded text-white ${isListening ? 'bg-red-600' : 'bg-blue-600'}`}
          >
            {isListening ? 'Listening...' : 'Answer with Voice'}
          </button>

          {answer && (
            <div className="bg-white border p-4 rounded shadow mb-4">
              <p className="text-sm text-gray-600">Your Answer:</p>
              <p className="mt-1">{answer}</p>
            </div>
          )}

          <button
            onClick={handleNextQuestion}
            disabled={questionIndex + 1 >= questions.length}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next Question
          </button>
        </>
      ) : (
        <p>Loading questions for {domain}...</p>
      )}
    </main>
  );
};

export default Interview;
