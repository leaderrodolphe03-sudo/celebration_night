import { NextRequest, NextResponse } from "next/server";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { generateQrCodeDataUrl, generateQrCodeSvg } from "@/lib/qrcode-generator";
import { EVENT } from "@/lib/event-config";

// Rate limiting en mémoire par IP (30 requêtes / minute)
const ticketViewRateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkTicketRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ticketViewRateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    ticketViewRateLimitMap.set(ip, { count: 1, expiresAt: now + 60 * 1000 });
    return true;
  }
  if (entry.count >= 30) {
    return false;
  }
  entry.count += 1;
  return true;
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

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketNumber: string } }
) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown-ip";
    if (!checkTicketRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requetes. Veuillez patienter un instant." },
        { status: 429 }
      );
    }

    const rawNumber = params.ticketNumber;
    if (!rawNumber || typeof rawNumber !== "string") {
      return NextResponse.json({ error: "Numero de billet manquant." }, { status: 400 });
    }

    const cleanNumber = rawNumber.trim().toUpperCase();
    if (!cleanNumber.startsWith("CN-2026-") && cleanNumber.length < 5) {
      return NextResponse.json({ error: "Format de billet non reconnu." }, { status: 400 });
    }

    let result = null;
    if (isSupabaseConfigured()) {
      result = await supabaseStorage.getTicketByNumber(cleanNumber);
    } else {
      result = storage.getTicketByNumber(cleanNumber);
    }

    if (!result) {
      return NextResponse.json({ error: "Billet introuvable." }, { status: 404 });
    }

    const { ticket, participant } = result;

    // Le QR Code encode le token securise sans PII
    const qrCodeDataUrl = await generateQrCodeDataUrl(ticket.qrToken);
    const qrCodeSvg = await generateQrCodeSvg(ticket.qrToken);

    return NextResponse.json({
      success: true,
      event: {
        name: EVENT.name,
        organizer: EVENT.organizer,
        tagline: EVENT.tagline,
        dateLabel: EVENT.dateLabel,
        timeLabel: EVENT.timeLabel,
        venue: EVENT.venue,
      },
      ticket: {
        ticketNumber: ticket.ticketNumber,
        ticketType: ticket.ticketType,
        status: ticket.status,
        scannedAt: ticket.scannedAt,
        createdAt: ticket.createdAt,
      },
      participant: {
        firstName: participant.firstName,
        lastName: participant.lastName,
        phone: maskPhone(participant.phone),
        email: maskEmail(participant.email),
        city: participant.city,
        country: participant.country,
      },
      qrCodeDataUrl,
      qrCodeSvg,
    });
  } catch (error) {
    console.error("Erreur récupération billet:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement du billet." },
      { status: 500 }
    );
  }
}
