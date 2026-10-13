import { Metadata } from "next";
import Link from "next/link";
import { Mic2, Music, Sparkles, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Artistes & Chantres — CÉLÉBRATION NIGHT 2026",
  description:
    "Découvrez les ministres de la louange, chantres invités et orateurs de la Célébration Night organisée par HAGIAZO Ministry.",
};

const ARTISTS = [
  {
    name: "Chantre MANNE",
    role: "Chantre & Ministre de Louange Officiel",
    origin: "Cotonou • Bénin",
    bio: "Voix emblématique de la louange vivante, le Chantre MANNE conduit l'assemblée dans une ferveur prophétique intense où les cœurs s'abandonnent totalement à la gloire de Dieu.",
    songs: ["Amour Inconditionnel", "Victoire en Jésus", "Prière Prophétique"],
    badge: "Tête d'Affiche",
  },
  {
    name: "Groupe Musical JEUNESSE SIKECODJI",
    role: "Collectif Musical & Orchestre Live",
    origin: "Paroisse de Sikècodji",
    bio: "Une formation de jeunes chantres et musiciens embrasés par le Saint-Esprit. Rythmes sacrés, cuivres, percussions et harmonies vocales pour faire vibrer toute la salle.",
    songs: ["Louange sans limite", "Jubilation Sainte", "Alléluia au Roi"],
    badge: "Collectif Scène",
  },
  {
    name: "Collectif HAGIAZO Worship",
    role: "Direction Musicale & Grand Chœur Hôte",
    origin: "Abidjan • Côte d'Ivoire",
    bio: "Cœur battant du ministère, le collectif HAGIAZO Worship réunit chantres, vocalistes et solistes consacrés. Leurs chants unissent solennité biblique et puissance de louange contemporaine.",
    songs: ["Hagiazo Live", "Brûle en moi", "Sainteté"],
    badge: "Hôte Officiel",
  },
  {
    name: "Prédication & Parole Vivante",
    role: "Orateurs & Mentors Spirituels",
    origin: "Conseil Pastoral HAGIAZO",
    bio: "Des serviteurs de Dieu apportant une parole percutante d'exhortation, de réveil spirituel et de consécration pour équiper la génération montante.",
    songs: ["Exhortation : Une génération sanctifiée pour Christ"],
    badge: "La Parole",
  },
  {
    name: "Section Rythmique & Synthés",
    role: "Musiciens & Virtuoses de Scène",
    origin: "Régie Musicale Célébration Night",
    bio: "Claviéristes, batteurs, percussionnistes et bassistes réunis dans une virtuosité au service exclusif de la sainteté et du culte divin.",
    songs: ["Symphonie Céleste", "Groove d'Adoration"],
    badge: "Musiciens Live",
  },
  {
    name: "Grand Chœur de l'Assemblée",
    role: "Peuple Rassemblé & Adorateurs",
    origin: "Toutes dénominations réunies",
    bio: "La plus belle chorale de la soirée : des milliers de voix unies sans barrières de dénominations pour couronner le Roi des rois d'une seule voix.",
    songs: ["Hosanna au plus haut des cieux", "Yahweh Règne"],
    badge: "Unité du Peuple",
  },
];

export default function ArtistesPage() {
  return (
    <div className="min-h-screen bg-[#17110E] text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#F59E0B]/10 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#F59E0B]">
            Une programmation d&apos;exception
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Artistes &amp; Conducteurs
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-[#BFB89E] max-w-2xl mx-auto">
            Des chantres et prédicateurs dévoués à élever le nom de Jésus-Christ avec puissance,
            justesse et authenticité spirituelle.
          </p>
        </div>
      </section>

      {/* Grille des Artistes */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISTS.map((artist, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/8 bg-[#120E0A] p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F59E0B]/50 hover:shadow-[0_12px_36px_rgba(245,158,11,0.15)] flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#1A1410] border border-[#F59E0B]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FCD34D]">
                    {artist.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#7D7560]">
                    <MapPin size={12} className="text-[#F59E0B]" />
                    <span>{artist.origin}</span>
                  </div>
                </div>

                {/* Nom et rôle */}
                <h2 className="mt-5 font-heading text-3xl uppercase tracking-wide text-white group-hover:text-[#FCD34D] transition-colors">
                  {artist.name}
                </h2>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#F59E0B] mt-1">
                  {artist.role}
                </p>

                {/* Bio */}
                <p className="mt-4 font-body text-sm leading-relaxed text-[#BFB89E]">
                  {artist.bio}
                </p>
              </div>

              {/* Titres / Répertoire */}
              <div className="mt-6 pt-5 border-t border-white/8">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] uppercase tracking-wider">
                  <Music size={14} /> Chants &amp; Interventions
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {artist.songs.map((song, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-[#EDE8DC]"
                    >
                      {song}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Billetterie */}
        <div className="mt-20 rounded-2xl bg-gradient-to-b from-[#17110E] via-[#120E0A] to-[#0A0806] border border-[#F59E0B]/40 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#F59E0B]/10 blur-[80px]"
          />
          <h3 className="font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            Vivez cette expérience musicale unique
          </h3>
          <p className="mt-3 font-body text-sm sm:text-base text-[#BFB89E] max-w-xl mx-auto">
            Rejoignez des milliers d&apos;adorateurs. L&apos;entrée est 100% gratuite avec génération de votre badge officiel.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-sm bg-[#F59E0B] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#17110E] shadow-xl hover:bg-[#FCD34D] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] transition-all hover:scale-105"
            >
              Obtenir mon pass d&apos;accès <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

