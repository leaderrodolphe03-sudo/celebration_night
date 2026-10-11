"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Ticket,
  Users,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Check,
  Camera,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import BadgeGenerator from "@/components/ticket/BadgeGenerator";

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
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

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

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const fullName = `${firstName} ${lastName}`.trim();
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
      // Redirection vers confirmation avec les paramètres
      router.push(
        `/confirmation?ticketNumber=${encodeURIComponent(primaryNumber)}&name=${encodeURIComponent(
          fullName || "Participant"
        )}&count=${values.numberOfGuests}`
      );
    } catch (err: any) {
      setServerError(err.message || "Erreur de connexion avec le serveur.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDE8DC] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance cinématique */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#F59E0B]/20 via-[#EA580C]/15 to-[#FCD34D]/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Titre & En-tête */}
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FCD34D] block">
            Billeterie Officielle Gratuite & Pass Carré
          </span>
          <h1 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-[#EDE8DC]">
            Réserver Ma Place
          </h1>
          <p className="mt-3 font-body text-sm sm:text-base text-[#BFB89E] max-w-xl mx-auto">
            {EVENT.name} • {EVENT.dateLabel} à {EVENT.timeLabel}.
            Inscrivez-vous gratuitement et personnalisez dès maintenant votre badge officiel carré « J&apos;y serai ».
          </p>
        </div>

        {/* Message d'erreur serveur si applicable */}
        {serverError && (
          <div className="mb-8 rounded-xl border border-red-500/50 bg-red-950/80 p-4 text-xs text-red-200 flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-400" />
            <span>{serverError}</span>
          </div>
        )}

        {/* SECTION 1 : GÉNÉRATEUR DE BADGE 'J'Y SERAI' */}
        <div className="mb-12 rounded-3xl border-2 border-[#F59E0B]/30 bg-gradient-to-b from-[#18120B] via-[#120E0A] to-[#0A0806] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="border-b border-white/10 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1F1710] border border-[#F59E0B]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FCD34D] mb-2">
                <Camera size={13} className="text-[#F59E0B]" />
                <span>Format Carré Réseaux Sociaux</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-wide text-[#EDE8DC]">
                Génère ton badge &laquo; J&apos;y serai ! &raquo;
              </h2>
              <p className="mt-1 font-body text-xs sm:text-sm text-[#BFB89E]">
                Téléverse ta photo pour créer ton pass personnalisé carré à partager sur tes statuts WhatsApp et Instagram.
              </p>
            </div>
          </div>

          <BadgeGenerator
            fullName={fullName || "Votre Nom et Prénom"}
            ticketNumber="CN-2026-PASS"
            qrToken="https://celebrationnight.org/reservation"
            onPhotoUploaded={(url) => setUploadedPhotoUrl(url)}
            showDownloadButton={true}
          />
        </div>

        {/* SECTION 2 : FORMULAIRE D'INSCRIPTION OFFICIEL */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Choix de catégorie */}
          <div className="rounded-2xl border border-white/10 bg-[#120E0A]/90 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-[#EDE8DC] mb-4 flex items-center gap-2">
              <Ticket size={22} className="text-[#F59E0B]" />
              1. Choisissez votre catégorie de billet
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carte Standard */}
              <div
                onClick={() => setValue("ticketType", "STANDARD")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "STANDARD"
                    ? "border-[#F59E0B] bg-gradient-to-br from-[#1F1710] to-[#120E0A] shadow-[0_4px_25px_rgba(245,158,11,0.2)]"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EDE8DC]">
                    Pass Standard
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    100% Gratuit
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-[#EDE8DC]">
                  Accès Général
                </h3>
                <p className="mt-2 text-xs text-[#BFB89E] leading-relaxed font-body">
                  Accès complet à la grande célébration, toutes les sessions d&apos;adoration et la
                  ferveur en direct.
                </p>
                {selectedTicketType === "STANDARD" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#FCD34D]">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>

              {/* Carte VIP */}
              <div
                onClick={() => setValue("ticketType", "VIP")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "VIP"
                    ? "border-[#F59E0B] bg-gradient-to-br from-[#1F1710] to-[#120E0A] shadow-[0_4px_25px_rgba(245,158,11,0.2)]"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FCD34D]">
                    Pass Partenaire VIP
                  </span>
                  <span className="rounded-full bg-[#F59E0B]/20 text-[#FCD34D] border border-[#F59E0B]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    Gratuit / Réservé
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-[#EDE8DC]">
                  Accès Privilège
                </h3>
                <p className="mt-2 text-xs text-[#BFB89E] leading-relaxed font-body">
                  Tribune avant réservée, coupe-file dédié à l&apos;entrée et accès aux temps d&apos;échange avec l&apos;équipe HAGIAZO.
                </p>
                {selectedTicketType === "VIP" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#FCD34D]">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>
            </div>

            {/* Nombre de participants */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#BFB89E]">
                  Nombre de places souhaitées
                </label>
                <p className="text-[11px] text-[#BFB89E]/70">
                  Un billet avec QR Code individuel sera attribué à chaque personne.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  {...register("numberOfGuests", { valueAsNumber: true })}
                  className="rounded-md border border-[#F59E0B]/30 bg-[#0A0806] px-4 py-2.5 text-sm font-bold text-[#EDE8DC] focus:border-[#F59E0B] focus:outline-none"
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

          {/* Coordonnées du participant */}
          <div className="rounded-2xl border border-white/10 bg-[#120E0A]/90 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-[#EDE8DC] mb-6 flex items-center gap-2">
              <Users size={22} className="text-[#F59E0B]" />
              2. Informations du titulaire du billet
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                  Prénom *
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="Ex: Emmanuel"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#EDE8DC] placeholder-[#BFB89E]/50 focus:border-[#F59E0B] focus:outline-none"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Ex: Kouassi"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#EDE8DC] placeholder-[#BFB89E]/50 focus:border-[#F59E0B] focus:outline-none"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                  Adresse Email * (pour recevoir le billet officiel)
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Ex: emmanuel@example.com"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#EDE8DC] placeholder-[#BFB89E]/50 focus:border-[#F59E0B] focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="Ex: +225 07 12 34 56 78"
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#EDE8DC] placeholder-[#BFB89E]/50 focus:border-[#F59E0B] focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                  Pays de résidence *
                </label>
                <select
                  {...register("country")}
                  className="w-full rounded-md border border-white/15 bg-[#0A0806] px-4 py-3 text-sm text-[#EDE8DC] focus:border-[#F59E0B] focus:outline-none"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                  Ville *
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Ex: Abidjan, Paris, Libreville..."
                  className="w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#EDE8DC] placeholder-[#BFB89E]/50 focus:border-[#F59E0B] focus:outline-none"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#BFB89E] mb-1.5">
                  Comment avez-vous connu CÉLÉBRATION NIGHT ?
                </label>
                <select
                  {...register("source")}
                  className="w-full rounded-md border border-white/15 bg-[#0A0806] px-4 py-3 text-sm text-[#EDE8DC] focus:border-[#F59E0B] focus:outline-none"
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

          {/* Validation & Enregistrement */}
          <div className="rounded-3xl border border-[#F59E0B]/40 bg-gradient-to-r from-[#18120B] via-[#120E0A] to-[#0A0806] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#FCD34D] font-bold">
                Récapitulatif de l&apos;Inscription
              </p>
              <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-[#EDE8DC] mt-1">
                {numberOfGuests} {numberOfGuests > 1 ? "Billets" : "Billet"} {selectedTicketType}
              </h3>
              <p className="text-xs text-[#BFB89E] mt-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Billet carré numérique officiel avec QR Code unique
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-w-[260px] flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FCD34D] px-8 py-4 font-body text-xs font-extrabold uppercase tracking-widest text-[#080808] shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-all hover:scale-105 disabled:opacity-50"
            >
              {submitting ? (
                <span>Génération des billets officiels...</span>
              ) : (
                <>
                  <span>Confirmer Mon Inscription</span>
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
