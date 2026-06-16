import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "choir-access";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const accessToken = process.env.ACCESS_TOKEN;

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  if (!token || !accessToken || token !== accessToken) {
    return NextResponse.redirect(new URL("/", origin));
  }

  const response = NextResponse.redirect(new URL("/", origin));
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
