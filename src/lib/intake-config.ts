// All select options, module checkboxes and priority sliders.
// Option values are taken verbatim from the original digital-twin-intake.html.

export interface ModuleItem {
  /** Stored value (also used in the AI prompt). */
  value: string;
  /** Short label shown on the checkbox chip. */
  label: string;
}

export interface ModuleCategory {
  title: string;
  items: ModuleItem[];
}

export const moduleCatalog: ModuleCategory[] = [
  {
    title: "Productie & machines",
    items: [
      { value: "Machinebezetting live", label: "Machinebezetting live" },
      { value: "Orderstatus & voortgang", label: "Orderstatus & voortgang" },
      { value: "Productie-output vs target", label: "Output vs target" },
      { value: "Machinestoring detectie", label: "Storingdetectie" },
      { value: "3D fabrieksvloer plattegrond", label: "3D plattegrond" },
      { value: "Kwaliteitscontrole & afkeur", label: "Kwaliteitscontrole" },
    ],
  },
  {
    title: "Voorraad & inkoop",
    items: [
      { value: "Grondstoffen voorraad", label: "Grondstoffen" },
      { value: "Gereed product voorraad", label: "Gereed product" },
      { value: "Inkooporders & leveringen", label: "Inkooporders" },
      { value: "Voorraad alarmen & tekorten", label: "Voorraad alarmen" },
    ],
  },
  {
    title: "Service & klanten",
    items: [
      { value: "Servicemonteurs live kaart", label: "Monteurs live kaart" },
      { value: "Servicemeldingen & tickets", label: "Servicemeldingen" },
      { value: "Geïnstalleerde base klanten", label: "Geïnstalleerde base" },
      { value: "Onderhoudsplanning predictief", label: "Predictief onderhoud" },
    ],
  },
  {
    title: "Faciliteiten & personeel",
    items: [
      { value: "Aanwezigheid medewerkers externen bezoekers", label: "Aanwezigheid" },
      { value: "Bezetting vergaderzalen", label: "Vergaderzalen" },
      { value: "Parkeerplaatsen bezetting", label: "Parkeerplaatsen" },
      { value: "Energieverbruik monitoring", label: "Energieverbruik" },
      { value: "Telefoonlijnen bezetting", label: "Telefoonlijnen" },
    ],
  },
  {
    title: "AI & analyse",
    items: [
      { value: "AI scenario simulator", label: "Scenario simulator" },
      { value: "Bottleneck detectie AI", label: "Bottleneck detectie" },
      { value: "Levertijdvoorspelling", label: "Levertijdvoorspelling" },
      { value: "Managementrapportages AI", label: "Rapportages" },
    ],
  },
];

// --- Select options ---------------------------------------------------------

export const sectorOpties = [
  "Metaalbewerking / plaatwerk",
  "Machinebouw",
  "Elektronica assemblage",
  "Voedingsmiddelen productie",
  "Kunststof / rubber",
  "Hout / meubel",
  "Chemie / farma",
  "Logistiek / distributie",
  "Bouw & installatie",
  "Overige maakindustrie",
];

export const medewerkersOpties = ["1 – 10", "10 – 25", "25 – 50", "50 – 100", "100 – 250", "250+"];

export const oppervlakOpties = [
  "< 500 m²",
  "500 – 2.000 m²",
  "2.000 – 5.000 m²",
  "5.000 – 10.000 m²",
  "> 10.000 m²",
];

export const productietypeOpties = [
  "Volledig maatwerk (elk order uniek)",
  "Configureerbaar (varianten van standaard)",
  "Serieproductie (herhalende batches)",
  "Massaproductie (continue stroom)",
  "Project-/engineeringbedrijf",
];

export const machinesOpties = ["1 – 5", "5 – 15", "15 – 30", "30 – 60", "60+"];

export const doorlooptijdOpties = [
  "< 1 dag",
  "1 – 5 dagen",
  "1 – 4 weken",
  "1 – 3 maanden",
  "> 3 maanden",
];

export const ordersOpties = ["1 – 5", "5 – 20", "20 – 50", "50 – 100", "100+"];

export const servicedienstOpties = [
  "Geen buitendienst",
  "1 – 3 monteurs",
  "3 – 10 monteurs",
  "10 – 25 monteurs",
  "25+ monteurs",
];

export const installedBaseOpties = [
  "Geen (geen installaties)",
  "< 50 installaties",
  "50 – 200 installaties",
  "200 – 1.000 installaties",
  "> 1.000 installaties",
];

export const erpOpties = [
  "AFAS",
  "Exact Online",
  "SAP",
  "Microsoft Dynamics 365",
  "Odoo",
  "Infor",
  "Eigen/maatwerk systeem",
  "Excel / handmatig",
  "Anders",
];

export const crmOpties = [
  "Salesforce",
  "HubSpot",
  "Microsoft Dynamics CRM",
  "AFAS (CRM module)",
  "Eigen/maatwerk",
  "Excel / handmatig",
  "Anders",
];

export const fieldServiceOpties = [
  "TOPdesk",
  "ServiceMax",
  "ClickSoftware",
  "Eigen planningssysteem",
  "Outlook / handmatig",
  "Anders",
];

export const gpsOpties = [
  "TomTom Webfleet",
  "Webfleet Business",
  "Verizon Connect",
  "Samsara",
  "Handmatig / telefoon",
  "Anders",
];

export const wifiOpties = [
  "Volledige dekking, stabiel",
  "Gedeeltelijke dekking",
  "Geen / slecht",
  "Alleen kantoor, niet productie",
];

export const itVolwassenheidOpties = [
  "Basis (weinig digitalisering)",
  "Gemiddeld (ERP + email + Office)",
  "Geavanceerd (meerdere systemen, API's)",
  "Hoog (eigen IT-afdeling, integraties)",
];

export const budgetOpties = [
  "< €25.000",
  "€25.000 – €50.000",
  "€50.000 – €100.000",
  "€100.000 – €200.000",
  "> €200.000",
];

export const tijdlijnOpties = [
  "Zo snel mogelijk (< 2 maanden)",
  "3 – 6 maanden",
  "6 – 12 maanden",
  "1 – 2 jaar",
  "Geen specifieke deadline",
];

export const capaciteitOpties = [
  "Geen (volledig uitbesteden)",
  "Beperkt (1 persoon, deeltijd)",
  "Gemiddeld (1-2 personen, parttime)",
  "Goed (eigen IT'er beschikbaar)",
  "Sterk (eigen developer / IT-team)",
];

// --- Priority sliders -------------------------------------------------------

export interface PrioField {
  /** Key in IntakeFormData. */
  key:
    | "prio_machinebezetting"
    | "prio_levertijd"
    | "prio_service"
    | "prio_voorraad"
    | "prio_rapportages"
    | "prio_kostenreductie";
  label: string;
}

export const prioFields: PrioField[] = [
  { key: "prio_machinebezetting", label: "Inzicht in machinebezetting & stilstand" },
  { key: "prio_levertijd", label: "Betere levertijdbetrouwbaarheid" },
  { key: "prio_service", label: "Efficiëntere servicemonteurs" },
  { key: "prio_voorraad", label: "Voorraad- en tekortbeheer verbeteren" },
  { key: "prio_rapportages", label: "Managementinzicht & rapportages" },
  { key: "prio_kostenreductie", label: "Kostenreductie (energie, personeel, materiaal)" },
];
