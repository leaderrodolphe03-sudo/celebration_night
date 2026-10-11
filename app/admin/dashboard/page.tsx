"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Ticket,
  CheckCircle2,
  Clock,
  QrCode,
  ArrowRight,
  TrendingUp,
  Shield,
  Download,
  RefreshCw,
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

interface DashboardData {
  stats: {
    totalParticipants: number;
    totalTickets: number;
    scannedTickets: number;
    pendingTickets: number;
    attendanceRate: number;
    standardTickets: number;
    vipTickets: number;
    recentParticipants: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      city: string;
      country: string;
      ticketType: string;
      ticketsCount: number;
      firstTicketNumber: string;
      createdAt: string;
    }>;
    recentScans: Array<{
      id: string;
      ticketNumber: string;
      ticketType: string;
      scannedAt: string;
      scannedBy: string;
      participantName: string;
    }>;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      // 1. Vérification session
      const meRes = await fetch("/api/admin/me");
      if (!meRes.ok) {
        router.push("/admin/login");
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);

      // 2. Récupération stats
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setData(statsData);
      }
    } catch (e) {
      console.error("Erreur chargement dashboard:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Rafraîchissement automatique toutes les 15 secondes pour le suivi temps réel
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-6">
        <div className="h-10 w-10 rounded-full border-4 border-[#F5B900] border-t-transparent animate-spin mb-4" />
        <p className="font-heading text-lg uppercase tracking-wider text-cn-gray-300">
          Chargement du tableau de bord...
        </p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDE8DC]">
      <AdminNav user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* En-tête du Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FCD34D]">
              Supervision en direct
            </span>
            <h1 className="mt-1 font-heading text-3xl sm:text-4xl uppercase tracking-wider text-[#EDE8DC]">
              Tableau de Bord Événement
            </h1>
            <p className="text-xs text-[#BFB89E] mt-0.5">
              Connecté en tant que <strong className="text-[#EDE8DC]">{user?.name || user?.email}</strong> ({user?.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-[#EDE8DC] hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span>Actualiser</span>
            </button>

            <Link
              href="/admin/scanner"
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-5 py-2 text-xs font-black uppercase tracking-wider text-[#080808] shadow-lg transition-transform hover:scale-105"
            >
              <QrCode size={16} />
              <span>Ouvrir Scanner</span>
            </Link>
          </div>
        </div>

        {/* CARTES D'INDICATEURS CLÉS (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Participants */}
          <div className="rounded-2xl border border-[#F59E0B]/20 bg-[#120E0A]/90 p-5 shadow-xl">
            <div className="flex items-center justify-between text-[#BFB89E]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Participants</span>
              <div className="h-8 w-8 rounded-lg bg-[#1F1710] border border-[#F59E0B]/30 flex items-center justify-center text-[#FCD34D]">
                <Users size={16} />
              </div>
            </div>
            <p className="mt-3 font-heading text-4xl text-[#EDE8DC] tracking-wide">
              {stats?.totalParticipants || 0}
            </p>
            <p className="mt-1 text-[11px] text-[#BFB89E]/70">Inscrits uniques</p>
          </div>

          {/* Billets Générés */}
          <div className="rounded-2xl border border-[#F59E0B]/20 bg-[#120E0A]/90 p-5 shadow-xl">
            <div className="flex items-center justify-between text-[#BFB89E]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Billets Émis</span>
              <div className="h-8 w-8 rounded-lg bg-[#1F1710] border border-[#F59E0B]/30 flex items-center justify-center text-[#FCD34D]">
                <Ticket size={16} />
              </div>
            </div>
            <p className="mt-3 font-heading text-4xl text-[#EDE8DC] tracking-wide">
              {stats?.totalTickets || 0}
            </p>
            <p className="mt-1 text-[11px] text-[#FCD34D]">
              {stats?.standardTickets || 0} Standard • {stats?.vipTickets || 0} VIP
            </p>
          </div>

          {/* Billets Scannés (Présents) */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-5 shadow-xl">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Présents</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <p className="mt-3 font-heading text-4xl text-emerald-400 tracking-wide">
              {stats?.scannedTickets || 0}
            </p>
            <p className="mt-1 text-[11px] text-emerald-200/70">Billets scannés validés</p>
          </div>

          {/* Absents / En Attente */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-xl">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Absents</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Clock size={16} />
              </div>
            </div>
            <p className="mt-3 font-heading text-4xl text-amber-400 tracking-wide">
              {stats?.pendingTickets || 0}
            </p>
            <p className="mt-1 text-[11px] text-amber-200/70">En attente d&apos;entrée</p>
          </div>

          {/* Taux de présence */}
          <div className="rounded-2xl border border-[#F59E0B]/20 bg-[#18120B]/90 p-5 shadow-xl">
            <div className="flex items-center justify-between text-[#FCD34D]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Affluence</span>
              <div className="h-8 w-8 rounded-lg bg-[#1F1710] border border-[#F59E0B]/30 flex items-center justify-center text-[#FCD34D]">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="mt-3 font-heading text-4xl text-[#EDE8DC] tracking-wide">
              {stats?.attendanceRate || 0}%
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#EA580C] to-[#FCD34D] transition-all duration-500"
                style={{ width: `${Math.min(100, stats?.attendanceRate || 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* SECTIONS BASSES : DERNIÈRES INSCRIPTIONS & DERNIERS SCANS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dernières Inscriptions (7 colonnes) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#120E0A]/80 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h2 className="font-heading text-xl uppercase tracking-wide text-[#EDE8DC]">
                Dernières Inscriptions
              </h2>
              <Link
                href="/admin/participants"
                className="text-xs font-semibold text-[#FCD34D] hover:underline uppercase tracking-wider"
              >
                Voir tout →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#BFB89E]/60 font-bold uppercase">
                    <th className="pb-3">Participant</th>
                    <th className="pb-3">Ville / Pays</th>
                    <th className="pb-3">Catégorie</th>
                    <th className="pb-3">Billets</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats?.recentParticipants?.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-[#EDE8DC]">
                        {p.firstName} {p.lastName}
                        <span className="block text-[11px] font-normal text-[#BFB89E]/70 font-mono">
                          {p.email}
                        </span>
                      </td>
                      <td className="py-3 text-[#BFB89E]">
                        {p.city}, {p.country}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            p.ticketType === "VIP"
                              ? "bg-[#F59E0B] text-[#080808] font-black"
                              : "bg-[#1F1710] text-[#FCD34D] border border-[#F59E0B]/30"
                          }`}
                        >
                          {p.ticketType}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-semibold text-[#EDE8DC]">
                        {p.ticketsCount} {p.ticketsCount > 1 ? "places" : "place"}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/billet/${encodeURIComponent(p.firstTicketNumber)}`}
                          target="_blank"
                          className="rounded bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#EDE8DC] hover:bg-[#F59E0B] hover:text-[#080808] transition-colors"
                        >
                          Billet
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Derniers Scans En Direct (5 colonnes) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#120E0A]/80 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h2 className="font-heading text-xl uppercase tracking-wide text-[#EDE8DC] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Scans En Direct
              </h2>
              <Link
                href="/admin/scanner"
                className="text-xs font-semibold text-[#FCD34D] hover:underline uppercase tracking-wider"
              >
                Scanner →
              </Link>
            </div>

            {stats?.recentScans && stats.recentScans.length > 0 ? (
              <div className="space-y-3">
                {stats.recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {scan.participantName}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400">
                        {scan.ticketNumber} ({scan.ticketType})
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-cn-gray-400">
                      <span className="block text-emerald-300 font-semibold">
                        {new Date(scan.scannedAt).toLocaleTimeString("fr-FR")}
                      </span>
                      <span className="text-[10px] text-cn-gray-500 truncate max-w-[120px] block">
                        {scan.scannedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-cn-gray-500">
                <QrCode size={32} className="mx-auto text-cn-gray-600 mb-2" />
                Aucun scan enregistré pour le moment.
                <br />
                Ouvrez le scanner lors de l&apos;ouverture des portes.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
