// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  generateAccessKey,
  hashAccessKey,
  isWellFormedKey,
  sameName,
  samePhone,
} from "@/lib/registrations/keys";

describe("cle d'acces aux billets", () => {
  it("est longue, aleatoire et bien formee", () => {
    const a = generateAccessKey();
    expect(isWellFormedKey(a)).toBe(true);
    expect(a).not.toBe(generateAccessKey());
  });

  it("n'est stockee que sous forme d'empreinte", () => {
    const key = generateAccessKey();
    expect(hashAccessKey(key)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashAccessKey(key)).not.toContain(key);
  });

  it("refuse les valeurs mal formees", () => {
    for (const bad of [
      "",
      "CN-2026-000001",
      "a".repeat(42),
      "a".repeat(44),
      "<script>".padEnd(43, "a"),
      null,
      42,
    ]) {
      expect(isWellFormedKey(bad)).toBe(false);
    }
  });
});

describe("retrouver une inscription", () => {
  it("reconnait un meme numero ecrit differemment", () => {
    expect(samePhone("+229 01 97 00 00 00", "0197000000")).toBe(true);
    expect(samePhone("+229 01 97 00 00 00", "97 00 00 00")).toBe(true);
    expect(samePhone("+229 01 97 00 00 00", "+229 01 97 00 00 01")).toBe(false);
    expect(samePhone("123", "123")).toBe(false);
  });

  it("compare les noms sans accents ni majuscules", () => {
    expect(sameName("AGBOTON", "Agboton")).toBe(true);
    expect(sameName("Héribert", "heribert")).toBe(true);
    expect(sameName("Folly", "Shine")).toBe(false);
    expect(sameName("", "")).toBe(false);
  });
});
