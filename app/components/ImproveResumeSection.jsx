// app/components/ImproveResumeSection.jsx

export default function ImproveResumeSection() {
    return (
      <section className="relative bg-[#1C1279] py-16 px-6 text-white overflow-hidden">
        {/* Wavy Top */}
        <div className="absolute top-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 320"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#E5E7FF"
              fillOpacity="1"
              d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,186.7C840,181,960,139,1080,133.3C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>
  
        {/* Main Content */}
        <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://imgs.search.brave.com/qAGbj9CUAFJ9IZhNQITDHlT0rLgoqIU-AcaKAUJ6B8c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aGlz/cmVzdW1lZG9lc25v/dGV4aXN0LmNvbS9k/YXRhL2JpbGwtZ2F0/ZXMvcmVzdW1lLnBu/Zw" // Replace with your image path
              alt="Resume preview"
              className="w-72 md:w-96"
            />
          </div>
  
          {/* Text */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Enhance your resume with AI feedback
            </h2>
            <p className="text-md md:text-lg text-gray-300 mb-4 leading-relaxed">
              Don’t know where to start? We offer 250+ proven bullet points and
              resume lines from top industries. Use our templates and samples to
              quickly draft a professional, ATS-ready resume.
            </p>
            <p className="text-md md:text-lg text-gray-300 leading-relaxed">
              Upload your resume and get AI-powered, line-by-line feedback to help
              you land more interviews. Improve each section with smart suggestions.
            </p>
          </div>
        </div>
      </section>
    );
  }
  