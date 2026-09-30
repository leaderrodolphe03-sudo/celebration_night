"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Ticket, ArrowRight, AlertCircle, Sparkles, QrCode } from "lucide-react";

interface TicketSummary {
  ticketNumber: string;
  ticketType: "STANDARD" | "VIP";
  status: "VALID" | "USED" | "CANCELLED";
  participantName: string;
  email: string;
}

export default function MonBilletPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TicketSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/ticket/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Aucun billet trouvé.");
      }

      if (!data.tickets || data.tickets.length === 0) {
        setError("Aucun billet ne correspond à cette recherche. Vérifiez l'orthographe ou le numéro.");
      } else {
        setResults(data.tickets);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0304] text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#E5252A]/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD84A]">
          Espace Participant
        </span>
        <h1 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-white">
          Retrouver Mon Billet
        </h1>
        <p className="mt-3 font-body text-sm sm:text-base text-cn-gray-300 max-w-xl mx-auto">
          Entrez votre numéro de billet (ex: <code className="text-[#FFD84A]">CN-2026-000001</code>),
          votre adresse email ou votre téléphone pour afficher et télécharger votre QR Code d&apos;entrée.
        </p>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Numéro CN-2026-..., email ou téléphone"
              className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-4 pl-11 text-sm text-white placeholder-cn-gray-500 focus:border-[#E5252A] focus:outline-none focus:ring-1 focus:ring-[#E5252A]"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cn-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-white hover:opacity-95 shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </form>

        {/* Message d'erreur */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-950/60 p-4 text-xs text-red-200 flex items-center gap-3 text-left">
            <AlertCircle size={18} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Résultats */}
        {results && results.length > 0 && (
          <div className="mt-10 space-y-4 text-left">
            <h3 className="font-heading text-xl uppercase tracking-wide text-[#FFD84A]">
              {results.length} Billet(s) Trouvé(s) :
            </h3>

            {results.map((ticket, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#140507]/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E5252A]/50 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-2xl text-white tracking-wider">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ticket.ticketType === "VIP"
                          ? "bg-[#E5252A] text-white"
                          : "bg-[#24080C] text-[#FFD84A] border border-[#E5252A]/30"
                      }`}
                    >
                      {ticket.ticketType}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-cn-gray-300">
                    Titulaire : <strong className="text-white">{ticket.participantName}</strong> ({ticket.email})
                  </p>

                  <span className="mt-1 inline-block text-[11px] font-mono text-emerald-400">
                    Statut : {ticket.status === "VALID" ? "✓ Actif pour le 14 Novembre" : "Scanné"}
                  </span>
                </div>

                <Link
                  href={`/billet/${encodeURIComponent(ticket.ticketNumber)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F5B900] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#FFD84A] transition-all"
                >
                  <QrCode size={16} />
                  <span>Ouvrir mon Billet</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CTA Pas encore inscrit ? */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-xs text-cn-gray-500">
            Vous n&apos;avez pas encore de billet pour CÉLÉBRATION NIGHT ?
          </p>
          <Link
            href="/inscription"
            className="mt-2 inline-block font-body text-xs font-bold uppercase tracking-widest text-[#F5B900] hover:underline"
          >
            → Réserver ma place gratuitement maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
