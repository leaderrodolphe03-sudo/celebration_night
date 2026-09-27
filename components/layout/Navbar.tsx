"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Ticket as TicketIcon, ShieldCheck, Sparkles } from "lucide-react";
import { CelebrationNightLogo } from "./Logos";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/programme", label: "Programme" },
  { href: "/artistes", label: "Artistes" },
  { href: "/medias", label: "Médias" },
  { href: "/worship-session", label: "Worship Session" },
  { href: "/echo-de-la-louange", label: "L'Écho de la Louange" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 print:hidden ${
        scrolled
          ? "bg-[#17165A]/90 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl border-b border-[#F5B900]/25"
          : "bg-gradient-to-b from-[#17165A]/95 via-[#17165A]/60 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo officiel avec lueur dorée */}
        <Link
          href="/"
          className="flex items-center transition-transform hover:scale-[1.02]"
          aria-label="Célébration Night — Accueil"
        >
          <div className="relative">
            <CelebrationNightLogo />
            {/* Lueur subtile derrière le logo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-full bg-[#F5B900]/10 blur-md -z-10"
            />
          </div>
        </Link>

        {/* Liens de navigation Desktop */}
        <nav className="hidden xl:flex items-center gap-7" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-body text-xs font-semibold uppercase tracking-wider transition-colors duration-200 py-1 ${
                  isActive
                    ? "text-[#F5B900] font-bold"
                    : "text-cn-gray-300 hover:text-[#FFD84A]"
                }`}
              >
                {link.label}
                {/* Ligne d'indication de page active */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[#F5B900] to-[#FFD84A] shadow-[0_0_8px_#F5B900]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions Rapides Droite */}
        <div className="flex items-center gap-3">
          {/* Bouton Mon Billet */}
          <Link
            href="/mon-billet"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-cn-gray-200 hover:text-white uppercase tracking-wider py-2.5 px-3.5 rounded-md border border-white/20 bg-white/5 hover:border-[#F5B900]/60 hover:bg-[#38217F]/40 transition-all backdrop-blur-sm"
          >
            <TicketIcon size={14} className="text-[#F5B900]" />
            <span>Mon billet</span>
          </Link>

          {/* Bouton Participer */}
          <Link
            href="/inscription"
            className="rounded-md bg-gradient-to-r from-[#F5B900] via-[#FFD84A] to-[#F5B900] bg-[length:200%_auto] hover:bg-right px-6 py-2.5 font-body text-xs font-bold uppercase tracking-widest text-[#111111] shadow-[0_4px_20px_rgba(245,185,0,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_24px_rgba(245,185,0,0.5)]"
          >
            Participer
          </Link>

          {/* Bouton Menu Mobile */}
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white xl:hidden hover:bg-white/10 transition-colors"
          >
            {open ? <X size={22} className="text-[#FFD84A]" /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile avec effet Glassmorphism */}
      {open && (
        <div className="border-t border-[#F5B900]/20 bg-[#17165A]/95 px-5 pb-8 pt-4 xl:hidden shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-3">
          <nav className="flex flex-col gap-1.5" aria-label="Navigation mobile">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3.5 py-3 font-body text-sm uppercase tracking-wider transition-colors flex items-center justify-between ${
                    isActive
                      ? "bg-gradient-to-r from-[#38217F] to-[#17165A] border-l-4 border-[#F5B900] text-[#F5B900] font-bold"
                      : "text-cn-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <Sparkles size={14} className="text-[#F5B900]" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/mon-billet"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 py-3 text-center font-body text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10"
            >
              <TicketIcon size={16} className="text-[#F5B900]" />
              Consulter / Télécharger mon billet
            </Link>

            <Link
              href="/inscription"
              onClick={() => setOpen(false)}
              className="block rounded-md bg-gradient-to-r from-[#F5B900] to-[#FFD84A] py-3.5 text-center font-body text-xs font-bold uppercase tracking-widest text-[#111111] shadow-xl"
            >
              Réserver ma place (100% Gratuit)
            </Link>

            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 text-center font-body text-xs text-cn-gray-400 hover:text-white"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              Accès Organisateur & Scanner d&apos;Entrées
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
