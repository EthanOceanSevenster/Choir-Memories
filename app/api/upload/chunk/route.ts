import { NextRequest, NextResponse } from "next/server";
import { hasValidAccess } from "@/lib/access";

export async function PUT(request: NextRequest) {
  if (!(await hasValidAccess())) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const sessionUri = request.headers.get("x-session-uri");
  const contentRange = request.headers.get("x-content-range");

  if (!sessionUri || !contentRange) {
    return NextResponse.json(
      { error: "Missing session URI or content range" },
      { status: 400 }
    );
  }

  const chunk = await request.arrayBuffer();

  const response = await fetch(sessionUri, {
    method: "PUT",
    headers: {
      "Content-Length": String(chunk.byteLength),
      "Content-Range": contentRange,
    },
    body: chunk,
  });

  if (response.status === 308) {
    return NextResponse.json({ status: "incomplete" });
  }

  if (response.status === 200 || response.status === 201) {
    const data = await response.json();
    return NextResponse.json({ status: "complete", fileId: data.id });
  }

  const errorText = await response.text();
  return NextResponse.json({ error: errorText }, { status: response.status });
}
