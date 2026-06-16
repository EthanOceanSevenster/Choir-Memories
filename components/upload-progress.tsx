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
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-stone-200">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-stone-100 flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 truncate">{fileName}</p>

        {status === "error" && errorMessage ? (
          <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
        ) : (
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                status === "complete"
                  ? "bg-emerald-500"
                  : status === "error"
                  ? "bg-red-500"
                  : "bg-amber-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex-shrink-0">
        {status === "pending" && (
          <span className="text-xs text-stone-400">Waiting</span>
        )}
        {status === "uploading" && (
          <div className="text-right">
            <span className="text-xs font-medium text-amber-700">
              {progress}%
            </span>
            {statusText && (
              <p className="text-[10px] text-stone-400">{statusText}</p>
            )}
          </div>
        )}
        {status === "complete" && (
          <svg
            className="h-5 w-5 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
        {status === "error" && (
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
