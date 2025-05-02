import { NextResponse } from "next/server";

export async function GET(req) {
  // 1️⃣ Parse incoming skills
  const { searchParams } = new URL(req.url);
  const rawSkills = searchParams.get("skills") || "";
  console.log("[API] Raw skills from query:", rawSkills);

  const skills = rawSkills
    .split(",")
    .map((s) =>
      s
        .trim()
        .replace(/\.+$/g, "")      // strip trailing dots
        .toLowerCase()             // lowercase for comparison
    )
    .filter(Boolean);
  console.log("[API] Parsed skills array:", skills);

  // 2️⃣ Fetch all jobs (no category filter)
  const url = `https://www.themuse.com/api/public/jobs?page=1`;
  console.log("[API] Fetching all jobs from URL:", url);

  try {
    const response = await fetch(url);
    const result = await response.json();

    const totalFetched = (result.results || []).length;
    console.log("[API] Total jobs fetched:", totalFetched);

    // 3️⃣ Return all jobs without filtering
    const jobs = (result.results || []).map((job) => ({
      title: job.name,
      company: job.company.name,
      location: job.locations.map((loc) => loc.name).join(", "),
      link: job.refs?.landing_page,
    }));

    console.log("[API] Jobs to return:", jobs.length);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[API] Error fetching or parsing The Muse jobs:", error);
    return NextResponse.json(
      { jobs: [], error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }
}
