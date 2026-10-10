import type { RegistrationInput } from "@/lib/validation/registration";

export type TicketStatus = "valid" | "used" | "cancelled";

export interface RegistrationTicket {
  ticketNumber: string;
  status: TicketStatus;
  /** Jeton aleatoire encode dans le QR code (aucune donnee personnelle). */
  qrToken: string;
}

export interface RegistrationView {
  firstName: string;
  lastName: string;
  seats: number;
  tickets: RegistrationTicket[];
}

export interface CreatedRegistration {
  /** Cle secrete en clair : a transmettre au participant, jamais stockee. */
  accessKey: string;
  ticketNumbers: string[];
}

export class CapacityReachedError extends Error {
  constructor(public readonly remaining: number) {
    super(
      remaining > 0 ? `Il ne reste que ${remaining} place(s).` : "Les inscriptions sont complètes."
    );
  }
}

/** Acces aux inscriptions, independant du stockage (fichier local ou Supabase). */
export interface RegistrationStore {
  create(input: Omit<RegistrationInput, "consent" | "website">): Promise<CreatedRegistration>;
  getByKey(accessKey: string): Promise<RegistrationView | null>;
  /**
   * Retrouve une inscription par telephone + nom et lui attribue une NOUVELLE
   * cle (l'ancien lien cesse de fonctionner). Renvoie null si rien ne correspond.
   */
  recover(phone: string, lastName: string): Promise<string | null>;
}
