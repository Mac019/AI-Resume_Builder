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

    return map[domain]?.[currentQuestion] || [];
  };

  const evaluateAnswer = (answerText) => {
    const keywords = getKeywords(currentQuestion);
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
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Interview - {domain}</h1>

      {interviewFinished ? (
        <div className="text-xl font-semibold text-green-700">
          Interview Finished! Your total score: {score} / {questions.length * 100}
        </div>
      ) : currentQuestion ? (
        <>
          <div className="bg-white p-4 rounded mb-4 shadow-lg">
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
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {questionIndex + 1 < questions.length ? 'Next Question' : 'Finish Interview'}
          </button>
        </>
      ) : (
        <p>Loading questions for {domain}...</p>
      )}
    </main>
  );
};

export default Interview;
