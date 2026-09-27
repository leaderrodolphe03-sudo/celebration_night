import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/db/storage";
import { TicketType } from "@/lib/types";

// Schema de validation strict Zod
const InscriptionSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères").max(50),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères").max(50),
  email: z.string().email("Adresse email invalide").toLowerCase(),
  phone: z.string().min(6, "Numéro de téléphone requis").max(30),
  country: z.string().min(2, "Le pays est requis").max(50),
  city: z.string().min(2, "La ville est requise").max(50),
  numberOfGuests: z.coerce.number().int().min(1, "Au moins 1 place").max(10, "Maximum 10 places par commande"),
  ticketType: z.enum(["STANDARD", "VIP"] as const),
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
  if (entry.count >= 15) {
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

    const { participant, tickets } = storage.createRegistration({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      city: parsed.data.city,
      numberOfGuests: parsed.data.numberOfGuests,
      ticketType: parsed.data.ticketType as TicketType,
      source: parsed.data.source,
    });

    const primaryTicket = tickets[0];

    return NextResponse.json(
      {
        success: true,
        message: "Inscription confirmée avec succès",
        participant: {
          id: participant.id,
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email,
          city: participant.city,
          country: participant.country,
          numberOfGuests: participant.numberOfGuests,
          ticketType: participant.ticketType,
        },
        primaryTicket: {
          ticketNumber: primaryTicket.ticketNumber,
          ticketType: primaryTicket.ticketType,
          status: primaryTicket.status,
        },
        allTickets: tickets.map((t) => ({
          ticketNumber: t.ticketNumber,
          ticketType: t.ticketType,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API inscription:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}
