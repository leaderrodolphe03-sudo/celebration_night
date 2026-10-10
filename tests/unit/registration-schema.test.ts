import { describe, expect, it } from "vitest";
import { RegistrationSchema } from "@/lib/validation/registration";

const valid = {
  firstName: "Grâce",
  lastName: "Exemple",
  phone: "+229 01 97 00 00 00",
  email: "",
  city: "Cotonou",
  seats: 2,
  heardFrom: "Mon église",
  consent: true,
};

describe("formulaire d'inscription", () => {
  it("accepte une inscription complete sans email", () => {
    expect(RegistrationSchema.safeParse(valid).success).toBe(true);
  });

  it("exige le consentement", () => {
    expect(RegistrationSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("limite a 10 places", () => {
    expect(RegistrationSchema.safeParse({ ...valid, seats: 11 }).success).toBe(false);
    expect(RegistrationSchema.safeParse({ ...valid, seats: 0 }).success).toBe(false);
  });

  it("refuse un telephone invalide", () => {
    expect(RegistrationSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
  });

  it("ignore toute categorie de billet envoyee par le client", () => {
    const parsed = RegistrationSchema.parse({ ...valid, ticketType: "VIP" });
    expect(parsed).not.toHaveProperty("ticketType");
  });
});
