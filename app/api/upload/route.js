// File: /app/api/upload/route.js
import { scoreResume } from "../../lib/scoreResume";
import { checkATSFormatting } from "../../lib/atsChecker";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Disable Next.js built-in body parser so we can handle formData
export const config = {
  api: { bodyParser: false },
};

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

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    console.log("[upload] uploadDir ensured:", uploadDir);

    // Write the uploaded file
    const filePath = path.join(uploadDir, file.name);
    console.log("[upload] writing file to:", filePath);
    await writeFile(filePath, buffer);

    // Parse PDF if it's a PDF, using dynamic require to avoid webpack bundling test data
    let parsedData = null;
    if (file.type === "application/pdf") {
      console.log("[upload] parsing PDF");
      parsedData = await parsePdf(buffer);
    }

    let resumeScore = null;
    let atsWarnings = null;
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
      atsWarnings, // ← add this
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
    // Dynamically load pdf-parse to avoid webpack test data bundling
    const pdfParse = eval('require')('pdf-parse');
    const data = await pdfParse(buffer);
    const text = data.text;

    // Normalize text
    const cleanedText = text.replace(/\r\n|\r/g, "\n").replace(/\n{2,}/g, "\n\n");

    // Emails
    const emails = cleanedText.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}/gi) || [];

    // Extract name as line before email
    let name = "Not Found";
    if (emails.length > 0) {
      const lines = cleanedText.split("\n");
      const emailLineIndex = lines.findIndex(line => line.includes(emails[0]));
      if (emailLineIndex > 0) {
        name = lines[emailLineIndex - 1].trim(); // line before email
        // Optional: If that line is city (like 'pune, maharashtra'), go one more up
        const lowerName = name.toLowerCase();
        if (lowerName.includes("pune") || lowerName.includes("maharashtra") || lowerName.includes("pimpri-chinchwad")) {
          name = lines[emailLineIndex - 2]?.trim() || name;
        }
      }
    }

    // Section extractor
    const extractSection = (label) => {
      const pattern = new RegExp(`${label}\\n([\\s\\S]*?)(\\n[A-Z ]{3,}|$)`, "i");
      const match = cleanedText.match(pattern);
      return match ? match[1].trim().split("\n").filter(Boolean) : [];
    };

    const education = extractSection("EDUCATION");
    const experience = extractSection("EXPERIENCE");
    const skills = extractSection("SKILLS");
    const projects = extractSection("PROJECTS");

    return {
      name,
      emails,
      education,
      experience,
      skills,
      projects,
      text: cleanedText,
    };
  } catch (err) {
    console.error("PDF parse error:", err);
    return {};
  }
}