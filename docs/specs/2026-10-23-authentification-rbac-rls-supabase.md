# Spécification Technique : Authentification Sécurisée RBAC, Sécurité RLS Supabase & Gestion de l'Équipe

- **Projet** : CELEBRATION NIGHT (HAGIAZO Ministry)
- **Auteur** : Antigravity & Équipe Projet
- **Date** : 23 Octobre 2026
- **Statut** : En attente de validation utilisateur

---

## 1. Contexte & Objectifs

Actuellement, l'accès à l'espace administrateur repose sur un code secret partagé unique défini dans les variables d'environnement (`ADMIN_ACCESS_CODE=CN2026`). 

L'objectif de cette évolution est de déployer un système de gestion des accès de niveau production :
1. **Suppression définitive du mot de passe statique partagé**.
2. **Authentification par Identifiant court (ou Email) + Mot de passe** individuel pour chaque membre de l'organisation.
3. **Contrôle d'accès basé sur les rôles (RBAC - Role-Based Access Control)** :
   - **`ADMIN` (Compte Principal / Super Admin)** : Accès complet au Dashboard des statistiques, liste des participants, export CSV, suivi pastoral des nouvelles âmes, gestion de tous les billets, scanner, et création/suppression des comptes auxiliaires.
   - **`STAFF` (Comptes Auxiliaires / Équipe de Contrôle Terrain)** : Accès strictement restreint au Scanner mobile (`/admin/scanner`) pour l'accueil/entrée et pour la validation des décisions pour Christ (« Âmes pour Christ »). Aucun accès au Dashboard ni aux listes de données personnelles.
4. **Sécurisation hermétique de Supabase via RLS (Row Level Security)** : Les tables de la base de données ne doivent autoriser aucune écriture directe non contrôlée depuis l'extérieur. Toutes les opérations passent par le serveur Next.js avec la clé protégée `service_role`.
5. **Gestion de l'équipe par le Super Admin** : Interface conviviale permettant à l'administrateur principal de créer des comptes auxiliaires (ex: nom `Porte Principale 1`, identifiant `porte1`, mot de passe) et de révoquer un compte à tout moment.

---

## 2. Modèle de Données & Configuration Supabase

### 2.1. Table `admin_users`

Une table dédiée `admin_users` est créée dans le schéma `public` de Supabase.

```sql
-- 1. Création de la table des utilisateurs administrateurs & staff
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'STAFF')) DEFAULT 'STAFF',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour une recherche rapide lors du login
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (LOWER(email));
```

### 2.2. Politiques RLS (Row Level Security)

Les données de la billetterie et des participants doivent être inaccessibles aux requêtes directes non authentifiées avec la clé publique `anon`.

```sql
-- 2. Activation du RLS sur l'ensemble des tables sensibles
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Suppression des anciennes politiques ouvertes éventuelles
DROP POLICY IF EXISTS "Deny all anon on admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Service role full access on admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Deny direct anon on participants" ON public.participants;
DROP POLICY IF EXISTS "Service role full access on participants" ON public.participants;
DROP POLICY IF EXISTS "Deny direct anon on tickets" ON public.tickets;
DROP POLICY IF EXISTS "Service role full access on tickets" ON public.tickets;

-- 4. Politiques RLS : Le service_role (serveur Next.js) a les pleins droits, le public est bloqué en direct
CREATE POLICY "Service role full access on admin_users" 
  ON public.admin_users 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role full access on participants" 
  ON public.participants 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role full access on tickets" 
  ON public.tickets 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role full access on contact_messages" 
  ON public.contact_messages 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
```

### 2.3. Hachage Cryptographique

Les mots de passe sont hachés avec le moteur cryptographique scrypt déjà présent dans le projet (`crypto.scryptSync(password, salt, 64)`) avec un sel aléatoire de 16 octets (`crypto.randomBytes(16).toString("hex")`). 

La comparaison lors de la connexion utilise `crypto.timingSafeEqual` pour empêcher toute attaque temporelle (*timing attack*).

---

## 3. Matrice des Rôles & Permissions (RBAC)

| Ressource / Action | Rôle `ADMIN` (Principal) | Rôle `STAFF` (Auxiliaire) | Non connecté |
| :--- | :---: | :---: | :---: |
| **Accès `/admin/dashboard`** (KPIs, stats, récents) | ✅ Autorisé | ❌ Bloqué (Redirection `/admin/scanner`) | ❌ Redirection `/admin/login` |
| **Accès `/admin/participants`** (Liste complète, recherche, export CSV) | ✅ Autorisé | ❌ Bloqué (Redirection `/admin/scanner`) | ❌ Redirection `/admin/login` |
| **Accès `/admin/billets`** (Recherche, filtres, détails) | ✅ Autorisé | ❌ Bloqué (Redirection `/admin/scanner`) | ❌ Redirection `/admin/login` |
| **Accès `/admin/scanner`** (Caméra, scan entrées, âmes pour Christ) | ✅ Autorisé | ✅ Autorisé | ❌ Redirection `/admin/login` |
| **Gestion Équipe `/admin/equipe`** (Créer/révoquer comptes staff) | ✅ Autorisé | ❌ Bloqué (Redirection `/admin/scanner`) | ❌ Redirection `/admin/login` |
| **API `GET /api/admin/stats`** | ✅ 200 OK | ❌ 403 Forbidden | ❌ 401 Unauthorized |
| **API `GET /api/admin/participants`** | ✅ 200 OK | ❌ 403 Forbidden | ❌ 401 Unauthorized |
| **API `GET /api/admin/billets`** | ✅ 200 OK | ❌ 403 Forbidden | ❌ 401 Unauthorized |
| **API `POST /api/admin/scan`** | ✅ 200 OK (Nom loggué) | ✅ 200 OK (Nom loggué) | ❌ 401 Unauthorized |
| **API `GET/POST/DELETE /api/admin/users`** | ✅ 200 OK | ❌ 403 Forbidden | ❌ 401 Unauthorized |

