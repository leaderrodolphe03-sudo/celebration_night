import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { EVENT } from "@/lib/content";
import { generateAccessKey, hashAccessKey } from "./keys";
import { CapacityReachedError, type RegistrationStore, type RegistrationView } from "./types";

// Inscriptions via les fonctions SQL de supabase/migrations (service role,
// cote serveur uniquement). Les regles metier (capacite, numerotation,
// unicite) sont appliquees dans PostgreSQL, en une seule transaction.

export const supabaseRegistrationStore: RegistrationStore = {
  async create(input) {
    const supabase = createSupabaseAdminClient();
    const accessKey = generateAccessKey();
    const { data, error } = await supabase.rpc("create_registration", {
      p_year: EVENT.edition,
      p_first_name: input.firstName,
      p_last_name: input.lastName,
      p_phone: input.phone,
      p_email: input.email || null,
      p_city: input.city,
      p_seats: input.seats,
      p_heard_from: input.heardFrom,
      p_access_key_hash: hashAccessKey(accessKey),
    });
    if (error) {
      const remaining = /capacite_atteinte:(\d+)/.exec(error.message);
      if (remaining) throw new CapacityReachedError(Number(remaining[1]));
      throw new Error(`create_registration: ${error.message}`);
    }
    return { accessKey, ticketNumbers: data as string[] };
  },

  async getByKey(accessKey) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.rpc("get_registration_by_key", {
      p_access_key_hash: hashAccessKey(accessKey),
    });
    if (error) throw new Error(`get_registration_by_key: ${error.message}`);
    return (data as RegistrationView | null) ?? null;
  },

  async recover(phone, lastName) {
    const supabase = createSupabaseAdminClient();
    const accessKey = generateAccessKey();
    const { data, error } = await supabase.rpc("rotate_registration_key", {
      p_year: EVENT.edition,
      p_phone: phone,
      p_last_name: lastName,
      p_new_access_key_hash: hashAccessKey(accessKey),
    });
    if (error) throw new Error(`rotate_registration_key: ${error.message}`);
    return data ? accessKey : null;
  },
};
