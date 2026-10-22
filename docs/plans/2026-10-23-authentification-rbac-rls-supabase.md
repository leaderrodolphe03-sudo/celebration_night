# Plan d'Implémentation : Authentification Sécurisée RBAC, Sécurité RLS Supabase & Gestion de l'Équipe

> **Pour l'agent d'exécution :** Chaque tâche se valide étape par étape via les cases à cocher (`- [ ]`). Ne pas passer à la tâche suivante sans avoir validé la suite de tests associée.

**Objectif :** Remplacer le mot de passe partagé par un système d'authentification multi-utilisateurs RBAC (Admin principal vs Staff auxiliaire) avec contrôle d'accès strict, sécurisation RLS sur Supabase et interface de gestion d'équipe.
**Architecture :** Stockage des comptes dans la table `admin_users` de Supabase avec hachage scrypt + sel aléatoire, sessions scellées par cookie HTTPOnly (HMAC-SHA256). Interception Edge via `middleware.ts` pour rediriger les comptes `STAFF` vers le scanner, protection des routes API par rôle (`ADMIN` vs `STAFF`), et création/suppression des comptes auxiliaires via `/admin/equipe`.
**Stack Technique :** Next.js 14 (App Router), TypeScript, Tailwind CSS, `@supabase/supabase-js`, Node.js Crypto (`scrypt`, `timingSafeEqual`), Zod.
**Spécification source :** `docs/specs/2026-10-23-authentification-rbac-rls-supabase.md`

## Contraintes Globales
- Aucune régression sur le formulaire d'inscription public des participants ni sur la génération de billets.
- Pas de dépendance à Gotrue / Supabase Auth client côté navigateur : toutes les vérifications passent par les Route Handlers Next.js avec `SUPABASE_SERVICE_ROLE_KEY`.
- Compatibilité stricte du middleware avec l'environnement Edge Runtime (Web Crypto API uniquement, pas de modules Node `fs` ou `crypto`).
- Zéro placeholder ("TODO", "TBD") dans le code produit.

## Focus de Revue (5 Cas Limites Critiques)
1. Requête anonyme directe sur Supabase $\rightarrow$ RLS bloque avec code 42501 (interdit au public).
2. Compte `STAFF` tentant d'accéder à `/admin/dashboard`, `/admin/participants`, `/admin/billets` ou `/admin/equipe` $\rightarrow$ Redirection forcée automatique vers `/admin/scanner` par le middleware et 403 Forbidden sur les APIs associées.
3. Super Admin tentant de supprimer son propre compte depuis l'interface équipe $\rightarrow$ Rejet 400 avec message « Impossible de supprimer votre propre compte ».
4. Tentative de création d'un compte avec un identifiant court déjà utilisé (insensible à la casse, ex. `Porte1` vs `porte1`) $\rightarrow$ Rejet 409 avec message explicite.
5. Saisie d'espaces superflus ou de casse différente lors de la connexion $\rightarrow$ Nettoyage (`trim()`, `toLowerCase()`) pour une expérience fluide sur smartphone.

---

### Tâche 1 : Schéma SQL Supabase, Script de migration & Politiques RLS

**Fichiers concernés :**
- Création : `lib/db/migrations/20261023_init_admin_users_and_rls.sql`
- Création : `scripts/seed-admin.mjs`
- Test : `tests/db/test-rls.mjs`

**Interfaces :**
- *Expose* : Table `public.admin_users`, politiques RLS sur `participants`, `tickets`, `contact_messages`, `admin_users`.

- [ ] **Étape 1 : Rédiger le fichier SQL de migration et RLS**
  Créer `lib/db/migrations/20261023_init_admin_users_and_rls.sql` contenant la création de la table `admin_users`, les index sur `LOWER(username)` et `LOWER(email)`, et les politiques RLS strictes garantissant que seul `service_role` a les accès `ALL`.

- [ ] **Étape 2 : Créer le script de génération du hash initial du Super Admin**
  Créer `scripts/seed-admin.mjs` utilisant scrypt pour générer le hash et le sel pour l'administrateur principal initial et insérer le compte dans Supabase via `SUPABASE_SERVICE_ROLE_KEY`.

