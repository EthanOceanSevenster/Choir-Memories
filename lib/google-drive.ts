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

async function findOrCreateFolder(
  token: string,
  folderName: string,
  parentId: string
): Promise<string> {
  const query = `name='${folderName.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      console.log("[google-drive] Found existing folder:", folderName, data.files[0].id);
      return data.files[0].id;
    }
  }

  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error("[google-drive] Folder creation failed:", createRes.status, err);
    throw new Error(`Failed to create folder (${createRes.status}): ${err}`);
  }

  const folder = await createRes.json();
  console.log("[google-drive] Created new folder:", folderName, folder.id);
  return folder.id;
}

export async function initResumableUpload(
  fileName: string,
  mimeType: string,
  fileSize: number,
  userName?: string
): Promise<string> {
  const token = await getAccessToken();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;

  let targetFolderId = rootFolderId;
  if (userName) {
    targetFolderId = await findOrCreateFolder(token, userName, rootFolderId);
  }

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
        parents: [targetFolderId],
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
