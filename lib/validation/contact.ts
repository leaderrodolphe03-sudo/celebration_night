import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "Renseignement",
  "Partenariat",
  "Bénévolat",
  "Inscription / billet",
  "Médias / presse",
  "Autre",
] as const;

const trimmed = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max);

export const ContactSchema = z
  .object({
    name: trimmed(2, 80, "Indiquez votre nom."),
    email: z.union([z.literal(""), z.string().trim().email("Adresse email invalide.").max(120)]),
    phone: z.union([
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^\+?[0-9 ().-]{8,20}$/, "Numéro de téléphone invalide."),
    ]),
    subject: z.enum(CONTACT_SUBJECTS),
    message: trimmed(10, 2000, "Votre message doit comporter au moins 10 caractères."),
    // Champ piege invisible : un humain le laisse vide.
    website: z.string().max(200).optional(),
  })
  .refine((d) => d.email !== "" || d.phone !== "", {
    message: "Indiquez un email ou un numéro de téléphone pour que nous puissions vous répondre.",
    path: ["phone"],
  });

export type ContactInput = z.infer<typeof ContactSchema>;
