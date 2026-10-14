import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/**
 * Client Supabase pour les routes API du serveur (pleins droits avec service_role)
 */
let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (serverClient) return serverClient;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Variables Supabase manquantes dans .env.local (NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  serverClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClient;
}

/**
 * Client Supabase public standard
 */
let publicClient: SupabaseClient | null = null;

export function getSupabasePublicClient(): SupabaseClient {
  if (publicClient) return publicClient;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variables Supabase manquantes dans .env.local (NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  publicClient = createClient(supabaseUrl, supabaseAnonKey);
  return publicClient;
}