- [ ] **Étape 3 : Créer et exécuter le test de validation RLS (`test-rls.mjs`)**
  Vérifier que :
  1. L'accès direct avec `NEXT_PUBLIC_SUPABASE_ANON_KEY` sur `admin_users` et `participants` est refusé (RLS violation).
  2. L'accès avec `SUPABASE_SERVICE_ROLE_KEY` permet la lecture et l'écriture.
  - Commande : `node tests/db/test-rls.mjs`
  - Résultat attendu : Code de sortie 0.

- [ ] **Étape 4 : Commit Git atomique**
  ```bash
  git add lib/db/migrations scripts tests/db
  git commit -m "feat(db): schema sql admin_users et politiques rls supabase"
  ```

---

### Tâche 2 : Extension de SupabaseStorage & Types TypeScript

**Fichiers concernés :**
- Modification : `lib/types.ts`
- Modification : `lib/crypto-security.ts`
- Modification : `lib/db/supabase-storage.ts`
- Test : `tests/auth/test-admin-storage.mjs`

**Interfaces :**
- *Consomme* : `hashPassword`, `verifyPassword` (de `lib/crypto-security.ts`)
- *Expose* : 
  - `getAdminByUsernameOrEmail(identifier: string): Promise<AdminUser | null>`
  - `createAdminUser(data: { username: string; name: string; password: string; role?: AdminRole; email?: string }): Promise<Omit<AdminUser, 'passwordHash' | 'salt'>>`
  - `listAdminUsers(): Promise<Omit<AdminUser, 'passwordHash' | 'salt'>[]>`
  - `deleteAdminUser(id: string): Promise<boolean>`

- [ ] **Étape 1 : Mettre à jour `lib/types.ts` et `lib/crypto-security.ts`**
  Ajouter `username` à `AdminUser` et `SessionData`.

- [ ] **Étape 2 : Écrire le test d'intégration `tests/auth/test-admin-storage.mjs`**
  Tester la création, la recherche par identifiant insensible à la casse, le listing et la suppression d'un compte auxiliaire.

- [ ] **Étape 3 : Implémenter les 4 méthodes dans `lib/db/supabase-storage.ts`**
  Coder `getAdminByUsernameOrEmail`, `createAdminUser`, `listAdminUsers`, et `deleteAdminUser`.

- [ ] **Étape 4 : Lancer le test et valider le succès**
  - Commande : `node tests/auth/test-admin-storage.mjs`
  - Résultat attendu : Succès avec code de sortie 0.

- [ ] **Étape 5 : Commit Git atomique**
  ```bash
  git add lib/types.ts lib/crypto-security.ts lib/db/supabase-storage.ts tests/auth
  git commit -m "feat(storage): methodes supabase pour la gestion des admin_users"
  ```

---

### Tâche 3 : Nouvelle Route API Authentification (`POST /api/admin/login`)

**Fichiers concernés :**
- Modification : `app/api/admin/login/route.ts`
- Modification : `app/api/admin/me/route.ts`
- Test : `tests/api/test-login.mjs`

**Interfaces :**
- *Consomme* : `supabaseStorage.getAdminByUsernameOrEmail`, `verifyPassword`, `setSessionCookie`
- *Expose* : Endpoint `POST /api/admin/login` retournant `{ success: true, user: { id, username, name, role } }` et cookie de session.

- [ ] **Étape 1 : Écrire le test de route API `tests/api/test-login.mjs`**
  Tester :
  - Identifiant vide ou manquant $\rightarrow$ 400
  - Identifiant inexistant $\rightarrow$ 401
  - Mot de passe erroné $\rightarrow$ 401
  - Identifiants valides Super Admin $\rightarrow$ 200 + cookie de session + rôle ADMIN
  - Identifiants valides Staff Auxiliaire $\rightarrow$ 200 + cookie de session + rôle STAFF

