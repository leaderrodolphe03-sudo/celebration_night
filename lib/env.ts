import { z } from "zod";

// Variables d'environnement validees au demarrage. Les cles Supabase restent
// optionnelles tant que le projet Supabase de l'organisation n'est pas cree.
// Une variable presente mais vide (ex. "AUTH_SECRET=" copie depuis .env.example)
// est traitee comme absente.
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AUTH_SECRET: optional(z.string().min(32)),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: optional(z.string().url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optional(z.string().min(1)),
  SUPABASE_SERVICE_ROLE_KEY: optional(z.string().min(1)),
});

export const env = serverSchema.parse(process.env);

const DEV_ONLY_SECRET = "dev-only-secret-ne-jamais-utiliser-en-production";

/**
 * Secret de signature des sessions admin. En production, l'absence de
 * AUTH_SECRET est une erreur bloquante : aucun secret par defaut n'est accepte.
 */
export function getAuthSecret(): string {
  if (env.AUTH_SECRET) return env.AUTH_SECRET;
  if (env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET (32 caracteres minimum) est obligatoire en production.");
  }
  return DEV_ONLY_SECRET;
}
