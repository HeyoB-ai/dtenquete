import type { Intake } from "@/lib/types";
import { prioFields } from "@/lib/intake-config";
import { nlDateTime } from "@/lib/utils";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 border-b border-line/70 py-2 last:border-b-0">
      <dt className="text-[0.78rem] font-semibold text-ink-3">{label}</dt>
      <dd className="text-[0.88rem] text-ink-2">{value && value.trim() ? value : "—"}</dd>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5">
      <h3 className="mb-2 font-serif text-[1.05rem] text-ink">{title}</h3>
      <dl>{children}</dl>
    </section>
  );
}

export function IntakeDetail({ intake: it }: { intake: Intake }) {
  return (
    <div className="no-print space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-ink">{it.bedrijfsnaam}</h2>
        <p className="text-sm text-ink-3">Ontvangen op {nlDateTime(it.created_at)}</p>
      </div>

      <Group title="Bedrijfsprofiel">
        <Row label="Vestigingsplaats" value={it.vestigingsplaats} />
        <Row label="Contactpersoon" value={it.contactpersoon} />
        <Row label="Functie" value={it.functie} />
        <Row label="E-mail" value={it.email} />
        <Row label="Telefoon" value={it.telefoon} />
        <Row label="Sector" value={it.sector} />
        <Row label="Aantal medewerkers" value={it.aantal_medewerkers} />
        <Row label="Fabrieksoppervlak" value={it.fabrieksoppervlak} />
        <Row label="Beschrijving" value={it.beschrijving} />
      </Group>

      <Group title="Operationeel profiel">
        <Row label="Productietype" value={it.productietype} />
        <Row label="Aantal machines" value={it.aantal_machines} />
        <Row label="Doorlooptijd per order" value={it.doorlooptijd} />
        <Row label="Actieve orders" value={it.actieve_orders} />
        <Row label="Servicedienst" value={it.servicedienst} />
        <Row label="Geïnstalleerde base" value={it.installed_base} />
        <Row label="Pijnpunten" value={it.pijnpunten} />
      </Group>

      <Group title={`Gewenste modules (${it.modules?.length ?? 0})`}>
        {it.modules && it.modules.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {it.modules.map((m) => (
              <span
                key={m}
                className="rounded-full border border-accent/20 bg-accent-light px-2.5 py-0.5 text-xs text-accent"
              >
                {m}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-3">Geen modules geselecteerd.</p>
        )}
      </Group>

      <Group title="Bestaande infrastructuur">
        <Row label="ERP-systeem" value={it.erp} />
        <Row label="CRM-systeem" value={it.crm} />
        <Row label="Field service software" value={it.field_service} />
        <Row label="GPS / fleet tracking" value={it.gps_tracking} />
        <Row label="WiFi dekking" value={it.wifi_dekking} />
        <Row label="IT-volwassenheid" value={it.it_volwassenheid} />
        <Row label="Budget indicatie" value={it.budget} />
        <Row label="Bijzonderheden" value={it.infra_bijzonderheden} />
      </Group>

      <Group title="Doelen & prioriteiten">
        {prioFields.map((f) => (
          <Row key={f.key} label={f.label} value={`${it[f.key] ?? 3} / 5`} />
        ))}
        <Row label="Gewenste tijdlijn" value={it.tijdlijn} />
        <Row label="Interne capaciteit" value={it.capaciteit} />
        <Row label="Opmerkingen" value={it.opmerkingen} />
      </Group>
    </div>
  );
}
