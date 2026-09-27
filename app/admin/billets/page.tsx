"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Ticket, CheckCircle2, Clock, QrCode, RefreshCw, AlertCircle } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { Ticket as TicketItem, Participant } from "@/lib/types";

interface TicketWithParticipant extends TicketItem {
  participant?: Participant;
}

export default function AdminBilletsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<TicketWithParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ticketTypeFilter, setTicketTypeFilter] = useState("ALL");
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const meRes = await fetch("/api/admin/me");
      if (!meRes.ok) {
        router.push("/admin/login");
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (ticketTypeFilter !== "ALL") params.append("ticketType", ticketTypeFilter);

      const res = await fetch(`/api/admin/billets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, ticketTypeFilter]);

  const handleManualValidation = async (ticketNumber: string) => {
    if (!confirm(`Confirmer la validation manuelle du billet ${ticketNumber} à l'entrée ?`)) {
      return;
    }

    setValidatingId(ticketNumber);
    try {
      const res = await fetch("/api/admin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenOrNumber: ticketNumber }),
      });

      const data = await res.json();
      if (data.status === "VALID") {
        alert(`✓ Billet ${ticketNumber} validé avec succès !`);
      } else if (data.status === "ALREADY_USED") {
        alert(`⚠ Ce billet a déjà été validé à ${new Date(data.previousScanAt).toLocaleTimeString("fr-FR")}`);
      } else {
        alert(`✕ Erreur : ${data.message}`);
      }

      fetchTickets();
    } catch (e) {
      alert("Erreur lors de la validation.");
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminNav user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Titre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B900]">
              Contrôle d&apos;accès
            </span>
            <h1 className="mt-1 font-heading text-3xl sm:text-4xl uppercase tracking-wider text-white">
              Gestion des Billets ({tickets.length})
            </h1>
          </div>

          <Link
            href="/admin/scanner"
            className="flex items-center gap-2 rounded-md bg-[#F5B900] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#FFD84A] shadow-lg transition-transform hover:scale-105"
          >
            <QrCode size={16} />
            <span>Passer au Scanner Caméra</span>
          </Link>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par numéro de billet CN-2026-..., nom ou email..."
              className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 pl-10 text-xs text-white placeholder-cn-gray-500 focus:border-[#F5B900] focus:outline-none"
            />
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cn-gray-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-white/15 bg-[#17165A] px-4 py-2.5 text-xs font-semibold text-white focus:border-[#F5B900] focus:outline-none"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="VALID">Valides (En attente)</option>
            <option value="USED">Scannés (Utilisés)</option>
            <option value="CANCELLED">Annulés</option>
          </select>

          <select
            value={ticketTypeFilter}
            onChange={(e) => setTicketTypeFilter(e.target.value)}
            className="rounded-md border border-white/15 bg-[#17165A] px-4 py-2.5 text-xs font-semibold text-white focus:border-[#F5B900] focus:outline-none"
          >
            <option value="ALL">Toutes les catégories</option>
            <option value="STANDARD">Pass Standard</option>
            <option value="VIP">Pass VIP Partenaire</option>
          </select>

          <button
            type="button"
            onClick={fetchTickets}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-cn-gray-300 hover:text-white"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Tableau des billets */}
        <div className="rounded-2xl border border-white/10 bg-[#17165A]/40 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-cn-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Numéro de Billet</th>
                  <th className="py-3.5 px-4">Titulaire</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Statut d&apos;Entrée</th>
                  <th className="py-3.5 px-4">Horodatage Scan</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tickets.length > 0 ? (
                  tickets.map((t) => {
                    const isValid = t.status === "VALID";
                    const isUsed = t.status === "USED";

                    return (
                      <tr key={t.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {t.ticketNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">
                            {t.participant
                              ? `${t.participant.firstName} ${t.participant.lastName}`
                              : "Inconnu"}
                          </span>
                          <span className="text-[11px] text-cn-gray-400 font-mono block">
                            {t.participant?.email}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                              t.ticketType === "VIP"
                                ? "bg-[#F5B900] text-[#111111]"
                                : "bg-[#38217F] text-[#FFD84A]"
                            }`}
                          >
                            {t.ticketType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isValid && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                              <CheckCircle2 size={13} />
                              Valide (Non scanné)
                            </span>
                          )}
                          {isUsed && (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
                              <Clock size={13} />
                              Scanné / Utilisé
                            </span>
                          )}
                          {t.status === "CANCELLED" && (
                            <span className="inline-flex items-center gap-1 text-red-400 font-semibold text-xs">
                              <AlertCircle size={13} />
                              Annulé
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-cn-gray-400 text-[11px]">
                          {t.scannedAt ? (
                            <>
                              <span className="text-white block">
                                {new Date(t.scannedAt).toLocaleTimeString("fr-FR")}
                              </span>
                              <span className="text-[10px] text-cn-gray-500 block">
                                Par : {t.scannedBy || "Staff"}
                              </span>
                            </>
                          ) : (
                            <span className="text-cn-gray-600">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {isValid && (
                            <button
                              type="button"
                              onClick={() => handleManualValidation(t.ticketNumber)}
                              disabled={validatingId === t.ticketNumber}
                              className="rounded bg-emerald-600/30 border border-emerald-500/50 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              Valider l&apos;entrée
                            </button>
                          )}
                          <Link
                            href={`/billet/${encodeURIComponent(t.ticketNumber)}`}
                            target="_blank"
                            className="inline-block rounded bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#F5B900] hover:text-[#111111] transition-colors"
                          >
                            Voir Billet
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-cn-gray-500">
                      {loading ? "Chargement des billets..." : "Aucun billet ne correspond aux critères."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
