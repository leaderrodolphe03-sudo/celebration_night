import { Eye, Award, HeartHandshake, Handshake, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SponsorsCtaSection() {
  return (
    <section className="bg-cn-dark px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Gauche : Argumentaire */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-6 bg-cn-gold" />
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-cn-gold">
                Appel aux Partenaires
              </span>
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl uppercase leading-[0.92] tracking-wide text-white">
              Associez Votre Image à une CELEBRATION Historique
            </h2>

            <p className="mt-6 font-body text-base leading-relaxed text-cn-gray-300">
              CELEBRATION NIGHT réunit chaque année des milliers de personnes. En devenant
              sponsor officiel, vous bénéficiez d&apos;une visibilité d&apos;honneur et participez
              à la gratuité totale des billets pour la jeunesse.
            </p>

            

            {/* Boutons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                href="/soutenir"
                variant="primary"
                size="md"
              >
                Devenir Partenaire
              </Button>
              
            </div>
          </div>

          {/* Droite : Carte Badge Épurée */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-2xl border border-cn-gold/30 bg-gradient-to-b from-cn-deep via-cn-dark to-cn-black p-8 shadow-xl overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-cn-gold/10 blur-[40px]"
              />
              <div className="h-14 w-14 rounded-xl bg-cn-deep border border-cn-gold/40 flex items-center justify-center text-cn-gold mb-6 shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <span className="block font-body text-[10px] font-bold uppercase tracking-[0.25em] text-cn-gold mb-2">
                Rejoignez les Bâtisseurs
              </span>
              <h3 className="font-heading text-2xl uppercase tracking-wide text-white mb-3">
                Pack Partenaire
              </h3>
              <p className="font-body text-sm text-cn-gray-300 leading-relaxed">
                Présence prestigieuse sur scène et visibilité maximale
                sur tous nos supports de communication officiels et digitaux.
              </p>
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="font-body text-xs text-cn-gray-400">Dossier Sponsoring 2026</span>
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
