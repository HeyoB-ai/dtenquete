import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/plan-prompt";
import type { Intake } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 26;

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const { id } = await req.json().catch(() => ({ id: undefined }));
  if (!id) {
    return NextResponse.json({ error: "id ontbreekt." }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY ontbreekt." }, { status: 500 });
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

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let plan = "";
  try {
    const msg = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(intake as Intake) }],
    });
    plan = msg.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();
  } catch (e) {
    const message = e instanceof Error ? e.message : "onbekende fout";
    console.error("[generate-plan] anthropic error", e);
    return NextResponse.json({ error: "Genereren mislukt: " + message }, { status: 502 });
  }

  if (!plan) {
    return NextResponse.json({ error: "Leeg plan ontvangen van het model." }, { status: 502 });
  }

  const { error: upErr } = await supabase
    .from("intakes")
    .update({
      gegenereerd_plan: plan,
      plan_gegenereerd_at: new Date().toISOString(),
      status: "plan_gegenereerd",
    })
    .eq("id", id);
  if (upErr) console.error("[generate-plan] update error", upErr);

  return NextResponse.json({ plan });
}
