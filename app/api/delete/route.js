import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { filename } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    await unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
