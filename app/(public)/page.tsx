import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Music,
  Users,
  ShieldCheck,
  ArrowRight,
  Flame,
  Volume2,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import Hero from "@/components/hero/Hero";
import PresentationSection from "@/components/event/PresentationSection";
import EventTimeline from "@/components/event/EventTimeline";
import { EVENT } from "@/lib/event-config";

const HIGHLIGHTED_ARTISTS = [
  {
    name: "Collectif HAGIAZO Worship",
    role: "Direction Musicale & Louange Signature",
    badge: "Hôte Officiel",
  },
  {
    name: "Pasteur Jean-Marc Yao",
    role: "Orateur Principal • Exhortation Foi & Jeunesse",
    badge: "Prédication",
  },
  {
    name: "Déborah Lukalu (Invité Spécial)",
    role: "Ministre de Louange Prophétique",
    badge: "Chantre Invitée",
  },
  {
    name: "David Okyere",
    role: "Chantre & Compositeur Worship Acoustique",
    badge: "Accra • Ghana",
  },
];

const STATS = [
  { number: "6H", label: "De louange & prière non-stop" },
  { number: "25+", label: "Chantres, musiciens & choristes" },
  { number: "100%", label: "Gratuit sur inscription" },
  { number: "1", label: "Génération embrasée pour Christ" },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Principal */}
      <Hero />

      {/* 2. Bandeau Chiffres Clés */}
      <section className="border-y border-white/10 bg-[#111111]/70 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-heading text-4xl sm:text-5xl text-[#F5B900] tracking-wider">
                {stat.number}
              </span>
              <p className="font-body text-xs text-cn-gray-300 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section Présentation de l'Événement */}
      <PresentationSection />

      {/* 4. Aperçu du Programme */}
      <section className="bg-[#111111]/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5B900]">
            Déroulement de la soirée
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            Un Rythme Divin & Ininterrompu
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-body text-sm text-cn-gray-300">
            De l&apos;ouverture des portes à la célébration triomphale, découvrez les moments clés
            qui composeront cette veillée historique.
          </p>

          <div className="mt-12 text-left">
            <EventTimeline />
          </div>

          <div className="mt-10">
            <Link
              href="/programme"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-[#F5B900] hover:text-[#FFD84A] transition-colors"
            >
              <span>Consulter le programme détaillé heure par heure</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Section Artistes & Ministres de Louange */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6 mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5B900]">
                Sur Scène
              </span>
              <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
                Artistes & Conducteurs
              </h2>
            </div>
            <Link
              href="/artistes"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5B900] hover:underline"
            >
              <span>Découvrir tous les intervenants</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTED_ARTISTS.map((artist, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-white/10 bg-[#17165A]/80 p-6 flex flex-col justify-between hover:border-[#F5B900]/50 transition-all hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <span className="rounded-full bg-[#38217F] border border-[#5A35A8] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFD84A]">
                    {artist.badge}
                  </span>
                  <h3 className="mt-4 font-heading text-2xl uppercase tracking-wide text-white group-hover:text-[#F5B900] transition-colors">
                    {artist.name}
                  </h3>
                  <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed font-body">
                    {artist.role}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#F5B900]">
                  <span className="text-[11px] uppercase font-semibold">Présent le 14 Nov</span>
                  <Sparkles size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Section HAGIAZO Ministry (Vision & Impact) */}
      <section className="bg-gradient-to-b from-[#111111]/80 to-[#17165A] border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5B900]">
            Le Ministère Hôte
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            HAGIAZO Ministry
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-cn-gray-300">
            HAGIAZO (ἁγιάζω) porte une vision de sainteté, d&apos;adoration contemporaine et de communion
            fraternelle au service d&apos;une jeunesse en quête d&apos;authenticité spirituelle.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="rounded-md border border-[#F5B900] px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-[#F5B900] hover:bg-[#F5B900] hover:text-[#111111] transition-colors"
            >
              En savoir plus sur HAGIAZO
            </Link>
            <Link
              href="/worship-session"
              className="rounded-md border border-white/20 px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
            >
              Écouter nos chants en ligne
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Grand Appel à l'Action (CTA Billeterie) */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border-2 border-[#F5B900]/60 bg-gradient-to-r from-[#38217F] via-[#17165A] to-[#111111] p-8 sm:p-14 text-center shadow-[0_20px_60px_rgba(245,185,0,0.2)]">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD84A]">
            Capacité limitée • Réservation obligatoire
          </span>
          <h2 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wide text-white">
            Rejoignez la Célébration
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm sm:text-base text-cn-gray-300">
            Entrée 100% gratuite. Obtenez immédiatement votre billet officiel avec QR Code unique
            sur votre smartphone.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#F5B900] px-10 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#111111] hover:bg-[#FFD84A] shadow-2xl transition-all hover:scale-105"
            >
              <Ticket size={16} />
              <span>Réserver mon billet gratuit</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/mon-billet"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 py-4 font-body text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
            >
              J&apos;ai déjà un billet
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
