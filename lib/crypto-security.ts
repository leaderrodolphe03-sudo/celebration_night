import crypto from "crypto";
import { getAuthSecret } from "./env";
import { AdminRole } from "./types";



/**
 * Hache un mot de passe en utilisant scrypt et un sel cryptographique aléatoire.
 * Sécurisé contre les attaques par dictionnaire, brute force et rainbow tables.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString("hex"),
    salt,
  };
}

/**
 * Vérifie un mot de passe par rapport au hash et au sel stockés.
 * Utilise timingSafeEqual pour prévenir les attaques temporelles (timing attacks).
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString("hex"), "hex");
    const hashBuffer = Buffer.from(hash, "hex");

    if (keyBuffer.length !== hashBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(keyBuffer, hashBuffer);
  } catch (error) {
    return false;
  }
}

/**
 * Génère un token cryptographique aléatoire de 64 caractères hexadécimaux (256 bits d'entropie).
 * Conforme au brief : Le QR Code ne contient AUCUNE donnée personnelle (PII).
 */
export function generateSecureQrToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  expiresAt: number; // timestamp en millisecondes
}

/**
 * Crée un token de session signé (HMAC-SHA256).
 */
export function createSessionToken(data: Omit<SessionData, "expiresAt">, durationHours = 24): string {
  const expiresAt = Date.now() + durationHours * 3600 * 1000;
  const payload: SessionData = {
    ...data,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Vérifie et décode un token de session signé.
 */
export function verifySessionToken(token: string): SessionData | null {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", getAuthSecret())
      .update(payloadBase64)
      .digest("base64url");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return null;
    }

    const payloadText = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadText) as SessionData;

    if (Date.now() > payload.expiresAt) {
      return null; // Expiré
    }

    return payload;
  } catch (err) {
    return null;
  }
}
