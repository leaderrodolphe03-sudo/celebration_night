import { z } from "zod";

export const HEARD_FROM = [
  "Mon église",
  "Réseaux sociaux",
  "Un ami ou un proche",
  "Affiche ou flyer",
  "Groupe Haguiazo",
  "Autre",
] as const;

export const RegistrationSchema = z.object({
  firstName: z.string().trim().min(2, "Indiquez votre prénom.").max(60),
  lastName: z.string().trim().min(2, "Indiquez votre nom.").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ().-]{8,20}$/, "Numéro de téléphone invalide (ex. +229 01 00 00 00 00)."),
  email: z.union([
    z.literal(""),
    z.string().trim().toLowerCase().email("Adresse email invalide.").max(120),
  ]),
  city: z.string().trim().min(2, "Indiquez votre ville ou votre quartier.").max(60),
  seats: z.coerce
    .number()
    .int()
    .min(1, "Au moins 1 place.")
    .max(10, "10 places maximum par inscription."),
  heardFrom: z.enum(HEARD_FROM),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Votre accord est nécessaire pour vous inscrire." }),
  }),
  // Champ piege invisible : un humain le laisse vide.
  website: z.string().max(200).optional(),
});

export type RegistrationInput = z.infer<typeof RegistrationSchema>;
