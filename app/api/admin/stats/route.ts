import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { supabaseStorage } from "@/lib/db/supabase-storage";
import { storage } from "@/lib/db/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé. Veuillez vous connecter." }, { status: 401 });
  }

  if (isSupabaseConfigured()) {
    const stats = await supabaseStorage.getDashboardStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  }

  const stats = storage.getDashboardStats();
  return NextResponse.json({
    success: true,
    stats: {
      ...stats,
      gaveLifeCount: 0,
    },
  });
}
