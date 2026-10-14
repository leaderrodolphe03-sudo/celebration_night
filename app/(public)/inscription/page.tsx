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
  Check,
  Camera,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import BadgeGenerator from "@/components/ticket/BadgeGenerator";
import Button from "@/components/ui/Button";

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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F6F1EA] to-[#FAF7F2] text-cn-black pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance cinématique chaleureux */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-200/40 blur-[130px]"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Titre & En-tête */}
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cn-amber block">
            Billeterie Officielle Gratuite &amp; Pass Carré
          </span>
          <h1 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-cn-black">
            Réserver Ma Place
          </h1>
          <p className="mt-3 font-body text-sm sm:text-base text-[#5A4D41] max-w-xl mx-auto">
            {EVENT.name} • {EVENT.dateLabel} à {EVENT.timeLabel}.
            Inscrivez-vous gratuitement et personnalisez dès maintenant votre badge officiel carré « J&apos;y serai ».
          </p>
        </div>

        {/* Message d'erreur serveur si applicable */}
        {serverError && (
          <div className="mb-8 rounded-xl border border-red-300 bg-red-50 p-4 text-xs text-red-800 flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        {/* SECTION 1 : GÉNÉRATEUR DE BADGE 'J'Y SERAI' */}
        <div className="mb-12 rounded-3xl border border-[#E5DACF] bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(28,22,19,0.06)]">
          <div className="border-b border-[#E5DACF] pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              
              <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-wide text-cn-black">
                Génère ton badge &laquo; J&apos;y serai ! &raquo;
              </h2>
              <p className="mt-1 font-body text-xs sm:text-sm text-[#5A4D41]">
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
          <div className="rounded-2xl border border-[#E5DACF] bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(28,22,19,0.05)]">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-cn-black mb-4 flex items-center gap-2">
              <Ticket size={22} className="text-cn-amber" />
              1. Choisissez votre catégorie de billet
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carte Standard */}
              <div
                onClick={() => setValue("ticketType", "STANDARD")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "STANDARD"
                    ? "border-2 border-cn-gold bg-amber-50/60 shadow-[0_4px_25px_rgba(245,158,11,0.15)]"
                    : "border border-[#E5DACF] bg-[#FAF7F2] hover:border-cn-gold/40 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cn-black">
                    Pass Standard
                  </span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    100% Gratuit
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-cn-black">
                  Accès Général
                </h3>
                <p className="mt-2 text-xs text-[#5A4D41] leading-relaxed font-body">
                  Accès complet à la grande CELEBRATION, toutes les sessions d&apos;adoration et la
                  ferveur en direct.
                </p>
                {selectedTicketType === "STANDARD" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cn-amber">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>

              {/* Carte VIP */}
              <div
                onClick={() => setValue("ticketType", "VIP")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "VIP"
                    ? "border-2 border-cn-gold bg-amber-50/60 shadow-[0_4px_25px_rgba(245,158,11,0.15)]"
                    : "border border-[#E5DACF] bg-[#FAF7F2] hover:border-cn-gold/40 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cn-amber">
                    Pass Partenaire VIP
                  </span>
                  <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    Gratuit / Réservé
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-cn-black">
                  Accès Privilège
                </h3>
                <p className="mt-2 text-xs text-[#5A4D41] leading-relaxed font-body">
                  Tribune avant réservée, coupe-file dédié à l&apos;entrée et accès aux temps d&apos;échange avec l&apos;équipe HAGIAZO.
                </p>
                {selectedTicketType === "VIP" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cn-amber">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>
            </div>

            {/* Nombre de participants */}
            <div className="mt-6 pt-6 border-t border-[#E5DACF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E34]">
                  Nombre de places souhaitées
                </label>
                <p className="text-[11px] text-[#7A6D60]">
                  Un billet avec QR Code individuel sera attribué à chaque personne.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  {...register("numberOfGuests", { valueAsNumber: true })}
                  className="rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-2.5 text-sm font-bold text-cn-black focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold"
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
          <div className="rounded-2xl border border-[#E5DACF] bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(28,22,19,0.05)]">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-cn-black mb-6 flex items-center gap-2">
              <Users size={22} className="text-cn-amber" />
              2. Informations du titulaire du billet
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Prénom *
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="Ex: Emmanuel"
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black placeholder-[#9E9081] focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Ex: Kouassi"
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black placeholder-[#9E9081] focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Adresse Email * (pour recevoir le billet officiel)
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Ex: emmanuel@example.com"
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black placeholder-[#9E9081] focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="Ex: +225 07 12 34 56 78"
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black placeholder-[#9E9081] focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Pays de résidence *
                </label>
                <select
                  {...register("country")}
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Ville *
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Ex: Abidjan, Paris, Libreville..."
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black placeholder-[#9E9081] focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.city.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Comment avez-vous connu CELEBRATION NIGHT ?
                </label>
                <select
                  {...register("source")}
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
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
          <div className="rounded-3xl border border-cn-gold/40 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(28,22,19,0.08)]">
            <div>
              <p className="text-xs uppercase tracking-wider text-cn-amber font-bold">
                Récapitulatif de l&apos;Inscription
              </p>
              <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-cn-black mt-1">
                {numberOfGuests} {numberOfGuests > 1 ? "Billets" : "Billet"} {selectedTicketType}
              </h3>
              <p className="text-xs text-[#5A4D41] mt-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Billet carré numérique officiel avec QR Code unique
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full sm:w-auto min-w-[260px] justify-center"
            >
              {submitting ? "Génération des billets officiels..." : "Confirmer Mon Inscription"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
