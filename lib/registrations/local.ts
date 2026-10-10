import "server-only";
import { storage } from "@/lib/db/storage";
import { EVENT } from "@/lib/content";
import { generateAccessKey, hashAccessKey, sameName, samePhone } from "./keys";
import { CapacityReachedError, type RegistrationStore, type TicketStatus } from "./types";

// Stockage de developpement : fichier data/db.json. Ne convient pas a la
// production (Vercel n'autorise pas l'ecriture sur disque) : utiliser Supabase.

const STATUS: Record<string, TicketStatus> = {
  VALID: "valid",
  USED: "used",
  CANCELLED: "cancelled",
};

export const localRegistrationStore: RegistrationStore = {
  async create(input) {
    if (EVENT.capacity !== null) {
      const remaining = EVENT.capacity - storage.countActiveTickets();
      if (input.seats > remaining) throw new CapacityReachedError(Math.max(0, remaining));
    }
    const accessKey = generateAccessKey();
    const { tickets } = storage.createRegistration({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      country: "Non précisé",
      city: input.city,
      numberOfGuests: input.seats,
      ticketType: "STANDARD",
      source: input.heardFrom,
      accessKeyHash: hashAccessKey(accessKey),
    });
    return { accessKey, ticketNumbers: tickets.map((t) => t.ticketNumber) };
  },

  async getByKey(accessKey) {
    const found = storage.findByAccessKeyHash(hashAccessKey(accessKey));
    if (!found) return null;
    return {
      firstName: found.participant.firstName,
      lastName: found.participant.lastName,
      seats: found.participant.numberOfGuests,
      tickets: found.tickets.map((t) => ({
        ticketNumber: t.ticketNumber,
        status: STATUS[t.status] ?? "valid",
        qrToken: t.qrToken,
      })),
    };
  },

  async recover(phone, lastName) {
    const participant = storage
      .listParticipants()
      .filter((p) => samePhone(p.phone, phone) && sameName(p.lastName, lastName))
      .at(-1);
    if (!participant) return null;
    const accessKey = generateAccessKey();
    storage.setAccessKeyHash(participant.id, hashAccessKey(accessKey));
    return accessKey;
  },
};
