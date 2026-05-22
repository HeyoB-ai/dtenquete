-- Digital Twin Intake — Supabase schema
-- Voer dit uit in de Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'nieuw',          -- 'nieuw' | 'plan_gegenereerd' | 'verstuurd'
  gegenereerd_plan text,
  plan_gegenereerd_at timestamptz,

  -- Stap 1 — Bedrijfsprofiel
  bedrijfsnaam text not null,
  vestigingsplaats text,
  contactpersoon text not null,
  functie text,
  email text not null,
  telefoon text,
  sector text,
  aantal_medewerkers text,
  fabrieksoppervlak text,
  beschrijving text,

  -- Stap 2 — Operationeel profiel
  productietype text,
  aantal_machines text,
  doorlooptijd text,
  actieve_orders text,
  servicedienst text,
  installed_base text,
  pijnpunten text,

  -- Stap 3 — Gewenste modules
  modules jsonb not null default '[]'::jsonb,

  -- Stap 4 — Bestaande infrastructuur
  erp text,
  crm text,
  field_service text,
  gps_tracking text,
  wifi_dekking text,
  it_volwassenheid text,
  budget text,
  infra_bijzonderheden text,

  -- Stap 5 — Doelen & prioriteiten (1–5)
  prio_machinebezetting int default 3,
  prio_levertijd int default 3,
  prio_service int default 3,
  prio_voorraad int default 3,
  prio_rapportages int default 3,
  prio_kostenreductie int default 3,
  tijdlijn text,
  capaciteit text,
  opmerkingen text
);

create index if not exists intakes_created_at_idx on public.intakes (created_at desc);

-- Row Level Security.
-- LET OP: de anon-key wordt in deze app UITSLUITEND server-side gebruikt
-- (env var SUPABASE_ANON_KEY, géén NEXT_PUBLIC_ prefix), dus hij komt nooit in
-- de browser terecht. Onderstaande policies stellen daarom niets publiek bloot.
-- Voor extra zekerheid in productie: gebruik een service-role key server-side en
-- maak de policies restrictiever.
alter table public.intakes enable row level security;

drop policy if exists "intake insert (anon)" on public.intakes;
drop policy if exists "intake select (anon)" on public.intakes;
drop policy if exists "intake update (anon)" on public.intakes;

create policy "intake insert (anon)" on public.intakes
  for insert to anon with check (true);
create policy "intake select (anon)" on public.intakes
  for select to anon using (true);
create policy "intake update (anon)" on public.intakes
  for update to anon using (true) with check (true);
