"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Ticket as TicketIcon, ShieldCheck, Sparkles } from "lucide-react";
import { CelebrationNightLogo } from "./Logos";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/notre-histoire", label: "Notre Histoire" },
  { href: "/medias", label: "Médias" },
  { href: "/worship-session", label: "Worship session" },
  { href: "/soutenir", label: "Soutenir" },
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
          ? "bg-[#0A0304]/92 shadow-[0_8px_32px_rgba(0,0,0,0.75)] backdrop-blur-xl border-b border-[#E5252A]/25"
          : "bg-gradient-to-b from-[#0A0304]/95 via-[#0A0304]/70 to-transparent"
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
              className="pointer-events-none absolute -inset-1 rounded-full bg-[#E5252A]/15 blur-md -z-10"
            />
          </div>
        </Link>

        {/* Liens de navigation Desktop (5 liens stricts) */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-body text-xs font-semibold uppercase tracking-wider transition-colors duration-200 py-1.5 ${
                  isActive
                    ? "text-[#FFD84A] font-bold"
                    : "text-cn-gray-300 hover:text-[#FFD84A]"
                }`}
              >
                {link.label}
                {/* Ligne d'indication de page active */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[#E5252A] to-[#FFD84A] shadow-[0_0_8px_#E5252A]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Principale Droite : Bouton Participer */}
        <div className="flex items-center gap-3">
          <Link
            href="/inscription"
            className="rounded-md bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] bg-[length:200%_auto] hover:bg-right px-6 py-2.5 font-body text-xs font-bold uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(229,37,42,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_24px_rgba(229,37,42,0.6)]"
          >
            Participer
          </Link>

          {/* Bouton Menu Mobile */}
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white lg:hidden hover:bg-white/10 transition-colors"
          >
            {open ? <X size={22} className="text-[#FFD84A]" /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile avec effet Glassmorphism */}
      {open && (
        <div className="border-t border-[#E5252A]/25 bg-[#0A0304]/98 px-5 pb-8 pt-4 lg:hidden shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-3">
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
                      ? "bg-gradient-to-r from-[#24080C] to-[#0A0304] border-l-4 border-[#E5252A] text-[#FFD84A] font-bold"
                      : "text-cn-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <Sparkles size={14} className="text-[#FFD84A]" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/inscription"
              onClick={() => setOpen(false)}
              className="block rounded-md bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] py-3.5 text-center font-body text-xs font-bold uppercase tracking-widest text-white shadow-xl"
            >
              Participer (Réserver ma place)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
