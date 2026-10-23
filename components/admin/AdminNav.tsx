"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Ticket,
  QrCode,
  UserPlus,
  LogOut,
  Shield,
  ExternalLink,
} from "lucide-react";
import { CelebrationNightLogo } from "../layout/Logos";

interface AdminNavProps {
  user?: {
    email?: string;
    username?: string;
    name?: string;
    role?: "ADMIN" | "STAFF";
  } | null;
}

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const isStaff = user?.role === "STAFF";

  const navItems = isStaff
    ? [
        { href: "/admin/scanner", label: "Scanner", icon: QrCode, highlight: true },
      ]
    : [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/scanner", label: "Scanner", icon: QrCode, highlight: true },
        { href: "/admin/participants", label: "Inscrits", icon: Users },
        { href: "/admin/billets", label: "Billets", icon: Ticket },
        { href: "/admin/equipe", label: "Équipe", icon: UserPlus },
      ];

  const homeHref = isStaff ? "/admin/scanner" : "/admin/dashboard";

  return (
    <>
      {/* Top Bar (Header fixe) */}
      <header className="border-b border-white/10 bg-cn-black/95 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Logo & Rôle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href={homeHref} className="flex items-center shrink-0">
              <CelebrationNightLogo imgClassName="h-8 sm:h-10 w-auto object-contain" />
            </Link>

            <span className="inline-flex items-center gap-1 rounded-md bg-cn-dark px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-cn-gold-light border border-cn-gold/30">
              <Shield size={11} className="text-cn-gold shrink-0" />
              <span>{isStaff ? "Staff" : "Super Admin"}</span>
            </span>
          </div>

          {/* Navigation centrale (Desktop uniquement) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                    item.highlight
                      ? isActive
                        ? "bg-gradient-to-r from-cn-gold to-cn-amber text-cn-black font-extrabold shadow-sm"
                        : "bg-cn-gold/15 text-cn-gold-light border border-cn-gold/40 hover:bg-cn-gold hover:text-cn-black"
                      : isActive
                      ? "bg-white/12 text-white border border-white/10"
                      : "text-cn-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions Droite : Site public & Déconnexion */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1 text-xs text-cn-gray-400 hover:text-white transition-colors py-1.5 px-2 rounded-md hover:bg-white/5"
              title="Voir le site public"
            >
              <span>Site public</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 sm:px-3 py-1.5 text-xs text-cn-gray-300 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-300 transition-colors"
              title="Se déconnecter de la session"
            >
              <LogOut size={14} className="shrink-0" />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar (Mobile uniquement, ergonomie tactile sous le pouce) */}
      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cn-dark/95 backdrop-blur-xl border-t border-white/10 px-1 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center -mt-3.5 relative group px-2"
                >
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg ${
                      isActive
                        ? "bg-gradient-to-r from-cn-gold to-cn-amber text-cn-black ring-2 ring-cn-gold-light ring-offset-2 ring-offset-cn-dark shadow-gold"
                        : "bg-cn-gold text-cn-black hover:brightness-110"
                    }`}
                  >
                    <Icon size={22} className="shrink-0" />
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider mt-1 transition-colors ${
                      isActive ? "text-cn-gold-light" : "text-cn-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 min-h-[48px] ${
                  isActive
                    ? "text-cn-gold-light bg-white/5 font-bold"
                    : "text-cn-gray-400 hover:text-white"
                }`}
              >
                <Icon size={19} className={isActive ? "text-cn-gold" : "text-cn-gray-400"} />
                <span className="text-[10px] font-semibold uppercase tracking-wider mt-1 truncate max-w-[64px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
