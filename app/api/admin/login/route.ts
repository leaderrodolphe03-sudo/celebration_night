import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/db/storage";
import { setSessionCookie } from "@/lib/auth-session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre email et mot de passe." },
        { status: 400 }
      );
    }

    const user = storage.authenticate(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides (email ou mot de passe incorrect)." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    return setSessionCookie(response, {
      id: user.id,
      email: user.email,
      name: user.name || "Admin",
      role: user.role as "ADMIN" | "STAFF",
    });
  } catch (error) {
    console.error("Erreur login admin:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la connexion." },
      { status: 500 }
    );
  }
}
