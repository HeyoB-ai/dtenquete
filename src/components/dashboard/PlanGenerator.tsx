"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { IntakeStatus } from "@/lib/types";

export function PlanGenerator({
  id,
  initialPlan,
  status,
}: {
  id: string;
  initialPlan: string | null;
  status: IntakeStatus;
}) {
  const [plan, setPlan] = useState<string | null>(initialPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(status === "verstuurd");

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Genereren mislukt.");
      setPlan(json.plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Genereren mislukt.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!plan) return;
    await navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function send() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/send-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Versturen mislukt.");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Versturen mislukt.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <h2 className="mb-4 font-serif text-xl text-ink">Implementatieplan</h2>

      {error && (
        <div className="mb-4 rounded border border-warn/30 bg-warn-light px-4 py-3 text-sm text-warn">
          {error}
        </div>
      )}

      {!plan && !loading && (
        <div className="py-10 text-center">
          <button
            onClick={generate}
            className="rounded bg-accent px-8 py-3.5 text-base font-semibold text-white transition hover:bg-accent-dark"
          >
            Genereer implementatieplan →
          </button>
          <p className="mt-3 text-xs text-ink-3">Duurt 10–20 seconden</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-4 py-14 text-ink-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
          <span>Plan wordt gegenereerd...</span>
        </div>
      )}

      {plan && !loading && (
        <>
          <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-ink prose-h2:mb-2 prose-h2:mt-6 prose-h2:border-b prose-h2:border-line prose-h2:pb-1 prose-h2:text-[1.2rem] prose-p:text-ink-2 prose-li:text-ink-2 prose-strong:text-ink">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan}</ReactMarkdown>
          </div>

          <div className="no-print mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
            <button
              onClick={() => window.print()}
              className="rounded border border-line bg-white px-4 py-2 text-sm text-ink-2 transition hover:bg-paper-2"
            >
              🖨 Print / PDF
            </button>
            <button
              onClick={copy}
              className="rounded border border-line bg-white px-4 py-2 text-sm text-ink-2 transition hover:bg-paper-2"
            >
              {copied ? "✓ Gekopieerd" : "📋 Kopieer"}
            </button>
            <button
              onClick={send}
              disabled={sending}
              className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
            >
              {sent ? "✓ Verstuurd naar klant" : sending ? "Versturen..." : "Verstuur naar klant"}
            </button>
            <button
              onClick={generate}
              className="rounded border border-line bg-white px-4 py-2 text-sm text-ink-3 transition hover:bg-paper-2"
            >
              ↺ Opnieuw genereren
            </button>
          </div>
        </>
      )}
    </div>
  );
}
