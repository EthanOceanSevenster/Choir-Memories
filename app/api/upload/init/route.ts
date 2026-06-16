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
    console.log("[upload/init] Starting upload:", { fileName, mimeType, fileSize });
    console.log("[upload/init] Env check:", {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
      hasFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
    });
    const sessionUri = await initResumableUpload(fileName, mimeType, fileSize);
    console.log("[upload/init] Success, got session URI");
    return NextResponse.json({ sessionUri });
  } catch (error) {
    console.error("[upload/init] Failed:", error instanceof Error ? error.message : error);
    console.error("[upload/init] Stack:", error instanceof Error ? error.stack : "no stack");
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload initiation failed" },
      { status: 500 }
    );
  }
}
