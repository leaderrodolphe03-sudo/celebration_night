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
    <div className="min-h-screen bg-cn-black text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance cinématique */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-cn-gold/15 via-cn-amber/10 to-cn-gold-light/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Titre & En-tête */}
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cn-gold-light block">
            Billeterie Officielle Gratuite &amp; Pass Carré
          </span>
          <h1 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-white">
            Réserver Ma Place
          </h1>
          <p className="mt-3 font-body text-sm sm:text-base text-cn-gray-300 max-w-xl mx-auto">
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
        <div className="mb-12 rounded-3xl border border-cn-gold/30 bg-gradient-to-b from-cn-dark via-cn-black to-cn-deep p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cn-dark border border-cn-gold/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cn-gold-light mb-2">
                <Camera size={13} className="text-cn-gold" />
                <span>Format Carré Réseaux Sociaux</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl uppercase tracking-wide text-white">
                Génère ton badge &laquo; J&apos;y serai ! &raquo;
              </h2>
              <p className="mt-1 font-body text-xs sm:text-sm text-cn-gray-300">
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
          <div className="rounded-2xl border border-white/10 bg-cn-dark/80 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-white mb-4 flex items-center gap-2">
              <Ticket size={22} className="text-cn-gold" />
              1. Choisissez votre catégorie de billet
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Carte Standard */}
              <div
                onClick={() => setValue("ticketType", "STANDARD")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "STANDARD"
                    ? "border-cn-gold bg-gradient-to-br from-cn-dark to-cn-black shadow-[0_4px_25px_rgba(245,158,11,0.2)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Pass Standard
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    100% Gratuit
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-white">
                  Accès Général
                </h3>
                <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed font-body">
                  Accès complet à la grande célébration, toutes les sessions d&apos;adoration et la
                  ferveur en direct.
                </p>
                {selectedTicketType === "STANDARD" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cn-gold-light">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>

              {/* Carte VIP */}
              <div
                onClick={() => setValue("ticketType", "VIP")}
                className={`cursor-pointer rounded-xl border p-5 transition-all relative ${
                  selectedTicketType === "VIP"
                    ? "border-cn-gold bg-gradient-to-br from-cn-dark to-cn-black shadow-[0_4px_25px_rgba(245,158,11,0.2)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cn-gold-light">
                    Pass Partenaire VIP
                  </span>
                  <span className="rounded-full bg-cn-gold/20 text-cn-gold-light border border-cn-gold/40 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    Gratuit / Réservé
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-2xl uppercase tracking-wide text-white">
                  Accès Privilège
                </h3>
                <p className="mt-2 text-xs text-cn-gray-300 leading-relaxed font-body">
                  Tribune avant réservée, coupe-file dédié à l&apos;entrée et accès aux temps d&apos;échange avec l&apos;équipe HAGIAZO.
                </p>
                {selectedTicketType === "VIP" && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cn-gold-light">
                    <Check size={16} /> Billet sélectionné
                  </div>
                )}
              </div>
            </div>

            {/* Nombre de participants */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cn-gray-300">
                  Nombre de places souhaitées
                </label>
                <p className="text-[11px] text-cn-gray-400">
                  Un billet avec QR Code individuel sera attribué à chaque personne.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  {...register("numberOfGuests", { valueAsNumber: true })}
                  className="rounded-lg border border-cn-gold/30 bg-cn-black px-4 py-2.5 text-sm font-bold text-white focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold"
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
          <div className="rounded-2xl border border-white/10 bg-cn-dark/80 p-6 sm:p-8 backdrop-blur-md">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-white mb-6 flex items-center gap-2">
              <Users size={22} className="text-cn-gold" />
              2. Informations du titulaire du billet
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
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
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
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-cn-gray-300 mb-1.5">
                  Adresse Email * (pour recevoir le billet officiel)
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Ex: emmanuel@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
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
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
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
                  className="w-full rounded-lg border border-white/10 bg-cn-black px-4 py-3 text-sm text-white focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
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
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
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
                  className="w-full rounded-lg border border-white/10 bg-cn-black px-4 py-3 text-sm text-white focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
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
          <div className="rounded-3xl border border-cn-gold/40 bg-gradient-to-r from-cn-dark via-cn-black to-cn-deep p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <p className="text-xs uppercase tracking-wider text-cn-gold-light font-bold">
                Récapitulatif de l&apos;Inscription
              </p>
              <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-wide text-white mt-1">
                {numberOfGuests} {numberOfGuests > 1 ? "Billets" : "Billet"} {selectedTicketType}
              </h3>
              <p className="text-xs text-cn-gray-300 mt-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Billet carré numérique officiel avec QR Code unique
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              icon={<ArrowRight size={16} />}
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
