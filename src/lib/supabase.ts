import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Lazily-created Supabase client. Created on first use (not at import time) so
 * the build doesn't fail when env vars are absent.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL en SUPABASE_ANON_KEY moeten ingesteld zijn.");
    }
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
