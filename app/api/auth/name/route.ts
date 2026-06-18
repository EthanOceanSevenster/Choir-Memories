import { NextRequest, NextResponse } from "next/server";
import { hasValidAccess } from "@/lib/access";

export async function POST(request: NextRequest) {
  if (!(await hasValidAccess())) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { name } = await request.json();
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Valid name required" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("choir-user-name", name.trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
