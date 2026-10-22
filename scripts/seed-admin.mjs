import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Chargement des variables d'environnement depuis .env.local si nécessaire
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length > 0) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.trim();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString("hex"),
    salt,
  };
}

async function main() {
  const username = process.argv[2] || process.env.ADMIN_SEED_USERNAME || "superadmin";
  const password = process.argv[3] || process.env.ADMIN_SEED_PASSWORD || "Celebration2026!";
  const name = process.argv[4] || process.env.ADMIN_SEED_NAME || "Direction HAGIAZO";
  const email = process.argv[5] || process.env.ADMIN_SEED_EMAIL || "direction@celebrationnight.org";

  console.log("------------------------------------------------------------------");
  console.log("🔑 Préparation du compte Super Admin Initial pour CELEBRATION NIGHT");
  console.log("------------------------------------------------------------------");
  console.log(`- Identifiant : ${username}`);
  console.log(`- Nom         : ${name}`);
  console.log(`- Email       : ${email}`);
  console.log(`- Mot de passe: ${password}`);

  const { hash, salt } = hashPassword(password);

  console.log("\n📦 Requête SQL équivalente (à copier dans Supabase SQL Editor si besoin) :");
  console.log(`
INSERT INTO public.admin_users (username, name, email, password_hash, salt, role)
VALUES ('${username}', '${name}', '${email}', '${hash}', '${salt}', 'ADMIN')
ON CONFLICT (username) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  salt = EXCLUDED.salt,
  name = EXCLUDED.name,
  role = 'ADMIN',
  updated_at = now();
`);

  if (!supabaseUrl || !serviceKey) {
    console.log("⚠️ Variables Supabase non détectées dans .env.local.");
    console.log("Veuillez exécuter la requête SQL ci-dessus directement dans le SQL Editor de Supabase.");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  console.log("🚀 Tentative d'insertion directe via l'API Supabase...");
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        name,
        email,
        password_hash: hash,
        salt,
        role: "ADMIN",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("❌ Erreur mise à jour:", updateError.message);
    } else {
      console.log(`✅ Compte Super Admin '${username}' mis à jour avec succès dans Supabase !`);
    }
  } else {
    const { error: insertError } = await supabase
      .from("admin_users")
      .insert({
        username,
        name,
        email,
        password_hash: hash,
        salt,
        role: "ADMIN",
      });

    if (insertError) {
      console.error("❌ Erreur insertion:", insertError.message);
      if (insertError.message.includes("Could not find the table")) {
        console.log("👉 Rappel : N'oubliez pas d'exécuter d'abord le script 'lib/db/migrations/20261023_init_admin_users_and_rls.sql' dans votre SQL Editor Supabase.");
      }
    } else {
      console.log(`✅ Compte Super Admin '${username}' créé avec succès dans Supabase !`);
    }
  }
}

main().catch(console.error);
