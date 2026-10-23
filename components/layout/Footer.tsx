"use client";

import Link from "next/link";
import { Youtube, Facebook, Instagram, ShieldCheck, Mail, MapPin, Calendar, Ticket } from "lucide-react";
import { CelebrationNightLogo, HagiazoLogo } from "./Logos";
import { EVENT } from "@/lib/event-config";

export default function Footer() {
  return (
    <footer className="bg-cn-black text-cn-white print:hidden">

      {/* Bande supérieure info rapide */}
      <div className="border-b border-white/6 px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs text-cn-gray-300">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-cn-gold" />
            {EVENT.dateLabel} à {EVENT.timeLabel}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-cn-gold" />
            Temple des Leaders FOURSQUARE Sikècodji
          </span>
          <span className="flex items-center gap-2">
            <Mail size={14} className="text-cn-gold" />
            contact@celebrationnight.org
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Identité */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <CelebrationNightLogo priority={false} imgClassName="h-16 sm:h-20 w-auto object-contain" />
            
            <p className="text-sm leading-relaxed text-cn-gray-300 max-w-sm">
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
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-white/10 text-cn-gray-300 transition-all hover:border-cn-gold/40 hover:text-cn-gold hover:bg-cn-dark"
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
            <ul className="space-y-2.5 text-sm text-cn-gray-300">
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
            <ul className="space-y-2.5 text-sm text-cn-gray-300">
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
                  className="inline-flex items-center gap-2 font-semibold text-cn-gold hover:text-cn-gold-light transition-colors whitespace-nowrap flex-nowrap"
                >
                  <Ticket size={13} className="shrink-0" />
                  <span className="whitespace-nowrap">Réserver ma place</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/mon-billet"
                  className="inline-flex items-center gap-2 text-cn-gray-300 hover:text-white transition-colors whitespace-nowrap flex-nowrap"
                >
                  <Ticket size={13} className="shrink-0" />
                  <span className="whitespace-nowrap">Retrouver mon billet</span>
                </Link>
              </li>
              <li className="pt-3 border-t border-white/6">
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 text-xs text-cn-gray-400 hover:text-cn-gray-200 transition-colors"
                >
                
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8  flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cn-gray-400">
          <p>© {new Date().getFullYear()} HAGIAZO Ministry. Tous droits réservés.</p>
          <p>
            <span className="text-cn-gold">CELEBRATION NIGHT 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
