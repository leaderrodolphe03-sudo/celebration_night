import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Shield, Music, Heart, Users, CheckCircle2, Flame } from "lucide-react";
import { EVENT } from "@/lib/event-config";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Notre Histoire — HAGIAZO Ministry & CELEBRATION Night",
  description:
    "Découvrez l'histoire, la vision et le mandat divin d'HAGIAZO Ministry à travers le grand rassemblement annuel CELEBRATION NIGHT.",
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
    desc: "CELEBRATION Night brise les barrières dénominationnelles pour rassembler jeunes, responsables et familles dans un même souffle de ferveur.",
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
    title: "L'Appel de CELEBRATION Night",
    desc: "Structuration officielle de HAGIAZO Ministry et conception d'un rassemblement annuel d'envergure, alliant chantres renommés, chœur de louange et nouveaux talents.",
  },
  {
    year: "2026",
    title: "L'Édition Historique",
    desc: "Une soirée grandiose conçue pour marquer toute une génération : 6 heures de CELEBRATION non-stop, communion fraternelle et puissance du Saint-Esprit.",
  },
];

export default function NotreHistoirePage() {
  return (
    <div className="min-h-screen bg-cn-black text-white">
      {/* 1. Hero Éditorial */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cn-gold/10 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl uppercase tracking-wider text-white">
            Notre Histoire
          </h1>
          <p className="mt-6 font-body text-base sm:text-xl leading-relaxed text-cn-gray-300 max-w-2xl mx-auto">
            « Sanctifie-les par ta vérité : ta parole est la vérité. » — Jean 17:17.
            Une alliance d&apos;adoration et de ferveur pour marquer toute une génération.
          </p>
        </div>
      </section>

      {/* 2. Manifeste & Identité HAGIAZO */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            
            <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-wide leading-tight text-white">
              Une génération mise à part pour la gloire de Dieu
            </h2>
            <p className="font-body text-sm sm:text-base text-cn-gray-300 leading-relaxed">
              Issu du grec ancien <strong className="text-white">« ἁγιάζω »</strong>, HAGIAZO exprime
              l&apos;acte de purifier, consacrer et dédier entièrement à un usage divin.
              Dans une époque saturée de bruits et de distractions, HAGIAZO Ministry s&apos;est
              donné pour mandat d&apos;équiper une jeunesse passionnée qui refuse la tiédeur.
            </p>
            <p className="font-body text-sm sm:text-base text-cn-gray-300 leading-relaxed">
              Nous croyons que la musique n&apos;est pas une simple performance, mais un véhicule puissant pour
              introduire le peuple dans la présence du Très-Haut. Chaque CELEBRATION annuelle découle
              d&apos;un engagement permanent de prière, de consécration et d&apos;amour fraternel.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Button href="/inscription" variant="primary">
                Participer à l&apos;Événement
              </Button>
              <Button href="/soutenir" variant="outline">
                Soutenir la vision
              </Button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-cn-gold/30 bg-gradient-to-br from-cn-dark via-cn-black to-cn-deep p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
            <div className="absolute -top-3.5 -right-3 rounded-md bg-cn-gold px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cn-black shadow-lg">
              Rassemblement Annuel
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white">
              Les Piliers de CELEBRATION Night
            </h3>
            <p className="mt-2 text-xs text-cn-gold font-medium uppercase tracking-wider">
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
                  <CheckCircle2 size={18} className="text-cn-gold shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-cn-white leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. 4 Valeurs fondamentales */}
      <section className="relative bg-gradient-to-b from-[#FAF7F2] via-[#F6F1EA] to-[#FAF7F2] px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        {/* Halo lumineux chaud d'arrière-plan */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-amber-200/30 blur-[130px]"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="h-0.5 w-6 bg-cn-amber rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cn-amber">
                Notre ADN
              </span>
              <span className="h-0.5 w-6 bg-cn-amber rounded-full" />
            </div>
            <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-cn-black">
              Nos Valeurs Inébranlables
            </h2>
            <p className="mt-3 font-body text-sm sm:text-base text-[#5A4D41]">
              Ce qui anime chacune de nos actions et guide l&apos;organisation de chaque édition.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-[#E5DACF] bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-cn-gold/70 shadow-[0_10px_30px_rgba(28,22,19,0.06)] hover:shadow-[0_20px_45px_rgba(28,22,19,0.12)] flex flex-col justify-between"
                >
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-cn-gold/40 flex items-center justify-center text-cn-amber group-hover:bg-cn-amber group-hover:text-white transition-colors duration-300 shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-heading text-xl uppercase tracking-wide text-cn-black">
                      {val.title}
                    </h3>
                  </div>
                  <p className="mt-3 font-body text-xs sm:text-sm leading-relaxed text-[#5A4D41]">
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
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cn-gold">
            La Lignée du Réveil
          </span>
          <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            Le Chemin Parcouru
          </h2>
          <p className="mt-3 font-body text-sm text-cn-gray-300">
            D&apos;une humble salle de répétition au grand rassemblement annuel qui rassemble des milliers de cœurs.
          </p>
        </div>

        <div className="mt-14 space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-cn-gold/25">
          {MILESTONES.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/2">
                <div className="rounded-xl border border-white/10 bg-cn-dark p-6 backdrop-blur-sm shadow-lg hover:border-cn-gold/50 transition-colors">
                  <span className="font-heading text-2xl text-cn-gold tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="mt-1 font-heading text-xl uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-body text-xs text-cn-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border-4 border-cn-black bg-cn-gold flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>

        {/* 5. Bannière finale d'engagement */}
        <div className="mt-20 rounded-2xl bg-[linear-gradient(225deg,#6E1818_0%,#3B1812_22%,#241510_50%,#1C1613_100%)] border border-cn-gold/40 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.3em] text-cn-gold">
            Soyez témoin de cette histoire
          </span>
          <h3 className="relative z-10 mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
            Écrivez cette page avec nous
          </h3>
          <p className="relative z-10 mt-3 font-body text-sm sm:text-base text-cn-gray-300 max-w-xl mx-auto">
            L&apos;entrée est 100% gratuite sur inscription. Réservez votre place et générez votre badge officiel.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/inscription" variant="primary" size="lg">
              Réserver mon billet dès maintenant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


