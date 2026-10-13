"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Download, Users, Ticket, RefreshCw, Filter } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
import { Participant, Ticket as TicketItem } from "@/lib/types";

interface ParticipantWithTickets extends Participant {
  tickets: TicketItem[];
}

export default function AdminParticipantsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [participants, setParticipants] = useState<ParticipantWithTickets[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ticketTypeFilter, setTicketTypeFilter] = useState("ALL");

  const fetchParticipants = async () => {
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
      if (ticketTypeFilter !== "ALL") params.append("ticketType", ticketTypeFilter);

      const res = await fetch(`/api/admin/participants?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.participants || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [ticketTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParticipants();
  };

  const exportCsv = () => {
    if (participants.length === 0) return;

    const headers = [
      "Nom",
      "Prénom",
      "Email",
      "Téléphone",
      "Pays",
      "Ville",
      "Catégorie",
      "Places",
      "Billets",
      "Date Inscription",
    ];

    const rows = participants.map((p) => [
      `"${p.lastName.replace(/"/g, '""')}"`,
      `"${p.firstName.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${p.phone.replace(/"/g, '""')}"`,
      `"${p.country.replace(/"/g, '""')}"`,
      `"${p.city.replace(/"/g, '""')}"`,
      `"${p.ticketType}"`,
      p.numberOfGuests,
      `"${p.tickets.map((t) => t.ticketNumber).join(", ")}"`,
      `"${new Date(p.createdAt).toLocaleString("fr-FR")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `participants_celebration_night_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-cn-black text-white">
      <AdminNav user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Titre & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cn-gold-light">
              Répertoire officiel
            </span>
            <h1 className="mt-1 font-heading text-3xl sm:text-4xl uppercase tracking-wider text-white">
              Gestion des Participants ({participants.length})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={exportCsv}
              disabled={participants.length === 0}
              variant="primary"
              size="sm"
              icon={<Download size={15} />}
            >
              Exporter en CSV
            </Button>
          </div>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, prénom, email, téléphone, ville..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 pl-10 text-xs text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
            />
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cn-gray-400"
            />
          </form>

          <select
            value={ticketTypeFilter}
            onChange={(e) => setTicketTypeFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-cn-dark px-4 py-2.5 text-xs font-semibold text-white focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
          >
            <option value="ALL">Toutes les catégories</option>
            <option value="STANDARD">Pass Standard</option>
            <option value="VIP">Pass VIP Partenaire</option>
          </select>

          <button
            type="button"
            onClick={fetchParticipants}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-cn-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Tableau des participants */}
        <div className="rounded-2xl border border-white/8 bg-cn-dark/95 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-cn-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Localisation</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Places &amp; Billets</th>
                  <th className="py-3.5 px-4">Date d&apos;inscription</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {participants.length > 0 ? (
                  participants.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">
                          {p.firstName} {p.lastName}
                        </span>
                        {p.source && (
                          <span className="text-[10px] text-cn-gray-400 block">
                            Via : {p.source}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-white block">{p.email}</span>
                        <span className="text-cn-gray-400 text-[11px] block">{p.phone}</span>
                      </td>
                      <td className="py-3.5 px-4 text-cn-gray-300">
                        {p.city}, {p.country}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            p.ticketType === "VIP"
                              ? "bg-cn-gold text-cn-black font-black"
                              : "bg-cn-black text-cn-gold-light border border-cn-gold/30"
                          }`}
                        >
                          {p.ticketType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">
                          {p.numberOfGuests} place(s)
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px] text-cn-gray-400">
                          {p.tickets.map((t) => (
                            <span
                              key={t.id}
                              className={`rounded px-1.5 py-0.2 border ${
                                t.status === "USED"
                                  ? "border-emerald-500 text-emerald-400 bg-emerald-950/40"
                                  : "border-white/10 text-cn-gray-300"
                              }`}
                            >
                              {t.ticketNumber}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-cn-gray-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString("fr-FR")} à{" "}
                        {new Date(p.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.tickets[0] && (
                          <Link
                            href={`/billet/${encodeURIComponent(p.tickets[0].ticketNumber)}`}
                            target="_blank"
                            className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-cn-gold hover:text-cn-black transition-colors"
                          >
                            Voir Billet
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-cn-gray-500">
                      {loading ? "Recherche en cours..." : "Aucun participant ne correspond aux critères."}
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
