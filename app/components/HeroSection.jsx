// HeroSection.jsx
'use client'
import React, { useState } from "react";

const HeroSection = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#140065] to-[#0B0B3B] text-white px-8 py-16 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Text section */}
        <div>
          <h2 className="text-4xl font-bold mb-6">
            Improve your resume and <br /> LinkedIn profile
          </h2>
          <p className="mb-6 text-lg leading-relaxed">
            Designed by top recruiters, our AI-powered platform instantly gives
            you tailored feedback on your resume and LinkedIn profile.
          </p>
          <p className="mb-6 text-lg">
            Land 5x more interviews, opportunities and job offers.
          </p>
          <div className="flex gap-4">
            <button
              className="bg-white text-[#0B0B3B] px-6 py-3 rounded-md font-semibold"
              onClick={() => setShowPopup(true)}
            >
              Get Started
            </button>
            <button className="border border-white px-6 py-3 rounded-md font-semibold">
              Login
            </button>
          </div>
        </div>

        {/* Image mockup */}
        <div className="bg-white rounded-lg shadow-md p-4">
  <img
    src="https://resumeworded.com/assets/images/updated-homepage-sketch.png"
    alt="Resume Analysis"
    className="w-full h-auto rounded"
  />
</div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg w-[90%] max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">About This App</h2>
            <p className="mb-4">
              This AI-powered platform gives tailored resume and LinkedIn feedback to help you land more interviews and job offers.
            </p>
            <button
              className="bg-[#0B0B3B] text-white px-4 py-2 rounded-md"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
