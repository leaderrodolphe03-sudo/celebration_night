import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { storage } from "@/lib/db/storage";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Accès refusé. Veuillez vous connecter." }, { status: 401 });
  }

  const stats = storage.getDashboardStats();
  return NextResponse.json({
    success: true,
    stats,
  });
}
