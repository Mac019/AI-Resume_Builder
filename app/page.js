import AuthButton from "../app/components/AuthButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Resume Builder</h1>
      <p className="text-lg mb-8 text-center">
        Build smarter, unbiased, ATS-friendly resumes using AI!
      </p>

      <AuthButton />
    </main>
  );
}
