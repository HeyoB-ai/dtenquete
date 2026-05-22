import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper-2">
      <aside className="no-print flex w-60 shrink-0 flex-col bg-nightside text-paper">
        <div className="border-b border-white/10 px-6 py-5">
          <Link href="/dashboard" className="font-serif text-lg leading-tight">
            Digital Twin
          </Link>
          <div className="text-xs text-white/50">Consultant dashboard</div>
        </div>
        <nav className="flex-1 p-3">
          <Link
            href="/dashboard"
            className="block rounded px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
          >
            Intakes
          </Link>
        </nav>
        <div className="p-3">
          <LogoutButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
