import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/db/storage";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { RegistrationSchema } from "@/lib/validation/registration";

// Stockage provisoire (lib/db/storage) : sera remplace par Supabase a l'etape 5.
export async function POST(req: NextRequest) {
  if (!rateLimit(`inscription:${clientIp(req.headers)}`, 10, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = RegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Veuillez vérifier les informations saisies.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.website) {
    return NextResponse.json({ error: "Requête refusée." }, { status: 400 });
  }

  try {
    const { participant, tickets } = storage.createRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      country: "Non précisé",
      city: data.city,
      numberOfGuests: data.seats,
      ticketType: "STANDARD",
      source: data.heardFrom,
    });

    return NextResponse.json(
      {
        success: true,
        participant: {
          firstName: participant.firstName,
          numberOfGuests: participant.numberOfGuests,
        },
        primaryTicket: { ticketNumber: tickets[0].ticketNumber },
        allTickets: tickets.map((t) => ({ ticketNumber: t.ticketNumber })),
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
