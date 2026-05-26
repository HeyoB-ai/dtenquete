import { createHash } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "dashboard_session";
const FALLBACK_PASSWORD = "dtadmin2025";

export function sessionToken(): string {
  const pw = process.env.DASHBOARD_PASSWORD ?? FALLBACK_PASSWORD;
  return createHash("sha256").update(pw).digest("hex");
}

export function isAuthenticated(): boolean {
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  return !!cookie && cookie === sessionToken();
}
