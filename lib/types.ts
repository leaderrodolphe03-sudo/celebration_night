export type TicketType = "STANDARD" | "VIP";

export type TicketStatus = "VALID" | "USED" | "CANCELLED";

export type AdminRole = "ADMIN" | "STAFF";

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  country: string;
  city: string;
  numberOfGuests?: number;
  ticketType: TicketType;
  source?: string | null;
  gaveLifeToJesus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // Ex: CN-2026-000001
  qrToken: string; // Token cryptographique de 64 hex
  ticketType: TicketType;
  status: TicketStatus;
  scannedAt?: string | null;
  scannedBy?: string | null;
  participantId: string;
  participant?: Participant;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string | null;
  name: string;
  passwordHash: string;
  salt: string;
  role: AdminRole;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "ARCHIVED";
  createdAt: string;
}

export interface ScanResult {
  status: "VALID" | "ALREADY_USED" | "INVALID" | "GAVE_LIFE_SAVED";
  message: string;
  mode?: "ENTRY" | "GAVE_LIFE";
  ticket?: {
    id: string;
    ticketNumber: string;
    ticketType: TicketType;
    status: TicketStatus;
    scannedAt?: string | null;
    scannedBy?: string | null;
  };
  participant?: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
    city: string;
    country: string;
    gaveLifeToJesus?: boolean;
  };
  scannedAt?: string;
  previousScanAt?: string;
  previousScannedBy?: string;
}
