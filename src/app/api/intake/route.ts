import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/brevo";
import { consultantEmailHtml, prospectEmailHtml } from "@/lib/emails";
import { emptyIntake, type IntakeFormData } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: Partial<IntakeFormData>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Ongeldige aanvraag." }, { status: 400 });
  }

  // Required fields
  const required: [keyof IntakeFormData, string][] = [
    ["bedrijfsnaam", "Bedrijfsnaam"],
    ["contactpersoon", "Contactpersoon"],
    ["email", "E-mailadres"],
    ["pijnpunten", "Grootste pijnpunten"],
  ];
  for (const [key, label] of required) {
    const val = body[key];
    if (!val || (typeof val === "string" && !val.trim())) {
      return NextResponse.json({ success: false, error: `${label} is verplicht.` }, { status: 400 });
    }
  }
  if (!EMAIL_RE.test(String(body.email))) {
    return NextResponse.json({ success: false, error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  // Build a row from known columns only (ignore stray keys).
  const row: Record<string, unknown> = { status: "nieuw" };
  for (const key of Object.keys(emptyIntake) as (keyof IntakeFormData)[]) {
    row[key] = body[key] ?? emptyIntake[key];
  }
  row.modules = Array.isArray(body.modules) ? body.modules : [];

  let inserted: { id: string; bedrijfsnaam: string; contactpersoon: string; email: string };
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("intakes")
      .insert(row)
      .select("id, bedrijfsnaam, contactpersoon, email")
      .single();
    if (error) throw error;
    inserted = data as typeof inserted;
  } catch (e) {
    console.error("[intake] insert error", e);
    return NextResponse.json(
      { success: false, error: "Opslaan mislukt. Probeer het later opnieuw." },
      { status: 500 },
    );
  }

  // Notifications — best effort, never block the submission.
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const detailUrl = base ? `${base.replace(/\/$/, "")}/dashboard/${inserted.id}` : "";
    const consultant = process.env.CONSULTANT_EMAIL;
    if (consultant) {
      await sendEmail(
        consultant,
        "Consultant",
        `Nieuwe intake ontvangen: ${inserted.bedrijfsnaam}`,
        consultantEmailHtml(inserted, detailUrl),
      );
    }
    await sendEmail(
      inserted.email,
      inserted.contactpersoon,
      "Uw intake is ontvangen, we nemen contact op",
      prospectEmailHtml(inserted),
    );
  } catch (e) {
    console.error("[intake] email error", e);
  }

  return NextResponse.json({ success: true, id: inserted.id });
}
