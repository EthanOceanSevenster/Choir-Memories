"use client";

interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  thumbnailUrl?: string;
  errorMessage?: string;
  statusText?: string;
}

export function UploadProgress({
  fileName,
  progress,
  status,
  thumbnailUrl,
  errorMessage,
  statusText,
}: UploadProgressProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/5">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-white/5 flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/80 truncate">{fileName}</p>

        {status === "error" && errorMessage ? (
          <p className="text-xs text-red-400 mt-0.5">{errorMessage}</p>
        ) : (
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                status === "complete"
                  ? "bg-emerald-400"
                  : status === "error"
                  ? "bg-red-400"
                  : "bg-[var(--color-gold)]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        {status === "pending" && (
          <span className="text-xs text-white/20">Waiting</span>
        )}
        {status === "uploading" && (
          <div className="text-right">
            <span className="text-xs font-medium text-[var(--color-gold)]">
              {progress}%
            </span>
            {statusText && (
              <p className="text-[10px] text-white/25">{statusText}</p>
            )}
          </div>
        )}
        {status === "complete" && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        )}
        {status === "error" && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-400/10">
            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
