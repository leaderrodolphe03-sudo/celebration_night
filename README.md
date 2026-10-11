# CÉLÉBRATION NIGHT — HAGIAZO Ministry

Application web professionnelle complète pour l'événement **« CÉLÉBRATION NIGHT »**, organisé par **HAGIAZO Ministry**.

> **« Une génération. Une foi. Une célébration. »**  
> Date officielle : **Samedi 14 Novembre 2026 à 18h00**  
> Lieu : Palais des Congrès / Grande Halle de Célébration (Abidjan)

---

## 🌟 Fonctionnalités Réalisées

### 1. Site Vitrine & Présentation de HAGIAZO Ministry
- **Accueil (`/`)** : Hero avec typographie d'impact, date, heure, lieu, compte à rebours dynamique, chiffres clés, déroulement de la veillée, artistes à l'affiche et appel à l'action d'inscription.
- **À propos (`/about`)** : Genèse d'HAGIAZO Ministry (signification de *ἁγιάζω*, sainteté et consécration), valeurs inébranlables, frise chronologique de la vision et confession de foi.
- **Programme (`/programme`)** : Chronogramme détaillé heure par heure (18h00 à minuit) de l'accueil à la clôture triomphale, avec consignes de sécurité et d'accès.
- **Artistes & Chantres (`/artistes`)** : Fiches des ministres de louange invités, chorales polyphoniques et orateurs (Collectif HAGIAZO Worship, Pasteur Jean-Marc Yao, Déborah Lukalu, David Okyere, etc.).
- **Médias (`/medias`)** : Teasers vidéo, galerie photos immersive et kit média téléchargeable pour les églises partenaires (affiches HD, visuels réseaux sociaux, dossier de presse).
- **L’Écho de la Louange (`/echo-de-la-louange`)** : Espace magazine et blog spirituel avec articles théologiques sur l'adoration africaine contemporaine et témoignages authentiques.
- **Contact & FAQ (`/contact`)** : Formulaire de contact fonctionnel avec validation Zod, plan d'accès, transports, permanence téléphonique/WhatsApp et FAQ interactive.

---

### 2. Parcours Participant & Billetterie Automatisée
- **Inscription (`/inscription`)** :
  - Formulaire réactif avec **React Hook Form + Zod**.
  - Champs : Nom, Prénom, Email, Téléphone, Pays, Ville, Nombre de places (1 à 10 billets), Catégorie de billet (**Pass Standard** ou **Pass Partenaire VIP**), Source.
  - Validation stricte côté client et côté serveur avec protection contre les abus (rate-limiting).
- **Confirmation (`/confirmation`)** :
  - Récapitulatif instantané de la réservation.
  - Accès direct en un clic vers le billet numérique officiel.
  - Bouton de partage natif (WhatsApp / réseaux sociaux) pour inviter des proches.
- **Mon Billet Numérique (`/billet/[ticketNumber]`)** :
  - Format carte d'embarquement / badge VIP haute fidélité aux couleurs de la charte.
  - **Numéro de billet officiel unique** au format demandé : `CN-2026-000001`.
  - **QR Code sécurisé dynamique** haute résolution généré à la volée.
  - Conforme à la règle stricte de sécurité : **Le QR Code ne contient AUCUNE donnée personnelle (PII)** mais un token cryptographique sécurisé et infalsifiable.
  - Bouton **« Imprimer le Billet »** avec feuille de style `@media print` dédiée (masque la navigation et le pied de page pour une impression A4 ou format badge ultra nette).
  - Bouton **« Télécharger le QR Code PNG »**.
- **Recherche de Billet (`/mon-billet`)** :
  - Permet à n'importe quel participant de retrouver instantanément tous ses billets en saisissant son numéro de billet, son adresse email ou son numéro de téléphone.

---

