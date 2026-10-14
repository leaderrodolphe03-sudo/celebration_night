import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé. Veuillez vous connecter." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const ticketType = searchParams.get("ticketType") || undefined;

  if (isSupabaseConfigured()) {
    const tickets = await supabaseStorage.getTickets({
      search,
      status,
      ticketType,
    });

    return NextResponse.json({
      success: true,
      total: tickets.length,
      tickets,
    });
  }

  const tickets = storage.getTickets(search, status, ticketType);

  return NextResponse.json({
    success: true,
    total: tickets.length,
    tickets,
  });
}
