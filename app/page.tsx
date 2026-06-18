import { cookies } from "next/headers";
import { QrScanner } from "@/components/qr-scanner";
import { UploadPage } from "@/components/upload-page";

export default async function Home() {
  const accessToken = process.env.ACCESS_TOKEN;
  const cookieStore = await cookies();

  const hasAccess =
    !accessToken || cookieStore.get("choir-access")?.value === accessToken;

  if (!hasAccess) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-4 py-10">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-gold-glow)] ring-1 ring-[var(--color-gold)]/30">
            <svg className="h-9 w-9 text-[var(--color-gold)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 2a1 1 0 0 1 2 0v7h7a1 1 0 1 1 0 2h-7v11a1 1 0 1 1-2 0V11H4a1 1 0 1 1 0-2h7V2z" />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">Welcome</h1>
            <p className="mt-2 text-sm text-white/50">
              Scan the QR code to access our choir photo album
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mt-6">
          <QrScanner />
        </div>

        <p className="mt-10 text-center text-xs text-white/25 italic">
          &ldquo;Make a joyful noise unto the Lord&rdquo; &mdash; Psalm 100:1
        </p>
      </main>
    );
  }

  const userName = cookieStore.get("choir-user-name")?.value || null;

  return <UploadPage initialName={userName} />;
}