- [ ] **Étape 2 : Récrire `app/api/admin/login/route.ts`**
  Remplacer la validation du code statique `CN2026` par l'interrogation de Supabase avec hachage scrypt.
  Mettre à jour `app/api/admin/me/route.ts` pour retourner `username` en plus de `userId`, `name`, `role`.

- [ ] **Étape 3 : Valider le test**
  - Commande : `node tests/api/test-login.mjs`
  - Résultat attendu : Code 0.

- [ ] **Étape 4 : Commit Git atomique**
  ```bash
  git add app/api/admin/login app/api/admin/me tests/api/test-login.mjs
  git commit -m "feat(auth): authentification securisee bdd sur api/admin/login"
  ```

---

### Tâche 4 : Cloisonnement RBAC dans le Middleware Edge et APIs

**Fichiers concernés :**
- Modification : `middleware.ts`
- Modification : `app/api/admin/stats/route.ts`
- Modification : `app/api/admin/participants/route.ts`
- Modification : `app/api/admin/billets/route.ts`
- Modification : `app/api/admin/scan/route.ts`
- Test : `tests/api/test-rbac-access.mjs`

**Interfaces :**
- *Consomme* : `verifySessionTokenEdge` (de `middleware.ts`), `getSessionUser` (de `lib/auth-session.ts`)
- *Expose* : Blocage automatique des routes réservées aux admins pour les comptes staff.

- [ ] **Étape 1 : Mettre à jour `middleware.ts`**
  Détecter le champ `role` dans le payload décodé.
  Si `role === "STAFF"` :
  - Si l'URL demandée n'est pas `/admin/scanner` (ex. `/admin/dashboard`, `/admin/participants`, `/admin/billets`, `/admin/equipe`) : rediriger immédiatement vers `/admin/scanner`.
  - Si sur `/admin/login` : rediriger vers `/admin/scanner`.

- [ ] **Étape 2 : Sécuriser les Route Handlers API**
  Dans `stats`, `participants`, `billets` :
  Vérifier `if (session.role !== "ADMIN") return NextResponse.json({ error: "Accès interdit." }, { status: 403 });`
  Dans `scan` : Consigner `session.name || session.username` dans le champ `scannedBy`.

- [ ] **Étape 3 : Valider avec le test `test-rbac-access.mjs`**
  - Commande : `node tests/api/test-rbac-access.mjs`
  - Résultat attendu : Code 0.

- [ ] **Étape 4 : Commit Git atomique**
  ```bash
  git add middleware.ts app/api/admin/stats app/api/admin/participants app/api/admin/billets app/api/admin/scan tests/api/test-rbac-access.mjs
  git commit -m "security(rbac): cloisonnement strict du middleware edge et des api admin"
  ```

---

### Tâche 5 : API de Gestion de l'Équipe (`/api/admin/users`)

**Fichiers concernés :**
- Création : `app/api/admin/users/route.ts`
- Création : `app/api/admin/users/[id]/route.ts`
- Test : `tests/api/test-users-api.mjs`

**Interfaces :**
- *Consomme* : `supabaseStorage.listAdminUsers`, `supabaseStorage.createAdminUser`, `supabaseStorage.deleteAdminUser`
- *Expose* :
  - `GET /api/admin/users` $\rightarrow$ Liste des comptes (réservé `ADMIN`)
  - `POST /api/admin/users` $\rightarrow$ Création compte auxiliaire (réservé `ADMIN`)
  - `DELETE /api/admin/users/[id]` $\rightarrow$ Révocation d'un compte (réservé `ADMIN`, auto-suppression interdite)

- [ ] **Étape 1 : Écrire le test d'API `tests/api/test-users-api.mjs`**
  Tester :
  - Appel non connecté $\rightarrow$ 401
  - Appel avec compte STAFF $\rightarrow$ 403
  - Appel avec compte ADMIN $\rightarrow$ 200, création réussie d'un compte auxiliaire, listing, puis suppression.
  - Tentative de suppression de son propre compte $\rightarrow$ 400.

