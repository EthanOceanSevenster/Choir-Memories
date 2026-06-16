"use client";

import { useState, useRef, useCallback } from "react";
import { UploadProgress } from "./upload-progress";
import { UploadStatus } from "./upload-status";

interface UploadItem {
  id: string;
  file: File;
  status: "pending" | "uploading" | "complete" | "error";
  progress: number;
  thumbnailUrl?: string;
  errorMessage?: string;
  statusText?: string;
}

const CHUNK_SIZE = 3.5 * 1024 * 1024; // 3.5MB per chunk
const MAX_CONCURRENT = 2;
const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|heic|heif|bmp|tiff?)$/i;

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || IMAGE_EXTENSIONS.test(file.name);
}

async function uploadFile(
  file: File,
  onProgress: (progress: number) => void,
  onStatus: (status: string) => void
): Promise<void> {
  // Phase 1: Initiate resumable upload session
  onStatus("Preparing...");
  onProgress(5);

  const initRes = await fetch("/api/upload/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type || "image/jpeg",
      fileSize: file.size,
    }),
  });

  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({ error: "Failed to start upload" }));
    throw new Error(err.error || "Failed to start upload");
  }

  const { sessionUri } = await initRes.json();
  onStatus("Uploading...");
  onProgress(10);

  // Phase 2: Upload in chunks
  let offset = 0;
  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const chunk = file.slice(offset, end);
    const chunkBuffer = await chunk.arrayBuffer();

    const res = await fetch("/api/upload/chunk", {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "x-session-uri": sessionUri,
        "x-content-range": `bytes ${offset}-${end - 1}/${file.size}`,
      },
      body: chunkBuffer,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Chunk upload failed" }));
      throw new Error(err.error || "Chunk upload failed");
    }

    offset = end;
    // Scale progress from 10% to 100%
    onProgress(10 + Math.round((offset / file.size) * 90));
  }
}

export function UploadZone() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const uploadingCount = useRef(0);
  const queueRef = useRef<UploadItem[]>([]);

  const updateItem = useCallback(
    (id: string, updates: Partial<UploadItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const processQueue = useCallback(() => {
    while (
      uploadingCount.current < MAX_CONCURRENT &&
      queueRef.current.length > 0
    ) {
      const item = queueRef.current.shift()!;
      uploadingCount.current++;

      updateItem(item.id, { status: "uploading", progress: 0, statusText: "Starting..." });

      uploadFile(
        item.file,
        (progress) => {
          updateItem(item.id, { progress });
        },
        (statusText) => {
          updateItem(item.id, { statusText });
        }
      )
        .then(() => {
          updateItem(item.id, { status: "complete", progress: 100 });
        })
        .catch((err) => {
          updateItem(item.id, {
            status: "error",
            errorMessage: err.message,
          });
        })
        .finally(() => {
          uploadingCount.current--;
          processQueue();
        });
    }
  }, [updateItem]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newItems: UploadItem[] = Array.from(files)
        .filter((f) => isImageFile(f))
        .map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          status: "pending" as const,
          progress: 0,
          thumbnailUrl: URL.createObjectURL(file),
        }));

      if (newItems.length === 0) return;

      setItems((prev) => [...prev, ...newItems]);
      queueRef.current.push(...newItems);
      processQueue();
    },
    [processQueue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const completed = items.filter((i) => i.status === "complete").length;
  const errors = items.filter((i) => i.status === "error").length;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-amber-500 bg-amber-50"
            : "border-stone-300 bg-white/60"
        }`}
      >
        {/* Camera/photo icon */}
        <svg
          className="mx-auto h-10 w-10 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
        <p className="mt-3 text-sm text-stone-500">
          Drag & drop your photos here
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <label
          htmlFor="photo-input"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 active:bg-amber-900 transition-colors min-h-[48px] cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          Select Photos
        </label>

        <label
          htmlFor="camera-input"
          className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 active:bg-stone-100 transition-colors min-h-[48px] cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            />
          </svg>
          Camera
        </label>
      </div>

      {/* File inputs */}
      <input
        id="photo-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Upload status summary */}
      <UploadStatus total={items.length} completed={completed} errors={errors} />

      {/* File list */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <UploadProgress
              key={item.id}
              fileName={item.file.name}
              progress={item.progress}
              status={item.status}
              thumbnailUrl={item.thumbnailUrl}
              errorMessage={item.errorMessage}
              statusText={item.statusText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
