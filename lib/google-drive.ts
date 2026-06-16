import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export async function initResumableUpload(
  fileName: string,
  mimeType: string,
  fileSize: number
): Promise<string> {
  const { token } = await oauth2Client.getAccessToken();

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
    throw new Error(`Failed to initiate upload: ${error}`);
  }

  const sessionUri = response.headers.get("Location");
  if (!sessionUri) {
    throw new Error("No session URI returned from Google Drive");
  }

  return sessionUri;
}
