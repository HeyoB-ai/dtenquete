import type { Intake } from "./types";
import { prioFields } from "./intake-config";

export const SYSTEM_PROMPT =
  "Je bent een expert digital twin consultant gespecialiseerd in de Nederlandse maakindustrie. " +
  "Je maakt implementatieplannen die realistisch, betaalbaar en uitvoerbaar zijn. " +
  "Je adviseert ESP32-gebaseerde sensoren waar mogelijk.";

const or = (v: string | null | undefined, fallback = "Onbekend") =>
  v && v.trim() ? v.trim() : fallback;

/** Build the user prompt from a stored intake. */
export function buildUserPrompt(intake: Intake): string {
  const prio = prioFields
    .map((f) => `- ${f.label}: ${intake[f.key] ?? 3}/5`)
    .join("\n");

  const modules =
    intake.modules && intake.modules.length > 0
      ? intake.modules.map((m) => `- ${m}`).join("\n")
      : "Nog niet geselecteerd";

  return `Genereer een gedetailleerd, op maat gemaakt digital-twin implementatieplan op basis van de volgende intake.

BEDRIJFSPROFIEL:
- Bedrijfsnaam: ${or(intake.bedrijfsnaam)}
- Vestigingsplaats: ${or(intake.vestigingsplaats)}
- Contactpersoon: ${or(intake.contactpersoon)}${intake.functie ? ` (${intake.functie})` : ""}
- E-mail: ${or(intake.email)}
- Telefoon: ${or(intake.telefoon, "Niet opgegeven")}
- Sector: ${or(intake.sector)}
- Aantal medewerkers: ${or(intake.aantal_medewerkers)}
- Fabrieksoppervlak: ${or(intake.fabrieksoppervlak)}
- Beschrijving: ${or(intake.beschrijving, "Niet opgegeven")}

OPERATIONEEL PROFIEL:
- Productietype: ${or(intake.productietype)}
- Aantal machines/werkstations: ${or(intake.aantal_machines)}
- Doorlooptijd per order: ${or(intake.doorlooptijd)}
- Actieve orders tegelijk: ${or(intake.actieve_orders)}
- Servicedienst buitendienst: ${or(intake.servicedienst, "Geen")}
- Geïnstalleerde base bij klanten: ${or(intake.installed_base, "Geen")}
- Grootste pijnpunten: ${or(intake.pijnpunten, "Niet opgegeven")}

GEWENSTE MODULES (${intake.modules?.length ?? 0} geselecteerd):
${modules}

BESTAANDE INFRASTRUCTUUR:
- ERP: ${or(intake.erp, "Geen")}
- CRM: ${or(intake.crm, "Geen")}
- Field service software: ${or(intake.field_service, "Geen")}
- GPS / fleet tracking: ${or(intake.gps_tracking, "Geen")}
- WiFi dekking fabriek: ${or(intake.wifi_dekking)}
- IT-volwassenheid: ${or(intake.it_volwassenheid)}
- Budget indicatie: ${or(intake.budget, "Niet opgegeven")}
- Bijzonderheden: ${or(intake.infra_bijzonderheden, "Geen")}

PRIORITEITEN (1=laag, 5=hoog):
${prio}

IMPLEMENTATIEWENSEN:
- Gewenste tijdlijn: ${or(intake.tijdlijn, "Geen voorkeur")}
- Interne capaciteit: ${or(intake.capaciteit)}
- Aanvullende opmerkingen: ${or(intake.opmerkingen, "Geen")}

Genereer het implementatieplan met exact de volgende secties (gebruik deze als ## markdown-koppen):

## Samenvatting & aanbeveling
Korte analyse van het bedrijf en de 2-3 meest impactvolle verbeteringen die een digital twin hier oplevert.

## Aanbevolen fasering (3 fases)
Fase 1 (quick wins), Fase 2 (uitbreiding), Fase 3 (optimalisatie). Geef per fase: wat wordt gebouwd, doorlooptijd en verwacht resultaat. Koppel aan de gekozen modules en prioriteiten.

## Hardware advies
Concreet advies over sensoren en hardware. Gebruik ESP32-gebaseerde oplossingen waar mogelijk, met prijsindicaties per component.

## Software & integraties
Technische aanpak: hoe worden bestaande systemen (${or(intake.erp, "geen ERP")}) gekoppeld of omzeild, passend bij de IT-volwassenheid.

## Budgetraming
Gedetailleerde kostenraming gesplitst in hardware, software-ontwikkeling, installatie & configuratie en jaarlijks beheer. Geef min-max bandbreedtes, afgestemd op het budget (${or(intake.budget, "niet opgegeven")}).

## Terugverdientijd & ROI
Verwachte ROI op basis van prioriteiten en bedrijfsgrootte, met concrete besparingsvoorbeelden.

## Risico's & aandachtspunten
3-5 risico's specifiek voor dit bedrijf en hoe ze te mitigeren.

## Volgende stappen — 30 dagen actieplan
Concrete actielijst voor de eerste 30 dagen: wie doet wat, wanneer.

Schrijf in professioneel Nederlands. Wees specifiek, gebruik de intakegegevens en geef concrete getallen. Maak het plan direct bruikbaar als voorstel aan de klant.`;
}
