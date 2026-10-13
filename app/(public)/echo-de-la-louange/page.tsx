import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, User, Clock, ArrowRight, HeartHandshake, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "L'Écho de la Louange — Réflexions & Témoignages | HAGIAZO",
  description:
    "Articles spirituels, méditations bibliques, réflexions sur la louange africaine contemporaine et témoignages de vies transformées.",
};

const ARTICLES = [
  {
    slug: "theologie-du-rythme-louange-africaine",
    title: "La théologie du rythme : quand la louange africaine contemporaine glorifie le Créateur",
    excerpt:
      "Loin des clichés et des simplifications, l'expression corporelle et les polyrythmies africaines trouvent leur racine profonde dans les Psaumes de David. Une réflexion sur la rédemption de l'art par la foi.",
    category: "Théologie & Culture",
    author: "Pasteur Jean-Marc Yao",
    date: "15 Septembre 2026",
    readTime: "6 min de lecture",
    highlight: true,
  },
  {
    slug: "vivre-la-saintete-au-quotidien",
    title: "Vivre la sainteté dans sa jeunesse : le défi d'une génération consacrée",
    excerpt:
      "« Hagiazo » ne signifie pas s'isoler du monde, mais vivre dans le monde avec un cœur intègre. Comment garder ses yeux purs et son zèle intact à l'ère des réseaux sociaux ?",
    category: "Vie Chrétienne",
    author: "Équipe HAGIAZO Jeunesse",
    date: "02 Septembre 2026",
    readTime: "5 min de lecture",
    highlight: false,
  },
  {
    slug: "temoignage-de-lanxiete-a-la-paix",
    title: "Témoignage : Comment une veillée de louange a guéri mon anxiété chronique",
    excerpt:
      "« J'étais venu avec le cœur lourd et des insomnies sévères. Dès les premières notes de louange, le fardeau s'est brisé. » Récit poignant de Sarah, étudiante en médecine.",
    category: "Témoignage",
    author: "Sarah K. (Abidjan)",
    date: "20 Août 2026",
    readTime: "4 min de lecture",
    highlight: false,
  },
  {
    slug: "guide-equipes-de-louange",
    title: "De la répétition technique à l'autel spirituel : manuel pour conducteurs de louange",
    excerpt:
      "Pourquoi l'excellence vocale ne suffit pas sans l'onction du Saint-Esprit. 5 clés pratiques pour préparer votre équipe de louange avant de monter sur scène.",
    category: "Ministère Musical",
    author: "Directeur Musical HAGIAZO",
    date: "10 Août 2026",
    readTime: "7 min de lecture",
    highlight: false,
  },
];

export default function EchoDeLaLouangePage() {
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
            Édification &amp; Méditation
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            L&apos;Écho de la Louange
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-[#BFB89E] max-w-2xl mx-auto">
            Le magazine spirituel de HAGIAZO Ministry. Pensées théologiques, conseils pour chantres
            et témoignages authentiques d&apos;impact.
          </p>
        </div>
      </section>

      {/* Article à la une + Grille d'articles */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Article à la Une */}
        {ARTICLES.filter((a) => a.highlight).map((article, idx) => (
          <div
            key={idx}
            className="mb-14 rounded-2xl border border-[#F59E0B]/30 bg-gradient-to-b from-[#17110E] via-[#120E0A] to-[#0A0806] p-8 sm:p-12 shadow-2xl relative overflow-hidden group"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-md bg-[#F59E0B] px-3 py-1 font-bold uppercase tracking-wider text-[#17110E]">
                À la une
              </span>
              <span className="text-[#FCD34D] font-semibold">{article.category}</span>
              <span className="text-[#7D7560]">•</span>
              <span className="text-[#BFB89E] flex items-center gap-1">
                <Calendar size={13} className="text-[#F59E0B]" /> {article.date}
              </span>
              <span className="text-[#7D7560]">•</span>
              <span className="text-[#BFB89E] flex items-center gap-1">
                <Clock size={13} className="text-[#F59E0B]" /> {article.readTime}
              </span>
            </div>

            <h2 className="mt-6 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white group-hover:text-[#FCD34D] transition-colors">
              {article.title}
            </h2>

            <p className="mt-4 font-body text-sm sm:text-base leading-relaxed text-[#BFB89E] max-w-3xl">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/8">
              <div className="flex items-center gap-2 text-xs text-[#EDE8DC]">
                <User size={15} className="text-[#F59E0B]" />
                <span className="font-semibold">{article.author}</span>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F59E0B] group-hover:translate-x-1 transition-transform">
                Lire l&apos;article complet <ArrowRight size={15} />
              </span>
            </div>
          </div>
        ))}

        {/* Autres articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.filter((a) => !a.highlight).map((article, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/8 bg-[#120E0A] p-6 sm:p-8 flex flex-col justify-between hover:border-[#F59E0B]/50 transition-all hover:-translate-y-1 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#7D7560] mb-4">
                  <span className="font-semibold text-[#F59E0B] uppercase tracking-wider text-[11px]">
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-heading text-2xl uppercase tracking-wide text-white hover:text-[#FCD34D] transition-colors">
                  {article.title}
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-[#BFB89E] font-body">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-xs text-[#7D7560]">
                <span>{article.author}</span>
                <span>{article.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Appel à Témoignages */}
        <div className="mt-20 rounded-2xl border border-[#F59E0B]/30 bg-gradient-to-b from-[#17110E] to-[#120E0A] p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl">
          <HeartHandshake className="mx-auto text-[#F59E0B]" size={36} />
          <h3 className="mt-4 font-heading text-3xl sm:text-4xl uppercase tracking-wide text-white">
            Avez-vous un témoignage à partager ?
          </h3>
          <p className="mt-2 text-sm text-[#BFB89E] max-w-xl mx-auto">
            Dieu a-t-il touché votre vie lors d&apos;un rassemblement ou par un chant de HAGIAZO ?
            Votre témoignage peut fortifier la foi de milliers de jeunes.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-[#F59E0B]/40 px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-[#FCD34D] hover:bg-[#F59E0B] hover:text-[#17110E] transition-all"
            >
              Écrire à l&apos;équipe éditoriale
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

