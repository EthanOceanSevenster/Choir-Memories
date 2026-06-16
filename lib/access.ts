import { cookies } from "next/headers";

const COOKIE_NAME = "choir-access";

export async function hasValidAccess(): Promise<boolean> {
  const token = process.env.ACCESS_TOKEN;
  if (!token) return true; // No token configured = open access

  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === token;
}

export function getAccessToken(): string {
  return process.env.ACCESS_TOKEN || "";
}
