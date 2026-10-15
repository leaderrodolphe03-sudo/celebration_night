import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseStorage } from "@/lib/db/supabase-storage";
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

    // 1. Vérification de la configuration Supabase
    if (!isSupabaseConfigured()) {
      console.error("Configuration Supabase manquante au runtime:", {
        hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      });

      return NextResponse.json(
        {
          error:
            "Base de données non connectée : les variables d'environnement Supabase (NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY) ne sont pas détectées sur le serveur. Veuillez vérifier les variables d'environnement sur Vercel et relancer le déploiement.",
        },
        { status: 500 }
      );
    }

    // 2. Inscription directe dans Supabase
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
  } catch (error: any) {
    console.error("Erreur API inscription:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur interne est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}
