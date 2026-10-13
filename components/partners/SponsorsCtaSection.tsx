import Link from "next/link";
import { ArrowRight, Eye, Award, HeartHandshake, Handshake, ShieldCheck } from "lucide-react";

export default function SponsorsCtaSection() {
  return (
    <section className="bg-[#1E1611] border-t border-white/6 px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Gauche : Argumentaire */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-6 bg-[#F59E0B]" />
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#F59E0B]">
                Appel aux Partenaires
              </span>
            </div>

            <h2 className="font-heading text-[clamp(2rem,4.5vw,4rem)] uppercase leading-[0.92] tracking-wide text-white">
              Associez Votre Image à une Célébration Historique
            </h2>

            <p className="mt-6 font-body text-base leading-relaxed text-[#BFB89E]">
              CÉLÉBRATION NIGHT réunit chaque année des milliers de personnes. En devenant
              sponsor officiel, vous bénéficiez d&apos;une visibilité d&apos;honneur et participez
              à la gratuité totale des billets pour la jeunesse.
            </p>

            {/* Avantages */}
            <div className="mt-8 space-y-5">
              {[
                { icon: Eye,           label: "Forte Visibilité",    desc: "Écrans géants, scène, live streaming et réseaux." },
                { icon: Award,         label: "Excellence Reconnue", desc: "Organisation de standard international." },
                { icon: HeartHandshake, label: "Impact Spirituel",   desc: "Soutien concret à la jeunesse consacrée." },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="mt-0.5 h-8 w-8 rounded-sm bg-[#1A1108] border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-white">{label}</p>
                    <p className="font-body text-xs text-[#7D7560] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Boutons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/soutenir"
                className="group inline-flex items-center gap-2 rounded-sm bg-[#F59E0B] px-7 py-3.5 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-[#17110E] transition-all hover:bg-[#FCD34D] hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-[0.98]"
              >
                <Handshake size={14} />
                <span>Devenir Partenaire</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm border border-white/15 px-7 py-3.5 font-body text-[11px] font-semibold uppercase tracking-wider text-white hover:border-white/30 hover:bg-white/5 transition-all"
              >
                Contacter le Comité
              </Link>
            </div>
          </div>

          {/* Droite : Carte Badge */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-xl border border-[#F59E0B]/30 bg-gradient-to-b from-[#17110E] via-[#120E0A] to-[#0A0806] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#F59E0B]/10 blur-[40px]"
              />
              <div className="h-14 w-14 rounded-md bg-[#1A1410] border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] mb-6 shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <span className="block font-body text-[10px] font-bold uppercase tracking-[0.25em] text-[#F59E0B] mb-2">
                Rejoignez les Bâtisseurs
              </span>
              <h3 className="font-heading text-2xl uppercase tracking-wide text-white mb-3">
                Pack Partenaire Flamme d&apos;Or
              </h3>
              <p className="font-body text-sm text-[#BFB89E] leading-relaxed">
                Présence prestigieuse sur scène, places VIP réservées et visibilité maximale
                sur tous nos supports de communication officiels et digitaux.
              </p>
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="font-body text-xs text-[#7D7560]">Dossier Sponsoring 2026</span>
                <span className="font-body text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Ouvert
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
