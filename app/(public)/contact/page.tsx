"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { EVENT } from "@/lib/event-config";

const FAQS = [
  {
    q: "L'entrée à CÉLÉBRATION NIGHT est-elle payante ?",
    a: "Non, l'entrée est 100% gratuite ! Cependant, en raison de la capacité d'accueil de la salle et des normes strictes de sécurité, l'inscription préalable est obligatoire pour obtenir votre billet numérique avec QR Code unique.",
  },
  {
    q: "Comment fonctionne le billet numérique et son QR Code ?",
    a: "Dès votre inscription validée en ligne, un numéro de billet officiel (format CN-2026-XXXXXX) et un QR Code sécurisé sont générés instantanément. Vous pouvez le télécharger sur votre smartphone ou l'imprimer sur papier A4. Il sera scanné par nos agents à l'entrée.",
  },
  {
    q: "Puis-je inscrire plusieurs personnes à la fois ?",
    a: "Oui ! Le formulaire d'inscription vous permet de réserver jusqu'à 10 places pour vos proches, votre famille ou votre groupe de jeunesse. Un billet distinct avec QR Code unique sera généré pour chaque place.",
  },
  {
    q: "Quelle est la différence entre un billet Standard et VIP ?",
    a: "Le billet Standard donne un accès complet à l'événement et à la grande salle. Le billet VIP (Partenaire) donne en plus accès aux places réservées en tribune avant et à la rencontre d'échange avec les pasteurs et conducteurs de louange à l'issue de la célébration.",
  },
  {
    q: "Y aura-t-il un service de restauration sur place ?",
    a: "Un point d'eau minérale gratuit et des stands de rafraîchissement / snacks légers agréés seront ouverts dans le hall d'accueil avant le début de la veillée et lors des entractes.",
  },
  {
    q: "Comment puis-je devenir bénévole ou partenaire de HAGIAZO ?",
    a: "Vous pouvez nous envoyer un message via le formulaire de contact ci-dessous en sélectionnant l'objet « Bénévolat » ou « Partenariat Église ». Notre équipe d'organisation prendra contact avec vous.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Renseignement Général",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setStatus({
        success: true,
        message: "Merci ! Votre message a été transmis avec succès à l'équipe HAGIAZO.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Renseignement Général",
        message: "",
      });
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || "Impossible d'envoyer le message.",
      });
    } finally {
      setLoading(false);
    }
  };

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
            Une équipe à votre écoute
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Contact &amp; Informations
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-[#BFB89E] max-w-2xl mx-auto">
            Une question sur la billetterie, l&apos;accès, les transports ou un partenariat ?
            Retrouvez nos réponses fréquentes ou écrivez-nous directement.
          </p>
        </div>
      </section>

      {/* Coordonnées Rapides & Formulaire */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Informations & Coordonnées (5 col) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F59E0B]">
                Localisation &amp; Accès
              </span>
              <h2 className="mt-2 font-heading text-3xl uppercase tracking-wide text-white">
                Nous Trouver
              </h2>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#120E0A] p-6 space-y-5 backdrop-blur-sm shadow-xl">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#1A1410] border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg uppercase tracking-wide text-white">
                    Lieu du Rassemblement
                  </h3>
                  <p className="text-xs text-[#BFB89E] leading-relaxed mt-1">
                    Palais des Congrès / Grande Halle de Célébration
                    <br />
                    Boulevard Principal des Événements, Abidjan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#1A1410] border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg uppercase tracking-wide text-white">
                    Email Officiel
                  </h3>
                  <p className="text-xs text-[#BFB89E] leading-relaxed mt-1 font-mono">
                    contact@celebrationnight.org
                    <br />
                    billetterie@celebrationnight.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#1A1410] border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-lg uppercase tracking-wide text-white">
                    Permanence Téléphonique &amp; WhatsApp
                  </h3>
                  <p className="text-xs text-[#BFB89E] leading-relaxed mt-1 font-mono">
                    +225 07 00 00 20 26 / +33 7 00 00 20 26
                  </p>
                </div>
              </div>
            </div>

            {/* Note Accès & Transports */}
            <div className="rounded-2xl border border-[#F59E0B]/30 bg-gradient-to-b from-[#17110E] to-[#120E0A] p-6 shadow-md">
              <h3 className="font-heading text-xl uppercase tracking-wide text-[#FCD34D]">
                Transports &amp; Parking
              </h3>
              <p className="mt-2 text-xs text-[#BFB89E] leading-relaxed">
                Un parking sécurisé gratuit de 600 places est mis à disposition des participants.
                Des navettes spéciales seront organisées depuis les principaux carrefours de la ville.
              </p>
            </div>
          </div>

          {/* Formulaire de Contact (7 col) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/8 bg-[#120E0A] p-6 sm:p-10 backdrop-blur-md shadow-2xl">
              <h2 className="font-heading text-3xl uppercase tracking-wide text-white mb-2">
                Envoyer un Message
              </h2>
              <p className="text-xs text-[#BFB89E] mb-8 font-body">
                Remplissez ce formulaire et notre équipe vous répondra dans un délai de 24 heures.
              </p>

              {status && (
                <div
                  className={`mb-6 rounded-xl p-4 flex items-center gap-3 text-xs font-semibold ${
                    status.success
                      ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-200"
                      : "bg-red-950/80 border border-red-500/50 text-red-200"
                  }`}
                >
                  {status.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      placeholder="Ex: David Kouamé"
                      className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: david@example.com"
                      className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: +225 07 12 34 56"
                      className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                      Objet du Message *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-sm border border-white/15 bg-[#120E0A] px-4 py-3 text-sm text-white focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                    >
                      <option value="Renseignement Général">Renseignement Général</option>
                      <option value="Problème Billetterie">Question sur mon Billet / QR Code</option>
                      <option value="Partenariat Église">Partenariat Église &amp; Ministère</option>
                      <option value="Bénévolat">Devenir Bénévole à l&apos;événement</option>
                      <option value="Presse & Médias">Presse &amp; Couverture Média</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                    Votre Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Détaillez votre question ou votre proposition..."
                    className="w-full rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#7D7560] focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-sm bg-[#F59E0B] py-4 text-xs font-bold uppercase tracking-widest text-[#17110E] hover:bg-[#FCD34D] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Envoyer mon message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Foire Aux Questions (FAQ) */}
      <section className="bg-[#0B0806] border-t border-white/8 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F59E0B]">
              Réponses Rapides
            </span>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl uppercase tracking-wide text-white flex items-center justify-center gap-2">
              <HelpCircle className="text-[#F59E0B]" size={28} />
              Foire Aux Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/8 bg-[#120E0A] overflow-hidden transition-colors shadow-md hover:border-[#F59E0B]/40"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-body text-sm font-semibold text-white hover:text-[#FCD34D]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} className="text-[#F59E0B]" /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm font-body text-[#BFB89E] leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

