import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { storage } from "@/lib/db/storage";

export async function GET(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé. Veuillez vous connecter." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const ticketType = searchParams.get("ticketType") || undefined;

  const participants = storage.getParticipants(search, ticketType);

  return NextResponse.json({
    success: true,
    total: participants.length,
    participants,
  });
}
