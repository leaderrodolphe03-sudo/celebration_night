// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  createSessionToken,
  generateSecureQrToken,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from "@/lib/crypto-security";

const user = { userId: "u1", email: "a@b.c", name: "A", role: "ADMIN" as const };

describe("mots de passe", () => {
  it("verifie le bon mot de passe et refuse un mauvais", () => {
    const { hash, salt } = hashPassword("correct horse");
    expect(verifyPassword("correct horse", hash, salt)).toBe(true);
    expect(verifyPassword("wrong", hash, salt)).toBe(false);
  });

  it("utilise un sel different a chaque hachage", () => {
    expect(hashPassword("x").salt).not.toBe(hashPassword("x").salt);
  });
});

describe("jeton QR", () => {
  it("est aleatoire et ne contient aucune donnee lisible", () => {
    const a = generateSecureQrToken();
    expect(a).not.toBe(generateSecureQrToken());
    expect(a.length).toBeGreaterThanOrEqual(32);
  });
});

describe("sessions signees", () => {
  it("accepte un jeton intact", () => {
    expect(verifySessionToken(createSessionToken(user))?.email).toBe("a@b.c");
  });

  it("refuse un jeton dont le contenu a ete modifie (elevation de role)", () => {
    const [, sig] = createSessionToken({ ...user, role: "STAFF" as never }).split(".");
    const forged = Buffer.from(JSON.stringify({ ...user, expiresAt: Date.now() + 1e6 })).toString(
      "base64url"
    );
    expect(verifySessionToken(`${forged}.${sig}`)).toBeNull();
  });

  it("refuse un jeton expire", () => {
    vi.useFakeTimers();
    const token = createSessionToken(user, 1);
    vi.advanceTimersByTime(2 * 3600 * 1000);
    expect(verifySessionToken(token)).toBeNull();
    vi.useRealTimers();
  });

  it("refuse un jeton malforme", () => {
    expect(verifySessionToken("n'importe-quoi")).toBeNull();
  });
});
