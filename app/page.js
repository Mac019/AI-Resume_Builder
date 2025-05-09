import AuthButton from "../app/components/AuthButton";
import HeroSection from "../app/components/HeroSection";
import ImproveResumeSection from "../app/components/ImproveResumeSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140065] to-[#0B0B3B] text-white">


      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to AI Resume Builder
        </h1>

        <p className="text-lg max-w-2xl mb-8">
          Build smarter, unbiased, ATS-friendly resumes using AI!
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
  
        
        </div>
      </main>

      {/* Visual Section / Resume Score Card */}
      <section className="mt-12 px-8">
        <HeroSection />
        <ImproveResumeSection />
  
      </section>
    </div>
  );
}
