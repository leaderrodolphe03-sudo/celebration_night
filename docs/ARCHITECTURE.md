# CELEBRATION NIGHT 2026 — Architecture

> Complète [`REQUIREMENTS.md`](../REQUIREMENTS.md). Ce document décrit **comment** le site est construit.
> Statut : étape 2 (architecture) et étape 3 (configuration) réalisées. Les pages seront migrées aux étapes 4 à 6.

## 1. Point de départ

Le dépôt contient déjà une application Next.js fonctionnelle (vitrine, inscription, billets QR, admin, scanner) stockée dans un fichier JSON local, avec une authentification maison.

**Décision : migrer l'existant plutôt que repartir de zéro.**

| On garde | On remplace |
|---|---|
| Structure App Router, groupes `(public)`, `(print)`, `admin` | Stockage `data/db.json` → Supabase PostgreSQL |
| Principe du QR code sans donnée personnelle | Auth maison (HMAC + comptes de démo) → Supabase Auth + rôles |
| Scanner caméra + saisie manuelle de secours | Validation en mémoire → fonction SQL atomique `validate_ticket` |
| Génération de badge / billet imprimable | Contenu codé en dur → tables administrables |
| Bebas Neue + Montserrat | Palette « braise » rouge → palette nuit / or / lumières de scène |

Le contenu inventé (date du 14 novembre, Abidjan, artistes non prévus, programme 18h) sera remplacé par les données du dossier à l'étape 4.

## 2. Stack

