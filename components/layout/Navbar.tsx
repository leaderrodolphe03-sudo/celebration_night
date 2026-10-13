"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Ticket } from "lucide-react";
import { CelebrationNightLogo } from "./Logos";
import Button from "@/components/ui/Button";

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

  // Empêcher le défilement arrière-plan sur mobile quand le menu est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 print:hidden ${
        scrolled
          ? "bg-cn-black/90 border-b border-white/10 shadow-xl backdrop-blur-md"
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
          <CelebrationNightLogo className="group-hover:opacity-85 transition-opacity" />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 rounded-md ${
                  isActive
                    ? "text-cn-gold-light"
                    : "text-cn-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-cn-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Button
            href="/inscription"
            size="sm"
            variant="primary"
            className="hidden sm:inline-flex"
          >
            <span>Participer</span>
          </Button>

          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden hover:border-cn-gold/40 hover:text-cn-gold transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Plein Écran */}
      {open && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 bg-cn-black/98 backdrop-blur-xl border-t border-white/10 px-6 py-8 lg:hidden flex flex-col justify-between overflow-y-auto">
          <nav className="flex flex-col space-y-2" aria-label="Navigation mobile">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-white/8 py-4 font-body text-base font-semibold uppercase tracking-wider transition-colors ${
                    isActive ? "text-cn-gold-light" : "text-cn-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-8">
            <Button
              href="/inscription"
              size="lg"
              variant="primary"
              className="w-full justify-center"
            >
              
              <span>Réserver ma place</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
