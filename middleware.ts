import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "celebration_admin_session";
const SECRET_KEY =
  process.env.AUTH_SECRET ||
  "celebration-night-hagiazo-super-secret-key-2026-phase1-4";

function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

interface EdgeSessionData {
  userId: string;
  username?: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  expiresAt: number;
}

async function verifySessionTokenEdge(token: string): Promise<EdgeSessionData | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadBase64, signature] = parts;
    if (!payloadBase64 || !signature) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadBase64)
    );

    const expectedSig = uint8ArrayToBase64Url(new Uint8Array(sigBuffer));
    if (expectedSig !== signature) return null;

    // Décoder le payload
    const payloadText = new TextDecoder().decode(base64UrlToUint8Array(payloadBase64));
    const payload = JSON.parse(payloadText) as EdgeSessionData;

    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Visite de la page de login (/admin/login)
  if (pathname === "/admin/login") {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (sessionCookie) {
      const session = await verifySessionTokenEdge(sessionCookie);
      if (session) {
        // Redirection contextuelle selon le rôle
        const target = session.role === "STAFF" ? "/admin/scanner" : "/admin/dashboard";
        return NextResponse.redirect(new URL(target, req.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protection des routes d'administration (/admin/*)
  if (pathname.startsWith("/admin")) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifySessionTokenEdge(sessionCookie);
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // 3. Cloisonnement strict RBAC : Le rôle STAFF est strictement cantonné au scanner
    if (session.role === "STAFF" && pathname !== "/admin/scanner") {
      const scannerUrl = new URL("/admin/scanner", req.url);
      return NextResponse.redirect(scannerUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
