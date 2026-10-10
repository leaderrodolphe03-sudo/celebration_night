import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { storage } from "@/lib/db/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter en tant qu'administrateur ou membre du staff." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const tokenOrNumber = body.tokenOrNumber || body.qrToken || body.ticketNumber;

    if (!tokenOrNumber || typeof tokenOrNumber !== "string") {
      return NextResponse.json(
        {
          status: "INVALID",
          message: "Code QR ou numéro de billet manquant.",
        },
        { status: 400 }
      );
    }

    // Un QR code officiel contient un jeton aleatoire, jamais un numero de
    // billet : les numeros se suivent et seraient faciles a falsifier.
    // Le numero n'est accepte qu'en saisie manuelle par un agent.
    if (body.manual !== true && /^CN-/i.test(tokenOrNumber.trim())) {
      return NextResponse.json({
        status: "INVALID",
        message: "QR code non officiel : il contient un numéro de billet au lieu du code sécurisé.",
      });
    }

    const scannerAgent = session.name || session.email;
    const result = storage.scanTicket(tokenOrNumber, scannerAgent);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur API validation scan:", error);
    return NextResponse.json(
      {
        status: "INVALID",
        message: "Erreur interne du serveur lors de la validation du billet.",
      },
      { status: 500 }
    );
  }
}
