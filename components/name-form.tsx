"use client";

import { useState } from "react";

export function NameForm({ onComplete }: { onComplete: (name: string) => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    if (!firstName.trim() || !lastName.trim()) return;

    setSaving(true);
    await fetch("/api/auth/name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName }),
    });
    onComplete(fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="first-name" className="block text-sm font-medium text-white/60 mb-1.5">
          First Name
        </label>
        <input
          id="first-name"
          type="text"
          required
          autoFocus
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="e.g. Ethan"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)]/50"
        />
      </div>
      <div>
        <label htmlFor="last-name" className="block text-sm font-medium text-white/60 mb-1.5">
          Last Name
        </label>
        <input
          id="last-name"
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="e.g. Sevenster"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)]/50"
        />
      </div>
      <button
        type="submit"
        disabled={!firstName.trim() || !lastName.trim() || saving}
        className="w-full rounded-xl bg-[var(--color-gold)] px-4 py-3.5 text-sm font-semibold text-[#0f0f1e] shadow-lg shadow-[var(--color-gold)]/20 hover:bg-[var(--color-gold-dim)] active:scale-[0.98] transition-all min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Setting up..." : "Continue"}
      </button>
    </form>
  );
}
