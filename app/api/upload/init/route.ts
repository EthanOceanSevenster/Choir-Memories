import { NextRequest, NextResponse } from "next/server";
import { initResumableUpload } from "@/lib/google-drive";
import { hasValidAccess } from "@/lib/access";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: NextRequest) {
  if (!(await hasValidAccess())) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { fileName, mimeType, fileSize } = await request.json();

  if (!fileName || !mimeType || !fileSize) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!mimeType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only images are allowed" },
      { status: 400 }
    );
  }

  if (fileSize > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 20MB)" },
      { status: 400 }
    );
  }

  try {
    const sessionUri = await initResumableUpload(fileName, mimeType, fileSize);
    return NextResponse.json({ sessionUri });
  } catch (error) {
    console.error("Failed to init upload:", error);
    return NextResponse.json(
      { error: "Upload initiation failed" },
      { status: 500 }
    );
  }
}
