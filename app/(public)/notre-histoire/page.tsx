import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Music, Heart, Users, CheckCircle2, ArrowRight, Flame } from "lucide-react";
import { EVENT } from "@/lib/event-config";

export const metadata: Metadata = {
  title: "Notre Histoire — HAGIAZO Ministry & Célébration Night",
  description:
    "Découvrez l'histoire, la vision et le mandat divin d'HAGIAZO Ministry à travers le grand rassemblement annuel CÉLÉBRATION NIGHT.",
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
    desc: "Un petit groupe de jeunes chantres et musiciens se réunit à Abidjan avec une soif : dépasser le simple divertissement pour vivre une adoration profonde et sans compromis.",
  },
  {
    year: "2023",
    title: "Premières Veillées d'Impact",
    desc: "Les sessions intimes réunissent plus de 1 200 participants venus de plusieurs communautés chrétiennes, accompagnées de guérisons intérieures et de restaurations spirituelles.",
  },
  {
    year: "2025",
    title: "L'Appel de Célébration Night",
    desc: "Structuration officielle de HAGIAZO Ministry et conception d'un rassemblement annuel d'envergure, alliant chantres renommés, chœur de louange et nouveaux talents.",
  },
  {
    year: "2026",
    title: "L'Édition Historique",
    desc: "Une soirée grandiose conçue pour marquer toute une génération : 6 heures de célébration non-stop, communion fraternelle et puissance du Saint-Esprit.",
  },
];

export default function NotreHistoirePage() {
  return (
    <div className="min-h-screen bg-[#17110E] text-white">
      {/* 1. Hero Éditorial */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#F59E0B]/10 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#120E0A] border border-[#F59E0B]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#FCD34D] mb-6 shadow-sm">
            <Flame size={14} className="text-[#F59E0B]" />
            <span>Genèse &amp; Mandat Spirituel</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl uppercase tracking-wider text-white">
            Notre Histoire
          </h1>
          <p className="mt-6 font-body text-base sm:text-xl leading-relaxed text-[#BFB89E] max-w-2xl mx-auto">
            « Sanctifie-les par ta vérité : ta parole est la vérité. » — Jean 17:17.
            Une alliance d&apos;adoration et de ferveur pour marquer toute une génération.
          </p>
        </div>
      </section>

      {/* 2. Manifeste & Identité HAGIAZO */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#120E0A] px-4 py-1.5 text-xs font-semibold text-[#FCD34D] border border-[#F59E0B]/30 shadow-sm">
              <Shield size={14} className="text-[#F59E0B]" /> Le Sens Fondateur de Hagiazo
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-wide leading-tight text-white">
              Une génération mise à part pour la gloire de Dieu
            </h2>
            <p className="font-body text-sm sm:text-base text-[#BFB89E] leading-relaxed">
              Issu du grec ancien <strong className="text-white">« ἁγιάζω »</strong>, HAGIAZO exprime
              l&apos;acte de purifier, consacrer et dédier entièrement à un usage divin.
              Dans une époque saturée de bruits et de distractions, HAGIAZO Ministry s&apos;est
              donné pour mandat d&apos;équiper une jeunesse passionnée qui refuse la tiédeur.
            </p>
            <p className="font-body text-sm sm:text-base text-[#BFB89E] leading-relaxed">
              Nous croyons que la musique n&apos;est pas une simple performance, mais un véhicule puissant pour
              introduire le peuple dans la présence du Très-Haut. Chaque célébration annuelle découle
              d&apos;un engagement permanent de prière, de consécration et d&apos;amour fraternel.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 rounded-sm bg-[#F59E0B] px-7 py-3.5 font-body text-xs font-bold uppercase tracking-widest text-[#17110E] shadow-xl hover:bg-[#FCD34D] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] transition-all hover:scale-105"
              >
                Participer à l&apos;Événement <ArrowRight size={16} />
              </Link>
              <Link
                href="/soutenir"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-white hover:border-[#F59E0B]/40 hover:bg-white/10 transition-colors"
              >
                Soutenir la vision
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-[#F59E0B]/30 bg-gradient-to-br from-[#17110E] via-[#120E0A] to-[#0A0806] p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
            <div className="absolute -top-3.5 -right-3 rounded-md bg-[#F59E0B] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#17110E] shadow-lg">
              Rassemblement Annuel
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white">
              Les Piliers de Célébration Night
            </h3>
            <p className="mt-2 text-xs text-[#F59E0B] font-medium uppercase tracking-wider">
              Une tradition d&apos;excellence renouvelée chaque année
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Adoration prophétique en direct et spontanée",
                "Chorales et chantres unis dans un même esprit",
                "Temps d'intercession communautaire pour la jeunesse et les nations",
                "Atmosphère d'accueil chaleureuse, inclusive et hautement sécurisée",
                "Entrée 100% libre et gratuite avec badge personnalisé officiel",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#F59E0B] shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-[#EDE8DC] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. 4 Valeurs fondamentales */}
      <section className="bg-[#0B0806] border-y border-white/8 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F59E0B]">
              Notre ADN
            </span>
            <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
              Nos Valeurs Inébranlables
            </h2>
            <p className="mt-3 font-body text-sm text-[#BFB89E]">
              Ce qui anime chacune de nos actions et guide l&apos;organisation de chaque édition.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/8 bg-[#120E0A] p-6 transition-all hover:-translate-y-1 hover:border-[#F59E0B]/40 shadow-lg"
                >
                  <div className="h-12 w-12 rounded-lg bg-[#1A1410] border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shadow-sm">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-heading text-xl uppercase tracking-wide text-white">
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

      {/* 4. Chronologie / Histoire */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F59E0B]">
            La Lignée du Réveil
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            Le Chemin Parcouru
          </h2>
          <p className="mt-3 font-body text-sm text-[#BFB89E]">
            D&apos;une humble salle de répétition au grand rassemblement annuel qui rassemble des milliers de cœurs.
          </p>
        </div>

        <div className="mt-14 space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-[#F59E0B]/25">
          {MILESTONES.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/2">
                <div className="rounded-xl border border-white/10 bg-[#120E0A] p-6 backdrop-blur-sm shadow-lg hover:border-[#F59E0B]/50 transition-colors">
                  <span className="font-heading text-2xl text-[#F59E0B] tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="mt-1 font-heading text-xl uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-body text-xs text-[#BFB89E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border-4 border-[#17110E] bg-[#F59E0B] flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>

        {/* 5. Bannière finale d'engagement */}
        <div className="mt-20 rounded-2xl bg-gradient-to-b from-[#17110E] via-[#120E0A] to-[#0A0806] border border-[#F59E0B]/40 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#F59E0B]/10 blur-[80px]"
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F59E0B]">
            Soyez témoin de cette histoire
          </span>
          <h3 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            Écrivez cette page avec nous
          </h3>
          <p className="mt-3 font-body text-sm sm:text-base text-[#BFB89E] max-w-xl mx-auto">
            L&apos;entrée est 100% gratuite sur inscription. Réservez votre place et générez votre badge officiel.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/inscription"
              className="rounded-sm bg-[#F59E0B] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#17110E] shadow-xl hover:bg-[#FCD34D] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] transition-all hover:scale-105"
            >
              Réserver mon billet dès maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


