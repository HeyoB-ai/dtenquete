"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { emptyIntake, type IntakeFormData } from "@/lib/types";
import * as cfg from "@/lib/intake-config";
import {
  CheckboxChip,
  FieldLabel,
  RangeField,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields";
import { cn } from "@/lib/utils";

const STEP_TITLES = ["Bedrijf", "Operatie", "Modules", "Infrastructuur", "Doelen", "Overzicht"];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function scrollTop() {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

export function IntakeWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeFormData>(emptyIntake);
  const [privacy, setPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof IntakeFormData>(key: K, val: IntakeFormData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  function toggleModule(value: string) {
    setData((d) => ({
      ...d,
      modules: d.modules.includes(value)
        ? d.modules.filter((m) => m !== value)
        : [...d.modules, value],
    }));
  }

  function validateStep(s: number): string | null {
    if (s === 0) {
      if (!data.bedrijfsnaam.trim()) return "Vul de bedrijfsnaam in.";
      if (!data.contactpersoon.trim()) return "Vul de contactpersoon in.";
      if (!data.email.trim()) return "Vul een e-mailadres in.";
      if (!EMAIL_RE.test(data.email)) return "Vul een geldig e-mailadres in.";
    }
    if (s === 1 && !data.pijnpunten.trim()) return "Beschrijf de grootste operationele pijnpunten.";
    return null;
  }

  function next() {
    const e = validateStep(step);
    if (e) {
      setError(e);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, 5));
    scrollTop();
  }

  function prev() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  }

  function goTo(n: number) {
    if (n <= step) {
      setError(null);
      setStep(n);
      scrollTop();
    }
  }

  async function submit() {
    for (const s of [0, 1]) {
      const e = validateStep(s);
      if (e) {
        setStep(s);
        setError(e);
        scrollTop();
        return;
      }
    }
    if (!privacy) {
      setError("Ga akkoord met de privacyverklaring om te verzenden.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Verzenden mislukt.");
      router.push(`/bedankt?naam=${encodeURIComponent(data.contactpersoon)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verzenden mislukt.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[900px]">
      {/* Progress */}
      <div className="mb-8 flex border-b border-line bg-paper-2">
        {STEP_TITLES.map((title, i) => (
          <button
            key={title}
            type="button"
            onClick={() => goTo(i)}
            className={cn(
              "flex-1 border-r border-line px-3 py-3 text-center text-[0.75rem] font-medium transition last:border-r-0",
              i === step
                ? "bg-ink text-paper"
                : i < step
                  ? "bg-paper-3 text-ink-2"
                  : "text-ink-3",
            )}
          >
            {i + 1}. {title}
            {i < step && <span className="ml-1 text-success">✓</span>}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-5 rounded border border-warn/30 bg-warn-light px-4 py-3 text-[0.85rem] text-warn">
          {error}
        </div>
      )}

      {/* STEP 1 — Bedrijfsprofiel */}
      {step === 0 && (
        <Section number="Stap 1 van 6" title="Bedrijfsprofiel" desc="Basisinformatie over het bedrijf en de contactpersoon.">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="bedrijfsnaam" label="Bedrijfsnaam" required value={data.bedrijfsnaam} onChange={(v) => set("bedrijfsnaam", v)} placeholder="bijv. QBtec B.V." />
            <TextField id="vestigingsplaats" label="Vestigingsplaats" value={data.vestigingsplaats} onChange={(v) => set("vestigingsplaats", v)} placeholder="bijv. Woerden" />
            <TextField id="contactpersoon" label="Contactpersoon" required value={data.contactpersoon} onChange={(v) => set("contactpersoon", v)} placeholder="Voor- en achternaam" />
            <TextField id="functie" label="Functie" value={data.functie} onChange={(v) => set("functie", v)} placeholder="bijv. Operations Manager" />
            <TextField id="email" label="E-mailadres" required type="email" value={data.email} onChange={(v) => set("email", v)} placeholder="naam@bedrijf.nl" />
            <TextField id="telefoon" label="Telefoonnummer" type="tel" value={data.telefoon} onChange={(v) => set("telefoon", v)} placeholder="bijv. 06 12345678" />
            <SelectField id="sector" label="Sector / branche" value={data.sector} onChange={(v) => set("sector", v)} options={cfg.sectorOpties} />
            <SelectField id="aantal_medewerkers" label="Aantal medewerkers" value={data.aantal_medewerkers} onChange={(v) => set("aantal_medewerkers", v)} options={cfg.medewerkersOpties} />
            <SelectField id="fabrieksoppervlak" label="Fabrieksoppervlak (m²)" optional="(schatting)" value={data.fabrieksoppervlak} onChange={(v) => set("fabrieksoppervlak", v)} options={cfg.oppervlakOpties} />
          </div>
          <div className="mt-5">
            <TextAreaField id="beschrijving" label="Korte beschrijving van het bedrijf en de producten" value={data.beschrijving} onChange={(v) => set("beschrijving", v)} placeholder="bijv. Producent van professionele frituurinstallaties voor de horeca. Maatwerk orders, 8 merken, 24/7 serviceteam..." />
          </div>
        </Section>
      )}

      {/* STEP 2 — Operationeel profiel */}
      {step === 1 && (
        <Section number="Stap 2 van 6" title="Operationeel profiel" desc="Hoe ziet het productie- en serviceproces eruit?">
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField id="productietype" label="Productietype" value={data.productietype} onChange={(v) => set("productietype", v)} options={cfg.productietypeOpties} />
            <SelectField id="aantal_machines" label="Aantal machines / werkstations" value={data.aantal_machines} onChange={(v) => set("aantal_machines", v)} options={cfg.machinesOpties} />
            <SelectField id="doorlooptijd" label="Gemiddelde doorlooptijd per order" value={data.doorlooptijd} onChange={(v) => set("doorlooptijd", v)} options={cfg.doorlooptijdOpties} />
            <SelectField id="actieve_orders" label="Aantal actieve orders tegelijk" value={data.actieve_orders} onChange={(v) => set("actieve_orders", v)} options={cfg.ordersOpties} />
            <SelectField id="servicedienst" label="Servicedienst buitendienst?" value={data.servicedienst} onChange={(v) => set("servicedienst", v)} options={cfg.servicedienstOpties} />
            <SelectField id="installed_base" label="Geïnstalleerde base bij klanten" value={data.installed_base} onChange={(v) => set("installed_base", v)} options={cfg.installedBaseOpties} />
          </div>
          <div className="mt-5">
            <TextAreaField id="pijnpunten" label="Grootste operationele pijnpunten" required value={data.pijnpunten} onChange={(v) => set("pijnpunten", v)} placeholder="bijv. We weten niet real-time wat machines doen, levertijden zijn moeilijk te voorspellen, servicemonteurs zijn slecht te sturen..." />
          </div>
        </Section>
      )}

      {/* STEP 3 — Gewenste modules */}
      {step === 2 && (
        <Section number="Stap 3 van 6" title="Gewenste modules" desc="Welke onderdelen zijn relevant? Selecteer alles wat van toepassing is.">
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-accent/20 bg-accent-light px-4 py-3 text-[0.85rem] text-accent">
            <span>💡</span>
            <span>Begin klein. Het advies is om maximaal 3 modules te kiezen voor de eerste fase. Meer modules = hogere kosten en langere doorlooptijd. Je kunt altijd uitbreiden.</span>
          </div>
          <div className="space-y-6">
            {cfg.moduleCatalog.map((cat) => (
              <div key={cat.title}>
                <FieldLabel>{cat.title}</FieldLabel>
                <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
                  {cat.items.map((item) => (
                    <CheckboxChip
                      key={item.value}
                      label={item.label}
                      checked={data.modules.includes(item.value)}
                      onToggle={() => toggleModule(item.value)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* STEP 4 — Bestaande infrastructuur */}
      {step === 3 && (
        <Section number="Stap 4 van 6" title="Bestaande infrastructuur" desc="Wat heeft het bedrijf al? Dit bepaalt de integratiestrategie.">
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField id="erp" label="ERP-systeem" placeholder="Geen / onbekend" value={data.erp} onChange={(v) => set("erp", v)} options={cfg.erpOpties} />
            <SelectField id="crm" label="CRM-systeem" placeholder="Geen / onbekend" value={data.crm} onChange={(v) => set("crm", v)} options={cfg.crmOpties} />
            <SelectField id="field_service" label="Field service / planningssoftware" placeholder="Geen" value={data.field_service} onChange={(v) => set("field_service", v)} options={cfg.fieldServiceOpties} />
            <SelectField id="gps_tracking" label="GPS / fleet tracking" placeholder="Geen" value={data.gps_tracking} onChange={(v) => set("gps_tracking", v)} options={cfg.gpsOpties} />
            <SelectField id="wifi_dekking" label="WiFi dekking fabrieksvloer" placeholder="Onbekend" value={data.wifi_dekking} onChange={(v) => set("wifi_dekking", v)} options={cfg.wifiOpties} />
            <SelectField id="it_volwassenheid" label="IT-volwassenheid algemeen" value={data.it_volwassenheid} onChange={(v) => set("it_volwassenheid", v)} options={cfg.itVolwassenheidOpties} />
          </div>
          <div className="mt-5">
            <SelectField id="budget" label="Budget indicatie totale investering" optional="(helpt bij fasering)" placeholder="Liever niet aangeven" value={data.budget} onChange={(v) => set("budget", v)} options={cfg.budgetOpties} />
          </div>
          <div className="mt-5">
            <TextAreaField id="infra_bijzonderheden" label="Bijzonderheden infrastructuur" optional="(optioneel)" value={data.infra_bijzonderheden} onChange={(v) => set("infra_bijzonderheden", v)} placeholder="bijv. Zware machines met veel metaal (WiFi-demping), legacy PLC-systemen, verouderde bekabeling, buitenlocaties..." />
          </div>
        </Section>
      )}

      {/* STEP 5 — Doelen & prioriteiten */}
      {step === 4 && (
        <Section number="Stap 5 van 6" title="Doelen & prioriteiten" desc="Wat wil het bedrijf bereiken? Geef een prioriteit aan elke doelstelling.">
          <div className="mb-2">
            <FieldLabel>Prioriteer de volgende doelstellingen (1 = laag, 5 = hoog)</FieldLabel>
          </div>
          <div className="mb-8 flex flex-col gap-5">
            {cfg.prioFields.map((f) => (
              <RangeField key={f.key} label={f.label} value={data[f.key]} onChange={(v) => set(f.key, v)} />
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField id="tijdlijn" label="Gewenste doorlooptijd implementatie" value={data.tijdlijn} onChange={(v) => set("tijdlijn", v)} options={cfg.tijdlijnOpties} />
            <SelectField id="capaciteit" label="Interne capaciteit voor implementatie" value={data.capaciteit} onChange={(v) => set("capaciteit", v)} options={cfg.capaciteitOpties} />
          </div>
          <div className="mt-5">
            <TextAreaField id="opmerkingen" label="Aanvullende opmerkingen of wensen" optional="(optioneel)" value={data.opmerkingen} onChange={(v) => set("opmerkingen", v)} placeholder="Alles wat relevant is voor een goed advies..." />
          </div>
        </Section>
      )}

      {/* STEP 6 — Overzicht & verzenden */}
      {step === 5 && (
        <Section number="Stap 6 van 6" title="Controleer & verzend" desc="Controleer de gegevens en verstuur de intake.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {summaryItems(data).map((it) => (
              <div key={it.label} className="rounded-lg border border-line bg-white px-4 py-3">
                <div className="mb-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink-3">
                  {it.label}
                </div>
                <div className="text-[0.95rem] font-medium text-ink">{it.value}</div>
              </div>
            ))}
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white px-4 py-3 text-[0.85rem] text-ink-2">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-accent"
            />
            <span>
              Ik ga akkoord dat deze gegevens worden gebruikt om een implementatieplan op te stellen
              en dat er contact met mij wordt opgenomen.
            </span>
          </label>

          <div className="mt-7 text-center">
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="rounded bg-accent px-10 py-4 text-[1rem] font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-ink-3"
            >
              {submitting ? "Bezig met verzenden..." : "Verzend intake →"}
            </button>
          </div>
        </Section>
      )}

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={prev}
            className="rounded border border-line bg-transparent px-7 py-3 text-[0.875rem] font-semibold text-ink-2 transition hover:bg-paper-2"
          >
            ← Terug
          </button>
        ) : (
          <span />
        )}
        {step < 5 && (
          <button
            type="button"
            onClick={next}
            className="rounded bg-ink px-7 py-3 text-[0.875rem] font-semibold text-paper transition hover:bg-ink-2"
          >
            {step === 4 ? "Naar overzicht →" : "Volgende →"}
          </button>
        )}
      </div>
    </div>
  );
}

function Section({
  number,
  title,
  desc,
  children,
}: {
  number: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="animate-fadeIn">
      <div className="mb-8 border-b-2 border-ink pb-4">
        <div className="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-3">
          {number}
        </div>
        <h2 className="font-serif text-[1.75rem] text-ink">{title}</h2>
        <p className="mt-2 text-[0.875rem] text-ink-3">{desc}</p>
      </div>
      {children}
    </section>
  );
}

function summaryItems(d: IntakeFormData) {
  const dash = (v: string) => (v && v.trim() ? v : "—");
  return [
    { label: "Bedrijf", value: dash(d.bedrijfsnaam) },
    { label: "Vestiging", value: dash(d.vestigingsplaats) },
    { label: "Contact", value: dash(d.contactpersoon) },
    { label: "E-mail", value: dash(d.email) },
    { label: "Sector", value: dash(d.sector) },
    { label: "Medewerkers", value: dash(d.aantal_medewerkers) },
    { label: "Productietype", value: dash(d.productietype) },
    { label: "Machines", value: dash(d.aantal_machines) },
    { label: "Servicedienst", value: dash(d.servicedienst) },
    { label: "ERP", value: d.erp || "Geen" },
    { label: "WiFi fabriek", value: dash(d.wifi_dekking) },
    { label: "Budget", value: d.budget || "Niet opgegeven" },
    { label: "Tijdlijn", value: dash(d.tijdlijn) },
    { label: "Modules geselecteerd", value: `${d.modules.length} stuks` },
  ];
}
