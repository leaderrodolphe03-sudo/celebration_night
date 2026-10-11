import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Music, Heart, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { EVENT } from "@/lib/event-config";

export const metadata: Metadata = {
  title: "À propos — HAGIAZO Ministry & Célébration Night",
  description:
    "Découvrez la vision d'HAGIAZO Ministry et la genèse de l'événement Célébration Night : sainteté, adoration vivante et unité fraternelle.",
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Sainteté & Consécration",
    desc: "« Hagiazo » (ἁγιάζω) signifie sanctifier, mettre à part. Notre désir premier est d'élever un autel de louange pure, consacré exclusivement à la gloire de Dieu.",
  },
  {
    icon: Music,
    title: "Excellence Artistique",
    desc: "Nous unissons les sonorités africaines contemporaines, les harmonies gospel vibrantes et les arrangements modernes pour une louange d'un standard irréprochable.",
  },
  {
    icon: Users,
    title: "Unité des Générations",
    desc: "Célébration Night brise les barrières dénominationnelles pour rassembler jeunes, responsables et familles dans un même souffle de ferveur.",
  },
  {
    icon: Heart,
    title: "Impact & Compassion",
    desc: "La louange authentique déborde du temple pour transformer les vies, restaurer les cœurs brisés et inspirer des œuvres concrètes dans la société.",
  },
];

const MILESTONES = [
  {
    year: "2021",
    title: "La Naissance d'un Fardeau",
    desc: "Un petit groupe de jeunes chantres et musiciens se réunit à Abidjan avec une soif : dépasser le simple divertissement pour vivre une adoration profonde.",
  },
  {
    year: "2023",
    title: "Premières Veillées d'Impact",
    desc: "Les sessions intimes réunissent plus de 1 200 participants venus de plusieurs églises, accompagnées de guérisons intérieures et de restaurations spirituelles.",
  },
  {
    year: "2025",
    title: "L'Appel de Célébration Night",
    desc: "Structuration officielle de HAGIAZO Ministry et conception d'un rassemblement annuel d'envergure, alliant chantres renommés et nouveaux talents.",
  },
  {
    year: "2026",
    title: "L'Édition Historique",
    desc: "Une soirée grandiose conçue pour marquer toute une génération : 6 heures de célébration non-stop, communion fraternelle et puissance du Saint-Esprit.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#EDE8DC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#F59E0B]/20 via-[#EA580C]/15 to-[#FCD34D]/20 blur-[120px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#FCD34D]">
            Notre Vision & Histoire
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-[#EDE8DC]">
            HAGIAZO Ministry
          </h1>
          <p className="mt-6 font-body text-lg sm:text-xl leading-relaxed text-[#BFB89E] max-w-2xl mx-auto">
            « Sanctifie-les par ta vérité : ta parole est la vérité. » — Jean 17:17.
            Un mouvement d&apos;adoration et de transformation pour réveiller les cœurs.
          </p>
        </div>
      </section>

      {/* Manifeste & Identité */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1F1710] px-4 py-1.5 text-xs font-semibold text-[#FCD34D] border border-[#F59E0B]/40 shadow-sm">
              <Shield size={14} /> Le Sens de Hagiazo
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-[#EDE8DC]">
              Une génération mise à part pour la gloire de Dieu
            </h2>
            <p className="font-body text-base text-[#BFB89E] leading-relaxed">
              Issu du grec ancien <strong className="text-[#EDE8DC]">« ἁγιάζω »</strong>, HAGIAZO exprime
              l&apos;acte de purifier, consacrer et dédier entièrement à un usage sacré.
              Dans un monde saturé de distractions et de superficialité, HAGIAZO Ministry s&apos;est
              donné pour mandat d&apos;équiper une jeunesse passionnée qui refuse le compromis.
            </p>
            <p className="font-body text-base text-[#BFB89E] leading-relaxed">
              Nous croyons que la musique n&apos;est pas une fin en soi, mais un véhicule puissant pour
              introduire le peuple de Dieu dans sa présence glorieuse. Chaque mélodie, chaque accord et
              chaque parole chantée lors de <strong className="text-[#FCD34D]">CÉLÉBRATION NIGHT</strong> découle
              d&apos;un temps de prière et d&apos;intimité spirituelle.
            </p>
            <div className="pt-2">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-6 py-3.5 font-body text-xs font-black uppercase tracking-widest text-[#080808] shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:opacity-95 transition-all hover:scale-105"
              >
                Participer à l&apos;événement <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-[#F59E0B]/30 bg-gradient-to-br from-[#1F1710] to-[#120E0A] p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
            <div className="absolute -top-4 -right-4 rounded-xl bg-[#F59E0B] px-4 py-2 text-xs font-black uppercase text-[#080808] shadow-lg">
              Édition 2026
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-wide text-[#EDE8DC]">
              Les Piliers de Célébration Night
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "Adoration prophétique en direct et spontanée",
                "Chorales et solistes de renommée africaine et internationale",
                "Temps de prière d'intercession pour nos nations et la jeunesse",
                "Atmosphère d'accueil chaleureuse, inclusive et sécurisée",
                "Accès gratuit sur inscription avec billet numérique officiel",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#FCD34D] shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-[#BFB89E] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4 Valeurs fondamentales */}
      <section className="bg-[#120E0A]/90 border-y border-[#F59E0B]/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-[#EDE8DC]">
              Nos Valeurs Inébranlables
            </h2>
            <p className="mt-3 font-body text-sm text-[#BFB89E]">
              Ce qui anime chacune de nos actions et guide chaque conducteur de louange.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-[#080808] p-6 transition-all hover:-translate-y-1 hover:border-[#F59E0B]/50 hover:bg-[#18120B] shadow-md"
                >
                  <div className="h-12 w-12 rounded-lg bg-[#1F1710] border border-[#F59E0B]/40 flex items-center justify-center text-[#FCD34D]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-heading text-xl uppercase tracking-wide text-[#EDE8DC]">
                    {val.title}
                  </h3>
                  <p className="mt-2.5 font-body text-xs leading-relaxed text-[#BFB89E]">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chronologie / Histoire */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide text-[#EDE8DC]">
            Le Chemin Parcouru
          </h2>
          <p className="mt-2 font-body text-sm text-[#BFB89E]">
            D&apos;une humble salle de répétition au grand rassemblement de {EVENT.dateLabel}.
          </p>
        </div>

        <div className="mt-14 space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-[#F59E0B]/20">
          {MILESTONES.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/2">
                <div className="rounded-xl border border-white/10 bg-[#120E0A] p-6 backdrop-blur-sm">
                  <span className="font-heading text-2xl text-[#FCD34D] tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="mt-1 font-heading text-xl uppercase tracking-wide text-[#EDE8DC]">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-body text-xs text-[#BFB89E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border-4 border-[#080808] bg-[#F59E0B] flex items-center justify-center shadow-lg" />
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>

        {/* Bannière finale */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-[#1F1710] via-[#120E0A] to-[#080808] border border-[#F59E0B]/40 p-8 sm:p-12 text-center shadow-2xl">
          <h3 className="font-heading text-3xl sm:text-5xl uppercase tracking-wide text-[#EDE8DC]">
            Écrivez cette page avec nous
          </h3>
          <p className="mt-3 font-body text-sm sm:text-base text-[#BFB89E] max-w-xl mx-auto">
            La réservation est 100% gratuite. Ne manquez pas ce rendez-vous divin.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/inscription"
              className="rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-8 py-4 font-body text-xs font-black uppercase tracking-widest text-[#080808] shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-transform hover:scale-105"
            >
              Réserver mon billet dès maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
