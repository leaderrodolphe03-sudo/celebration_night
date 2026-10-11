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
    <div className="min-h-screen bg-[#080808] text-[#EDE8DC] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#F59E0B]/20 via-[#EA580C]/15 to-[#FCD34D]/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FCD34D]">
          Espace Participant
        </span>
        <h1 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-[#EDE8DC]">
          Retrouver Mon Billet
        </h1>
        <p className="mt-3 font-body text-sm sm:text-base text-[#BFB89E] max-w-xl mx-auto">
          Entrez votre numéro de billet (ex: <code className="text-[#FCD34D]">CN-2026-000001</code>),
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
              className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-4 pl-11 text-sm text-[#EDE8DC] placeholder-[#BFB89E]/50 focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BFB89E]/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-8 py-4 font-body text-xs font-black uppercase tracking-widest text-[#080808] hover:opacity-95 shadow-xl transition-all disabled:opacity-50"
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
            <h3 className="font-heading text-xl uppercase tracking-wide text-[#FCD34D]">
              {results.length} Billet(s) Trouvé(s) :
            </h3>

            {results.map((ticket, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#F59E0B]/30 bg-[#120E0A]/95 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#F59E0B]/60 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-2xl text-[#EDE8DC] tracking-wider">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ticket.ticketType === "VIP"
                          ? "bg-[#F59E0B] text-[#080808] font-black"
                          : "bg-[#1F1710] text-[#FCD34D] border border-[#F59E0B]/40"
                      }`}
                    >
                      {ticket.ticketType}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[#BFB89E]">
                    Titulaire : <strong className="text-[#EDE8DC]">{ticket.participantName}</strong> ({ticket.email})
                  </p>

                  <span className="mt-1 inline-block text-[11px] font-mono text-emerald-400">
                    Statut : {ticket.status === "VALID" ? "✓ Actif pour le 14 Novembre" : "Scanné"}
                  </span>
                </div>

                <Link
                  href={`/billet/${encodeURIComponent(ticket.ticketNumber)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#080808] hover:brightness-110 transition-all"
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
          <p className="text-xs text-[#BFB89E]">
            Vous n&apos;avez pas encore de billet pour CÉLÉBRATION NIGHT ?
          </p>
          <Link
            href="/inscription"
            className="mt-2 inline-block font-body text-xs font-bold uppercase tracking-widest text-[#FCD34D] hover:underline"
          >
            → Réserver ma place gratuitement maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