- [ ] **Étape 2 : Implémenter `app/api/admin/users/route.ts` et `app/api/admin/users/[id]/route.ts`**
  Validation stricte des paramètres (identifiant court sans espaces, mot de passe $\ge$ 6 caractères).

- [ ] **Étape 3 : Valider le test**
  - Commande : `node tests/api/test-users-api.mjs`
  - Résultat attendu : Code 0.

- [ ] **Étape 4 : Commit Git atomique**
  ```bash
  git add app/api/admin/users tests/api/test-users-api.mjs
  git commit -m "feat(api): routes crud equipe pour le super admin"
  ```

---

### Tâche 6 : Refonte UI de la Page de Connexion (`/admin/login`)

**Fichiers concernés :**
- Modification : `app/admin/login/page.tsx`

**Interfaces :**
- *Consomme* : API `/api/admin/login`
- *Expose* : Interface utilisateur de connexion avec gestion des identifiants et redirection dynamique selon le rôle.

- [ ] **Étape 1 : Mettre à jour `app/admin/login/page.tsx`**
  - Remplacer le champ unique par 2 champs :
    1. Identifiant court ou Email
    2. Mot de passe avec toggle Afficher/Masquer (icône Eye/EyeOff)
  - Redirection automatique selon le rôle retourné : `/admin/scanner` pour le staff, `/admin/dashboard` pour le Super Admin.
  - Conserver le design cinématique "Obsidienne & Or Solaire".

- [ ] **Étape 2 : Commit Git atomique**
  ```bash
  git add app/admin/login/page.tsx
  git commit -m "feat(ui): refonte du formulaire de connexion admin avec identifiant et mot de passe"
  ```

---

### Tâche 7 : Interface de Navigation & Gestion d'Équipe (`/admin/equipe`)

**Fichiers concernés :**
- Modification : `components/admin/AdminNav.tsx`
- Création : `app/admin/equipe/page.tsx`
- Modification : `app/admin/dashboard/page.tsx` (ajout d'une carte d'accès rapide vers l'équipe)

**Interfaces :**
- *Consomme* : API `/api/admin/users`, `user` en session

- [ ] **Étape 1 : Adapter `components/admin/AdminNav.tsx` selon le rôle**
  - Si `user?.role === "STAFF"` : n'afficher que l'onglet « Scanner Entrées » et le bouton déconnexion.
  - Si `user?.role === "ADMIN"` : afficher « Dashboard », « Scanner », « Participants », « Billets » et le nouvel onglet « Équipe ».

- [ ] **Étape 2 : Créer la page `app/admin/equipe/page.tsx`**
  - Formulaire de création rapide de compte auxiliaire (Nom, Identifiant, Mot de passe avec bouton "Générer un mot de passe").
  - Tableau des comptes actifs avec badge Rôle, date d'ajout.
  - Bouton « Copier les accès » (formate identifiant + mot de passe pour partage WhatsApp en 1 clic).
  - Bouton « Supprimer » avec modale de confirmation.

- [ ] **Étape 3 : Ajouter un bouton d'accès rapide sur `app/admin/dashboard/page.tsx`**
  Permettre au Super Admin d'accéder à la gestion de l'équipe directement depuis le Dashboard.

- [ ] **Étape 4 : Commit Git atomique**
  ```bash
  git add components/admin/AdminNav.tsx app/admin/equipe app/admin/dashboard/page.tsx
  git commit -m "feat(ui): page de gestion d'equipe et adaptation du menu selon le role"
  ```

---

### Tâche 8 : Validation End-to-End, Typecheck TypeScript & Nettoyage

**Fichiers concernés :**
- Tous les fichiers modifiés

- [ ] **Étape 1 : Vérification globale TypeScript**
  - Commande : `npx tsc --noEmit`
  - Résultat attendu : 0 erreur de typage.

- [ ] **Étape 2 : Compilation du projet en production**
  - Commande : `npm run build`
  - Résultat attendu : Code de sortie 0, toutes les routes générées avec succès.

- [ ] **Étape 3 : Commit final et documentation**
  ```bash
  git commit -m "chore: finalisation et validation du systeme rbac et securite supabase"
  ```
