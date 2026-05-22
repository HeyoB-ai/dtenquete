# Digital Twin Intake

Een twee-pagina intake-applicatie voor digital-twin consultancy in de maakindustrie.

- **`/intake`** (publiek) — een 6-staps wizard die de prospect zelf invult. Geen login.
- **`/dashboard`** (privé) — wachtwoord-beveiligd consultant-dashboard met alle intakes.
  Per intake genereert de consultant met de Claude API een implementatieplan op maat.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — DM Sans / DM Serif Display, paper-thema, blauw accent `#1a4d8f`
- **Supabase** — opslag van intakes (`@supabase/supabase-js`)
- **Brevo** — transactionele e-mail (`@getbrevo/brevo`)
- **Claude API** — plan-generatie (`@anthropic-ai/sdk`, model `claude-sonnet-4-6`)
- **react-markdown** — weergave van het gegenereerde plan

## Aan de slag

```bash
npm install
cp .env.example .env.local   # vul de waarden in
npm run dev                  # http://localhost:3000  → redirect naar /intake
```

### 1. Supabase
Maak een project en voer `supabase/schema.sql` uit in de SQL Editor. Zet
`SUPABASE_URL` en `SUPABASE_ANON_KEY` in `.env.local`.

> De anon-key wordt **uitsluitend server-side** gebruikt (geen `NEXT_PUBLIC_`),
> dus hij komt niet in de browser. Zie de opmerking in `schema.sql`.

### 2. Brevo
Maak een API-key aan en verifieer een afzender. Zet `BREVO_API_KEY`,
`BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` en `CONSULTANT_EMAIL`.
Zonder key wordt e-mail overgeslagen (de intake wordt wél opgeslagen).

### 3. Claude API
Zet `ANTHROPIC_API_KEY` (en optioneel `ANTHROPIC_MODEL`).

### 4. Dashboard
Zet `DASHBOARD_PASSWORD`. Inloggen zet een httpOnly-sessiecookie.

## Flow

1. Prospect vult `/intake` in en verzendt → opslag in Supabase, notificatie naar
   de consultant, bevestiging naar de prospect, redirect naar `/bedankt`.
2. Consultant logt in op `/dashboard`, opent een intake en klikt
   **Genereer implementatieplan**. Het plan wordt opgeslagen en kan worden
   geprint, gekopieerd of naar de klant gemaild.

## API routes

| Route | Doel |
|-------|------|
| `POST /api/intake` | Valideren, opslaan in Supabase, e-mails versturen |
| `POST /api/generate-plan` | (auth) Claude-plan genereren en opslaan |
| `POST /api/send-plan` | (auth) Plan naar de klant mailen |
| `POST /api/auth/login` / `logout` | Dashboard-sessie |

## Deploy

Geconfigureerd voor **Netlify** (`netlify.toml`, `@netlify/plugin-nextjs`).
Zet alle env-variabelen uit `.env.example` in de Netlify site-instellingen.
Op Free/Starter-plans is de functietimeout 10s — gebruik dan een snel model
(bijv. `claude-haiku-4-5`) voor `/api/generate-plan`.
