// Contenu officiel du site, issu du dossier « Projet d'organisation
// CELEBRATION NIGHT 2026 » et des affiches fournies par l'organisation.
// Regle : ne rien ajouter qui ne figure pas dans une source validee.
// A terme, ces donnees seront lues depuis Supabase (voir supabase/seed.sql).

export type SpeakerStatus = "confirme" | "annonce" | "proposition";

export interface Speaker {
  name: string;
  role: string;
  status: SpeakerStatus;
  /** Chemin d'une photo dans /public ; absent tant qu'elle n'est pas fournie. */
  photo?: string;
}

export const SPEAKER_STATUS_LABEL: Record<SpeakerStatus, string> = {
  confirme: "Confirmé",
  annonce: "Annoncé",
  proposition: "Proposition — à confirmer",
};

export const MEDIA = {
  logo: "/media/official/logo-celebration-night.webp",
  poster2025Singers: "/media/official/affiche-2025-chantres-invites.jpg",
  poster2025Host: "/media/official/affiche-2025-groupe-hote.jpg",
  banner2025: "/media/official/banniere-2025-coming-soon.jpg",
} as const;

export const EVENT = {
  name: "CELEBRATION NIGHT",
  edition: 2026,
  slogan: "Une nuit de louange, d'adoration et d'impact spirituel",
  theme: "La délivrance des vrais adorateurs : Génération Asaph",
  verse: {
    reference: "Psaume 73:17",
    text: "Jusqu'à ce que je sois entré dans les sanctuaires de Dieu, et que j'aie pris garde au sort final des méchants.",
    translation: "Louis Segond 1910",
  },
  group: "Haguiazo",
  // Heure du Benin (UTC+1).
  startsAt: "2026-11-13T20:00:00+01:00",
  dateLabel: "Vendredi 13 novembre 2026",
  timeLabel: "Dès 20h, jusqu'à l'aube",
  venue: "Terrain du CEG Sainte Rita",
  city: "Cotonou",
  venueConfirmed: false,
  /**
   * Nombre maximum de places (billets). null = pas de limite tant que
   * l'organisation ne l'a pas fixe (reference logistique : 500 a 650 chaises).
   */
  capacity: null as number | null,
} as const;

export const VISION =
  "Faire de CELEBRATION NIGHT une rencontre incontournable de louange et d'adoration, capable d'impacter durablement les vies, d'unir les adorateurs et de contribuer au réveil spirituel de la jeunesse au Bénin et au-delà.";

export const GENERAL_OBJECTIVE =
  "Organiser une grande soirée de louange et d'adoration réunissant plusieurs participants dans un esprit d'unité, de communion et d'adoration sincère envers Dieu.";

export const OBJECTIVES = [
  "Favoriser une rencontre profonde avec Dieu.",
  "Rassembler la jeunesse chrétienne autour de l'adoration.",
  "Encourager l'unité entre les communautés chrétiennes.",
  "Accroître la visibilité et l'impact de CELEBRATION NIGHT.",
  "Annoncer l'Évangile de Jésus-Christ à travers la musique et l'adoration.",
  "Être une plateforme d'évangélisation.",
];

export const AUDIENCE = [
  "Jeunesse chrétienne",
  "Familles",
  "Chorales",
  "Églises",
  "Passionnés de musique gospel",
  "Cotonou et ses environs",
  "Grand public",
];

/** Activites de la soiree (dossier, § 4). Horaires detailles non encore publies. */
export const PROGRAM = [
  { title: "Louange et adoration", text: "Un temps pour élever ensemble nos voix vers Dieu." },
  {
    title: "Prestations des chantres invités",
    text: "Des ministres de louange au service de l'adoration.",
  },
  { title: "Temps de prière", text: "L'intercession au cœur de la nuit." },
  {
    title: "Exhortation et appel à la conversion",
    text: "La Parole annoncée, une invitation à suivre Jésus-Christ.",
  },
  { title: "Témoignages", text: "Ce que Dieu fait dans les vies." },
];

