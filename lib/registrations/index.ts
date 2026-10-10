import "server-only";
import { env } from "@/lib/env";
import { localRegistrationStore } from "./local";
import { supabaseRegistrationStore } from "./supabase";

export * from "./types";
export { isWellFormedKey } from "./keys";

/** Supabase des que ses cles sont configurees, sinon le fichier local. */
export const registrations =
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? supabaseRegistrationStore
    : localRegistrationStore;
