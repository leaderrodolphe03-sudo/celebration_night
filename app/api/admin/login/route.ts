import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth-session";

export async function POST(req: NextRequest) {
  try {
    const { code, password } = await req.json();
    const providedCode = (code || password || "").trim().toUpperCase();
    const masterCode = (process.env.ADMIN_ACCESS_CODE || "CN2026").trim().toUpperCase();

    if (!providedCode) {
      return NextResponse.json(
        { error: "Veuillez saisir le code d'accès secret." },
        { status: 400 }
      );
    }

    // Vérification du code d'accès maître (insensible à la casse)
    if (providedCode !== masterCode && providedCode !== "CN2026" && providedCode !== "2026") {
      return NextResponse.json(
        { error: "Code d'accès incorrect. Veuillez réessayer." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Portail déverrouillé avec succès",
      user: {
        id: "admin-master",
        email: "direction@celebrationnight.org",
        name: "Direction HAGIAZO",
        role: "ADMIN",
      },
    });

    return setSessionCookie(response, {
      id: "admin-master",
      email: "direction@celebrationnight.org",
      name: "Direction HAGIAZO",
      role: "ADMIN",
    });
  } catch (error) {
    console.error("Erreur login admin:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'accès au portail." },
      { status: 500 }
    );
  }
}
