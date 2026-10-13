"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

  // Détection fluide du défilement
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture automatique du menu mobile lors du changement d'URL
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Verrouillage du scroll en arrière-plan lorsque le menu mobile est ouvert
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

  // Les pages à fond clair ont besoin d'une barre contrastée dès le départ
  const isLightPage = pathname === "/inscription";
  const hasSolidBackground = scrolled || open || isLightPage;

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 print:hidden ${
          hasSolidBackground
            ? "bg-cn-black/95 border-white/10 shadow-xl backdrop-blur-md"
            : "bg-transparent border-transparent shadow-none"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 transition-all duration-300 ease-in-out ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo officiel adaptatif */}
          <Link
            href="/"
            className="group flex items-center shrink-0"
            aria-label="Célébration Night — Accueil"
          >
            <CelebrationNightLogo
              className="group-hover:opacity-85 transition-opacity"
              imgClassName={`w-auto object-contain transition-all duration-300 ${
                scrolled ? "h-9 sm:h-10" : "h-11 sm:h-12"
              }`}
            />
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

          {/* CTA + Bouton Hamburger Mobile */}
          <div className="flex items-center gap-3">
            <Button
              href="/inscription"
              size={scrolled ? "sm" : "sm"}
              variant="primary"
              className="hidden sm:inline-flex"
            >
              Participer
            </Button>

            <button
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden hover:border-cn-gold/40 hover:text-cn-gold transition-colors"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Plein Écran (placé en frère du header pour immunité absolue au bug CSS backdrop-filter) */}
      {open && (
        <div
          id="mobile-navigation-drawer"
          className={`fixed inset-x-0 bottom-0 z-40 bg-cn-black/98 backdrop-blur-2xl border-t border-white/10 px-6 py-8 lg:hidden flex flex-col justify-between overflow-y-auto transition-all duration-300 ${
            scrolled ? "top-16" : "top-20"
          }`}
        >
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
              onClick={() => setOpen(false)}
            >
              Réserver ma place
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
