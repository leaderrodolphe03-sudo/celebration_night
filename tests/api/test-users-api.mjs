import assert from "assert";
import { GET, POST } from "../../app/api/admin/users/route.js";
import { DELETE } from "../../app/api/admin/users/[id]/route.js";
import { createSessionToken } from "../../lib/crypto-security.js";
import { NextRequest } from "next/server.js";

async function runUsersApiTests() {
  console.log("🧪 Test des routes d'API de gestion d'équipe /api/admin/users...");

  // 1. Non authentifié -> 401
  const reqAnon = new NextRequest("http://localhost:3000/api/admin/users");
  const resAnon = await GET(reqAnon);
  assert.strictEqual(resAnon.status, 401, "GET anonyme doit renvoyer 401");
  console.log("✅ Test 1 : Anonyme rejeté avec 401.");

  // 2. Compte Staff -> 403
  const staffToken = createSessionToken({
    userId: "staff-1",
    username: "porte1",
    name: "Staff 1",
    email: "staff1@celebration.org",
    role: "STAFF",
  });
  const reqStaff = new NextRequest("http://localhost:3000/api/admin/users", {
    headers: { cookie: `celebration_admin_session=${staffToken}` },
  });
  const resStaff = await GET(reqStaff);
  assert.strictEqual(resStaff.status, 403, "Compte Staff doit renvoyer 403");
  console.log("✅ Test 2 : Staff rejeté avec 403.");

  // 3. Validation payload invalide par Admin -> 400
  const adminToken = createSessionToken({
    userId: "admin-master",
    username: "superadmin",
    name: "Super Admin",
    email: "direction@celebrationnight.org",
    role: "ADMIN",
  });
  const reqBadData = new NextRequest("http://localhost:3000/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: `celebration_admin_session=${adminToken}`,
    },
    body: JSON.stringify({
      username: "a", // Trop court (< 2)
      name: "Jean",
      password: "123", // Trop court (< 6)
    }),
  });
  const resBadData = await POST(reqBadData);
  assert.strictEqual(resBadData.status, 400, "Données invalides doivent renvoyer 400");
  const badDataJson = await resBadData.json();
  assert(badDataJson.error, "Doit contenir un message d'erreur de validation explicite");
  console.log("✅ Test 3 : Validation Zod des paramètres rejetant les entrées invalides validée.");

  // 4. Tentative de suppression de son propre compte -> 400
  const reqSelfDelete = new NextRequest("http://localhost:3000/api/admin/users/admin-master", {
    method: "DELETE",
    headers: { cookie: `celebration_admin_session=${adminToken}` },
  });
  const resSelfDelete = await DELETE(reqSelfDelete, { params: { id: "admin-master" } });
  assert.strictEqual(resSelfDelete.status, 400, "Auto-suppression doit être bloquée avec 400");
  const selfDeleteJson = await resSelfDelete.json();
  assert(selfDeleteJson.error.includes("propre compte"), "Message explicite interdisant l'auto-suppression attendu");
  console.log("✅ Test 4 : Protection anti-suppression de son propre compte validée.");

  console.log("🎉 Tous les tests de l'API /api/admin/users sont validés avec succès !");
}

runUsersApiTests().catch((err) => {
  console.error("❌ Échec test users API :", err);
  process.exit(1);
});
