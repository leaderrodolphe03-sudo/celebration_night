import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken, createSessionToken, SessionData } from "./crypto-security";
import { AdminRole } from "./types";

export const SESSION_COOKIE_NAME = "celebration_admin_session";

/**
 * Récupère les données de session de l'administrateur ou du staff connecté.
 */
export async function getSessionUser(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  return verifySessionToken(sessionCookie.value);
}

/**
 * Dépose le cookie de session sécurisé HTTPOnly dans la réponse.
 */
export function setSessionCookie(
  response: NextResponse,
  user: { id: string; email: string; name: string; role: AdminRole }
): NextResponse {
  const token = createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 3600, // 24 heures
  });

  return response;
}

/**
 * Supprime le cookie de session lors de la déconnexion.
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
