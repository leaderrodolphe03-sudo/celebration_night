"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENT } from "@/lib/event-config";
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
        setError(
          "Aucun billet ne correspond à cette recherche. Vérifiez l'orthographe ou le numéro."
        );
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
    <div className="min-h-screen bg-[#0A0304] px-4 py-16 text-white sm:px-6 lg:px-8">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-12 h-96 w-96 -translate-x-1/2 rounded-full bg-[#E5252A]/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD84A]">
          Espace Participant
        </span>
        <h1 className="mt-3 font-heading text-4xl uppercase tracking-wider text-white sm:text-6xl">
          Retrouver Mon Billet
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-sm text-cn-gray-300 sm:text-base">
          Entrez votre numéro de billet (ex: <code className="text-[#FFD84A]">CN-2026-000001</code>
          ), votre adresse email ou votre téléphone pour afficher et télécharger votre QR Code
          d&apos;entrée.
        </p>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
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
            className="rounded-md bg-gradient-to-r from-[#B71C1C] via-[#E5252A] to-[#F5B900] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Recherche..." : "Rechercher"}
          </button>
        </form>

        {/* Message d'erreur */}
        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-950/60 p-4 text-left text-xs text-red-200">
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
                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#140507]/90 p-5 shadow-xl transition-all hover:border-[#E5252A]/50 sm:flex-row sm:items-center sm:p-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-2xl tracking-wider text-white">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ticket.ticketType === "VIP"
                          ? "bg-[#E5252A] text-white"
                          : "border border-[#E5252A]/30 bg-[#24080C] text-[#FFD84A]"
                      }`}
                    >
                      {ticket.ticketType}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-cn-gray-300">
                    Titulaire : <strong className="text-white">{ticket.participantName}</strong> (
                    {ticket.email})
                  </p>

                  <span className="mt-1 inline-block font-mono text-[11px] text-emerald-400">
                    Statut :{" "}
                    {ticket.status === "VALID" ? `✓ Valable le ${EVENT.dateLabel}` : "Scanné"}
                  </span>
                </div>

                <Link
                  href={`/billet/${encodeURIComponent(ticket.ticketNumber)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F5B900] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#111111] transition-all hover:bg-[#FFD84A]"
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
        <div className="mt-14 border-t border-white/10 pt-8">
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
