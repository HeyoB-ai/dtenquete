import { isAuthenticated } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { LoginForm } from "@/components/dashboard/LoginForm";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { IntakeList } from "@/components/dashboard/IntakeList";
import type { Intake } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isAuthenticated()) {
    return <LoginForm />;
  }

  let intakes: Intake[] = [];
  let loadError: string | null = null;
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("intakes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    intakes = (data ?? []) as Intake[];
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Onbekende fout";
  }

  return (
    <DashboardShell>
      <IntakeList intakes={intakes} error={loadError} />
    </DashboardShell>
  );
}
