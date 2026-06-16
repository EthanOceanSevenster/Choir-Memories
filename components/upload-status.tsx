"use client";

interface UploadStatusProps {
  total: number;
  completed: number;
  errors: number;
}

export function UploadStatus({ total, completed, errors }: UploadStatusProps) {
  if (total === 0) return null;

  const allDone = completed + errors === total;

  if (allDone && errors === 0) {
    return (
      <div className="rounded-xl bg-emerald-400/10 ring-1 ring-emerald-400/20 p-5 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15">
          <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-base font-semibold text-emerald-300">
          Upload Complete!
        </p>
        <p className="mt-1 text-sm text-emerald-400/60">
          {completed} photo{completed !== 1 ? "s" : ""} saved to our shared album
        </p>
      </div>
    );
  }

  if (allDone && errors > 0) {
    return (
      <div className="rounded-xl bg-red-400/10 ring-1 ring-red-400/20 p-5 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/15">
          <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-red-300">Upload Finished</p>
        <p className="mt-1 text-sm text-red-400/60">
          {completed} saved, {errors} failed
        </p>
      </div>
    );
  }

  const inProgress = total - completed - errors;
  return (
    <div className="rounded-xl bg-[var(--color-gold-glow)] ring-1 ring-[var(--color-gold)]/20 p-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <svg className="h-5 w-5 text-[var(--color-gold)] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-medium text-[var(--color-gold)]">
          Uploading {inProgress} of {total} photo{total !== 1 ? "s" : ""}...
        </p>
      </div>
      {completed > 0 && (
        <p className="mt-1 text-xs text-[var(--color-gold)]/50">
          {completed} saved so far
        </p>
      )}
    </div>
  );
}
