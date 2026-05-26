"use client";

import Link from "next/link";
import type { Intake, IntakeStatus } from "@/lib/types";
import { nlDateTime } from "@/lib/utils";

const statusStyle: Record<IntakeStatus, string> = {
  nieuw: "bg-accent-light text-accent",
  plan_gegenereerd: "bg-success-light text-success",
  verstuurd: "bg-warn-light text-warn",
};

const statusLabel: Record<IntakeStatus, string> = {
  nieuw: "Nieuw",
  plan_gegenereerd: "Plan gegenereerd",
  verstuurd: "Verstuurd",
};

const cols = "grid grid-cols-[150px_1.4fr_1.2fr_1fr_1fr_140px] gap-4 items-center";

function escapeCSV(val: unknown): string {
  const s = val == null ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadCSV(intakes: Intake[]) {
  const headers: (keyof Intake)[] = [
    "created_at", "status", "bedrijfsnaam", "vestigingsplaats", "contactpersoon",
    "functie", "email", "telefoon", "sector", "aantal_medewerkers", "fabrieksoppervlak",
    "beschrijving", "productietype", "aantal_machines", "doorlooptijd", "actieve_orders",
    "servicedienst", "installed_base", "pijnpunten", "modules", "erp", "crm",
    "field_service", "gps_tracking", "wifi_dekking", "it_volwassenheid", "budget",
    "infra_bijzonderheden", "prio_machinebezetting", "prio_levertijd", "prio_service",
    "prio_voorraad", "prio_rapportages", "prio_kostenreductie", "tijdlijn",
    "capaciteit", "opmerkingen",
  ];

  const rows = [
    headers.join(","),
    ...intakes.map((it) =>
      headers
        .map((h) => escapeCSV(h === "modules" ? (it.modules ?? []).join("; ") : it[h]))
        .join(",")
    ),
  ];

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `intakes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function IntakeList({ intakes, error }: { intakes: Intake[]; error: string | null }) {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="mb-1 font-serif text-2xl text-ink">Intakes</h1>
          <p className="text-sm text-ink-3">{intakes.length} aanvragen</p>
        </div>
        {intakes.length > 0 && (
          <button
            onClick={() => downloadCSV(intakes)}
            className="rounded border border-line bg-white px-4 py-2 text-sm font-medium text-ink-2 transition hover:bg-paper-2 hover:text-ink"
          >
            ↓ Download CSV
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-warn/30 bg-warn-light px-4 py-3 text-sm text-warn">
          Kon de intakes niet laden: {error}
        </div>
      )}

      {intakes.length === 0 && !error ? (
        <div className="rounded-lg border border-line bg-white px-6 py-16 text-center text-ink-3">
          Nog geen intakes ontvangen.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-white">
          <div
            className={`${cols} border-b border-line px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-ink-3`}
          >
            <span>Datum</span>
            <span>Bedrijf</span>
            <span>Contactpersoon</span>
            <span>Sector</span>
            <span>Budget</span>
            <span>Status</span>
          </div>
          {intakes.map((it) => (
            <Link
              key={it.id}
              href={`/dashboard/${it.id}`}
              className={`${cols} border-b border-line/70 px-5 py-3.5 text-sm text-ink-2 transition last:border-b-0 hover:bg-paper-2`}
            >
              <span className="text-ink-3">{nlDateTime(it.created_at)}</span>
              <span className="font-medium text-ink">{it.bedrijfsnaam}</span>
              <span>{it.contactpersoon}</span>
              <span className="truncate">{it.sector || "—"}</span>
              <span>{it.budget || "—"}</span>
              <span>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[it.status]}`}
                >
                  {statusLabel[it.status]}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
