import { NextRequest, NextResponse } from "next/server";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

// Rate limiting en mémoire par IP (10 requêtes / minute)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60 * 1000 });
    return true;
  }
  if (entry.count >= 10) {
    return false;
  }
  entry.count += 1;
  return true;
}

function maskName(firstName: string, lastName: string): string {
  const first = firstName.trim();
  const lastInitial = lastName.trim().charAt(0);
  return lastInitial ? `${first} ${lastInitial.toUpperCase()}.` : first;
}

function maskEmail(email?: string | null): string {
  if (!email || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local.charAt(0)}*@${domain}`;
  }
  return `${local.charAt(0)}***${local.charAt(local.length - 1)}@${domain}`;
}

function maskPhone(phone?: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  const last4 = digits.slice(-4);
  const prefix = phone.startsWith("+") ? phone.slice(0, 4) : "";
  return `${prefix} •••• ${last4}`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requetes. Veuillez patienter avant de renouveler votre recherche." },
        { status: 429 }
      );
    }

    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Veuillez entrer une recherche valide." },
        { status: 400 }
      );
    }

    const clean = query.trim();

    // 1. Validation de l'intention de recherche pour interdire le moissonnage partiel
    const isTicketNumber = clean.toUpperCase().startsWith("CN-2026-");
    const isEmail = clean.includes("@");
    const digitsOnly = clean.replace(/\D/g, "");

    if (!isTicketNumber && !isEmail && digitsOnly.length < 8) {
      return NextResponse.json(
        { error: "Pour une recherche par telephone, veuillez saisir au moins 8 chiffres (numero complet)." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      // 1. Essai direct par numéro de billet
      if (isTicketNumber) {
        const directTicket = await supabaseStorage.getTicketByNumber(clean);
        if (directTicket) {
          return NextResponse.json({
            success: true,
            tickets: [
              {
                ticketNumber: directTicket.ticket.ticketNumber,
                ticketType: directTicket.ticket.ticketType,
                status: directTicket.ticket.status,
                participantName: maskName(directTicket.participant.firstName, directTicket.participant.lastName),
                phone: maskPhone(directTicket.participant.phone),
                email: maskEmail(directTicket.participant.email),
              },
            ],
          });
        }
      }

      // 2. Recherche par email ou téléphone
      const matched = await supabaseStorage.findTicketsByPhoneOrEmail(clean);
      const tickets = matched.flatMap((item) =>
        item.tickets.map((t) => ({
          ticketNumber: t.ticketNumber,
          ticketType: t.ticketType,
          status: t.status,
          participantName: maskName(item.participant.firstName, item.participant.lastName),
          phone: maskPhone(item.participant.phone),
          email: maskEmail(item.participant.email),
        }))
      );

      return NextResponse.json({
        success: true,
        tickets,
      });
    }

    // Fallback local
    if (isTicketNumber) {
      const directTicket = storage.getTicketByNumber(clean);
      if (directTicket) {
        return NextResponse.json({
          success: true,
          tickets: [
            {
              ticketNumber: directTicket.ticket.ticketNumber,
              ticketType: directTicket.ticket.ticketType,
              status: directTicket.ticket.status,
              participantName: maskName(directTicket.participant.firstName, directTicket.participant.lastName),
              phone: maskPhone(directTicket.participant.phone),
              email: maskEmail(directTicket.participant.email),
            },
          ],
        });
      }
    }

    const matched = storage.findTicketsByEmailOrPhone(clean);
    const tickets = matched.flatMap((item) =>
      item.tickets.map((t) => ({
        ticketNumber: t.ticketNumber,
        ticketType: t.ticketType,
        status: t.status,
        participantName: maskName(item.participant.firstName, item.participant.lastName),
        phone: maskPhone(item.participant.phone),
        email: maskEmail(item.participant.email),
      }))
    );

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Erreur recherche billets:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche des billets." },
      { status: 500 }
    );
  }
}
