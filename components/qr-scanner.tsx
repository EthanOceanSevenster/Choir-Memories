"use client";

import { useEffect, useRef, useState } from "react";

export function QrScanner() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef<unknown>(null);

  const handleResult = (decodedText: string) => {
    try {
      const url = new URL(decodedText);
      const token = url.searchParams.get("token");
      if (token) {
        window.location.href = decodedText;
      }
    } catch {
      // Not a valid URL, ignore
    }
  };

  const startScanner = async () => {
    if (!scannerRef.current || html5QrCodeRef.current) return;

    setScanning(true);
    setError(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          scanner.stop().catch(() => {});
          html5QrCodeRef.current = null;
          setScanning(false);
          handleResult(decodedText);
        },
        () => {}
      );
    } catch {
      setError(
        "Could not access camera. Please allow camera permissions or upload a QR code image instead."
      );
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      const scanner = html5QrCodeRef.current as { stop: () => Promise<void> };
      await scanner.stop().catch(() => {});
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader-file");
      const result = await scanner.scanFile(file, true);
      handleResult(result);
    } catch {
      setError("No QR code found in the image. Please try another image.");
    }

    e.target.value = "";
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div
        id="qr-reader"
        ref={scannerRef}
        className="overflow-hidden rounded-xl bg-black ring-1 ring-white/10"
        style={{ display: scanning ? "block" : "none" }}
      />
      <div id="qr-reader-file" style={{ display: "none" }} />

      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      {!scanning ? (
        <>
          <button
            onClick={startScanner}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-gold)] px-4 py-3.5 text-sm font-semibold text-[#0f0f1e] shadow-lg shadow-[var(--color-gold)]/20 hover:bg-[var(--color-gold-dim)] active:scale-[0.98] transition-all min-h-[48px]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75H16.5v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75H16.5v-.75z"
              />
            </svg>
            Scan with Camera
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white/70 hover:bg-white/10 active:scale-[0.98] transition-all min-h-[48px]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            Upload QR Code Image
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </>
      ) : (
        <button
          onClick={stopScanner}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-white/70 hover:bg-white/10 active:scale-[0.98] transition-all min-h-[48px]"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
