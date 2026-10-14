"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  ArrowRight,
} from "lucide-react";
import { EVENT } from "@/lib/event-config";
import Button from "@/components/ui/Button";

const FormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phone: z.string().min(6, "Numéro de téléphone requis pour valider votre entrée"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  country: z.string().min(2, "Le pays est requis"),
  city: z.string().optional(),
  ticketType: z.enum(["STANDARD", "VIP"]),
  source: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const COUNTRIES = [
  "Bénin",
  "Togo",
  "Côte d'Ivoire",
  "Nigeria",
  "Ghana",
  "Gabon",
  "Cameroun",
  "Sénégal",
  "Burkina Faso",
  "Mali",
  "Niger",
  "RDC (Congo)",
  "Congo-Brazzaville",
  "France",
  "Belgique",
  "Canada",
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
  const [existingTicketNumber, setExistingTicketNumber] = useState<string | null>(null);
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
      phone: "",
      email: "",
      country: "Bénin",
      city: "",
      ticketType: "STANDARD",
      source: "Réseaux sociaux (Instagram, TikTok, Facebook)",
    },
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const fullName = `${firstName} ${lastName}`.trim();
  const selectedTicketType = watch("ticketType");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError(null);
    setExistingTicketNumber(null);

    try {
      const payload = {
        ...values,
        city: values.city?.trim() || "Cotonou",
      };

      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Cas où le numéro est déjà enregistré
      if (res.status === 409 && data.isExisting) {
        setExistingTicketNumber(data.primaryTicket?.ticketNumber || null);
        setServerError(
          "Ce numéro de téléphone est déjà enregistré pour CELEBRATION NIGHT. Chaque personne dispose d'un pass individuel unique."
        );
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      const primaryNumber = data.primaryTicket.ticketNumber;

      // Redirection immédiate vers la page de confirmation et création du badge
      router.push(
        `/confirmation?ticketNumber=${encodeURIComponent(primaryNumber)}&name=${encodeURIComponent(
          fullName || "Participant"
        )}`
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

      <div className="relative mx-auto max-w-3xl">
        {/* Titre & En-tête */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cn-amber block">
            Billeterie Officielle Gratuite &bull; Inscription Individuelle
          </span>
          <h1 className="mt-3 font-heading text-4xl sm:text-6xl uppercase tracking-wider text-cn-black">
            Réserver Ma Place
          </h1>
          <p className="mt-3 font-body text-sm sm:text-base text-[#5A4D41] max-w-xl mx-auto">
            {EVENT.name} &bull; {EVENT.dateLabel} à {EVENT.timeLabel}.<br />
            Remplissez ce formulaire pour valider votre entrée gratuite. Dès confirmation, vous pourrez ajouter votre photo et générer votre badge officiel carré &laquo; J&apos;y serai &raquo;.
          </p>
        </div>

        {/* Message d'erreur serveur si applicable */}
        {serverError && (
          <div className="mb-8 rounded-2xl border border-red-300 bg-red-50 p-5 text-sm text-red-900 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{serverError}</p>
                {existingTicketNumber && (
                  <div className="mt-3">
                    <Link
                      href={`/confirmation?ticketNumber=${encodeURIComponent(existingTicketNumber)}&name=${encodeURIComponent(fullName || "Participant")}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Voir mon badge &amp; billet existant ({existingTicketNumber})
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FORMULAIRE D'INSCRIPTION OFFICIEL */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ÉTAPE 1 : Choix de catégorie */}
          <div className="rounded-2xl border border-[#E5DACF] bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(28,22,19,0.05)]">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-cn-black mb-4 flex items-center gap-2">
              <Ticket size={22} className="text-cn-amber" />
              1. Choisissez votre catégorie d&apos;accès
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
                  Accès complet à la grande CELEBRATION, toutes les sessions d&apos;adoration et la ferveur en direct.
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

            <div className="mt-5 pt-4 border-t border-[#E5DACF] flex items-center gap-2 text-xs text-[#5A4D41]">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>
                <strong>1 place individuelle par inscription</strong> : chaque participant doit être inscrit avec son propre numéro de téléphone afin de recevoir son QR Code unique infalsifiable.
              </span>
            </div>
          </div>

          {/* ÉTAPE 2 : Coordonnées du participant */}
          <div className="rounded-2xl border border-[#E5DACF] bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(28,22,19,0.05)]">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-cn-black mb-6 flex items-center gap-2">
              <Users size={22} className="text-cn-amber" />
              2. Vos Coordonnées
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
                  Numéro de Téléphone * (Sert d&apos;identifiant unique)
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="Ex: +229 97 00 00 00"
                  className="w-full rounded-lg border border-[#D8CABE] bg-[#FAF7F2] px-4 py-3 text-sm text-cn-black placeholder-[#9E9081] focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold focus:bg-white transition-colors"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E34] mb-1.5">
                  Adresse Email <span className="text-[#887869] normal-case font-normal">(Optionnelle)</span>
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
                  Ville <span className="text-[#887869] normal-case font-normal">(Par défaut : Cotonou)</span>
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Cotonou"
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
                1 Billet {selectedTicketType} &bull; 100% Gratuit
              </h3>
              <p className="text-xs text-[#5A4D41] mt-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Pass carré officiel avec QR Code unique généré immédiatement
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full sm:w-auto min-w-[280px] justify-center"
            >
              {submitting ? "Validation de ma place..." : "Valider et Générer Mon Badge"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
