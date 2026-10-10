# CELEBRATION NIGHT 2026

Site officiel de **CELEBRATION NIGHT 2026** — *Une nuit de louange, d'adoration et d'impact spirituel*,
organisée autour du groupe musical **Haguiazo**.

- **Thème** : La délivrance des vrais adorateurs : Génération Asaph (Psaume 73:17)
- **Date** : vendredi 13 novembre 2026, dès 20h
- **Lieu** : terrain du CEG Sainte Rita, Cotonou (en cours de confirmation)

Documents de référence : [`REQUIREMENTS.md`](REQUIREMENTS.md) (exigences) et
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) (choix techniques).

## Lancer le site sur son ordinateur

Prérequis : [Node.js](https://nodejs.org) 20.9 ou plus récent, et [Git](https://git-scm.com).

```bash
git clone -b claude/beautiful-galileo-qar6mc https://github.com/leaderrodolphe03-sudo/celebration_night.git
cd celebration_night
npm install
npm run dev
```

Puis ouvrir <http://localhost:3000>.

Sans configuration, les inscriptions sont enregistrées dans `data/db.json`, sur votre ordinateur
uniquement (ce fichier n'est jamais envoyé sur GitHub).

## Modifier le contenu

| Je veux changer… | Où |
|---|---|
| Date, lieu, thème, intervenants, programme, partenaires | `lib/content.ts` |
| Le logo et les affiches officielles | `public/media/official/` (voir son README) |
| Les photos d'une édition | `public/media/editions/<année>/` + descriptions dans `legendes.json` |
| Le nombre maximum de places | `capacity` dans `lib/content.ts` (ou la table `editions` sur Supabase) |

Le statut de chaque intervenant (`confirme`, `annonce`, `proposition`) s'affiche sur le site :
une proposition n'est jamais présentée comme une participation acquise.

## Billets et sécurité

- Chaque inscription reçoit un **lien personnel secret** (`/mes-billets#cle=…`). Sans lui, les billets
  ne s'affichent pas. Seule l'empreinte de la clé est stockée.
- Un participant qui a perdu son lien le retrouve avec son **téléphone + nom** (`/mon-billet`) :
  un nouveau lien est créé et l'ancien cesse de fonctionner.
- Le **QR code** ne contient qu'un jeton aléatoire, jamais de donnée personnelle. Le scanner refuse
  un QR code contenant un numéro de billet ; le numéro n'est accepté qu'en saisie manuelle par un agent.
- Le badge « J'y serai » à partager ne contient pas le billet : son QR code renvoie vers l'inscription.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` puis `npm start` | version de production |
| `npm run check` | typage + lint + tests unitaires |
| `npm run test:e2e` | tests de bout en bout (Playwright, mobile et ordinateur) |
| `PGURL=… tests/db/run.sh` | tests SQL (sécurité, capacité, double scan) sur une base **jetable** |

## Passage en production (Supabase + Vercel)

1. Créer un projet Supabase et exécuter les fichiers de `supabase/migrations/` dans l'ordre, puis
   `supabase/seed.sql`.
2. Renseigner les variables de `.env.example` (`AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). Dès que les clés Supabase sont
   présentes, les inscriptions y sont enregistrées automatiquement.
3. En production, `AUTH_SECRET` est obligatoire : l'application refuse de démarrer les sessions sans lui.

## État d'avancement

- ✅ Pages publiques, inscription, billets sécurisés, base de données Supabase prête
- ⏳ Espace administrateur sur Supabase Auth (étape 6). L'administration actuelle utilise encore
  l'ancien système, avec des comptes de démonstration créés automatiquement en local : ne pas
  l'utiliser en production.
