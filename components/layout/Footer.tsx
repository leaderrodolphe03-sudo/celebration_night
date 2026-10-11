"use client";

import Link from "next/link";
import { Youtube, Facebook, Instagram, ShieldCheck, Mail, MapPin, Calendar, Ticket, ArrowRight } from "lucide-react";
import { CelebrationNightLogo, HagiazoLogo } from "./Logos";
import { EVENT } from "@/lib/event-config";

export default function Footer() {
  return (
    <footer className="bg-[#0F0B07] border-t border-white/8 text-cn-white print:hidden">

      {/* Bande supérieure info rapide */}
      <div className="border-b border-white/6 px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs text-[#7D7560]">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-[#F59E0B]" />
            {EVENT.dateLabel} à {EVENT.timeLabel}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-[#F59E0B]" />
            Palais des Congrès — Grande Salle
          </span>
          <span className="flex items-center gap-2">
            <Mail size={14} className="text-[#F59E0B]" />
            contact@celebrationnight.org
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Identité */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <CelebrationNightLogo />
            <HagiazoLogo className="opacity-80" />
            <p className="text-sm leading-relaxed text-[#7D7560] max-w-sm">
              Un rassemblement d&apos;adoration contemporaine, de ferveur et de louange
              porté par HAGIAZO Ministry pour une jeunesse consacrée.
            </p>
            <div className="flex items-center gap-2.5 mt-1">
              {[
                { href: "https://youtube.com",   icon: Youtube,   label: "YouTube HAGIAZO" },
                { href: "https://facebook.com",  icon: Facebook,  label: "Facebook HAGIAZO" },
                { href: "https://instagram.com", icon: Instagram, label: "Instagram HAGIAZO" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="h-9 w-9 flex items-center justify-center border border-white/8 text-[#7D7560] transition-all hover:border-[#F59E0B]/40 hover:text-[#F59E0B] hover:bg-[#1A1108]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* L'Événement */}
          <div>
            <h3 className="font-heading text-base uppercase tracking-wider text-white mb-4">
              L&apos;Événement
            </h3>
            <ul className="space-y-2.5 text-sm text-[#7D7560]">
              {[
                { href: "/",              label: "Accueil" },
                { href: "/notre-histoire", label: "Notre Histoire" },
                { href: "/medias",         label: "Médias & Galerie" },
                { href: "/soutenir",       label: "Soutenir l'Événement" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partenaires */}
          <div>
            <h3 className="font-heading text-base uppercase tracking-wider text-white mb-4">
              Partenaires
            </h3>
            <ul className="space-y-2.5 text-sm text-[#7D7560]">
              <li>
                <Link href="/soutenir" className="hover:text-white transition-colors">
                  Devenir Partenaire
                </Link>
              </li>
              <li>
                <Link href="/echo-de-la-louange" className="hover:text-white transition-colors">
                  L&apos;Écho de la Louange
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  FAQ & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Billetterie */}
          <div>
            <h3 className="font-heading text-base uppercase tracking-wider text-white mb-4">
              Billetterie
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/inscription"
                  className="group inline-flex items-center gap-2 font-semibold text-[#F59E0B] hover:text-[#FCD34D] transition-colors"
                >
                  <Ticket size={13} />
                  <span>Réserver ma place</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link
                  href="/mon-billet"
                  className="flex items-center gap-2 text-[#7D7560] hover:text-white transition-colors"
                >
                  <Ticket size={13} />
                  <span>Retrouver mon billet</span>
                </Link>
              </li>
              <li className="pt-3 border-t border-white/6">
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 text-xs text-[#403C32] hover:text-[#7D7560] transition-colors"
                >
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Portail Admin & Scanner</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#403C32]">
          <p>© {new Date().getFullYear()} HAGIAZO Ministry. Tous droits réservés.</p>
          <p>
            Style contemporain et excellence spirituelle ·{" "}
            <span className="text-[#D97706]">CÉLÉBRATION NIGHT 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
