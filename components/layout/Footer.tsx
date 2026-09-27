"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Youtube, Facebook, Instagram, ShieldCheck, Mail, MapPin, Calendar, Clock, Ticket } from "lucide-react";
import { CelebrationNightLogo, HagiazoLogo } from "./Logos";
import { EVENT } from "@/lib/event-config";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-[#111111] text-cn-white print:hidden">
      {/* Bannière supérieure de contact rapide */}
      <div className="border-b border-white/5 bg-[#17165A]/40 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs text-cn-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#F5B900]" />
            <span>{EVENT.dateLabel} à {EVENT.timeLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#F5B900]" />
            <span>Palais des Congrès / Grande Salle de Célébration</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-[#F5B900]" />
            <span>contact@celebrationnight.org</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Colonne 1 & 2 : Présentation et Ministère */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <CelebrationNightLogo />
            <div className="mt-2">
              <HagiazoLogo className="opacity-90" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-cn-gray-300 max-w-md">
              « CÉLÉBRATION NIGHT » est un rassemblement d&apos;adoration contemporaine,
              de ferveur et de louange porté par HAGIAZO Ministry. Une expérience spirituelle et
              musicale d&apos;excellence pour une jeunesse consacrée et unie.
            </p>
            <div className="mt-3 flex items-center gap-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube HAGIAZO"
                className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cn-gray-300 transition-colors hover:bg-[#F5B900] hover:text-[#111111]"
              >
                <Youtube size={17} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook HAGIAZO"
                className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cn-gray-300 transition-colors hover:bg-[#F5B900] hover:text-[#111111]"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram HAGIAZO"
                className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cn-gray-300 transition-colors hover:bg-[#F5B900] hover:text-[#111111]"
              >
                <Instagram size={17} />
              </a>
            </div>
          </div>

          {/* Colonne 3 : Navigation principale */}
          <div>
            <h3 className="font-heading text-lg uppercase tracking-wider text-[#F5B900]">
              L&apos;Événement
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cn-gray-300 font-medium">
              <li>
                <Link href="/" className="hover:text-[#F5B900] transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F5B900] transition-colors">
                  À propos d&apos;HAGIAZO
                </Link>
              </li>
              <li>
                <Link href="/programme" className="hover:text-[#F5B900] transition-colors">
                  Programme de la soirée
                </Link>
              </li>
              <li>
                <Link href="/artistes" className="hover:text-[#F5B900] transition-colors">
                  Artistes & Conducteurs
                </Link>
              </li>
              <li>
                <Link href="/medias" className="hover:text-[#F5B900] transition-colors">
                  Médias & Galerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Expérience & Réflexion */}
          <div>
            <h3 className="font-heading text-lg uppercase tracking-wider text-[#F5B900]">
              Immersion
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cn-gray-300 font-medium">
              <li>
                <Link href="/worship-session" className="hover:text-[#F5B900] transition-colors">
                  Worship Session
                </Link>
              </li>
              <li>
                <Link href="/echo-de-la-louange" className="hover:text-[#F5B900] transition-colors">
                  L&apos;Écho de la Louange
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5B900] transition-colors">
                  Lieu & Accès
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5B900] transition-colors">
                  Foire aux questions (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 5 : Billetterie & Accès Organisateur */}
          <div>
            <h3 className="font-heading text-lg uppercase tracking-wider text-[#F5B900]">
              Billetterie
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cn-gray-300 font-medium">
              <li>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-1.5 font-bold text-[#F5B900] hover:underline"
                >
                  <span>→ Réserver ma place</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/mon-billet"
                  className="inline-flex items-center gap-1.5 hover:text-[#F5B900] transition-colors"
                >
                  <Ticket size={14} className="text-[#F5B900]" />
                  <span>Retrouver mon billet</span>
                </Link>
              </li>
              <li className="pt-4 border-t border-white/10">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-cn-gray-500 hover:text-white transition-colors"
                >
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Portail Admin & Scanner</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne inférieure de copyright */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cn-gray-500">
          <p>© {new Date().getFullYear()} HAGIAZO Ministry. Tous droits réservés.</p>
          <p className="flex items-center gap-2">
            <span>Style contemporain et excellence spirituelle</span>
            <span>•</span>
            <span className="text-[#F5B900]">CÉLÉBRATION NIGHT 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
