import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé. Veuillez vous connecter." }, { status: 401 });
  }

  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const ticketType = searchParams.get("ticketType") || undefined;
  const onlyGaveLife = searchParams.get("onlyGaveLife") === "true";

  if (isSupabaseConfigured()) {
    const participants = await supabaseStorage.getParticipants({
      search,
      ticketType,
      onlyGaveLife,
    });

    return NextResponse.json({
      success: true,
      total: participants.length,
      participants,
    });
  }

  // Fallback local
  let participants = storage.getParticipants(search, ticketType);
  if (onlyGaveLife) {
    participants = participants.filter((p: any) => p.gaveLifeToJesus);
  }

  return NextResponse.json({
    success: true,
    total: participants.length,
    participants,
  });
}
