import fs from "fs";
import path from "path";
import {
  Participant,
  Ticket,
  AdminUser,
  ContactMessage,
  ScanResult,
  TicketType,
  TicketStatus,
} from "../types";
import {
  hashPassword,
  verifyPassword,
  generateSecureQrToken,
} from "../crypto-security";

interface DatabaseSchema {
  participants: Participant[];
  tickets: Ticket[];
  adminUsers: AdminUser[];
  contactMessages: ContactMessage[];
  lastTicketSequence: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDirectoryExists(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (e) {
    // Environnement read-only (ex: Vercel)
  }
}

function getInitialDatabase(): DatabaseSchema {
  const adminCredentials = hashPassword("Celebration2026!");
  const staffCredentials = hashPassword("Staff2026!");

  const adminUser: AdminUser = {
    id: "admin-super-001",
    username: "superadmin",
    email: "admin@celebrationnight.com",
    name: "Direction HAGIAZO",
    passwordHash: adminCredentials.hash,
    salt: adminCredentials.salt,
    role: "ADMIN",
    createdAt: new Date().toISOString(),
  };

  const staffUser: AdminUser = {
    id: "staff-gate-001",
    username: "staff",
    email: "staff@celebrationnight.com",
    name: "Équipe Accueil & Contrôle",
    passwordHash: staffCredentials.hash,
    salt: staffCredentials.salt,
    role: "STAFF",
    createdAt: new Date().toISOString(),
  };

  // Créons 3 participants de démonstration pour que le dashboard vive dès le premier lancement
  const p1Id = "part-demo-001";
  const p2Id = "part-demo-002";
  const p3Id = "part-demo-003";

  const p1: Participant = {
    id: p1Id,
    firstName: "Emmanuel",
    lastName: "Kouassi",
    email: "emmanuel.k@example.com",
    phone: "+225 07 08 09 10 11",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    numberOfGuests: 2,
    ticketType: "VIP",
    source: "Réseaux sociaux",
    gaveLifeToJesus: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const p2: Participant = {
    id: p2Id,
    firstName: "Grace",
    lastName: "Ndong",
    email: "grace.ndong@example.com",
    phone: "+241 65 43 21 09",
    country: "Gabon",
    city: "Libreville",
    numberOfGuests: 1,
    ticketType: "STANDARD",
    source: "Église partenaire",
    gaveLifeToJesus: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const p3: Participant = {
    id: p3Id,
    firstName: "Samuel",
    lastName: "Diallo",
    email: "samuel.diallo@example.com",
    phone: "+33 6 12 34 56 78",
    country: "France",
    city: "Paris",
    numberOfGuests: 1,
    ticketType: "STANDARD",
    source: "Bouche-à-oreille",
    gaveLifeToJesus: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const t1: Ticket = {
    id: "tick-demo-001",
    ticketNumber: "CN-2026-000001",
    qrToken: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    ticketType: "VIP",
    status: "USED",
    scannedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    scannedBy: "Équipe Accueil & Contrôle",
    participantId: p1Id,
    createdAt: p1.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const t2: Ticket = {
    id: "tick-demo-002",
    ticketNumber: "CN-2026-000002",
    qrToken: "b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01",
    ticketType: "VIP",
    status: "VALID",
    scannedAt: null,
    scannedBy: null,
    participantId: p1Id,
    createdAt: p1.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const t3: Ticket = {
    id: "tick-demo-003",
    ticketNumber: "CN-2026-000003",
    qrToken: "c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012",
    ticketType: "STANDARD",
    status: "VALID",
    scannedAt: null,
    scannedBy: null,
    participantId: p2Id,
    createdAt: p2.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const t4: Ticket = {
    id: "tick-demo-004",
    ticketNumber: "CN-2026-000004",
    qrToken: "d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123",
    ticketType: "STANDARD",
    status: "VALID",
    scannedAt: null,
    scannedBy: null,
    participantId: p3Id,
    createdAt: p3.createdAt,
    updatedAt: new Date().toISOString(),
  };

  return {
    participants: [p1, p2, p3],
    tickets: [t1, t2, t3, t4],
    adminUsers: [adminUser, staffUser],
    contactMessages: [],
    lastTicketSequence: 4,
  };
}

export interface DatabaseRepository {
  createRegistration(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    numberOfGuests: number;
    ticketType: TicketType;
    source?: string;
  }): { participant: Participant; tickets: Ticket[] };

  getTicketByNumber(ticketNumber: string): { ticket: Ticket; participant: Participant } | null;
  getTicketByToken(qrToken: string): { ticket: Ticket; participant: Participant } | null;
  findTicketsByEmailOrPhone(query: string): { participant: Participant; tickets: Ticket[] }[];
  scanTicket(tokenOrNumber: string, scannedBy?: string): ScanResult;
  getDashboardStats(): {
    totalParticipants: number;
    totalTickets: number;
    scannedTickets: number;
    pendingTickets: number;
    attendanceRate: number;
    standardTickets: number;
    vipTickets: number;
    recentParticipants: any[];
    recentScans: any[];
  };
  getParticipants(search?: string, ticketType?: string): (Participant & { tickets: Ticket[] })[];
  getTickets(search?: string, status?: string, ticketType?: string): (Ticket & { participant?: Participant })[];
  authenticate(email: string, password: string): AdminUser | null;
  getAdminUserById(id: string): AdminUser | null;
  addContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): ContactMessage;
}

class StorageEngine implements DatabaseRepository {
  private cache: DatabaseSchema | null = null;

  private load(): DatabaseSchema {
    if (this.cache) return this.cache;

    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, "utf-8");
        this.cache = JSON.parse(content) as DatabaseSchema;
        return this.cache;
      }
    } catch {
      // Environnement read-only ou fichier absent
    }

    const fallback = getInitialDatabase();
    this.cache = fallback;
    return fallback;
  }

  private save(): void {
    if (!this.cache) return;
    try {
      ensureDirectoryExists(DATA_DIR);
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), "utf-8");
    } catch {
      // Ignorer si filesystem read-only (ex: Vercel)
    }
  }

