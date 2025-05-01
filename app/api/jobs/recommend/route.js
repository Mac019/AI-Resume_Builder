import { NextResponse } from "next/server";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const rawSkills = searchParams.get("skills") || "";
  const skills = rawSkills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  console.log("[API] Raw skills from query:", rawSkills);
  console.log("[API] Parsed skills:", skills);

  const query = skills.join("-").toLowerCase() + "-jobs";
  const url = `https://www.naukri.com/${query}`;

  let jobs = [];

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      },
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    $(".jobTuple").each((i, el) => {
      if (jobs.length >= 10) return;

      const title = $(el).find(".title").text().trim();
      const company = $(el).find(".companyInfo .subTitle").text().trim();
      const location = $(el).find(".location .ellipsis").text().trim();
      const link = $(el).find("a.title").attr("href");

      if (title && company && location && link) {
        jobs.push({ title, company, location, link });
      }
    });
  } catch (err) {
    console.error("[API] Error fetching or parsing Naukri HTML:", err);
  }

  console.log("[API] Jobs to return:", jobs);
  return NextResponse.json({ jobs });
}
