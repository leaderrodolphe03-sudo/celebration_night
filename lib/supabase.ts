import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();
  return Boolean(url && key);
}

/**
 * Client Supabase pour les routes API du serveur (pleins droits avec service_role)
 */
let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (serverClient) return serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

  if (!url || !serviceKey) {
    throw new Error(
      "Variables Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY). Veuillez les configurer dans votre hébergeur (Vercel > Project Settings > Environment Variables)."
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    console.warn(
      "[Supabase] ⚠️ ATTENTION : SUPABASE_SERVICE_ROLE_KEY n'est pas définie sur le serveur. Utilisation de NEXT_PUBLIC_SUPABASE_ANON_KEY en secours. Si les règles RLS sont actives, les écritures échoueront."
    );
  }

  serverClient = createClient(url, serviceKey, {
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      "Variables Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY)."
    );
  }

  publicClient = createClient(url, anonKey);
  return publicClient;
}