  // --- PARTICIPANTS & BILLETS ---

  public createRegistration(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    numberOfGuests: number;
    ticketType: TicketType;
    source?: string;
  }): { participant: Participant; tickets: Ticket[] } {
    const db = this.load();

    const participantId = `part-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const participant: Participant = {
      id: participantId,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      country: data.country.trim(),
      city: data.city.trim(),
      numberOfGuests: data.numberOfGuests,
      ticketType: data.ticketType,
      source: data.source?.trim() || null,
      gaveLifeToJesus: false,
      createdAt: now,
      updatedAt: now,
    };

    const count = Math.max(1, Math.min(10, data.numberOfGuests));
    const generatedTickets: Ticket[] = [];

    for (let i = 0; i < count; i++) {
      db.lastTicketSequence += 1;
      const seqStr = String(db.lastTicketSequence).padStart(6, "0");
      const ticketNumber = `CN-2026-${seqStr}`;
      const qrToken = generateSecureQrToken();

      const ticket: Ticket = {
        id: `tick-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        ticketNumber,
        qrToken,
        ticketType: data.ticketType,
        status: "VALID",
        scannedAt: null,
        scannedBy: null,
        participantId: participant.id,
        createdAt: now,
        updatedAt: now,
      };

      generatedTickets.push(ticket);
      db.tickets.push(ticket);
    }

    db.participants.push(participant);
    this.save();

    return { participant, tickets: generatedTickets };
  }

  public getTicketByNumber(ticketNumber: string): { ticket: Ticket; participant: Participant } | null {
    const db = this.load();
    const formatted = ticketNumber.trim().toUpperCase();
    const ticket = db.tickets.find((t) => t.ticketNumber === formatted);
    if (!ticket) return null;

    const participant = db.participants.find((p) => p.id === ticket.participantId);
    if (!participant) return null;

    return { ticket, participant };
  }

  public getTicketByToken(qrToken: string): { ticket: Ticket; participant: Participant } | null {
    const db = this.load();
    const cleanToken = qrToken.trim();
    const ticket = db.tickets.find((t) => t.qrToken === cleanToken);
    if (!ticket) return null;

    const participant = db.participants.find((p) => p.id === ticket.participantId);
    if (!participant) return null;

    return { ticket, participant };
  }

  public findTicketsByEmailOrPhone(query: string): { participant: Participant; tickets: Ticket[] }[] {
    const db = this.load();
    const clean = query.trim().toLowerCase();

    const matchedParticipants = db.participants.filter(
      (p) =>
        (p.email && p.email.toLowerCase().includes(clean)) ||
        p.phone.includes(clean) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(clean)
    );

    return matchedParticipants.map((p) => ({
      participant: p,
      tickets: db.tickets.filter((t) => t.participantId === p.id),
    }));
  }

  // --- SCAN & VALIDATION ---

  public scanTicket(tokenOrNumber: string, scannedBy = "Staff"): ScanResult {
    const db = this.load();
    const cleanInput = tokenOrNumber.trim();

    // Recherche soit par qrToken, soit par numéro de billet CN-2026-XXXXXX
    let ticket = db.tickets.find((t) => t.qrToken === cleanInput);
    if (!ticket) {
      ticket = db.tickets.find((t) => t.ticketNumber.toUpperCase() === cleanInput.toUpperCase());
    }

    if (!ticket) {
      return {
        status: "INVALID",
        message: "Billet invalide ou introuvable dans le système.",
      };
    }

    const participant = db.participants.find((p) => p.id === ticket.participantId);

    if (ticket.status === "USED") {
      return {
        status: "ALREADY_USED",
        message: "Ce billet a déjà été validé à l'entrée !",
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          ticketType: ticket.ticketType,
          status: ticket.status,
          scannedAt: ticket.scannedAt,
          scannedBy: ticket.scannedBy,
        },
        participant: participant
          ? {
              firstName: participant.firstName,
              lastName: participant.lastName,
              phone: participant.phone,
              email: participant.email,
              city: participant.city,
              country: participant.country,
              gaveLifeToJesus: participant.gaveLifeToJesus,
            }
          : undefined,
        previousScanAt: ticket.scannedAt || undefined,
        previousScannedBy: ticket.scannedBy || undefined,
      };
    }

    if (ticket.status === "CANCELLED") {
      return {
        status: "INVALID",
        message: "Ce billet a été annulé par l'organisation.",
      };
    }

    // Validation atomique du billet
    const scanTime = new Date().toISOString();
    ticket.status = "USED";
    ticket.scannedAt = scanTime;
    ticket.scannedBy = scannedBy;
    ticket.updatedAt = scanTime;

    this.save();

    return {
      status: "VALID",
      message: "Billet validé avec succès ! Entrée autorisée.",
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        ticketType: ticket.ticketType,
        status: ticket.status,
        scannedAt: ticket.scannedAt,
        scannedBy: ticket.scannedBy,
      },
      participant: participant
        ? {
            firstName: participant.firstName,
            lastName: participant.lastName,
            phone: participant.phone,
            email: participant.email,
            city: participant.city,
            country: participant.country,
            gaveLifeToJesus: participant.gaveLifeToJesus,
          }
        : undefined,
      scannedAt: scanTime,
    };
  }

  // --- STATISTIQUES DASHBOARD ---

  public getDashboardStats() {
    const db = this.load();

    const totalParticipants = db.participants.length;
    const totalTickets = db.tickets.length;
    const scannedTickets = db.tickets.filter((t) => t.status === "USED").length;
    const pendingTickets = totalTickets - scannedTickets;
    const attendanceRate = totalTickets > 0 ? Math.round((scannedTickets / totalTickets) * 100) : 0;

    const standardTickets = db.tickets.filter((t) => t.ticketType === "STANDARD").length;
    const vipTickets = db.tickets.filter((t) => t.ticketType === "VIP").length;

    // Dernières inscriptions
    const recentParticipants = [...db.participants]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((p) => {
        const participantTickets = db.tickets.filter((t) => t.participantId === p.id);
        return {
          ...p,
          ticketsCount: participantTickets.length,
          firstTicketNumber: participantTickets[0]?.ticketNumber || "-",
        };
      });

    // Derniers scans
    const recentScans = [...db.tickets]
      .filter((t) => t.scannedAt)
      .sort((a, b) => new Date(b.scannedAt!).getTime() - new Date(a.scannedAt!).getTime())
      .slice(0, 6)
      .map((t) => {
        const participant = db.participants.find((p) => p.id === t.participantId);
        return {
          id: t.id,
          ticketNumber: t.ticketNumber,
          ticketType: t.ticketType,
          scannedAt: t.scannedAt,
          scannedBy: t.scannedBy,
          participantName: participant ? `${participant.firstName} ${participant.lastName}` : "Inconnu",
        };
      });

    return {
      totalParticipants,
      totalTickets,
      scannedTickets,
      pendingTickets,
      attendanceRate,
      standardTickets,
      vipTickets,
      recentParticipants,
      recentScans,
    };
  }

  // --- RECHERCHE ET LISTES ---

  public getParticipants(search?: string, ticketType?: string) {
    const db = this.load();
    let result = db.participants;

    if (ticketType && ticketType !== "ALL") {
      result = result.filter((p) => p.ticketType === ticketType);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          (p.email && p.email.toLowerCase().includes(q)) ||
          p.phone.includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q)
      );
    }

    return result.map((p) => {
      const participantTickets = db.tickets.filter((t) => t.participantId === p.id);
      return {
        ...p,
        tickets: participantTickets,
      };
    });
  }

  public getTickets(search?: string, status?: string, ticketType?: string) {
    const db = this.load();
    let result = db.tickets;

    if (status && status !== "ALL") {
      result = result.filter((t) => t.status === status);
    }

    if (ticketType && ticketType !== "ALL") {
      result = result.filter((t) => t.ticketType === ticketType);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((t) => {
        if (t.ticketNumber.toLowerCase().includes(q)) return true;
        const participant = db.participants.find((p) => p.id === t.participantId);
        if (!participant) return false;
        return (
          participant.firstName.toLowerCase().includes(q) ||
          participant.lastName.toLowerCase().includes(q) ||
          (participant.email && participant.email.toLowerCase().includes(q))
        );
      });
    }

    return result.map((t) => {
      const participant = db.participants.find((p) => p.id === t.participantId);
      return {
        ...t,
        participant,
      };
    });
  }

  // --- AUTHENTIFICATION ---

  public authenticate(emailOrUsername: string, password: string): AdminUser | null {
    const db = this.load();
    const clean = emailOrUsername.trim().toLowerCase();
    const user = db.adminUsers.find(
      (u) =>
        (u.email && u.email.toLowerCase() === clean) ||
        (u.username && u.username.toLowerCase() === clean)
    );
    if (!user) return null;

    const valid = verifyPassword(password, user.passwordHash, user.salt);
    if (!valid) return null;

    return user;
  }

  public getAdminUserById(id: string): AdminUser | null {
    const db = this.load();
    return db.adminUsers.find((u) => u.id === id) || null;
  }

  // --- CONTACTS ---

  public addContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): ContactMessage {
    const db = this.load();
    const msg: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      subject: data.subject.trim(),
      message: data.message.trim(),
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
    db.contactMessages.push(msg);
    this.save();
    return msg;
  }
}

export const storage = new StorageEngine();
