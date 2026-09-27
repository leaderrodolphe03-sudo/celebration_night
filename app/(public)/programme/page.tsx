import { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin, Sparkles, AlertCircle, ShieldCheck, Flame, ArrowRight } from "lucide-react";
import { EVENT } from "@/lib/event-config";

export const metadata: Metadata = {
  title: "Programme officiel — CÉLÉBRATION NIGHT 2026",
  description:
    "Découvrez le déroulement heure par heure de la soirée Célébration Night organisée par HAGIAZO Ministry. Louange, adoration et exhortation.",
};

const DETAILED_PROGRAM = [
  {
    time: "18h00 — 18h30",
    title: "Accueil & Contrôle des Billets",
    category: "Logistique & Accueil",
    desc: "Ouverture des portes principales. Scan fluide des QR Codes sur smartphone ou papier, remise des bracelets d'accès VIP/Standard et installation guidée par le service d'ordre.",
    highlight: false,
  },
  {
    time: "18h30 — 19h00",
    title: "Ouverture Solennelle & Cantique des Degrés",
    category: "Prière & Consécration",
    desc: "Prière d'inauguration pour sanctifier l'atmosphère. Proclamation des Écritures et montée progressive en adoration par le collectif des jeunes conducteurs.",
    highlight: false,
  },
  {
    time: "19h00 — 20h00",
    title: "Explosion de Louange Africaine Contemporaine",
    category: "Louange Festive",
    desc: "Un set musical vibrant alliant polyphonies vocales, percussions authentiques et rythmes modernes. Un temps d'action de grâce jubilatoire avec les chorales régionales invitées.",
    highlight: true,
  },
  {
    time: "20h00 — 21h30",
    title: "Session Signature HAGIAZO Ministry",
    category: "Worship & Présence Divine",
    desc: "Le moment d'immersion totale : interprétation en direct des cantiques originaux de HAGIAZO (« Hagiazo Live », « Brûle en moi », « Sainteté »). Adoration intime et prière spontanée.",
    highlight: true,
  },
  {
    time: "21h30 — 22h30",
    title: "Parole Vivante & Exhortation pour la Jeunesse",
    category: "Enseignement & Foi",
    desc: "Message spirituel puissant sur le thème « Une génération. Une foi. Une célébration. ». Appel à la consécration et engagement pour l'impact dans la société.",
    highlight: false,
  },
  {
    time: "22h30 — 23h30",
    title: "Adoration Prophétique & Intercession",
    category: "Prière & Guérison",
    desc: "Temps d'intercession communautaire pour nos nations, les familles, les étudiants et les jeunes professionnels. Imposition des mains et prière personnalisée.",
    highlight: true,
  },
  {
    time: "23h30 — Minuit",
    title: "Célébration Triomphale & Envoi dans la Mission",
    category: "Clôture & Jubilation",
    desc: "Final en apothéose avec l'ensemble des musiciens et chantres sur scène. Bénédiction sacerdotale et envoi pour briller dans le monde.",
    highlight: false,
  },
];

export default function ProgrammePage() {
  return (
    <div className="min-h-screen bg-[#17165A] text-white">
      {/* Header */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#38217F]/60 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#F5B900]">
            Chronogramme Officiel
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Programme de la Soirée
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-cn-gray-300 max-w-2xl mx-auto">
            {EVENT.dateLabel} • {EVENT.timeLabel} • 6 heures de louange, d&apos;intimité et de communion.
          </p>
        </div>
      </section>

      {/* Timeline détaillée */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {DETAILED_PROGRAM.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                item.highlight
                  ? "border-[#F5B900]/50 bg-gradient-to-r from-[#38217F]/80 to-[#17165A] shadow-[0_4px_30px_rgba(245,185,0,0.15)]"
                  : "border-white/10 bg-[#111111]/40 hover:border-white/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-[#F5B900] font-heading text-xl sm:text-2xl tracking-wider">
                  <Clock size={20} />
                  <span>{item.time}</span>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cn-gray-300">
                  {item.category}
                </span>
              </div>

              <h2 className="mt-4 font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white flex items-center gap-2">
                {item.highlight && <Sparkles size={20} className="text-[#F5B900]" />}
                {item.title}
              </h2>

              <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-cn-gray-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Guide & Consignes pour les participants */}
      <section className="bg-[#111111]/70 border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl uppercase tracking-wide text-center text-white">
            Consignes & Informations Pratiques
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 bg-[#17165A] p-6">
              <div className="h-10 w-10 rounded-lg bg-[#38217F] flex items-center justify-center text-[#F5B900]">
                <Clock size={20} />
              </div>
              <h3 className="mt-4 font-heading text-xl uppercase tracking-wide text-white">
                Ponctualité
              </h3>
              <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed">
                Les portes ouvrent dès 17h30 pour fluidifier les contrôles de sécurité et les scans
                de billets. Soyez installés dès 18h15 pour ne rien manquer de l&apos;ouverture.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#17165A] p-6">
              <div className="h-10 w-10 rounded-lg bg-[#38217F] flex items-center justify-center text-[#F5B900]">
                <AlertCircle size={20} />
              </div>
              <h3 className="mt-4 font-heading text-xl uppercase tracking-wide text-white">
                Billet & QR Code
              </h3>
              <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed">
                Chaque participant doit présenter son billet numérique unique (sur smartphone avec
                luminosité normale ou imprimé au format A4). Les captures d&apos;écran non lisibles
                seront refusées.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#17165A] p-6">
              <div className="h-10 w-10 rounded-lg bg-[#38217F] flex items-center justify-center text-[#F5B900]">
                <ShieldCheck size={20} />
              </div>
              <h3 className="mt-4 font-heading text-xl uppercase tracking-wide text-white">
                Sécurité & Confort
              </h3>
              <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed">
                Service de sécurité certifié et équipe médicale d&apos;urgence sur place. Tenue correcte
                et sobre exigée. Un vestiaire sécurisé et un point d&apos;eau sont mis à disposition.
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-md bg-[#F5B900] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#111111] shadow-xl hover:bg-[#FFD84A] transition-all hover:scale-105"
            >
              Je réserve ma place gratuite <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
