import assert from "assert";
import { POST } from "../../app/api/admin/login/route.js";
import { NextRequest } from "next/server.js";

async function runLoginTests() {
  console.log("🧪 Démarrage des tests de l'API de connexion /api/admin/login...");

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
  console.log("✅ Test 1 : Rejet identifiant vide validé.");

  // Test 2 : Mauvais identifiant / mot de passe
  const req2 = new NextRequest("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "utilisateur_inconnu", password: "mauvais_mot_de_passe" }),
  });
  const res2 = await POST(req2);
  assert.strictEqual(res2.status, 401, "Doit renvoyer 401 pour de mauvais identifiants");
  console.log("✅ Test 2 : Rejet mauvais identifiants validé.");

  // Test 3 : Connexion avec code de transition CN2026
  const req3 = new NextRequest("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "CN2026" }),
  });
  const res3 = await POST(req3);
  assert.strictEqual(res3.status, 200, "Doit renvoyer 200 pour le code de transition");
  const data3 = await res3.json();
  assert.strictEqual(data3.success, true);
  assert.strictEqual(data3.user.role, "ADMIN");
  assert.strictEqual(data3.user.username, "superadmin");
  const setCookieHeader = res3.headers.get("set-cookie");
  assert(setCookieHeader && setCookieHeader.includes("celebration_admin_session"), "Doit déposer le cookie de session");
  console.log("✅ Test 3 : Connexion valide avec cookie de session et rôle ADMIN validée.");

  console.log("🎉 Tous les tests de l'API /api/admin/login sont validés !");
}

runLoginTests().catch((err) => {
  console.error("❌ Échec test login API :", err);
  process.exit(1);
});
