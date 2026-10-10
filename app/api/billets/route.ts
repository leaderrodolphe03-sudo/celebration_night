import { NextRequest, NextResponse } from "next/server";
import { generateQrCodeSvg } from "@/lib/qrcode-generator";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { isWellFormedKey, registrations } from "@/lib/registrations";

// Renvoie les billets d'une inscription a partir de sa cle secrete.
// POST (et non GET) : la cle reste dans le corps, hors des URL et des journaux.
export async function POST(req: NextRequest) {
  if (!rateLimit(`billets:${clientIp(req.headers)}`, 60, 10 * 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const key = body?.cle;
  if (!isWellFormedKey(key)) {
    return NextResponse.json({ error: "Lien de billet invalide." }, { status: 400 });
  }

  try {
    const registration = await registrations.getByKey(key);
    if (!registration) {
      return NextResponse.json(
        {
          error:
            "Lien de billet invalide ou expiré. Vous pouvez retrouver vos billets avec votre téléphone.",
        },
        { status: 404 }
      );
    }

    const tickets = await Promise.all(
      registration.tickets.map(async (t) => ({
        ticketNumber: t.ticketNumber,
        status: t.status,
        qrSvg: await generateQrCodeSvg(t.qrToken),
      }))
    );

    return NextResponse.json(
      { firstName: registration.firstName, lastName: registration.lastName, tickets },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Erreur API billets:", error);
    return NextResponse.json({ error: "Impossible de charger les billets." }, { status: 500 });
  }
}
