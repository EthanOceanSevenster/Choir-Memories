import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const token = process.env.ACCESS_TOKEN;
  const url = token ? `${baseUrl}/api/auth/grant?token=${token}` : baseUrl;

  const buffer = await QRCode.toBuffer(url, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
