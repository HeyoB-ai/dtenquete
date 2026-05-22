"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/dashboard");
  }
  return (
    <button
      onClick={logout}
      className="w-full rounded border border-white/15 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
    >
      Uitloggen
    </button>
  );
}
