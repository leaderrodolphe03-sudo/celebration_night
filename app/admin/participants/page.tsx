"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Download, Users, Ticket, RefreshCw, Flame, Phone, Mail } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"ALL" | "GAVE_LIFE">("ALL");

  const fetchParticipants = async () => {
    try {
      setLoading(true);
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
      if (activeTab === "GAVE_LIFE") params.append("onlyGaveLife", "true");

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
  }, [ticketTypeFilter, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParticipants();
  };

  const exportCsv = () => {
    if (participants.length === 0) return;

    const isAmesTab = activeTab === "GAVE_LIFE";
    const headers = [
      "Nom",
      "Prénom",
      "Téléphone (Contact Principal)",
      "Email",
      "Ville",
      "Pays",
      "Catégorie",
      "N° Billet",
      "A donné sa vie à Jésus",
      "Date Inscription",
    ];

    const rows = participants.map((p) => [
      `"${p.lastName.replace(/"/g, '""')}"`,
      `"${p.firstName.replace(/"/g, '""')}"`,
      `"${p.phone.replace(/"/g, '""')}"`,
      `"${(p.email || "").replace(/"/g, '""')}"`,
      `"${p.city.replace(/"/g, '""')}"`,
      `"${p.country.replace(/"/g, '""')}"`,
      `"${p.ticketType}"`,
      `"${p.tickets.map((t) => t.ticketNumber).join(", ")}"`,
      p.gaveLifeToJesus ? "OUI" : "NON",
      `"${new Date(p.createdAt).toLocaleString("fr-FR")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = isAmesTab
      ? `ames_pour_christ_celebration_night_${Date.now()}.csv`
      : `participants_celebration_night_${Date.now()}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gaveLifeCount = participants.filter((p) => p.gaveLifeToJesus).length;

  return (
    <div className="min-h-screen bg-cn-black text-white">
      <AdminNav user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Titre & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cn-gold-light">
              Répertoire Officiel Organisateur
            </span>
            <h1 className="mt-1 font-heading text-3xl sm:text-4xl uppercase tracking-wider text-white">
              {activeTab === "GAVE_LIFE" ? "Âmes pour Christ (Suivi Pastoral)" : "Gestion des Inscrits"} ({participants.length})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={exportCsv}
              disabled={participants.length === 0}
              variant={activeTab === "GAVE_LIFE" ? "primary" : "secondary"}
              size="sm"
              icon={<Download size={15} />}
            >
              {activeTab === "GAVE_LIFE"
                ? "Exporter les Âmes pour Christ (CSV)"
                : "Exporter en CSV"}
            </Button>
          </div>
        </div>

        {/* ONGLETS MAJEURS : TOUS LES INSCRITS VS ÂMES POUR CHRIST */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "ALL"
                ? "bg-white/10 text-white border border-white/20 shadow-sm"
                : "text-cn-gray-400 hover:text-white"
            }`}
          >
            <Users size={16} />
            Tous les participants
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("GAVE_LIFE")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "GAVE_LIFE"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                : "text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30"
            }`}
          >
            <Flame size={16} />
            Âmes pour Christ
            {activeTab !== "GAVE_LIFE" && gaveLifeCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-400 text-black px-1.5 py-0.2 text-[10px] font-black">
                {gaveLifeCount}
              </span>
            )}
          </button>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, téléphone, ville..."
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
            title="Rafraîchir la liste"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Tableau des participants */}
        <div className="rounded-2xl border border-white/8 bg-cn-dark/95 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-cn-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Contact (Téléphone)</th>
                  <th className="py-3.5 px-4">Localisation</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Statut Spirituel</th>
                  <th className="py-3.5 px-4">Billet</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
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
                            Source : {p.source}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-white font-bold flex items-center gap-1.5">
                          <Phone size={13} className="text-emerald-400" />
                          {p.phone}
                        </span>
                        {p.email ? (
                          <span className="text-cn-gray-400 text-[11px] block mt-0.5">
                            {p.email}
                          </span>
                        ) : (
                          <span className="text-cn-gray-500 text-[10px] italic block mt-0.5">
                            Sans email
                          </span>
                        )}
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
                        {p.gaveLifeToJesus ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                            <Flame size={12} className="text-amber-400" />
                            A donné sa vie à Jésus
                          </span>
                        ) : (
                          <span className="text-cn-gray-500 text-[11px]">
                            Inscrit standard
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.tickets && p.tickets.length > 0 ? (
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[11px] border ${
                              p.tickets[0].status === "USED"
                                ? "border-emerald-500 text-emerald-400 bg-emerald-950/40 font-bold"
                                : "border-white/10 text-cn-gray-300"
                            }`}
                          >
                            {p.tickets[0].ticketNumber}
                          </span>
                        ) : (
                          <span className="text-cn-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.tickets?.[0] && (
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
                      {loading
                        ? "Chargement de la liste..."
                        : activeTab === "GAVE_LIFE"
                        ? "Aucune décision pour Christ enregistrée pour le moment. Activez le scanner en mode 'Âmes pour Christ' pour les scanner le jour J."
                        : "Aucun participant ne correspond aux critères."}
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
