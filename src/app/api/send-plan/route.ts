import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";
import { sendEmail } from "@/lib/brevo";
import { planEmailHtml } from "@/lib/emails";
import type { Intake } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { id } = await req.json().catch(() => ({ id: undefined }));
  if (!id) {
    return NextResponse.json({ error: "id ontbreekt." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data: intake, error } = await supabase
    .from("intakes")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !intake) {
    return NextResponse.json({ error: "Intake niet gevonden." }, { status: 404 });
  }

  const it = intake as Intake;
  if (!it.gegenereerd_plan) {
    return NextResponse.json({ error: "Er is nog geen plan gegenereerd." }, { status: 400 });
  }
  if (!it.email) {
    return NextResponse.json({ error: "Geen e-mailadres bij deze intake." }, { status: 400 });
  }

  try {
    await sendEmail(
      it.email,
      it.contactpersoon || "Klant",
      `Uw digital twin implementatieplan — ${it.bedrijfsnaam}`,
      planEmailHtml(it),
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "onbekende fout";
    console.error("[send-plan] email error", e);
    return NextResponse.json({ error: "Versturen mislukt: " + message }, { status: 502 });
  }

  await supabase.from("intakes").update({ status: "verstuurd" }).eq("id", id);

  return NextResponse.json({ success: true });
}
