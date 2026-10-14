import { NextRequest, NextResponse } from "next/server";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return NextResponse.json(
        { error: "Veuillez entrer au moins 3 caractères pour la recherche." },
        { status: 400 }
      );
    }

    const clean = query.trim();

    if (isSupabaseConfigured()) {
      // 1. Essai direct par numéro de billet
      const directTicket = await supabaseStorage.getTicketByNumber(clean);
      if (directTicket) {
        return NextResponse.json({
          success: true,
          tickets: [
            {
              ticketNumber: directTicket.ticket.ticketNumber,
              ticketType: directTicket.ticket.ticketType,
              status: directTicket.ticket.status,
              participantName: `${directTicket.participant.firstName} ${directTicket.participant.lastName}`,
              phone: directTicket.participant.phone,
              email: directTicket.participant.email,
            },
          ],
        });
      }

      // 2. Recherche par email ou téléphone
      const matched = await supabaseStorage.findTicketsByPhoneOrEmail(clean);
      const tickets = matched.flatMap((item) =>
        item.tickets.map((t) => ({
          ticketNumber: t.ticketNumber,
          ticketType: t.ticketType,
          status: t.status,
          participantName: `${item.participant.firstName} ${item.participant.lastName}`,
          phone: item.participant.phone,
          email: item.participant.email,
        }))
      );

      return NextResponse.json({
        success: true,
        tickets,
      });
    }

    // Fallback local
    const directTicket = storage.getTicketByNumber(clean);
    if (directTicket) {
      return NextResponse.json({
        success: true,
        tickets: [
          {
            ticketNumber: directTicket.ticket.ticketNumber,
            ticketType: directTicket.ticket.ticketType,
            status: directTicket.ticket.status,
            participantName: `${directTicket.participant.firstName} ${directTicket.participant.lastName}`,
            phone: directTicket.participant.phone,
            email: directTicket.participant.email,
          },
        ],
      });
    }

    const matched = storage.findTicketsByEmailOrPhone(clean);
    const tickets = matched.flatMap((item) =>
      item.tickets.map((t) => ({
        ticketNumber: t.ticketNumber,
        ticketType: t.ticketType,
        status: t.status,
        participantName: `${item.participant.firstName} ${item.participant.lastName}`,
        phone: item.participant.phone,
        email: item.participant.email,
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
