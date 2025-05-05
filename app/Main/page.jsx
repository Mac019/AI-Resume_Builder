import AuthButton from "../components/AuthButton";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ImproveResumeSection from "../components/ImproveResumeSection";
import DashboardPage from "../dashboard/page";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140065] to-[#0B0B3B] text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
s
      {/* Visual Section / Resume Score Card */}
      <section className="mt-12 px-8">
      <DashboardPage/>
        <Footer />
      </section>
    </div>
  );
}
