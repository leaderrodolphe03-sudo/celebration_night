import Link from "next/link";
import { Handshake, ArrowRight, ShieldCheck, Award, Eye, HeartHandshake } from "lucide-react";

export default function SponsorsCtaSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#0A0304] via-[#140507] to-[#0A0304] px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      {/* Halo de fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-80 w-full max-w-4xl rounded-full bg-[#E5252A]/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="rounded-3xl border-2 border-[#E5252A]/40 bg-gradient-to-br from-[#24080C] via-[#140507] to-[#0A0304] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          {/* Liseré or discret */}
          <div className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-white/10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Colonne Gauche : Argumentaire & Titre (7 cols) */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5252A]/20 border border-[#E5252A]/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
                <Handshake size={14} className="text-[#FFD84A]" />
                <span>Appel aux Partenaires & Sponsors</span>
              </span>

              <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-wide text-white leading-tight">
                Associez Votre Image à une Célébration Historique
              </h2>

              <p className="font-body text-sm sm:text-base text-cn-gray-300 leading-relaxed">
                CÉLÉBRATION NIGHT réunit chaque année des milliers de personnes, de leaders et de familles.
                En devenant sponsor ou partenaire officiel, vous propulsez un événement d&apos;excellence,
                bénéficiez d&apos;une visibilité d&apos;honneur et participez activement à la gratuité totale des billets
                pour la jeunesse.
              </p>

              {/* 3 Avantages clés */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-2.5">
                  <Eye size={18} className="text-[#FFD84A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading text-sm uppercase text-white tracking-wider">
                      Forte Visibilité
                    </h4>
                    <p className="text-[11px] text-cn-gray-400">
                      Écrans géants, scène, live streaming et réseaux.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award size={18} className="text-[#FFD84A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading text-sm uppercase text-white tracking-wider">
                      Excellence Reconnue
                    </h4>
                    <p className="text-[11px] text-cn-gray-400">
                      Son, lumière et organisation de standard international.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <HeartHandshake size={18} className="text-[#FFD84A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading text-sm uppercase text-white tracking-wider">
                      Impact Spirituel
                    </h4>
                    <p className="text-[11px] text-cn-gray-400">
                      Soutien concret à la jeunesse et à l&apos;évangélisation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/soutenir"
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] bg-[length:200%_auto] hover:bg-right px-7 py-3.5 font-body text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105"
                >
                  <span>Devenir Partenaire ou Sponsor</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                >
                  <span>Contacter le Comité</span>
                </Link>
              </div>
            </div>

            {/* Colonne Droite : Carte Badge Partenaire (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl border-2 border-white/20 bg-[#0A0304]/80 p-6 sm:p-7 shadow-2xl backdrop-blur-md text-center rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#24080C] border-2 border-[#F5B900] flex items-center justify-center text-[#FFD84A] shadow-lg mb-4">
                  <ShieldCheck size={32} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFD84A] block">
                  Rejoignez la Dynastie des Bâtisseurs
                </span>

                <h3 className="mt-2 font-heading text-2xl uppercase tracking-wide text-white">
                  Pack Partenaire &laquo; Flamme d&apos;Or &raquo;
                </h3>

                <p className="mt-2 font-body text-xs text-cn-gray-300 leading-relaxed">
                  Offrez à votre structure une présence prestigieuse lors de cette soirée et bénéficiez de places VIP réservées pour vos délégations et invités de marque.
                </p>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-cn-gray-400 font-mono">Dossier Sponsoring 2026</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    Candidatures Ouvertes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
