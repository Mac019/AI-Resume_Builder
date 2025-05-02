// File: /app/api/upload/route.js

import { scoreResume } from "../../lib/scoreResume";
import { checkATSFormatting } from "../../lib/atsChecker";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Disable Next.js built-in body parser so we can handle formData
export const config = { api: { bodyParser: false } };

export async function POST(request) {
  console.log("[upload] POST called");
  try {
    const form = await request.formData();
    const file = form.get("resume");
    console.log("[upload] file received:", file?.name, file?.type);

    if (!file || typeof file === "string" || !file.name) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing file upload." },
        { status: 400 }
      );
    }

    // write the uploaded file
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, file.name);
    console.log("[upload] writing file to:", filePath);
    await writeFile(filePath, buffer);

    // parse & process
    let parsedData = null;
    if (file.type === "application/pdf") {
      console.log("[upload] parsing PDF");
      parsedData = await parsePdf(buffer);
    }

    let resumeScore = null, atsWarnings = null;
    if (parsedData) {
      console.log("[upload] scoring resume");
      resumeScore = scoreResume(parsedData);
      console.log("[upload] resume score:", resumeScore);

      console.log("[upload] checking ATS formatting");
      atsWarnings = checkATSFormatting(parsedData.text || "");
      console.log("[upload] ATS warnings:", atsWarnings);
    }

    console.log("[upload] success: returning response");
    return NextResponse.json({
      success: true,
      filename: file.name,
      parsedData,
      resumeScore,
      atsWarnings,
    });

  } catch (error) {
    console.error("[upload] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed." },
      { status: 500 }
    );
  }
}

async function parsePdf(buffer) {
  try {
    const pdfParse = eval('require')('pdf-parse');
    const data = await pdfParse(buffer);

    const text = data.text || "";
    const cleanedText = text.replace(/\r\n|\r/g, "\n").replace(/\n{2,}/g, "\n\n");

    // Extract emails
    const emails = cleanedText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/gi) || [];

    // Extract name: line before first email
    let name = "Not Found";
    if (emails.length) {
      const lines = cleanedText.split("\n");
      const idx = lines.findIndex(l => l.includes(emails[0]));
      if (idx > 0) name = lines[idx - 1].trim();
    }

    // utility: extract a section by its uppercase heading
    const extractSection = label => {
      const re = new RegExp(`${label}\\n([\\s\\S]*?)(\\n[A-Z ]{3,}|$)`, "i");
      const m = cleanedText.match(re);
      return m ? m[1].trim().split("\n").filter(Boolean) : [];
    };

    // **NEW** super-clean skills extractor
    const cleanSkills = rawLines => {
      return rawLines
        // 1. drop the "Programming languages" prefix if present
        .map(line => line.replace(/.*Programming languages[:\-]*/i, ""))
        // 2. split on comma / semicolon / bullet / slash
        .flatMap(line => line.split(/[,;•\/]/g))
        // 3. strip out any leftover non-word characters (but keep + . #)
        .map(s => s.replace(/[^a-zA-Z0-9.+#]/g, "").trim())
        // 4. to lowercase for uniform comparison
        .map(s => s.toLowerCase())
        // 5. drop empty, drop "programming" itself if it survives
        .filter(s => s && s !== "programming")
        // 6. dedupe
        .filter((v, i, a) => a.indexOf(v) === i)
        // 7. capitalize first letter
        .map(s => s.charAt(0).toUpperCase() + s.slice(1));
    };

    // Extract & clean
    const rawSkills = extractSection("SKILLS");
    const skills = cleanSkills(rawSkills);

    // Fix: Replace 'Postgressql' with 'PostgreSQL'
    const fixedSkills = skills.map(s => s.replace('Postgressql', 'PostgreSQL'));
    console.log("[upload] final cleaned skills:", fixedSkills);

    return {
      name,
      emails,
      education: extractSection("EDUCATION"),
      experience: extractSection("EXPERIENCE"),
      skills: fixedSkills, // Use the fixed skills list
      projects: extractSection("PROJECTS"),
      text: cleanedText,
    };
  } catch (err) {
    console.error("PDF parse error:", err);
    return {
      name: "Parsing failed",
      emails: [],
      education: [],
      experience: [],
      skills: [],
      projects: [],
      text: "",
      error: "Could not parse the uploaded PDF.",
    };
  }
}