export const SPEAKER_2026: Speaker = {
  name: "Pasteur Sunday AVLA",
  role: "Orateur",
  status: "annonce",
};

export const SINGERS_2026: Speaker[] = [
  { name: "Josias FOLLY", role: "Chantre", status: "annonce" },
  { name: "Claudy SHINE", role: "Chantre", status: "annonce" },
  { name: "AGBOTON Oda Grâce", role: "Chantre", status: "annonce" },
];

export const MINISTERS_2026: Speaker[] = [
  { name: "Pasteur GBEHOUNOU Blaise", role: "Serviteur de Dieu", status: "annonce" },
  { name: "Pasteur ADEKPEDJOU Michaël", role: "Serviteur de Dieu", status: "annonce" },
  { name: "Évangéliste MELIHO Bruno", role: "Serviteur de Dieu", status: "annonce" },
  { name: "Pasteur Héribert Donald", role: "Serviteur de Dieu", status: "proposition" },
];

export const PARTNER_CATEGORIES = [
  { title: "L'Église EEIF Sikècodji", text: "Église partenaire de l'édition." },
  {
    title: "Églises partenaires",
    text: "Communautés qui portent la vision et mobilisent leurs membres.",
  },
  {
    title: "Structures de médias",
    text: "Pour faire rayonner la louange avant, pendant et après la soirée.",
  },
  {
    title: "Prestataires et détenteurs de matériel",
    text: "Scène, sonorisation, éclairage, logistique.",
  },
  { title: "Sponsors", text: "Entreprises et institutions qui soutiennent l'organisation." },
  {
    title: "Personnes de bonne volonté",
    text: "Chaque contribution compte et fait l'objet d'un suivi transparent.",
  },
];

export interface Edition {
  year: number;
  title: string;
  theme: string;
  verse: string;
  dateLabel: string;
  timeLabel: string;
  place: string;
  organizer: string;
  guests: string[];
  posters: { src: string; alt: string }[];
  /** Credit des photos de la soiree (public/media/editions/<annee>/). */
  photoCredit?: string;
}

export const PAST_EDITIONS: Edition[] = [
  {
    year: 2025,
    title: "CELEBRATION NIGHT — Édition 2025",
    theme: "L'adoration qui touche le cœur de Dieu",
    verse: "Genèse 22:5-18",
    dateLabel: "Vendredi 14 novembre 2025",
    timeLabel: "19h",
    place:
      "Sikècodji, Fignon, rue 7.048 C/861 — 4e von à droite en venant du feu tricolore de la Marina, pour le ciné Opkè-Oluwa",
    organizer:
      "Département de la Jeunesse — Église Évangélique Internationale Foursquare, Paroisse de Sikècodji (Temple des Leaders)",
    guests: [
      "Chantre Samuel",
      "Chantre Diane",
      "Chantre Hubert",
      "Chantre Manne",
      "Chantre Sergio",
    ],
    posters: [
      {
        src: MEDIA.poster2025Singers,
        alt: "Affiche de l'édition 2025 présentant les cinq chantres invités",
      },
      {
        src: MEDIA.poster2025Host,
        alt: "Affiche de l'édition 2025 présentant le groupe hôte vêtu de blanc",
      },
    ],
    photoCredit: "Regis L'Œil Artistique",
  },
];

export const GALLERY = [
  {
    src: MEDIA.poster2025Singers,
    alt: "Affiche 2025 — chantres invités",
    year: 2025,
    width: 1080,
    height: 1350,
  },
  {
    src: MEDIA.poster2025Host,
    alt: "Affiche 2025 — groupe hôte",
    year: 2025,
    width: 1080,
    height: 1350,
  },
  {
    src: MEDIA.banner2025,
    alt: "Bannière 2025 — Restez connectés, coming soon",
    year: 2025,
    width: 2000,
    height: 780,
  },
];

export const NAV_LINKS = [
  { href: "/a-propos", label: "À propos" },
  { href: "/intervenants", label: "Intervenants" },
  { href: "/programme", label: "Programme" },
  { href: "/galerie", label: "Galerie" },
  { href: "/archives", label: "Archives" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];
