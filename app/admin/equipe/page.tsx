"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  QrCode,
  UserCheck,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  username: string;
  name: string;
  email?: string | null;
  role: "ADMIN" | "STAFF";
  created_at: string;
}

export default function AdminEquipePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // États du formulaire de création
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STAFF" | "ADMIN">("STAFF");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Copie d'identifiants
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Chargement et vérification session
  const checkSessionAndFetch = async () => {
    try {
      const meRes = await fetch("/api/admin/me");
      if (!meRes.ok) {
        router.push("/admin/login");
        return;
      }

      const meData = await meRes.json();
      if (meData.user?.role !== "ADMIN") {
        router.push("/admin/scanner");
        return;
      }

      setCurrentUser(meData.user);

      // Charger les utilisateurs
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (e) {
      console.error("Erreur chargement équipe:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkSessionAndFetch();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    checkSessionAndFetch();
  };

  // Générateur de mot de passe automatique simple à taper sur mobile
  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let randomPart = "";
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const generated = `cn-${randomPart}`;
    setPassword(generated);
  };

  // 2. Création d'un compte
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          name: name.trim(),
          email: email.trim() || undefined,
          password: password.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible de créer le compte.");
      }

      setFormSuccess(`Le compte '${data.user.username}' a été créé avec succès !`);
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      setRole("STAFF");

      // Recharger la liste
      handleRefresh();
    } catch (err: any) {
      setFormError(err.message || "Erreur lors de la création.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Suppression d'un compte
  const handleDeleteUser = async (userToDelete: AdminUserItem) => {
    if (userToDelete.id === currentUser?.userId) {
      alert("Action impossible : vous ne pouvez pas supprimer votre propre compte Super Admin actif.");
      return;
    }

    const confirmed = window.confirm(
      `Êtes-vous certain de vouloir révoquer l'accès du compte '${userToDelete.username}' (${userToDelete.name}) ?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec de la suppression.");
      }

      setUsers(users.filter((u) => u.id !== userToDelete.id));
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression.");
    }
  };

  // 4. Copier les identifiants pour partage WhatsApp / SMS
  const handleCopyCredentials = (u: AdminUserItem) => {
    const text = `CELEBRATION NIGHT 2026 - Accès Scanner Terrain
Bonjour ${u.name},
Voici vos accès pour le scanner officiel :
- Rôle : ${u.role === "ADMIN" ? "Super Admin" : "Staff Contrôle / Scanner"}
- Identifiant : ${u.username}
- Portail : ${window.location.origin}/admin/login`;

    navigator.clipboard.writeText(text);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cn-black text-white flex flex-col items-center justify-center p-6">
        <div className="h-10 w-10 rounded-full border-4 border-cn-gold border-t-transparent animate-spin mb-4" />
        <p className="font-heading text-lg uppercase tracking-wider text-cn-gray-300">
          Chargement de l&apos;équipe...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cn-black text-white">
      <AdminNav user={currentUser} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cn-dark border border-cn-gold/40 px-3 py-1 text-xs font-semibold text-cn-gold-light mb-2">
              <Shield size={14} className="text-cn-gold" />
              <span>Administration &amp; Permissions</span>
            </div>
            <h1 className="font-heading text-3xl uppercase tracking-wider text-white">
              Gestion de l&apos;Équipe &amp; Scanners
            </h1>
            <p className="mt-1 text-sm text-cn-gray-400 font-body">
              Créez et gérez les comptes auxiliaires pour les bénévoles chargés du contrôle des entrées et du suivi des nouvelles âmes.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={refreshing}
            icon={<RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />}
          >
            Actualiser
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne Gauche : Formulaire de Création */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-cn-dark/95 p-6 backdrop-blur-md shadow-xl sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <UserPlus size={18} className="text-cn-gold" />
                <h2 className="font-heading text-lg uppercase tracking-wider text-white">
                  Ajouter un Membre
                </h2>
              </div>

              {formError && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/60 p-3 text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-4 rounded-xl border border-green-500/40 bg-green-950/60 p-3 text-xs text-green-200 flex items-center gap-2">
                  <Check size={16} className="shrink-0 text-green-400" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                    Nom du Bénévole ou Poste *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Porte Nord 1 (Marc)"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                    Identifiant Court (Connexion) *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    placeholder="ex: porte1 ou staff-marc"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-sm font-mono text-cn-gold-light placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold"
                  />
                  <span className="text-[10px] text-cn-gray-500 mt-1 block">
                    Lettres minuscules, chiffres, tirets uniquement.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300">
                      Mot de Passe *
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[11px] text-cn-gold hover:text-cn-gold-light flex items-center gap-1 transition-colors"
                    >
                      <Sparkles size={12} />
                      <span>Générer</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 caractères"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-sm font-mono text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                    Rôle &amp; Permissions
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "STAFF" | "ADMIN")}
                    className="w-full rounded-xl border border-white/15 bg-cn-dark px-3.5 py-2.5 text-sm text-white focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold"
                  >
                    <option value="STAFF">STAFF (Scanner uniquement : entrées &amp; âmes)</option>
                    <option value="ADMIN">ADMIN (Accès total au Dashboard et données)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                    Email de contact (Optionnel)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={submitting}
                    icon={<UserPlus size={16} />}
                    className="w-full justify-center"
                  >
                    {submitting ? "Création..." : "Créer le compte"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Colonne Droite : Liste des Comptes */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-cn-dark/95 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-cn-gold" />
                  <h2 className="font-heading text-lg uppercase tracking-wider text-white">
                    Comptes Actifs ({users.length})
                  </h2>
                </div>
                <span className="text-xs text-cn-gray-400">
                  {users.filter((u) => u.role === "STAFF").length} staff &bull; {users.filter((u) => u.role === "ADMIN").length} admin
                </span>
              </div>

              {users.length === 0 ? (
                <div className="p-12 text-center text-cn-gray-400">
                  <Users size={36} className="mx-auto mb-3 opacity-30 text-cn-gold" />
                  <p className="font-heading text-lg uppercase tracking-wider text-white">
                    Aucun compte auxiliaire
                  </p>
                  <p className="text-xs mt-1">
                    Utilisez le formulaire pour ajouter des bénévoles scanners pour la soirée.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {users.map((u) => {
                    const isSelf = u.id === currentUser?.userId;
                    const isStaff = u.role === "STAFF";

                    return (
                      <div
                        key={u.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border ${
                              isStaff
                                ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400"
                                : "bg-cn-gold/15 border-cn-gold/40 text-cn-gold"
                            }`}
                          >
                            {isStaff ? <QrCode size={18} /> : <Shield size={18} />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-white">
                                {u.name}
                              </span>
                              {isSelf && (
                                <span className="rounded-md bg-cn-gold/20 text-cn-gold-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-cn-gold/40">
                                  Votre session
                                </span>
                              )}
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                  isStaff
                                    ? "bg-cyan-950/60 text-cyan-300 border-cyan-500/30"
                                    : "bg-cn-dark text-cn-gold-light border-cn-gold/40"
                                }`}
                              >
                                {isStaff ? "Staff Scanner" : "Super Admin"}
                              </span>
                            </div>

                            <div className="mt-1 flex items-center gap-3 text-xs text-cn-gray-400 flex-wrap">
                              <span>
                                Identifiant :{" "}
                                <code className="text-white font-mono bg-white/[0.05] px-1.5 py-0.5 rounded">
                                  {u.username}
                                </code>
                              </span>
                              {u.email && <span>&bull; {u.email}</span>}
                              <span>
                                &bull; Créé le {new Date(u.created_at).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(u)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-cn-gray-300 hover:border-cn-gold/50 hover:text-cn-gold transition-colors"
                            title="Copier les identifiants pour WhatsApp / SMS"
                          >
                            {copiedId === u.id ? (
                              <>
                                <Check size={13} className="text-green-400" />
                                <span className="text-green-400 font-semibold">Copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Partager</span>
                              </>
                            )}
                          </button>

                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 hover:border-red-500/50 transition-colors"
                              title="Révoquer ce compte"
                            >
                              <Trash2 size={13} />
                              <span className="hidden sm:inline">Révoquer</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
