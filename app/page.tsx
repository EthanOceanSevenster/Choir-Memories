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
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Cross icon */}
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/80 ring-4 ring-amber-50">
            <svg className="h-8 w-8 text-amber-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 2a1 1 0 0 1 2 0v7h7a1 1 0 1 1 0 2h-7v11a1 1 0 1 1-2 0V11H4a1 1 0 1 1 0-2h7V2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Welcome, Blessed One</h1>
          <p className="text-sm text-stone-500">
            Scan the QR code to enter our choir photo album.
          </p>
        </div>
        <div className="w-full max-w-md mt-4">
          <QrScanner />
        </div>
        <p className="mt-8 text-center text-xs text-stone-400 italic">
          &ldquo;Make a joyful noise unto the Lord&rdquo; &mdash; Psalm 100:1
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          {/* Dove / music icon */}
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/80 ring-4 ring-amber-50">
            <svg className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Choir Memories</h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Share your photos from our blessed moments together
          </p>
        </div>
        <UploadZone />
        <p className="text-center text-xs text-stone-400 italic">
          &ldquo;Sing to the Lord a new song&rdquo; &mdash; Psalm 96:1
        </p>
      </div>
    </main>
  );
}
