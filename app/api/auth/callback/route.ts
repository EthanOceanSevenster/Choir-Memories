import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );

  const { tokens } = await oauth2Client.getToken(code);

  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Auth Success</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px;">
        <h1>Authorization Successful!</h1>
        <p>Copy this refresh token and add it to your <code>.env.local</code> file as <code>GOOGLE_REFRESH_TOKEN</code>:</p>
        <textarea readonly style="width: 100%; height: 100px; font-family: monospace; font-size: 12px;">${tokens.refresh_token}</textarea>
        <p style="color: #666; margin-top: 16px;">After adding it, restart your dev server. You can then delete these auth routes.</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
