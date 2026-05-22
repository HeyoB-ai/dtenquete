// Shape of one intake submission. Keys map 1:1 to the Supabase 'intakes' columns.

export type IntakeStatus = "nieuw" | "plan_gegenereerd" | "verstuurd";

export interface IntakeFormData {
  // Stap 1 — Bedrijfsprofiel
  bedrijfsnaam: string;
  vestigingsplaats: string;
  contactpersoon: string;
  functie: string;
  email: string;
  telefoon: string;
  sector: string;
  aantal_medewerkers: string;
  fabrieksoppervlak: string;
  beschrijving: string;

  // Stap 2 — Operationeel profiel
  productietype: string;
  aantal_machines: string;
  doorlooptijd: string;
  actieve_orders: string;
  servicedienst: string;
  installed_base: string;
  pijnpunten: string;

  // Stap 3 — Gewenste modules (lijst van geselecteerde module-waarden)
  modules: string[];

  // Stap 4 — Bestaande infrastructuur
  erp: string;
  crm: string;
  field_service: string;
  gps_tracking: string;
  wifi_dekking: string;
  it_volwassenheid: string;
  budget: string;
  infra_bijzonderheden: string;

  // Stap 5 — Doelen & prioriteiten (1–5)
  prio_machinebezetting: number;
  prio_levertijd: number;
  prio_service: number;
  prio_voorraad: number;
  prio_rapportages: number;
  prio_kostenreductie: number;
  tijdlijn: string;
  capaciteit: string;
  opmerkingen: string;
}

export interface Intake extends IntakeFormData {
  id: string;
  created_at: string;
  status: IntakeStatus;
  gegenereerd_plan: string | null;
  plan_gegenereerd_at: string | null;
}

/** A freshly-initialised, empty form. */
export const emptyIntake: IntakeFormData = {
  bedrijfsnaam: "",
  vestigingsplaats: "",
  contactpersoon: "",
  functie: "",
  email: "",
  telefoon: "",
  sector: "",
  aantal_medewerkers: "",
  fabrieksoppervlak: "",
  beschrijving: "",
  productietype: "",
  aantal_machines: "",
  doorlooptijd: "",
  actieve_orders: "",
  servicedienst: "",
  installed_base: "",
  pijnpunten: "",
  modules: [],
  erp: "",
  crm: "",
  field_service: "",
  gps_tracking: "",
  wifi_dekking: "",
  it_volwassenheid: "",
  budget: "",
  infra_bijzonderheden: "",
  prio_machinebezetting: 3,
  prio_levertijd: 3,
  prio_service: 3,
  prio_voorraad: 3,
  prio_rapportages: 3,
  prio_kostenreductie: 3,
  tijdlijn: "",
  capaciteit: "",
  opmerkingen: "",
};
