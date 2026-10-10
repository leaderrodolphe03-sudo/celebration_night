// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getAuthSecret", () => {
  it("refuse de demarrer en production sans AUTH_SECRET", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("AUTH_SECRET", "");
    const { getAuthSecret } = await import("@/lib/env");
    expect(() => getAuthSecret()).toThrow(/AUTH_SECRET/);
  });

  it("refuse un secret trop court", async () => {
    vi.stubEnv("AUTH_SECRET", "court");
    await expect(import("@/lib/env")).rejects.toThrow();
  });

  it("utilise AUTH_SECRET quand il est fourni", async () => {
    vi.stubEnv("AUTH_SECRET", "x".repeat(40));
    const { getAuthSecret } = await import("@/lib/env");
    expect(getAuthSecret()).toBe("x".repeat(40));
  });
});
