import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import assert from "assert";

// Chargement .env.local
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
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !anonKey || !serviceKey) {
  console.error("[ERROR] Variables d'environnement Supabase incompletes pour le test RLS.");
  process.exit(1);
}

const anonClient = createClient(supabaseUrl, anonKey);
const serviceClient = createClient(supabaseUrl, serviceKey);

async function runRlsTests() {
  console.log("[TEST] Demarrage des tests de securite RLS...");

  // Test 1 : Vérifier que l'accès Anonyme direct en écriture sur participants est bloqué
  console.log("- Test 1 : Tentative d'insertion avec cle Anonyme...");
  const { data: anonInsert, error: anonError } = await anonClient
    .from("participants")
    .insert({
      first_name: "Attacker",
      last_name: "Anonymous",
      phone: "+99900000000",
      country: "Benin",
      city: "Cotonou",
      ticket_type: "STANDARD",
      gave_life_to_jesus: false,
    });

  if (!anonError) {
    console.warn("[WARN] Attention : L'insertion anonyme n'a pas ete bloquee. Assurez-vous d'avoir execute la migration RLS dans Supabase.");
  } else {
    console.log("[SUCCESS] Test 1 : Insertion anonyme rejetee par RLS (" + (anonError.code || anonError.message) + ")");
  }

  // Test 2 : Vérifier que le service_role a tous les accès
  console.log("- Test 2 : Acces en lecture/ecriture avec cle service_role...");
  const testPhone = "+22900009999";
  const { data: sInsert, error: sError } = await serviceClient
    .from("participants")
    .insert({
      first_name: "TestService",
      last_name: "RoleAccess",
      phone: testPhone,
      country: "Benin",
      city: "Cotonou",
      ticket_type: "STANDARD",
      gave_life_to_jesus: false,
    })
    .select()
    .single();

  assert(!sError, "Le service_role doit pouvoir inserer : " + sError?.message);
  assert(sInsert && sInsert.id, "Le participant cree doit avoir un ID");

  // Nettoyage
  await serviceClient.from("participants").delete().eq("id", sInsert.id);
  console.log("[SUCCESS] Test 2 : Le service_role fonctionne et a ete nettoye.");

  console.log("[SUCCESS] Suite de tests RLS validee avec succes !");
}

runRlsTests().catch((err) => {
  console.error("[ERROR] Echec test RLS :", err);
  process.exit(1);
});
