import { cookies } from "next/headers";
import { UploadZone } from "@/components/upload-zone";
import { QrScanner } from "@/components/qr-scanner";

export default async function Home() {
  const accessToken = process.env.ACCESS_TOKEN;
  const cookieStore = await cookies();
  const COOKIE_NAME = "choir-access";

  const hasAccess =
    !accessToken || cookieStore.get(COOKIE_NAME)?.value === accessToken;

  if (!hasAccess) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-4 py-10">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Cross icon with glow */}
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

  return (
    <main className="flex flex-1 flex-col items-center p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold-glow)] ring-1 ring-[var(--color-gold)]/30">
            <svg className="h-7 w-7 text-[var(--color-gold)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Choir Memories</h1>
          <p className="mt-1 text-sm text-white/40">
            Share your photos from our blessed moments
          </p>
        </div>

        {/* Upload card */}
        <div className="rounded-2xl bg-[var(--color-card)] p-5 ring-1 ring-white/5">
          <UploadZone />
        </div>

        <p className="text-center text-xs text-white/20 italic">
          &ldquo;Sing to the Lord a new song&rdquo; &mdash; Psalm 96:1
        </p>
      </div>
    </main>
  );
}
