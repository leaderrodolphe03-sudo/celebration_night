"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { CelebrationNightLogo } from "@/components/layout/Logos";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
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
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Code d'accès invalide.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
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
        {/* Logo & En-tête */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <CelebrationNightLogo imgClassName="h-20 sm:h-24 w-auto object-contain mx-auto drop-shadow-md" />
          </Link>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cn-dark border border-cn-gold/40 px-3 py-1 text-xs font-semibold text-cn-gold-light">
            <ShieldCheck size={14} className="text-cn-gold" />
            <span>Portail Responsables &amp; Scanner Officiel</span>
          </div>
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-wider text-white">
            Accès Espace Admin
          </h1>
          <p className="mt-2 text-xs text-cn-gray-400 font-body">
            Saisissez le code d&apos;accès secret pour gérer les participants, le scanner et le suivi.
          </p>
        </div>

        {/* Formulaire Code d'Accès */}
        <div className="rounded-2xl border border-white/10 bg-cn-dark/95 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/60 p-3.5 text-xs text-red-200 flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-2">
                Code d&apos;Accès Secret
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Entrez le code d'accès"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3.5 pl-11 text-center font-mono text-lg tracking-widest text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
                />
                <KeyRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cn-gold"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={<ArrowRight size={16} />}
              className="w-full justify-center"
            >
              {loading ? "Vérification du code..." : "Déverrouiller le portail"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <span className="text-[11px] text-cn-gray-500">
              Code d&apos;accès configuré : <code className="text-cn-gold font-bold">CN2026</code>
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-cn-gray-400">
          HAGIAZO Ministry &bull; CELEBRATION NIGHT
        </p>
      </div>
    </div>
  );
}
