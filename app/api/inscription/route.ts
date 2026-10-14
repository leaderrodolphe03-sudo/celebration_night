import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { TicketType } from "@/lib/types";

// Schema de validation strict Zod pour inscription individuelle
const InscriptionSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères").max(50),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères").max(50),
  phone: z.string().min(6, "Numéro de téléphone valide requis").max(30),
  country: z.string().min(2, "Le pays est requis").default("Bénin"),
  city: z.string().optional().default("Cotonou"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .toLowerCase()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
  ticketType: z.enum(["STANDARD", "VIP"] as const).default("STANDARD"),
  source: z.string().max(100).optional(),
});

// Rate limiting mémoire simple par IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60 * 1000 }); // Fenêtre 1 minute
    return true;
  }
  if (entry.count >= 20) {
    return false; // Trop de requêtes
  }
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez patienter un instant." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = InscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Données de formulaire invalides",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const city = data.city?.trim() || "Cotonou";

    // Utilisation de Supabase en priorité
    if (isSupabaseConfigured()) {
      const res = await supabaseStorage.createRegistration({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        country: data.country,
        city,
        ticketType: data.ticketType as TicketType,
        source: data.source,
      });

      if (res.isExisting) {
        return NextResponse.json(
          {
            success: false,
            isExisting: true,
            error: "Ce numéro de téléphone est déjà inscrit pour CELEBRATION NIGHT.",
            primaryTicket: {
              ticketNumber: res.ticket.ticketNumber,
              ticketType: res.ticket.ticketType,
              status: res.ticket.status,
            },
            participant: {
              firstName: res.participant.firstName,
              lastName: res.participant.lastName,
              phone: res.participant.phone,
            },
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Inscription confirmée avec succès",
          participant: {
            id: res.participant.id,
            firstName: res.participant.firstName,
            lastName: res.participant.lastName,
            email: res.participant.email,
            phone: res.participant.phone,
            city: res.participant.city,
            country: res.participant.country,
            ticketType: res.participant.ticketType,
          },
          primaryTicket: {
            ticketNumber: res.ticket.ticketNumber,
            ticketType: res.ticket.ticketType,
            status: res.ticket.status,
          },
        },
        { status: 201 }
      );
    }

    // Fallback de développement local sur db.json si Supabase non encore connecté
    const { participant, tickets } = storage.createRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || `${data.phone.replace(/[^0-9]/g, "")}@phone.celebrationnight.org`,
      phone: data.phone,
      country: data.country,
      city,
      numberOfGuests: 1,
      ticketType: data.ticketType as TicketType,
      source: data.source,
    });

    const primaryTicket = tickets[0];

    return NextResponse.json(
      {
        success: true,
        message: "Inscription confirmée avec succès (stockage local)",
        participant: {
          id: participant.id,
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email,
          phone: participant.phone,
          city: participant.city,
          country: participant.country,
          ticketType: participant.ticketType,
        },
        primaryTicket: {
          ticketNumber: primaryTicket.ticketNumber,
          ticketType: primaryTicket.ticketType,
          status: primaryTicket.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur API inscription:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur interne est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}
