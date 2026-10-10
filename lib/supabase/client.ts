import { createBrowserClient } from "@supabase/ssr";

/** Client Supabase pour les composants client (cle anonyme, soumise a la RLS). */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase n'est pas configure (NEXT_PUBLIC_SUPABASE_*).");
  return createBrowserClient(url, anonKey);
}
