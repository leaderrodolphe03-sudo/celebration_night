import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/db/storage";
import { generateQrCodeDataUrl, generateQrCodeSvg } from "@/lib/qrcode-generator";
import { EVENT } from "@/lib/event-config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketNumber: string }> }
) {
  try {
    const { ticketNumber: rawNumber } = await params;
    if (!rawNumber) {
      return NextResponse.json({ error: "Numéro de billet manquant" }, { status: 400 });
    }

    const result = storage.getTicketByNumber(rawNumber);
    if (!result) {
      return NextResponse.json({ error: "Billet introuvable" }, { status: 404 });
    }

    const { ticket, participant } = result;

    // Le QR Code encode UNIQUEMENT le token sécurisé sans données personnelles
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
        email: participant.email,
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
