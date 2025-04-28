// /app/api/uploads/route.js

import { readdir, stat } from "fs/promises";
import path from "path";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    const files = await readdir(uploadDir);

    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadDir, file);
        const fileStat = await stat(filePath);
        return {
          name: file,
          size: fileStat.size, // size in bytes
        };
      })
    );

    return NextResponse.json({ files: fileDetails });
  } catch (error) {
    console.error("Error reading files:", error);
    return NextResponse.json({ error: "Failed to read files" }, { status: 500 });
  }
}