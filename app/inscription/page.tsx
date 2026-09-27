"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ticket, Users, ShieldCheck, Sparkles, AlertCircle, ArrowRight, Check } from "lucide-react";
import { EVENT } from "@/lib/event-config";

const FormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide").toLowerCase(),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().min(2, "La ville est requise"),
  numberOfGuests: z.coerce.number().int().min(1, "Au moins 1 place").max(10, "Maximum 10 places"),
  ticketType: z.enum(["STANDARD", "VIP"]),
  source: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const COUNTRIES = [
  "Côte d'Ivoire",
  "France",
  "Gabon",
  "Cameroun",
  "Sénégal",
  "Bénin",
  "Togo",
  "RDC (Congo)",
  "Congo-Brazzaville",
  "Burkina Faso",
  "Mali",
  "Canada",
  "Belgique",
  "Suisse",
  "États-Unis",
  "Autre pays",
];

const SOURCES = [
  "Réseaux sociaux (Instagram, TikTok, Facebook)",
  "Église locale / Pasteur",
  "Bouche-à-oreille (Famille / Amis)",
  "Affiche / Dépliant dans la ville",
  "YouTube / Chaîne HAGIAZO",
  "Autre canal",
];

export default function InscriptionPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "Côte d'Ivoire",
      city: "Abidjan",
      numberOfGuests: 1,
      ticketType: "STANDARD",
      source: "Réseaux sociaux (Instagram, TikTok, Facebook)",
    },
  });

  const selectedTicketType = watch("ticketType");
  const numberOfGuests = watch("numberOfGuests") || 1;

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      const primaryNumber = data.primaryTicket.ticketNumber;
      router.push(`/confirmation?ticketNumber=${encodeURIComponent(primaryNumber)}&count=${values.numberOfGuests}`);
    } catch (err: any) {
      setServerError(err.message || "Erreur de connexion avec le serveur.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#17165A] text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Halo d'ambiance */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#38217F]/60 blur-[130px]"
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Titre & En-tête */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5B900]">
            Billeterie Officielle Gratuite
          </span>
          <h1 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-white">
            Réserver Ma Place
          </h1>
          <p className="mt-3 font-body text-sm sm:text-base text-cn-gray-300 max-w-xl mx-auto">
            {EVENT.name} • {EVENT.dateLabel} à {EVENT.timeLabel}.
            Chaque inscription génère automatiquement un billet officiel avec QR Code unique.
          </p>
        </div>

        {/* Message d'erreur serveur */}
        {serverError && (
          <div className="mb-8 rounded-xl border border-red-500/50 bg-red-950/80 p-4 text-xs text-red-200 flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-400" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Étape 1 : Choix du type de billet */}
          <div className="rounded-2xl border border-white/10 bg-[#111111]/70 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-white mb-4 flex items-center gap-2">
              <Ticket size={22} className="text-[#F5B900]" />
              1. Choisissez votre catégorie de billet
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carte Standard */}
              <div
                onClick={() => setValue("ticketType", "STANDARD")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "STANDARD"
                    ? "border-[#F5B900] bg-gradient-to-br from-[#38217F] to-[#17165A] shadow-[0_4px_20px_rgba(245,185,0,0.25)]"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Pass Standard
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    Gratuit
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-white">
                  Accès Général
                </h3>
                <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed font-body">
                  Accès complet à la grande salle de célébration, toutes les sessions musicales et la
                  ferveur en direct.
                </p>
                {selectedTicketType === "STANDARD" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#F5B900]">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>

              {/* Carte VIP */}
              <div
                onClick={() => setValue("ticketType", "VIP")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "VIP"
                    ? "border-[#F5B900] bg-gradient-to-br from-[#38217F] to-[#17165A] shadow-[0_4px_20px_rgba(245,185,0,0.25)]"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
                    Pass Partenaire VIP
                  </span>
                  <span className="rounded-full bg-[#F5B900]/20 text-[#FFD84A] border border-[#F5B900]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    Gratuit / Réservé
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-white">
                  Accès Privilège
                </h3>
                <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed font-body">
                  Tribune avant réservée, coupe-file dédié à l&apos;entrée et accès à la session
                  d&apos;échange avec l&apos;équipe HAGIAZO.
                </p>
                {selectedTicketType === "VIP" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#F5B900]">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>
            </div>

            {/* Nombre de participants */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cn-gray-300">
                  Nombre de billets souhaités
                </label>
                <p className="text-[11px] text-cn-gray-500">
                  Un billet avec QR code distinct sera édité pour chaque personne.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  {...register("numberOfGuests", { valueAsNumber: true })}
                  className="rounded-md border border-white/20 bg-[#17165A] px-4 py-2.5 text-sm font-bold text-white focus:border-[#F5B900] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num > 1 ? "places" : "place"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Étape 2 : Coordonnées du participant */}
          <div className="rounded-2xl border border-white/10 bg-[#111111]/70 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-white mb-6 flex items-center gap-2">
              <Users size={22} className="text-[#F5B900]" />
              2. Informations du responsable de la réservation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Prénom *
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="Ex: Emmanuel"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-[#F5B900] focus:outline-none"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Ex: Kouassi"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-[#F5B900] focus:outline-none"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Adresse Email * (pour l&apos;envoi du billet)
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Ex: emmanuel@example.com"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-[#F5B900] focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="Ex: +225 07 12 34 56 78"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-[#F5B900] focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Pays de résidence *
                </label>
                <select
                  {...register("country")}
                  className="w-full rounded-md border border-white/15 bg-[#17165A] px-4 py-3 text-sm text-white focus:border-[#F5B900] focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-400">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Ville *
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Ex: Abidjan, Paris, Libreville..."
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-[#F5B900] focus:outline-none"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Comment avez-vous connu CÉLÉBRATION NIGHT ?
                </label>
                <select
                  {...register("source")}
                  className="w-full rounded-md border border-white/15 bg-[#17165A] px-4 py-3 text-sm text-white focus:border-[#F5B900] focus:outline-none"
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Récapitulatif et bouton de validation */}
          <div className="rounded-2xl border border-[#F5B900]/40 bg-gradient-to-r from-[#38217F]/80 to-[#17165A] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#FFD84A] font-bold">
                Récapitulatif de la commande
              </p>
              <h3 className="font-heading text-2xl uppercase tracking-wide text-white mt-1">
                {numberOfGuests} {numberOfGuests > 1 ? "Billets" : "Billet"} {selectedTicketType}
              </h3>
              <p className="text-xs text-cn-gray-300 mt-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Billet numérique sécurisé avec QR Code unique
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-2 rounded-md bg-[#F5B900] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#111111] hover:bg-[#FFD84A] shadow-2xl transition-all hover:scale-105 disabled:opacity-50"
            >
              {submitting ? (
                <span>Génération des billets...</span>
              ) : (
                <>
                  <span>Confirmer & Obtenir mon Billet</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
