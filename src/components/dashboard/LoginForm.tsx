"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Inloggen mislukt.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inloggen mislukt.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-nightside px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-[360px] rounded-lg border border-white/10 bg-nightside2 p-8 text-paper"
      >
        <div className="mb-1 font-serif text-xl">Consultant dashboard</div>
        <p className="mb-6 text-sm text-white/50">Log in om de intakes te bekijken.</p>

        <label className="text-xs font-semibold text-white/70">Wachtwoord</label>
        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded border border-white/15 bg-nightside px-3.5 py-2.5 text-sm text-paper outline-none focus:border-accent"
          placeholder="••••••••"
        />

        {error && <p className="mt-3 text-sm text-[#ff8a80]">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Bezig..." : "Inloggen"}
        </button>
      </form>
    </main>
  );
}
