"use client";

import { useState } from "react";
import { NameForm } from "./name-form";
import { UploadZone } from "./upload-zone";

export function UploadPage({ initialName }: { initialName: string | null }) {
  const [userName, setUserName] = useState(initialName);

  if (!userName) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold-glow)] ring-1 ring-[var(--color-gold)]/30">
              <svg className="h-7 w-7 text-[var(--color-gold)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome!</h1>
            <p className="mt-1.5 text-sm text-white/40">
              Enter your name to start sharing photos
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--color-card)] p-5 ring-1 ring-white/5">
            <NameForm onComplete={setUserName} />
          </div>

          <p className="text-center text-xs text-white/20 italic">
            &ldquo;Make a joyful noise unto the Lord&rdquo; &mdash; Psalm 100:1
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center p-4 py-8">
      <div className="w-full max-w-md space-y-6">
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
            Welcome, <span className="text-[var(--color-gold)]">{userName}</span>
          </p>
        </div>

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
