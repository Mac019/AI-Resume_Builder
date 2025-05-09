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
  const [score, setScore] = useState(0);
  const [interviewFinished, setInterviewFinished] = useState(false);

  useEffect(() => {
    if (domain) {
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
        ],
        Instrumentation: [
          "What is the role of a sensor in an instrumentation system?",
          "Explain the working of a thermocouple.",
          "What is PID control in instrumentation?",
          "What are the different types of signals used in instrumentation systems?"
        ]
      };
      setQuestions(mockQuestions[domain] || []);
    }
  }, [domain]);

  const getKeywords = (question) => {
    const map = {
      'React': {
        "What are hooks in React?": ["hooks", "function component", "state", "effect"],
        "Explain the virtual DOM.": ["virtual DOM", "diffing", "efficient", "re-render"],
        "What is the use of useEffect?": ["side effects", "fetch", "cleanup"]
      },
      'Node.js': {
        "What is middleware in Express?": ["middleware", "request", "response", "next"],
        "Explain event-driven architecture in Node.": ["event", "asynchronous", "callback", "non-blocking"]
      },
      'Full-Stack': {
        "How do frontend and backend communicate?": ["API", "HTTP", "request", "response"],
        "What is REST API?": ["REST", "HTTP", "GET", "POST", "resource"]
      },
      'MongoDB': {
        "Difference between MongoDB and SQL databases?": ["NoSQL", "schema-less", "document", "relational"],
        "Explain schema design in MongoDB.": ["schema", "embedded", "referenced", "design"]
      },
      'Instrumentation': {
        "What is the role of a sensor in an instrumentation system?": ["sensor", "measurement", "data", "control"],
        "Explain the working of a thermocouple.": ["thermocouple", "temperature", "voltage", "junction"],
        "What is PID control in instrumentation?": ["PID", "control", "proportional", "integral", "derivative"],
        "What are the different types of signals used in instrumentation systems?": ["signals", "analog", "digital", "current", "voltage"]
      }
    };

    return map[domain]?.[questions[questionIndex]] || [];
  };

  const evaluateAnswer = (answerText) => {
    const keywords = getKeywords();
    const normalizedAnswer = answerText.toLowerCase();
    let matchedKeywords = 0;

    keywords.forEach(kw => {
      if (normalizedAnswer.includes(kw.toLowerCase())) {
        matchedKeywords += 1;
      }
    });

    return Math.round((matchedKeywords / keywords.length) * 100);
  };

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
      const currentScore = evaluateAnswer(transcript);
      setScore(prev => prev + currentScore);
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
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(prev => prev + 1);
      setAnswer('');
    } else {
      setInterviewFinished(true);
    }
  };

  const currentQuestion = questions[questionIndex];

  return (
    <main className="p-6 max-w-3xl mx-auto min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">AI Interview - {domain}</h1>

      {interviewFinished ? (
        <div className="text-2xl font-semibold text-green-700 bg-green-100 p-4 rounded shadow">
          🎉 Interview Finished! <br />
          Your total score: <strong>{score}</strong> / {questions.length * 100}
        </div>
      ) : currentQuestion ? (
        <>
          <div className="bg-white p-6 rounded shadow mb-6">
            <p className="text-lg font-semibold text-gray-800">Question {questionIndex + 1} of {questions.length}:</p>
            <p className="mt-2 text-gray-700">{currentQuestion}</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={startListening}
              className={`px-6 py-2 rounded font-medium shadow-md transition ${
                isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isListening ? '🎤 Listening...' : '🎙️ Answer with Voice'}
            </button>

            <button
              onClick={handleNextQuestion}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium shadow-md"
            >
              {questionIndex + 1 < questions.length ? 'Next Question ➡️' : 'Finish Interview ✅'}
            </button>
          </div>

          {answer && (
            <div className="bg-white border-l-4 border-indigo-500 p-4 rounded shadow mb-4">
              <p className="text-sm text-gray-600 font-semibold mb-1">Your Answer:</p>
              <p className="text-gray-800">{answer}</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-center">🔄 Loading questions for <strong>{domain}</strong>...</p>
      )}
    </main>
  );
};

export default Interview;
