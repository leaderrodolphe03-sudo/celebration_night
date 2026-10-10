import crypto from "node:crypto";

/**
 * Cle d'acces d'une inscription : 256 bits aleatoires, donnee une seule fois
 * au participant (lien de ses billets). Seule son empreinte SHA-256 est
 * stockee : une fuite de la base ne donne pas acces aux billets.
 */
export function generateAccessKey(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashAccessKey(key: string): string {
  return crypto.createHash("sha256").update(key, "utf8").digest("hex");
}

/** Une cle valide fait exactement 43 caracteres base64url. */
export function isWellFormedKey(key: unknown): key is string {
  return typeof key === "string" && /^[A-Za-z0-9_-]{43}$/.test(key);
}

/**
 * Compare deux numeros de telephone sans tenir compte du format :
 * « +229 01 23 45 67 89 » et « 0123456789 » sont equivalents.
 * On compare les 8 derniers chiffres (numero local beninois sans le 01).
 */
export function samePhone(a: string, b: string): boolean {
  const da = a.replace(/\D/g, "");
  const db = b.replace(/\D/g, "");
  return da.length >= 8 && db.length >= 8 && da.slice(-8) === db.slice(-8);
}

export function sameName(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  return norm(a) !== "" && norm(a) === norm(b);
}
