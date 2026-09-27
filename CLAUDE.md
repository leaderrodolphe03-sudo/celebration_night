# 🧠 CLAUDE.MD — Registre Mémoire & Suivi d'Architecture du Projet

> **Projet** : CÉLÉBRATION NIGHT (HAGIAZO Ministry)  
> **Date de création du registre** : 27 Septembre 2026  
> **Dernière mise à jour** : 27 Septembre 2026  
> **Objectif Final** : Base de données hébergée sur **Supabase** (PostgreSQL)  
> **État Actuel** : Stockage local JSON (`data/db.json`) temporaire

---

## 📌 1. Vue d'Ensemble & Objectifs Stratégiques

### Vision du Projet
Application web événementielle et portail d'administration pour la veillée « CÉLÉBRATION NIGHT », organisée par HAGIAZO Ministry.
- **Front public** : Vitrine, présentation, programme, artistes, blog, contact/FAQ, lecteur worship, inscription participants avec génération de billets haute fidélité (QR codes sécurisés infalsifiables sans PII).
- **Back-office / Admin** : Portique de contrôle et scanner caméra temps réel avec Web Audio API et vibrations haptiques, dashboard des KPIs en direct, gestion et export CSV des participants et billets.

### Décision Clé sur la Persistance
- **Phase transitoire actuelle** : Maintien du moteur JSON (`data/db.json`) pour assurer un fonctionnement local immédiat, sans friction, mais en fiabilisant l'accès aux données avec une couche d'abstraction (Repository pattern).
- **Phase cible** : Migration propre vers **Supabase** (PostgreSQL) avec Prisma / Supabase JS Client, sécurisation RLS (Row-Level Security) et webhooks si nécessaire.

---

## 🔍 2. Bilan de l'Audit Architectural Initial

