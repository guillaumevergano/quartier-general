import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Server-side client with service role (bypasses RLS)
export const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null as unknown as SupabaseClient;

// Public client for client-side (limited by RLS) — lazy singleton
let _supabasePublic: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient | null {
  if (!supabaseUrl || !anonKey) return null;
  if (!_supabasePublic) {
    _supabasePublic = createClient(supabaseUrl, anonKey);
  }
  return _supabasePublic;
}

// Keep backward compat export — but safe
export const supabasePublic = (typeof window !== "undefined" && supabaseUrl && anonKey)
  ? createClient(supabaseUrl, anonKey)
  : null as unknown as SupabaseClient;