---

## 4. Architecture Logique & Flux Utilisateur

### 4.1. Flux de Connexion (`/admin/login`)
1. L'utilisateur saisit son **Identifiant court** (ex: `superadmin` ou `porte1`) ou son **Email**, ainsi que son **Mot de passe**.
2. La route API `POST /api/admin/login` interroge la table `admin_users` via Supabase (requête insensible à la casse).
3. Si le compte existe, le mot de passe est vérifié avec `verifyPassword`.
4. En cas de succès :
   - Un jeton JWT de session signé avec `AUTH_SECRET` (HMAC-SHA256) est généré, contenant `{ userId, username, email, name, role }`.
   - Ce jeton est placé dans un cookie HTTPOnly sécurisé (`celebration_admin_session`, `SameSite=Lax`, `MaxAge=24h`).
   - L'API renvoie le rôle de l'utilisateur.
   - Si `role === "STAFF"` : redirection immédiate vers `/admin/scanner`.
   - Si `role === "ADMIN"` : redirection vers `/admin/dashboard`.

### 4.2. Middleware Edge Next.js (`middleware.ts`)
Le middleware s'exécute sur le réseau Edge pour chaque requête vers `/admin/*` :
- Vérifie la signature et la validité temporelle du cookie de session.
- Si le cookie est absent ou invalide, redirige vers `/admin/login`.
- Si le rôle est `STAFF` et que la route demandée n'est pas `/admin/scanner` : redirection automatique immédiate vers `/admin/scanner`.
- Si l'utilisateur est déjà connecté et visite `/admin/login` : redirection vers `/admin/dashboard` (si Admin) ou `/admin/scanner` (si Staff).

### 4.3. Interface de Gestion d'Équipe (`/admin/equipe`)
Réservée au Super Admin, accessible depuis le menu d'administration et depuis un raccourci sur le Dashboard :
- **Formulaire de création rapide** :
  - Nom / Description du poste (ex. : `Porte A - Vérification Ouest`).
  - Identifiant court unique (ex. : `porte-a` ou `staff-luc`).
  - Mot de passe (avec bouton de génération automatique d'un mot de passe mémorisable ou saisie libre).
- **Liste des comptes existants** :
  - Tableau des comptes : Nom, Identifiant, Rôle (`Admin` ou `Staff`), Date de création.
  - Bouton « Copier les identifiants » (prêt à coller sur WhatsApp/SMS pour transmettre l'accès au bénévole en 1 clic).
  - Bouton de suppression/révocation immédiate (sauf sur son propre compte Super Admin).

---

## 5. Plan de Transition & Compte Super Admin Initial

Pour assurer une bascule sans rupture :
1. Un script d'initialisation (ou commande SQL directe) permet d'insérer le premier compte **Super Admin** dans Supabase avec un identifiant et un mot de passe choisi par l'administrateur.
2. Une fois ce compte créé et testé, le mot de passe statique par défaut `CN2026` / `2026` est définitivement retiré du code.

---

## 6. Stratégie de Vérification

1. **Vérification RLS Supabase** :
   - Tenter une lecture/écriture directe avec la clé publique `anon` : doit échouer avec l'erreur `42501` (violation de RLS).
   - Tenter l'inscription publique d'un participant via l'API Next.js : doit réussir (passage via `service_role`).
2. **Vérification Authentification** :
   - Connexion réussie avec le compte Super Admin -> arrivée sur `/admin/dashboard`.
   - Connexion réussie avec un compte Staff -> arrivée directe sur `/admin/scanner`.
   - Connexion rejetée avec mauvais mot de passe ou identifiant inexistant.
3. **Vérification RBAC & Cloisonnement** :
   - Avec un compte Staff connecté, tenter d'accéder à `/admin/dashboard`, `/admin/participants`, `/admin/billets`, `/admin/equipe` -> interception et redirection forcée vers `/admin/scanner`.
   - Tenter d'appeler l'API `GET /api/admin/stats` avec la session Staff -> retour `403 Forbidden`.
4. **Vérification Scan multi-agents** :
   - Effectuer un scan d'entrée et un scan "Âmes pour Christ" avec un compte auxiliaire -> vérifier que `scannedBy` dans la base enregistre bien le nom du staff connecté.
5. **Vérification Gestion d'Équipe** :
   - Créer un compte auxiliaire depuis l'interface Super Admin, se déconnecter, se connecter avec ce nouveau compte, vérifier le scan, puis le supprimer depuis l'admin principal.