### 🔴 Problèmes Critiques Détectés
1. **Écrasement accidentel du Spacing Tailwind** :
   - Dans `tailwind.config.ts`, `extend.spacing` écrasait les clés `"8"`, `"16"`, `"64"`, ce qui réduisait `w-64` (viseur du scanner) de 256px à 64px et `h-8 w-8` (boîtes d'icônes) de 32px à 8px.
2. **Absence de Route Groups dans Next.js App Router** :
   - `app/layout.tsx` appliquait `<Navbar />`, `<main className="flex-1 pt-16">` et `<Footer />` sur **toutes** les routes, forçant des hacks JS côté client pour masquer la navbar sur `/admin/*` et polluant l'impression des billets `/billet/[ticketNumber]`.
   - Absence de `app/admin/layout.tsx`, forçant chaque page admin à importer manuellement `<AdminNav />`.
3. **Absence de `middleware.ts`** :
   - Les pages d'administration n'étaient protégées qu'en client-side via un `useEffect` / `fetch('/api/admin/me')`, provoquant un risque de fuite de vue et un flash de contenu non autorisé.
4. **Fuite potentielle de données personnelles dans Git** :
   - `data/db.json` stocke des coordonnées réelles et les hashs de mots de passe mais n'était pas exclu dans `.gitignore`.
5. **Schizophrénie Prisma vs JSON** :
   - Dépendances Prisma présentes, scripts présents, mais code 100% exécuté sur un fichier JSON avec méthodes synchrones `fs.readFileSync/writeFileSync`. Script `prisma/seed.ts` manquant.
6. **Hydration Mismatch dans `Countdown.tsx`** :
   - Différence de temps calculée avec `Date.now()` au SSR vs client sans garde de montage.
7. **Redirections fantômes** :
   - `app/hagiazo/page.tsx` et `app/informations/page.tsx` contenaient de faux composants au lieu de vraies redirections HTTP dans `next.config.mjs`.
8. **Crash du Build Next.js sur `/medias` (Event Handler dans Server Component)** :
   - `app/medias/page.tsx` contenait un handler `onClick` (ligne 218) sans la directive `"use client"`, provoquant un échec bloquant de la génération statique lors de `next build`.

---

## 🗺️ 3. Plan Directeur & Statut des Chantiers

| N° | Chantier | Description | Statut |
| :--- | :--- | :--- | :--- |
| **01** | **Correction Tailwind** | Supprimer l'écrasement de `spacing` dans `tailwind.config.ts` | ✅ Terminé |
| **02** | **Sécurité & `.gitignore`** | Protéger `data/` et clés locales de Git, créer `middleware.ts` | ✅ Terminé |
| **03** | **Route Groups App Router** | Structurer `app/(public)`, `app/admin` et `app/(print)` | ✅ Terminé |
| **04** | **Layouts Spécifiques** | Layout public dédié, layout admin indépendant, layout print épuré | ✅ Terminé |
| **05** | **Nettoyage Redirections** | Migrer `/hagiazo` et `/informations` dans `next.config.mjs` (308) | ✅ Terminé |
| **06** | **Composants & Hydratation** | Corriger `Countdown.tsx` (garde mounted) et `MediaDownloadButton` (fix build) | ✅ Terminé |
| **07** | **Couche d'Abstraction BDD** | Interface `DatabaseRepository` mise en place pour préparer Supabase | ✅ Terminé |
| **08** | **Migration Supabase** | Migration des tables, variables d'env, RLS et seed Supabase | 📅 Prévu (Étape Ultérieure) |

---

## 🗃️ 4. Schéma de Données (Alignement Actuel & Supabase)

### Modèle Participant
- `id` : String (CUID ou UUID Supabase)
- `firstName` : String
- `lastName` : String
- `email` : String (Indexé)
- `phone` : String
- `country` : String
- `city` : String
- `numberOfGuests` : Integer (1 à 10)
- `ticketType` : Enum (`STANDARD` | `VIP`)
- `source` : String? (Canal d'acquisition)
- `createdAt` : DateTime (ISO)
- `updatedAt` : DateTime (ISO)

### Modèle Ticket
- `id` : String
- `ticketNumber` : String unique (Format `CN-2026-XXXXXX`)
- `qrToken` : String unique (SHA256 / 64 hex, sans PII)
- `ticketType` : Enum (`STANDARD` | `VIP`)
- `status` : Enum (`VALID` | `USED` | `CANCELLED`)
- `scannedAt` : DateTime?
- `scannedBy` : String?
- `participantId` : Relation -> Participant.id
- `createdAt` : DateTime
- `updatedAt` : DateTime

### Modèle AdminUser
- `id` : String
- `email` : String unique
- `name` : String?
- `passwordHash` : String (scrypt derived key)
- `salt` : String
- `role` : Enum (`ADMIN` | `STAFF`)
- `createdAt` : DateTime

### Modèle ContactMessage
- `id` : String
- `name` : String
- `email` : String
- `phone` : String?
- `subject` : String
- `message` : Text
- `status` : Enum (`NEW` | `READ` | `ARCHIVED`)
- `createdAt` : DateTime

---

## 📝 5. Journal des Modifications (Work Log)

- **27/09/2026** :
  - Audit complet de l'architecture du projet réalisé.
  - Identification des 8 anomalies clés (Tailwind spacing, routes Next.js, sécurité middleware, gitignore, prisma/json, hydration, crash build medias).
  - Validation de la feuille de route : Maintien temporaire du stockage JSON avec préparation de la passerelle vers Supabase.
  - Création du fichier mémoire `CLAUDE.md`.
  - Correction de `tailwind.config.ts` : suppression de l'écrasement de `spacing`.
  - Mise à jour de `.gitignore` pour exclure `data/` et les bases locales (`*.db`, `*.sqlite`).
  - Création de `middleware.ts` avec Web Crypto API pour verrouiller `/admin/*` côté serveur.
  - Mise à jour de `.env.example` avec les variables actuelles et la préparation Supabase.
  - Configuration des redirections 308 dans `next.config.mjs` et suppression des dossiers vides `app/hagiazo` et `app/informations`.
  - Restructuration Next.js App Router :
    - Création de `app/(public)/layout.tsx` pour isoler `Navbar` et `Footer`.
    - Déplacement des 11 pages publiques sous `app/(public)/`.
    - Création de `app/admin/layout.tsx` pour un affichage admin indépendant sans décalage.
    - Création de `app/(print)/layout.tsx` et déplacement de `app/billet` sous `app/(print)/`.
    - Allègement du `RootLayout` (`app/layout.tsx`).
    - Nettoyage des hacks dans `Navbar.tsx` et `Footer.tsx`.
  - Correction de `Countdown.tsx` avec une garde `mounted` contre le mismatch SSR.
  - Création de `components/media/MediaDownloadButton.tsx` et correction de `app/(public)/medias/page.tsx` pour éliminer le crash `next build`.
  - Mise en place de l'interface `DatabaseRepository` dans `lib/db/storage.ts` pour préparer l'injection de Supabase.
