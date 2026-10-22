import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter au portail organisateur." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const tokenOrNumber = body.tokenOrNumber || body.qrToken || body.ticketNumber;
    const mode = (body.mode === "GAVE_LIFE" ? "GAVE_LIFE" : "ENTRY") as "ENTRY" | "GAVE_LIFE";

    if (!tokenOrNumber || typeof tokenOrNumber !== "string") {
      return NextResponse.json(
        {
          status: "INVALID",
          message: "Code QR ou numéro de billet manquant.",
          mode,
        },
        { status: 400 }
      );
    }

    const scannerAgent = session.name || session.username || session.email;

    if (isSupabaseConfigured()) {
      const result = await supabaseStorage.scanTicket(tokenOrNumber, mode, scannerAgent);
      return NextResponse.json(result);
    }

    // Fallback stockage local si Supabase non encore connecté
    const result = storage.scanTicket(tokenOrNumber, scannerAgent);
    return NextResponse.json({
      ...result,
      mode,
    });
  } catch (error) {
    console.error("Erreur API validation scan:", error);
    return NextResponse.json(
      {
        status: "INVALID",
        message: "Erreur interne lors de la validation du billet.",
      },
      { status: 500 }
    );
  }
}
