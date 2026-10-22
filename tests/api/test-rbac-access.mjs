import assert from "assert";
import { GET as getStats } from "../../app/api/admin/stats/route.js";
import { middleware } from "../../middleware.js";
import { createSessionToken } from "../../lib/crypto-security.js";
import { NextRequest } from "next/server.js";

async function runRbacTests() {
  console.log("🧪 Test de contrôle d'accès RBAC (API & Middleware Edge)...");

  // 1. Appel API stats sans cookie -> 401
  const reqAnon = new NextRequest("http://localhost:3000/api/admin/stats");
  const resAnon = await getStats(reqAnon);
  assert.strictEqual(resAnon.status, 401, "Accès anonyme sur stats doit être refusé (401)");
  console.log("✅ Test 1 : Anonyme bloqué avec 401.");

  // 2. Création token Staff
  const staffToken = createSessionToken({
    userId: "staff-1",
    username: "porte1",
    name: "Staff Porte 1",
    email: "porte1@celebration.org",
    role: "STAFF",
  });

  // 3. Appel API stats avec token Staff -> 403
  const reqStaff = new NextRequest("http://localhost:3000/api/admin/stats", {
    headers: {
      cookie: `celebration_admin_session=${staffToken}`,
    },
  });
  const resStaff = await getStats(reqStaff);
  assert.strictEqual(resStaff.status, 403, "Compte STAFF sur stats doit renvoyer 403 Forbidden");
  console.log("✅ Test 2 : Rôle STAFF bloqué avec 403 sur /api/admin/stats.");

  // 4. Test Middleware Edge : Staff tentant d'accéder à /admin/dashboard
  const reqMiddlewareStaff = new NextRequest("http://localhost:3000/admin/dashboard", {
    headers: {
      cookie: `celebration_admin_session=${staffToken}`,
    },
  });
  const resMiddlewareStaff = await middleware(reqMiddlewareStaff);
  assert(resMiddlewareStaff, "Le middleware doit renvoyer une réponse");
  assert.strictEqual(resMiddlewareStaff.status, 307, "Doit rediriger (307)");
  const redirectLocation = resMiddlewareStaff.headers.get("location");
  assert(redirectLocation && redirectLocation.includes("/admin/scanner"), "Staff doit être redirigé vers /admin/scanner");
  console.log("✅ Test 3 : Middleware redirige bien le compte STAFF vers /admin/scanner.");

  // 5. Test Middleware Edge : Admin accédant à /admin/dashboard
  const adminToken = createSessionToken({
    userId: "admin-1",
    username: "superadmin",
    name: "Direction",
    email: "direction@celebrationnight.org",
    role: "ADMIN",
  });
  const reqMiddlewareAdmin = new NextRequest("http://localhost:3000/admin/dashboard", {
    headers: {
      cookie: `celebration_admin_session=${adminToken}`,
    },
  });
  const resMiddlewareAdmin = await middleware(reqMiddlewareAdmin);
  // Pour un admin, middleware renvoie next() (statut 200)
  assert.strictEqual(resMiddlewareAdmin.status, 200, "Admin doit passer le middleware sans redirection");
  console.log("✅ Test 4 : Middleware laisse passer le Super Admin.");

  console.log("🎉 Tous les tests RBAC (APIs & Middleware) sont validés avec succès !");
}

runRbacTests().catch((err) => {
  console.error("❌ Échec test RBAC :", err);
  process.exit(1);
});
