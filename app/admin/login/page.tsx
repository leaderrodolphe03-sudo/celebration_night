"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight, UserCheck } from "lucide-react";
import { CelebrationNightLogo } from "@/components/layout/Logos";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Identifiants invalides.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role: "admin" | "staff") => {
    if (role === "admin") {
      setEmail("admin@celebrationnight.com");
      setPassword("Celebration2026!");
    } else {
      setEmail("staff@celebrationnight.com");
      setPassword("Staff2026!");
    }
  };

  return (
    <div className="min-h-screen bg-cn-black text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo lumineux */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-cn-gold/15 via-cn-amber/10 to-cn-gold-light/15 blur-[130px]"
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <CelebrationNightLogo imgClassName="h-14 w-auto object-contain mx-auto" />
          </Link>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cn-dark border border-cn-gold/40 px-3 py-1 text-xs font-semibold text-cn-gold-light">
            <ShieldCheck size={14} className="text-cn-gold" />
            <span>Portail de Gestion &amp; Scanner d&apos;Entrées</span>
          </div>
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-wider text-white">
            Connexion Organisateur
          </h1>
        </div>

        {/* Boîte de Connexion */}
        <div className="rounded-2xl border border-white/10 bg-cn-dark/95 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/60 p-3.5 text-xs text-red-200 flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                Adresse Email Organisateur
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@celebrationnight.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 pl-10 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
                />
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cn-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                Mot de Passe Sécurisé
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 pl-10 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
                />
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cn-gray-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={<ArrowRight size={15} />}
              className="w-full justify-center"
            >
              {loading ? "Vérification sécurisée..." : "Accéder à l'administration"}
            </Button>
          </form>

          {/* Raccourcis de test pré-remplis pour la démonstration */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-cn-gray-400 mb-2">
              Comptes de test (cliquez pour pré-remplir) :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left hover:border-cn-gold/50 transition-colors"
              >
                <span className="block text-[11px] font-bold text-cn-gold-light">Super Admin</span>
                <span className="block text-[10px] text-cn-gray-400 truncate">admin@...</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("staff")}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left hover:border-cn-gold/50 transition-colors"
              >
                <span className="block text-[11px] font-bold text-white">Staff Entrées</span>
                <span className="block text-[10px] text-cn-gray-400 truncate">staff@...</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-cn-gray-400">
          Accès strictement réservé au personnel habilité de HAGIAZO Ministry.
        </p>
      </div>
    </div>
  );
}
