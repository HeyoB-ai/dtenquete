import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { IntakeDetail } from "@/components/dashboard/IntakeDetail";
import { PlanGenerator } from "@/components/dashboard/PlanGenerator";
import type { Intake } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function IntakeDetailPage({ params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    redirect("/dashboard");
  }

  let intake: Intake | null = null;
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("intakes")
      .select("*")
      .eq("id", params.id)
      .single();
    if (error) throw error;
    intake = data as Intake;
  } catch {
    notFound();
  }
  if (!intake) notFound();

  return (
    <DashboardShell>
      <div className="p-8">
        <Link href="/dashboard" className="no-print mb-5 inline-block text-sm text-ink-3 hover:text-accent">
          ← Terug naar overzicht
        </Link>
        <div className="grid gap-6 lg:grid-cols-2">
          <IntakeDetail intake={intake} />
          <PlanGenerator
            id={intake.id}
            initialPlan={intake.gegenereerd_plan}
            status={intake.status}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