| Couche | Choix | Version |
|---|---|---|
| Framework | Next.js App Router, React Server Components | 16.4 / React 19.3 |
| Langage | TypeScript strict | 5.x |
| Style | Tailwind CSS + composants shadcn/ui (`components/ui`) | 3.4 |
| Données | Supabase (PostgreSQL, Auth, Storage) via `@supabase/ssr` | — |
| Validation | Zod (formulaires, routes, variables d'environnement `lib/env.ts`) | 3.x |
| Tests | Vitest + Testing Library (unitaires), Playwright (E2E), `tests/db/run.sh` (SQL/RLS) | — |
| Qualité | ESLint 9 (`eslint-config-next`), Prettier + tri des classes Tailwind | — |
| Hébergement | Vercel (préproduction + production) | — |

Next.js 14 a été abandonné : il cumulait des failles connues (contournement du middleware, déni de service, empoisonnement de cache), toutes corrigées en 16.x. `middleware.ts` devient `proxy.ts` (nouvelle convention Next 16).

## 3. Arborescence cible

```
app/
  (public)/                 pages publiques (layout avec Navbar/Footer)
    page.tsx                accueil
    a-propos/               vision, objectifs, public
    intervenants/           Haguiazo, chantres, serviteurs, orateur (+ statut)
    programme/
    galerie/
    archives/[annee]/
    partenaires/
    inscription/ · confirmation/ · mon-billet/
    contact/
    mentions-legales/ · confidentialite/
  (print)/billet/[ticketNumber]/   billet imprimable
  admin/
    login/
    (protected)/            layout qui vérifie la session + le rôle
      dashboard/ inscriptions/ billets/ scanner/
      contenus/{editions,intervenants,programme,medias,partenaires}/
      equipe/               super_admin uniquement
  api/                      route handlers (inscription, export CSV…)
components/
  ui/                       primitives shadcn/ui (button, input, dialog…)
  sections/                 blocs de page (Hero, Countdown, SpeakerGrid…)
  admin/
lib/
  env.ts                    variables d'environnement validées
  supabase/{client,server,admin}.ts
  validation/               schémas Zod partagés client/serveur
  data/                     requêtes de lecture (contenu publié)
supabase/
  migrations/               schéma, RLS, fonctions
  seed.sql                  données issues du dossier (non publiées)
tests/
  unit/ · e2e/ · db/
```

Les routes actuelles (`/artistes`, `/medias`, `/notre-histoire`…) recevront une redirection permanente vers les nouvelles adresses pour ne pas casser les liens déjà partagés.

## 4. Système de design

### Direction
Nuit de concert gospel : fond nuit profond, **or** comme couleur d'action et de titre, halos **bleu scène / violet / flamme** repris des affiches officielles, utilisés comme lumières et jamais comme couleur de texte.

### Couleurs (`app/globals.css`, jetons shadcn/ui)

| Jeton | Hex | Usage | Contraste sur fond |
|---|---|---|---|
| `background` | `#07060F` | fond | — |
| `card` | `#12101F` | surfaces | — |
| `foreground` | `#F7F5FF` | texte | 18,7:1 |
| `muted-foreground` | `#A9A3C2` | texte secondaire | 8,4:1 |
| `primary` | `#F5B900` | boutons, titres, liens | 11,3:1 |
| `accent` | `#FFD84A` | survol, reflets | 14,6:1 |
| `success` / `destructive` | `#2BD889` / `#FF4D5E` | états (scanner) | 10,8:1 / 6,2:1 |
| `stage` / `violet` / `flame` | `#3B4BFF` / `#8B3DFF` / `#FF5A1F` | halos décoratifs uniquement | 3,5 / 4,0 / 6,5 |

### Typographie
- **Bebas Neue** (titres) : condensée et percutante, dans l'esprit du logo.
- **Montserrat** (texte, boutons) : lisible sur mobile.
- Polices auto-hébergées par `next/font` (aucune requête vers Google au chargement).

### Mouvement
- Introduction de l'accueil : apparition du logo en lumière (balayage doré), halos qui « respirent », compte à rebours.
- Transitions : fondus et légers déplacements au défilement, CSS en priorité, JavaScript seulement si nécessaire.
- `prefers-reduced-motion` : toutes les animations sont remplacées par un affichage direct.
- Budget : aucune animation ne bloque l'affichage du texte principal (LCP).

### Médias remplaçables
Chaque visuel occupe un **emplacement nommé** (`media.slot` : `hero`, `logo-principal`, `affiche-officielle`…). L'organisation remplace un fichier depuis l'administration sans toucher au code. En l'absence de fichier, un visuel neutre s'affiche.

## 5. Données et sécurité

Schéma : `supabase/migrations/20261010000000_init.sql`.

- **RLS activée sur toutes les tables.** Le public ne lit que les lignes `published = true`.
- **Données personnelles** (`registrations`, `tickets`) : lisibles uniquement par `super_admin` et `admin`.
- **Inscription** : route serveur → validation Zod → limite de débit → insertion avec le client `service_role` (jamais exposé au navigateur).
- **Scan à l'entrée** : le rôle `accueil` n'a accès à aucune table de données personnelles ; il appelle `validate_ticket(qr_token)`, qui :
  1. vérifie le rôle ;
  2. fait **un seul `UPDATE … WHERE status = 'valid'`**, que PostgreSQL sérialise : un seul scan peut réussir ;
  3. renvoie `valid`, `already_used` (avec heure et agent du premier scan), `cancelled` ou `unknown` ;
  4. journalise chaque tentative dans `ticket_scans`.
- **QR code** : jeton aléatoire de 192 bits, sans donnée personnelle.

Vérifié par `tests/db/run.sh` sur un PostgreSQL local : 11 contrôles, dont **20 scans simultanés du même billet → 1 validé, 19 refusés**.

### Rôles

| Rôle | Contenu | Inscriptions | Scanner | Équipe |
|---|---|---|---|---|
| `super_admin` | ✔ | ✔ | ✔ | ✔ |
| `admin` | ✔ | ✔ | ✔ | — |
| `communication` | ✔ | — | — | — |
| `accueil` | — | — | ✔ | — |
| `finance` | réservé à une phase ultérieure | | | |

## 6. Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run check` | typecheck + lint + tests unitaires |
| `npm run test:e2e` | tests Playwright (mobile + desktop) |
| `PGURL=… tests/db/run.sh` | tests SQL/RLS sur une base **jetable** |
| `npm run format` | formatage Prettier |

## 7. Dette connue (traitée aux étapes 4 à 6)

- 21 erreurs ESLint dans les pages existantes (`any`, `setState` dans `useEffect`) : ces pages seront réécrites.
- L'ancienne auth (`lib/auth-session.ts`, `lib/crypto-security.ts`, `proxy.ts`) et `lib/db/storage.ts` restent actives jusqu'au branchement de Supabase. Le secret de session n'a plus de valeur par défaut en production.
- Les comptes de démonstration créés par `lib/db/storage.ts` disparaîtront avec ce stockage.
- `prisma/` n'est plus la cible (remplacé par les migrations Supabase) ; à retirer après accord.