### 3. Espace Administrateur & Scanner d'Entrées Anti-Fraude
- **Connexion Sécurisée (`/admin/login`)** :
  - Authentification par email et mot de passe chiffré (scrypt / PBKDF2 avec sel cryptographique aléatoire de 32 octets).
  - Sessions sécurisées via cookies `HTTPOnly` signés cryptographiquement par HMAC-SHA256.
  - Gestion des rôles : **ADMIN** (Super Admin) et **STAFF** (Équipe d'accueil).
  - Comptes pré-configurés pour la démonstration :
    - **Administrateur** : `admin@celebrationnight.com` / `Celebration2026!`
    - **Staff Portique** : `staff@celebrationnight.com` / `Staff2026!`
- **Tableau de Bord en Temps Réel (`/admin/dashboard`)** :
  - Indicateurs clés (KPIs) : Total participants, Billets générés (Standard vs VIP), Billets scannés (Présents), Absents (En attente), Taux de présence en temps réel (%).
  - Dernières inscriptions en temps réel.
  - Flux en direct des derniers scans enregistrés avec horodatage et nom de l'agent.
- **Gestion des Participants (`/admin/participants`)** :
  - Recherche instantanée multi-critères (nom, prénom, email, téléphone, ville, pays).
  - Filtres par catégorie (Standard / VIP).
  - **Export CSV** en un clic pour les équipes d'accueil et le protocole.
- **Gestion des Billets (`/admin/billets`)** :
  - Liste de tous les billets avec leur statut (`VALID`, `USED`, `CANCELLED`).
  - Validation manuelle d'urgence si le smartphone d'un participant est déchargé ou a l'écran cassé.
- **Scanner QR Code d'Entrée (`/admin/scanner`)** :
  - Optimisé mobile et desktop pour les vigiles et hôtes d'accueil.
  - Détection automatique via caméra (caméra arrière smartphone ou webcam) avec viseur holographique et faisceau laser animé.
  - Prise en charge des bips sonores immersifs via la **Web Audio API** et vibrations haptiques sur smartphone :
    - **✓ BILLET VALIDE** : Son harmonique ascendant, écran vert émeraude, nom du participant, catégorie, horodatage de validation enregistré.
    - **⚠ BILLET DÉJÀ UTILISÉ** : Double bip d'alerte, écran orange ambré, indication de la date, heure et nom de l'agent du premier scan pour bloquer toute double entrée frauduleuse.
    - **✕ BILLET INVALIDE** : Son de refus, écran rouge vif.
  - Saisie manuelle de secours pour taper directement un code `CN-2026-...`.
  - Compteur de la session en cours de l'agent de contrôle.

---

## 🎨 Identité Visuelle & Charte Graphique

- **Couleurs Officielles** :
  - Bleu nuit : `#17165A`
  - Violet profond : `#38217F`
  - Violet : `#5A35A8`
  - Bleu : `#3159C8`
  - Or : `#F5B900`
  - Or clair : `#FFD84A`
  - Blanc : `#FFFFFF`
  - Noir : `#111111`
- **Typographies** :
  - `Bebas Neue` pour les grands titres et numéros de billets.
  - `Montserrat` pour les sous-titres, corps de texte et boutons.
- **Logos Vectoriels SVG** :
  - `/public/logos/celebration-night.svg` : Logo officiel avec flamme d'adoration et faisceau doré.
  - `/public/logos/hagiazo-ministry.svg` : Logo officiel avec croix sacrée épurée et sceau d'alliance.

---

## 🚀 Démarrage Rapide

### 1. Lancement du serveur de développement

Dans le dossier `celebration-night` :

```bash
npm run dev
```

L'application est disponible immédiatement sur : **`http://localhost:3000`**

### 2. Accès aux pages principales

- **Site public** : `http://localhost:3000`
- **Réserver une place** : `http://localhost:3000/inscription`
- **Retrouver un billet** : `http://localhost:3000/mon-billet`
- **Espace Administrateur** : `http://localhost:3000/admin/login`
- **Scanner d'entrées** : `http://localhost:3000/admin/scanner`
- **Tableau de bord** : `http://localhost:3000/admin/dashboard`

---

## 🗄️ Architecture de Données & Déploiement

- **Développement local instantané** : L'application dispose d'un moteur de persistance local sécurisé et réactif garantissant que l'inscription, la génération des billets, la validation des QR codes et les statistiques fonctionnent **immédiatement à 100% sans aucun pré-requis**.
- **Production PostgreSQL** : Le schéma de production officiel est disponible dans `prisma/schema.postgresql.prisma`. Pour connecter une base PostgreSQL (Supabase, Neon, AWS RDS, GCP Cloud SQL), il suffit de renseigner `DATABASE_URL` dans le fichier `.env`.
