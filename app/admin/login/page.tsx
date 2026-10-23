"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { CelebrationNightLogo } from "@/components/layout/Logos";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Identifiant ou mot de passe incorrect.");
      }

      // Redirection contextuelle selon le rôle de l'utilisateur
      if (data.user?.role === "STAFF") {
        router.push("/admin/scanner");
      } else {
        router.push("/admin/dashboard");
      }
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
          
          <h1 className="mt-3 font-heading text-3xl uppercase tracking-wider text-white">
            Connexion Admin &amp; Staff
          </h1>
          <p className="mt-2 text-xs text-cn-gray-400 font-body">
            Connectez-vous pour accéder au tableau de bord ou au portique de scan.
          </p>
        </div>

        {/* Formulaire de Connexion Sécurisée */}
        <div className="rounded-2xl border border-white/10 bg-cn-dark/95 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-950/60 p-3.5 text-xs text-red-200 flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Champ Identifiant ou Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-2">
                Identifiant ou Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ex: username"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 pl-11 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
                />
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cn-gold"
                />
              </div>
            </div>

            {/* Champ Mot de Passe */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 pl-11 pr-11 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
                />
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cn-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cn-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={<ArrowRight size={16} />}
                className="w-full justify-center"
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-cn-gray-400">
          HAGIAZO Ministry &bull; CELEBRATION NIGHT
        </p>
      </div>
    </div>
  );
}
