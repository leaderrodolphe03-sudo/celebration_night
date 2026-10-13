"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Handshake,
  Heart,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  Send,
  Award,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";

export default function SoutenirPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    supportType: "SPONSOR_ENTREPRISE",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi / préparation API
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

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
            <Handshake size={14} className="text-[#F59E0B]" />
            <span>Alliance &amp; Partenariats Stratégiques</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl uppercase tracking-wider text-white">
            Soutenir la Vision
          </h1>
          <p className="mt-6 font-body text-base sm:text-xl leading-relaxed text-[#BFB89E] max-w-2xl mx-auto">
            CÉLÉBRATION NIGHT est une œuvre d&apos;impact spirituel et social offerte gratuitement à la jeunesse.
            En devenant partenaire, sponsor ou bienfaiteur, vous bâtissez avec nous un autel d&apos;excellence.
          </p>
        </div>
      </section>

      {/* 2. Les 3 Volets de Partenariat */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formule 1 : Entreprise / Sponsor */}
          <div className="rounded-2xl border border-white/8 bg-[#120E0A] p-8 flex flex-col justify-between hover:border-[#F59E0B]/50 transition-all hover:-translate-y-1 shadow-xl">
            <div>
              <div className="h-12 w-12 rounded-lg bg-[#1A1410] border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] mb-6">
                <Building2 size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">
                Visibilité &amp; Marque
              </span>
              <h3 className="mt-2 font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white">
                Sponsor Entreprise
              </h3>
              <p className="mt-3 font-body text-xs sm:text-sm text-[#BFB89E] leading-relaxed">
                Associez l&apos;image de votre marque ou de votre institution à un événement chrétien de grande envergure.
              </p>
              <ul className="mt-6 space-y-3 text-xs text-[#EDE8DC]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Logo sur écrans géants et scène</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Mentions d&apos;honneur lors du direct</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Places VIP réservées pour vos cadres</span>
                </li>
              </ul>
            </div>
            <a
              href="#formulaire"
              className="mt-8 block text-center rounded-sm bg-[#1A1410] border border-[#F59E0B]/40 py-3 font-body text-xs font-bold uppercase tracking-wider text-[#FCD34D] hover:bg-[#F59E0B] hover:text-[#17110E] transition-all shadow-sm"
            >
              Postuler comme Sponsor
            </a>
          </div>

          {/* Formule 2 : Ministère & Église Partenaire */}
          <div className="rounded-2xl border border-[#F59E0B]/40 bg-gradient-to-b from-[#17110E] via-[#120E0A] to-[#0A0806] p-8 flex flex-col justify-between hover:border-[#F59E0B] transition-all hover:-translate-y-1 shadow-2xl relative">
            <div className="absolute -top-3.5 right-6 rounded-md bg-[#F59E0B] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#17110E] shadow-md">
              Recommandé
            </div>
            <div>
              <div className="h-12 w-12 rounded-lg bg-[#1A1410] border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] mb-6">
                <Award size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">
                Communion &amp; Réveil
              </span>
              <h3 className="mt-2 font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white">
                Église &amp; Ministère
              </h3>
              <p className="mt-3 font-body text-xs sm:text-sm text-[#BFB89E] leading-relaxed">
                Fédérons le corps du Christ au-delà des dénominations pour préparer ensemble la jeunesse.
              </p>
              <ul className="mt-6 space-y-3 text-xs text-[#EDE8DC]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Intégration au réseau des pasteurs partenaires</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Mobilisation officielle de vos jeunes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Temps d&apos;intercession pour vos assemblées</span>
                </li>
              </ul>
            </div>
            <a
              href="#formulaire"
              className="mt-8 block text-center rounded-sm bg-[#F59E0B] py-3.5 font-body text-xs font-bold uppercase tracking-wider text-[#17110E] shadow-xl hover:bg-[#FCD34D] transition-all"
            >
              Rejoindre l&apos;Alliance
            </a>
          </div>

          {/* Formule 3 : Donateur & Mécène Particulier */}
          <div className="rounded-2xl border border-white/8 bg-[#120E0A] p-8 flex flex-col justify-between hover:border-[#F59E0B]/50 transition-all hover:-translate-y-1 shadow-xl">
            <div>
              <div className="h-12 w-12 rounded-lg bg-[#1A1410] border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] mb-6">
                <Heart size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B]">
                Générosité du Cœur
              </span>
              <h3 className="mt-2 font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white">
                Donateur Privé
              </h3>
              <p className="mt-3 font-body text-xs sm:text-sm text-[#BFB89E] leading-relaxed">
                Chaque don participe à couvrir les frais techniques, la sécurité et la gratuité des billets d&apos;entrée.
              </p>
              <ul className="mt-6 space-y-3 text-xs text-[#EDE8DC]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Don libre et sans intermédiaire</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Bilan financier en toute transparence</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#F59E0B] shrink-0" />
                  <span>Accompagnement dans la prière</span>
                </li>
              </ul>
            </div>
            <a
              href="#formulaire"
              className="mt-8 block text-center rounded-sm bg-[#1A1410] border border-[#F59E0B]/40 py-3 font-body text-xs font-bold uppercase tracking-wider text-[#FCD34D] hover:bg-[#F59E0B] hover:text-[#17110E] transition-all shadow-sm"
            >
              Faire une Promesse de Don
            </a>
          </div>
        </div>
      </section>

      {/* 3. Formulaire de contact / Candidature Partenaire */}
      <section id="formulaire" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#120E0A] p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F59E0B] block">
              Prendre Contact
            </span>
            <h2 className="mt-2 font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white">
              Manifester Votre Intérêt
            </h2>
            <p className="mt-2 font-body text-xs sm:text-sm text-[#BFB89E]">
              Remplissez ce formulaire et notre responsable des partenariats vous contactera sous 24h ouvrées.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-8 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-heading text-2xl uppercase tracking-wider text-white">
                Merci pour votre engagement précieux !
              </h3>
              <p className="text-sm text-[#BFB89E] max-w-md mx-auto">
                Votre demande a bien été transmise à l&apos;équipe d&apos;organisation HAGIAZO. Nous prendrons contact
                avec vous très rapidement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                    Nom &amp; Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: David Kouassi"
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                    Entreprise / Église / Organisation
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Ex: Société Alpha ou Église de la Grâce"
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                    Email Professionnel ou Personnel *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: contact@organisation.com"
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                    Téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: +225 07 00 00 00 00"
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                    Type de Partenariat Souhaité *
                  </label>
                  <select
                    value={formData.supportType}
                    onChange={(e) => setFormData({ ...formData, supportType: e.target.value })}
                    className="w-full rounded-sm border border-white/15 bg-[#120E0A] px-4 py-3 text-sm text-white focus:border-[#F59E0B] focus:outline-none"
                  >
                    <option value="SPONSOR_ENTREPRISE">Sponsoring Entreprise (Visibilité &amp; Médias)</option>
                    <option value="EGLISE_MINISTERE">Église ou Ministère Partenaire</option>
                    <option value="DONATEUR_PRIVE">Donateur Privé / Soutien Financier</option>
                    <option value="TECHNIQUE_LOGISTIQUE">Partenaire Technique / Logistique</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                    Votre Message ou Proposition
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Précisez votre intention, le budget envisagé ou toute question spécifique..."
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#F59E0B] py-4 text-center font-body text-xs font-bold uppercase tracking-widest text-[#17110E] shadow-xl hover:bg-[#FCD34D] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Send size={16} />
                  <span>{loading ? "Envoi en cours..." : "Transmettre ma Demande de Partenariat"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Coordonnées directes */}
          <div className="mt-10 pt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#7D7560]">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-[#F59E0B]" />
              <span>partenaires@celebrationnight.org</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-[#F59E0B]" />
              <span>Permanence : +225 07 12 34 56 78</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck size={15} />
              <span>Gestion transparente HAGIAZO Ministry</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

