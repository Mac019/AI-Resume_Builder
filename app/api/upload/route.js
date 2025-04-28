// /app/api/upload/route.js

import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("resume");

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadPath = path.join(process.cwd(), "public", "uploads", file.name);

  try {
    await writeFile(uploadPath, buffer);
    return NextResponse.json({ success: true, filename: file.name });
  } catch (error) {
    console.error("Error writing file:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
  }
}
