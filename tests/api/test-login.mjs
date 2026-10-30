import assert from "assert";
import { POST } from "../../app/api/admin/login/route.js";
import { NextRequest } from "next/server.js";

async function runLoginTests() {
  console.log("[TEST] Démarrage des tests de l'API de connexion /api/admin/login...");

  // Test 1 : Identifiant vide
  const req1 = new NextRequest("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "", password: "" }),
  });
  const res1 = await POST(req1);
  assert.strictEqual(res1.status, 400, "Doit renvoyer 400 si l'identifiant est vide");
  const data1 = await res1.json();
  assert(data1.error.includes("identifiant"), "Message d'erreur attendu pour identifiant manquant");
  console.log("[SUCCESS] Test 1 : Rejet identifiant vide validé.");

  // Test 2 : Mauvais identifiant / mot de passe
  const req2 = new NextRequest("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "utilisateur_inconnu", password: "mauvais_mot_de_passe" }),
  });
  const res2 = await POST(req2);
  assert.strictEqual(res2.status, 401, "Doit renvoyer 401 pour de mauvais identifiants");
  console.log("[SUCCESS] Test 2 : Rejet mauvais identifiants validé.");

  // Test 3 : Rejet strict de l'ancienne porte dérobée CN2026
  const req3 = new NextRequest("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "CN2026", password: "CN2026" }),
  });
  const res3 = await POST(req3);
  assert.strictEqual(res3.status, 401, "L'ancienne backdoor CN2026 doit être strictement rejetée avec 401");
  console.log("[SUCCESS] Test 3 : Rejet et blocage strict de l'ancienne backdoor CN2026 validés.");

  console.log("[SUCCESS] Tous les tests de l'API /api/admin/login sont validés !");
}

runLoginTests().catch((err) => {
  console.error("[ERROR] Échec test login API :", err);
  process.exit(1);
});
