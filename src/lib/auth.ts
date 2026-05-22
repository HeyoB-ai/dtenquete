import { createHash } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "dashboard_session";

/** Token stored in the cookie — a hash of the password, never the raw value. */
export function sessionToken(): string {
  const pw = process.env.DASHBOARD_PASSWORD ?? "";
  return createHash("sha256").update(pw).digest("hex");
}

/** True when the request carries a valid dashboard session cookie. */
export function isAuthenticated(): boolean {
  if (!process.env.DASHBOARD_PASSWORD) return false;
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  return !!cookie && cookie === sessionToken();
}
