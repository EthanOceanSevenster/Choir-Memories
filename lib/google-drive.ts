let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
    return cachedToken.access_token;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[google-drive] Token refresh failed:", res.status, err);
    throw new Error(`Token refresh failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  console.log("[google-drive] Token refreshed successfully");
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.access_token;
}

export async function initResumableUpload(
  fileName: string,
  mimeType: string,
  fileSize: number
): Promise<string> {
  const token = await getAccessToken();

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mimeType,
        "X-Upload-Content-Length": String(fileSize),
      },
      body: JSON.stringify({
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("[google-drive] Drive API error:", response.status, error);
    throw new Error(`Failed to initiate upload (${response.status}): ${error}`);
  }

  const sessionUri = response.headers.get("Location");
  if (!sessionUri) {
    throw new Error("No session URI returned from Google Drive");
  }

  return sessionUri;
}
