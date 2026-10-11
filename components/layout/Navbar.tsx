"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Ticket } from "lucide-react";
import { CelebrationNightLogo } from "./Logos";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/notre-histoire", label: "Notre Histoire" },
  { href: "/medias", label: "Médias" },
  { href: "/soutenir", label: "Soutenir" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 print:hidden ${
        scrolled
          ? "bg-[#080808] border-b border-white/10 shadow-2xl shadow-black/90"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Wordmark */}
        <Link
          href="/"
          className="group flex items-center"
          aria-label="Célébration Night — Accueil"
        >
          <CelebrationNightLogo className="group-hover:opacity-80 transition-opacity" />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 rounded-sm ${
                  isActive
                    ? "text-[#FCD34D]"
                    : "text-[#BFB89E] hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-px bg-[#F59E0B]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/inscription"
            className="hidden sm:inline-flex items-center gap-2 rounded-sm bg-[#F59E0B] px-5 py-2.5 font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#080808] transition-all hover:bg-[#FCD34D] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95"
          >
            <Ticket size={13} />
            <span>Participer</span>
          </Link>

          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-white/4 text-white lg:hidden hover:border-[#F59E0B]/40 hover:text-[#F59E0B] transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="bg-[#080808] border-t border-white/8 px-5 pb-8 pt-5 lg:hidden">
          <nav className="flex flex-col" aria-label="Navigation mobile">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-white/6 py-4 font-body text-sm uppercase tracking-wider transition-colors ${
                    isActive ? "text-[#FCD34D]" : "text-[#BFB89E] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6">
            <Link
              href="/inscription"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#F59E0B] py-4 font-body text-sm font-bold uppercase tracking-wider text-[#080808]"
            >
              <Ticket size={15} />
              <span>Réserver ma place — Gratuit</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
