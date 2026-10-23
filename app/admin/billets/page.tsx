"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Ticket, CheckCircle2, Clock, QrCode, RefreshCw, AlertCircle } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
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
  const [notification, setNotification] = useState<{
    type: "success" | "warning" | "error";
    message: string;
  } | null>(null);
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

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleManualValidation = async (ticketNumber: string) => {
    setValidatingId(ticketNumber);
    try {
      const res = await fetch("/api/admin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenOrNumber: ticketNumber }),
      });

      const data = await res.json();
      if (data.status === "VALID") {
        setNotification({
          type: "success",
          message: `Billet ${ticketNumber} validé avec succès à l'entrée.`,
        });
      } else if (data.status === "ALREADY_USED") {
        setNotification({
          type: "warning",
          message: `Ce billet a déjà été validé à ${new Date(data.previousScanAt).toLocaleTimeString("fr-FR")}.`,
        });
      } else {
        setNotification({
          type: "error",
          message: data.message || "Erreur lors de la validation du billet.",
        });
      }

      fetchTickets();
    } catch {
      setNotification({
        type: "error",
        message: "Erreur réseau lors de la validation manuelle.",
      });
    } finally {
      setValidatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-cn-black text-white pb-20 md:pb-10">
      <AdminNav user={user} />

      {/* Toast Notification In-App */}
      {notification && (
        <div className="fixed top-16 sm:top-20 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`rounded-2xl p-4 border shadow-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold backdrop-blur-xl ${
              notification.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
                : notification.type === "warning"
                ? "bg-amber-950/90 border-amber-500/50 text-amber-200"
                : "bg-red-950/90 border-red-500/50 text-red-200"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {notification.type === "success" && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
              {notification.type === "warning" && <AlertCircle size={18} className="text-amber-400 shrink-0" />}
              {notification.type === "error" && <AlertCircle size={18} className="text-red-400 shrink-0" />}
              <span className="truncate">{notification.message}</span>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
        {/* Titre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-5 sm:pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cn-gold-light">
              Contrôle d&apos;accès
            </span>
            <h1 className="mt-1 font-heading text-2xl sm:text-4xl uppercase tracking-wider text-white">
              Gestion des Billets ({tickets.length})
            </h1>
          </div>

          <Button
            href="/admin/scanner"
            variant="primary"
            size="sm"
            icon={<QrCode size={15} />}
            className="text-xs self-start sm:self-center"
          >
            Passer au Scanner Caméra
          </Button>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° de billet (CN-2026-...), nom ou email..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 pl-10 text-xs sm:text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
            />
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cn-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-initial rounded-xl border border-white/10 bg-cn-dark px-3 py-2.5 text-xs font-semibold text-white focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="VALID">Valides (En attente)</option>
              <option value="USED">Scannés (Utilisés)</option>
              <option value="CANCELLED">Annulés</option>
            </select>

            <select
              value={ticketTypeFilter}
              onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="flex-1 sm:flex-initial rounded-xl border border-white/10 bg-cn-dark px-3 py-2.5 text-xs font-semibold text-white focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
            >
              <option value="ALL">Toutes catégories</option>
              <option value="STANDARD">Pass Standard</option>
              <option value="VIP">Pass VIP Partenaire</option>
            </select>

            <button
              type="button"
              onClick={fetchTickets}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-cn-gray-300 hover:text-white transition-colors shrink-0"
              title="Rafraîchir les billets"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* VUE MOBILE : FICHES BILLETS TACTILES */}
        <div className="block md:hidden space-y-3">
          {tickets.length > 0 ? (
            tickets.map((t) => {
              const isValid = t.status === "VALID";
              const isUsed = t.status === "USED";

              return (
                <div
                  key={t.id}
                  className="rounded-2xl border border-white/10 bg-cn-dark/95 p-4 shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-white text-sm block">
                        {t.ticketNumber}
                      </span>
                      <p className="text-xs text-cn-gray-300 font-semibold mt-0.5">
                        {t.participant
                          ? `${t.participant.firstName} ${t.participant.lastName}`
                          : "Inconnu"}
                      </p>
                      {t.participant?.email && (
                        <p className="text-[10px] text-cn-gray-500 font-mono truncate max-w-[200px]">
                          {t.participant.email}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase shrink-0 ${
                        t.ticketType === "VIP"
                          ? "bg-cn-gold text-cn-black font-black"
                          : "bg-cn-black text-cn-gold-light border border-cn-gold/30"
                      }`}
                    >
                      {t.ticketType}
                    </span>
                  </div>

                  {/* Statut d'entrée */}
                  <div className="text-xs pt-1">
                    {isValid && (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <CheckCircle2 size={14} />
                        <span>Valide (Non scanné)</span>
                      </span>
                    )}
                    {isUsed && (
                      <div className="text-amber-300 space-y-0.5">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <Clock size={14} />
                          <span>Scanné à l&apos;entrée</span>
                        </span>
                        {t.scannedAt && (
                          <p className="text-[10px] text-cn-gray-400 font-mono">
                            {new Date(t.scannedAt).toLocaleTimeString("fr-FR")} &bull; Par {t.scannedBy || "Staff"}
                          </p>
                        )}
                      </div>
                    )}
                    {t.status === "CANCELLED" && (
                      <span className="inline-flex items-center gap-1.5 text-red-400 font-semibold">
                        <AlertCircle size={14} />
                        <span>Annulé</span>
                      </span>
                    )}
                  </div>

                  {/* Actions tactiles */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                    {isValid ? (
                      <button
                        type="button"
                        onClick={() => handleManualValidation(t.ticketNumber)}
                        disabled={validatingId === t.ticketNumber}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold uppercase text-[11px] tracking-wider hover:bg-emerald-600 hover:text-white transition-colors text-center disabled:opacity-50"
                      >
                        {validatingId === t.ticketNumber ? "Validation..." : "Valider l'accès"}
                      </button>
                    ) : (
                      <span className="text-[11px] text-cn-gray-500 italic">Accès clôturé</span>
                    )}

                    <Link
                      href={`/billet/${encodeURIComponent(t.ticketNumber)}`}
                      target="_blank"
                      className="rounded-xl bg-white/10 hover:bg-cn-gold hover:text-cn-black px-3.5 py-2 text-[11px] font-semibold text-white transition-colors"
                    >
                      Billet
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-cn-dark/95 p-8 text-center text-xs text-cn-gray-400">
              {loading ? "Chargement des billets..." : "Aucun billet ne correspond aux critères."}
            </div>
          )}
        </div>

        {/* VUE DESKTOP : TABLEAU COMPLET */}
        <div className="hidden md:block rounded-2xl border border-white/10 bg-cn-dark/95 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-cn-gray-400 font-bold uppercase tracking-wider">
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
                                ? "bg-cn-gold text-cn-black font-black"
                                : "bg-cn-black text-cn-gold-light border border-cn-gold/30"
                            }`}
                          >
                            {t.ticketType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isValid && (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                              <CheckCircle2 size={13} />
                              Valide (Non scanné)
                            </span>
                          )}
                          {isUsed && (
                            <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                              <Clock size={13} />
                              Scanné / Utilisé
                            </span>
                          )}
                          {t.status === "CANCELLED" && (
                            <span className="inline-flex items-center gap-1.5 text-red-400 font-semibold text-xs">
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
                              className="rounded-lg bg-emerald-600/30 border border-emerald-500/50 px-3 py-1.5 text-[11px] font-bold uppercase text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors disabled:opacity-50"
                            >
                              {validatingId === t.ticketNumber ? "..." : "Valider l'accès"}
                            </button>
                          )}
                          <Link
                            href={`/billet/${encodeURIComponent(t.ticketNumber)}`}
                            target="_blank"
                            className="inline-block rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-cn-gold hover:text-cn-black transition-colors"
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
