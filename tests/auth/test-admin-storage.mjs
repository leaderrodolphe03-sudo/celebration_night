import assert from "assert";
import crypto from "crypto";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../../lib/crypto-security.js";

async function runStorageAuthTests() {
  console.log("🧪 Test unitaire de la couche cryptographique et des sessions RBAC...");

  // 1. Test du hachage de mot de passe (scrypt + sel)
  const password = "SecretStaffPassword2026!";
  const { hash, salt } = hashPassword(password);

  assert(hash && hash.length === 128, "Le hash scrypt 64 octets hex doit comporter 128 caractères");
  assert(salt && salt.length === 32, "Le sel 16 octets hex doit comporter 32 caractères");

  // Vérification mot de passe correct
  const isMatch = verifyPassword(password, hash, salt);
  assert.strictEqual(isMatch, true, "Le mot de passe valide doit être vérifié avec succès");

  // Vérification mauvais mot de passe
  const isBadMatch = verifyPassword("MauvaisMotDePasse", hash, salt);
  assert.strictEqual(isBadMatch, false, "Un mauvais mot de passe doit échouer");

  console.log("✅ Hachage et vérification de mot de passe validés.");

  // 2. Test des sessions HMAC-SHA256 avec rôles RBAC
  const staffSessionPayload = {
    userId: "user-uuid-1234",
    username: "porte1",
    email: "porte1@celebration.org",
    name: "Accueil Porte 1",
    role: "STAFF",
  };

  const staffToken = createSessionToken(staffSessionPayload);
  assert(staffToken && staffToken.includes("."), "Le jeton de session doit être signé avec signature");

  const decodedStaff = verifySessionToken(staffToken);
  assert(decodedStaff, "Le jeton de session valide doit être décodé");
  assert.strictEqual(decodedStaff.username, "porte1");
  assert.strictEqual(decodedStaff.role, "STAFF");

  // Test admin session
  const adminSessionPayload = {
    userId: "admin-uuid-0001",
    username: "superadmin",
    email: "admin@celebrationnight.org",
    name: "Direction Hagiazo",
    role: "ADMIN",
  };
  const adminToken = createSessionToken(adminSessionPayload);
  const decodedAdmin = verifySessionToken(adminToken);
  assert.strictEqual(decodedAdmin.role, "ADMIN");

  console.log("✅ Génération et décodage des sessions RBAC validés.");

  // 3. Test de falsification de jeton
  const tamperedToken = staffToken.substring(0, staffToken.length - 4) + "abcd";
  const decodedTampered = verifySessionToken(tamperedToken);
  assert.strictEqual(decodedTampered, null, "Un jeton altéré doit être rejeté");

  console.log("✅ Protection anti-falsification de session validée.");
  console.log("🎉 Tous les tests unitaires de sécurité et stockage sont validés !");
}

runStorageAuthTests().catch((err) => {
  console.error("❌ Échec test storage auth :", err);
  process.exit(1);
});
