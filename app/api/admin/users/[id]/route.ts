import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { supabaseStorage } from "@/lib/db/supabase-storage";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
    }

    const targetId = params.id?.trim();
    if (!targetId) {
      return NextResponse.json({ error: "Identifiant utilisateur manquant." }, { status: 400 });
    }

    // Protection anti-suicide de session : Empêcher de supprimer son propre compte
    if (session.userId === targetId) {
      return NextResponse.json(
        { error: "Impossible de supprimer votre propre compte administrateur actif." },
        { status: 400 }
      );
    }

    await supabaseStorage.deleteAdminUser(targetId);

    return NextResponse.json({
      success: true,
      message: "Compte utilisateur supprimé avec succès.",
    });
  } catch (error: any) {
    console.error("Erreur suppression utilisateur:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la suppression de l'utilisateur." },
      { status: 500 }
    );
  }
}
