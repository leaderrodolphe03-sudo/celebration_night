"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Ticket,
  QrCode,
  LogOut,
  Shield,
  ExternalLink,
} from "lucide-react";
import { CelebrationNightLogo } from "../layout/Logos";

interface AdminNavProps {
  user?: {
    email: string;
    name: string;
    role: "ADMIN" | "STAFF";
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
    } catch (e) {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/scanner", label: "Scanner Entrées", icon: QrCode, highlight: true },
    { href: "/admin/participants", label: "Participants", icon: Users },
    { href: "/admin/billets", label: "Billets", icon: Ticket },
  ];

  return (
    <header className="border-b border-white/10 bg-[#0D0A08]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Badge */}
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="flex items-center">
            <CelebrationNightLogo />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[#1F1710] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FCD34D] border border-[#F59E0B]/40">
            <Shield size={12} />
            {user?.role === "ADMIN" ? "Super Admin" : "Staff Contrôle"}
          </span>
        </div>

        {/* Navigation centrale */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  item.highlight
                    ? isActive
                      ? "bg-gradient-to-r from-[#EA580C] to-[#F59E0B] text-[#080808] font-black"
                      : "bg-[#F59E0B]/15 text-[#FCD34D] border border-[#F59E0B]/40 hover:bg-[#F59E0B] hover:text-[#080808]"
                    : isActive
                    ? "bg-white/10 text-[#FCD34D]"
                    : "text-[#BFB89E] hover:bg-white/5 hover:text-[#EDE8DC]"
                }`}
              >
                <Icon size={15} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profil & Déconnexion */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden lg:flex items-center gap-1 text-xs text-cn-gray-500 hover:text-white"
            title="Voir le site public"
          >
            <span>Site public</span>
            <ExternalLink size={12} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs text-cn-gray-300 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
