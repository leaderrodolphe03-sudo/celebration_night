import { getSupabaseServerClient, isSupabaseConfigured } from "../supabase";
import { generateSecureQrToken, hashPassword } from "../crypto-security";
import {
  Participant,
  Ticket,
  ScanResult,
  TicketType,
  TicketStatus,
  AdminUser,
  AdminRole,
} from "../types";

export class SupabaseStorage {
  /**
   * Créer une inscription individuelle (1 personne = 1 billet)
   */
  async createRegistration(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
    country: string;
    city: string;
    ticketType: TicketType;
    source?: string | null;
  }): Promise<{ participant: Participant; ticket: Ticket; isExisting?: boolean }> {
    const supabase = getSupabaseServerClient();
    const cleanPhone = data.phone.trim();
    const cleanEmail = data.email?.trim().toLowerCase() || null;

    // 1. Vérification de l'unicité stricte sur le numéro de téléphone
    const { data: existingParticipant } = await supabase
      .from("participants")
      .select("*, tickets(*)")
      .eq("phone", cleanPhone)
      .maybeSingle();

    if (existingParticipant) {
      const primaryTicket = existingParticipant.tickets?.[0];
      return {
        participant: {
          id: existingParticipant.id,
          firstName: existingParticipant.first_name,
          lastName: existingParticipant.last_name,
          phone: existingParticipant.phone,
          email: existingParticipant.email,
          country: existingParticipant.country,
          city: existingParticipant.city,
          ticketType: existingParticipant.ticket_type as TicketType,
          source: existingParticipant.source,
          gaveLifeToJesus: existingParticipant.gave_life_to_jesus,
          createdAt: existingParticipant.created_at,
          updatedAt: existingParticipant.updated_at,
        },
        ticket: primaryTicket
          ? {
              id: primaryTicket.id,
              ticketNumber: primaryTicket.ticket_number,
              qrToken: primaryTicket.qr_token,
              ticketType: primaryTicket.ticket_type as TicketType,
              status: primaryTicket.status as TicketStatus,
              scannedAt: primaryTicket.scanned_at,
              scannedBy: primaryTicket.scanned_by,
              participantId: primaryTicket.participant_id,
              createdAt: primaryTicket.created_at,
              updatedAt: primaryTicket.updated_at,
            }
          : ({} as any),
        isExisting: true,
      };
    }

    // 2. Création du nouveau participant
    const { data: newParticipant, error: pError } = await supabase
      .from("participants")
      .insert({
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        country: data.country.trim() || "Bénin",
        city: data.city.trim() || "Cotonou",
        ticket_type: data.ticketType,
        source: data.source?.trim() || null,
        gave_life_to_jesus: false,
      })
      .select()
      .single();

    if (pError || !newParticipant) {
      console.error("Erreur insertion participant Supabase:", pError);
      const detail = pError?.message ? ` (${pError.message})` : "";
      throw new Error(`Impossible d'enregistrer le participant dans la base de données.${detail}`);
    }

    // 3. Détermination du numéro de billet séquentiel
    const { count } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true });

    const sequenceNum = (count || 0) + 1;
    const ticketNumber = `CN-2026-${String(sequenceNum).padStart(6, "0")}`;
    const qrToken = generateSecureQrToken();

    // 4. Création du billet unique
    const { data: newTicket, error: tError } = await supabase
      .from("tickets")
      .insert({
        ticket_number: ticketNumber,
        qr_token: qrToken,
        ticket_type: data.ticketType,
        status: "VALID",
        participant_id: newParticipant.id,
      })
      .select()
      .single();

    if (tError || !newTicket) {
      console.error("Erreur insertion ticket Supabase:", tError);
      const detail = tError?.message ? ` (${tError.message})` : "";
      throw new Error(`Impossible de générer le billet officiel.${detail}`);
    }

    return {
      participant: {
        id: newParticipant.id,
        firstName: newParticipant.first_name,
        lastName: newParticipant.last_name,
        phone: newParticipant.phone,
        email: newParticipant.email,
        country: newParticipant.country,
        city: newParticipant.city,
        ticketType: newParticipant.ticket_type as TicketType,
        source: newParticipant.source,
        gaveLifeToJesus: newParticipant.gave_life_to_jesus,
        createdAt: newParticipant.created_at,
        updatedAt: newParticipant.updated_at,
      },
      ticket: {
        id: newTicket.id,
        ticketNumber: newTicket.ticket_number,
        qrToken: newTicket.qr_token,
        ticketType: newTicket.ticket_type as TicketType,
        status: newTicket.status as TicketStatus,
        scannedAt: newTicket.scanned_at,
        scannedBy: newTicket.scanned_by,
        participantId: newTicket.participant_id,
        createdAt: newTicket.created_at,
        updatedAt: newTicket.updated_at,
      },
      isExisting: false,
    };
  }

  /**
   * Récupérer un billet par son numéro officiel (ex: CN-2026-000001)
   */
  async getTicketByNumber(ticketNumber: string): Promise<{ ticket: Ticket; participant: Participant } | null> {
    const supabase = getSupabaseServerClient();
    const cleanNumber = ticketNumber.trim().toUpperCase();

    const { data: t, error } = await supabase
      .from("tickets")
      .select("*, participants(*)")
      .eq("ticket_number", cleanNumber)
      .maybeSingle();

    if (error || !t || !t.participants) return null;

    const p = t.participants;
    return {
      ticket: {
        id: t.id,
        ticketNumber: t.ticket_number,
        qrToken: t.qr_token,
        ticketType: t.ticket_type,
        status: t.status,
        scannedAt: t.scanned_at,
        scannedBy: t.scanned_by,
        participantId: t.participant_id,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      },
      participant: {
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        phone: p.phone,
        email: p.email,
        country: p.country,
        city: p.city,
        ticketType: p.ticket_type,
        source: p.source,
        gaveLifeToJesus: p.gave_life_to_jesus,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      },
    };
  }

  /**
   * Récupérer un billet par son QR Token
   */
  async getTicketByToken(qrToken: string): Promise<{ ticket: Ticket; participant: Participant } | null> {
    const supabase = getSupabaseServerClient();
    const cleanToken = qrToken.trim();

    const { data: t, error } = await supabase
      .from("tickets")
      .select("*, participants(*)")
      .eq("qr_token", cleanToken)
      .maybeSingle();

    if (error || !t || !t.participants) return null;

    const p = t.participants;
    return {
      ticket: {
        id: t.id,
        ticketNumber: t.ticket_number,
        qrToken: t.qr_token,
        ticketType: t.ticket_type,
        status: t.status,
        scannedAt: t.scanned_at,
        scannedBy: t.scanned_by,
        participantId: t.participant_id,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      },
      participant: {
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        phone: p.phone,
        email: p.email,
        country: p.country,
        city: p.city,
        ticketType: p.ticket_type,
        source: p.source,
        gaveLifeToJesus: p.gave_life_to_jesus,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      },
    };
  }

  /**
   * Recherche par téléphone ou email
   */
  async findTicketsByPhoneOrEmail(query: string): Promise<{ participant: Participant; tickets: Ticket[] }[]> {
    const supabase = getSupabaseServerClient();
    const clean = query.trim();

    let qb = supabase.from("participants").select("*, tickets(*)");
    if (clean.includes("@")) {
      qb = qb.ilike("email", clean.toLowerCase());
    } else {
      qb = qb.ilike("phone", `%${clean}%`);
    }

    const { data, error } = await qb;
    if (error || !data) return [];

    return data.map((p) => ({
      participant: {
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        phone: p.phone,
        email: p.email,
        country: p.country,
        city: p.city,
        ticketType: p.ticket_type,
        source: p.source,
        gaveLifeToJesus: p.gave_life_to_jesus,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      },
      tickets: (p.tickets || []).map((t: any) => ({
        id: t.id,
        ticketNumber: t.ticket_number,
        qrToken: t.qr_token,
        ticketType: t.ticket_type,
        status: t.status,
        scannedAt: t.scanned_at,
        scannedBy: t.scanned_by,
        participantId: t.participant_id,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })),
    }));
  }

  /**
   * Scannage de billet : Supporte le mode Entrée standard et le mode "Âmes pour Christ"
   */
  async scanTicket(
    tokenOrNumber: string,
    mode: "ENTRY" | "GAVE_LIFE" = "ENTRY",
    scannedBy: string = "Admin"
  ): Promise<ScanResult> {
    const supabase = getSupabaseServerClient();
    const clean = tokenOrNumber.trim();

    // Recherche par token ou numéro
    const { data: t, error } = await supabase
      .from("tickets")
      .select("*, participants(*)")
      .or(`qr_token.eq.${clean},ticket_number.eq.${clean.toUpperCase()}`)
      .maybeSingle();

    if (error || !t || !t.participants) {
      return {
        status: "INVALID",
        message: "Code invalide. Aucun billet correspondant trouvé.",
        mode,
      };
    }

    const p = t.participants;

    // --- MODE 1 : ÂMES POUR CHRIST (DONNER SA VIE À JÉSUS) ---
    if (mode === "GAVE_LIFE") {
      const { error: updateError } = await supabase
        .from("participants")
        .update({ gave_life_to_jesus: true, updated_at: new Date().toISOString() })
        .eq("id", p.id);

      if (updateError) {
        console.error("Erreur mise à jour gave_life_to_jesus:", updateError);
        return {
          status: "INVALID",
          message: "Erreur lors de l'enregistrement de la décision pour Christ.",
          mode,
        };
      }

      return {
        status: "GAVE_LIFE_SAVED",
        message: `Gloire à Dieu ! Décision pour Christ enregistrée pour ${p.first_name} ${p.last_name}.`,
        mode: "GAVE_LIFE",
        ticket: {
          id: t.id,
          ticketNumber: t.ticket_number,
          ticketType: t.ticket_type,
          status: t.status,
          scannedAt: t.scanned_at,
          scannedBy: t.scanned_by,
        },
        participant: {
          firstName: p.first_name,
          lastName: p.last_name,
          phone: p.phone,
          email: p.email,
          city: p.city,
          country: p.country,
          gaveLifeToJesus: true,
        },
      };
    }

    // --- MODE 2 : ENTRÉE STANDARD ---
    if (t.status === "USED") {
      return {
        status: "ALREADY_USED",
        message: `Billet DÉJÀ UTILISÉ le ${new Date(t.scanned_at).toLocaleTimeString("fr-FR")} par ${t.scanned_by || "Accueil"}.`,
        mode: "ENTRY",
        previousScanAt: t.scanned_at,
        previousScannedBy: t.scanned_by,
        ticket: {
          id: t.id,
          ticketNumber: t.ticket_number,
          ticketType: t.ticket_type,
          status: t.status,
          scannedAt: t.scanned_at,
          scannedBy: t.scanned_by,
        },
        participant: {
          firstName: p.first_name,
          lastName: p.last_name,
          phone: p.phone,
          email: p.email,
          city: p.city,
          country: p.country,
          gaveLifeToJesus: p.gave_life_to_jesus,
        },
      };
    }

    if (t.status === "CANCELLED") {
      return {
        status: "INVALID",
        message: "Ce billet a été annulé.",
        mode: "ENTRY",
      };
    }

    const now = new Date().toISOString();
    await supabase
      .from("tickets")
      .update({
        status: "USED",
        scanned_at: now,
        scanned_by: scannedBy,
        updated_at: now,
      })
      .eq("id", t.id);

    return {
      status: "VALID",
      message: `Accès autorisé ! Bienvenue ${p.first_name} ${p.last_name}.`,
      mode: "ENTRY",
      scannedAt: now,
      ticket: {
        id: t.id,
        ticketNumber: t.ticket_number,
        ticketType: t.ticket_type,
        status: "USED",
        scannedAt: now,
        scannedBy,
      },
      participant: {
        firstName: p.first_name,
        lastName: p.last_name,
        phone: p.phone,
        email: p.email,
        city: p.city,
        country: p.country,
        gaveLifeToJesus: p.gave_life_to_jesus,
      },
    };
  }

  /**
   * Récupérer les statistiques du Dashboard
   */
  async getDashboardStats() {
    const supabase = getSupabaseServerClient();

    const [
      { count: totalParticipants },
      { count: totalTickets },
      { count: scannedTickets },
      { count: standardTickets },
      { count: vipTickets },
      { count: gaveLifeCount },
      { data: recentParticipants },
      { data: recentScans },
    ] = await Promise.all([
      supabase.from("participants").select("*", { count: "exact", head: true }),
      supabase.from("tickets").select("*", { count: "exact", head: true }),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "USED"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("ticket_type", "STANDARD"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("ticket_type", "VIP"),
      supabase.from("participants").select("*", { count: "exact", head: true }).eq("gave_life_to_jesus", true),
      supabase
        .from("participants")
        .select("*, tickets(*)")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("tickets")
        .select("*, participants(*)")
        .eq("status", "USED")
        .order("scanned_at", { ascending: false })
        .limit(6),
    ]);

    const total = totalTickets || 0;
    const scanned = scannedTickets || 0;
    const attendanceRate = total > 0 ? Math.round((scanned / total) * 100) : 0;

    return {
      totalParticipants: totalParticipants || 0,
      totalTickets: total,
      scannedTickets: scanned,
      pendingTickets: total - scanned,
      attendanceRate,
      standardTickets: standardTickets || 0,
      vipTickets: vipTickets || 0,
      gaveLifeCount: gaveLifeCount || 0,
      recentParticipants: (recentParticipants || []).map((p) => ({
        ...p,
        gaveLifeToJesus: p.gave_life_to_jesus,
      })),
      recentScans: (recentScans || []).map((s) => ({
        ...s,
        participant: s.participants,
      })),
    };
  }

  /**
   * Lister les participants avec support de l'onglet « Âmes pour Christ »
   */
  async getParticipants(options: {
    search?: string;
    ticketType?: string;
    onlyGaveLife?: boolean;
  }) {
    const supabase = getSupabaseServerClient();
    let qb = supabase
      .from("participants")
      .select("*, tickets(*)")
      .order("created_at", { ascending: false });

    if (options.onlyGaveLife) {
      qb = qb.eq("gave_life_to_jesus", true);
    }

    if (options.ticketType && options.ticketType !== "ALL") {
      qb = qb.eq("ticket_type", options.ticketType);
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim();
      qb = qb.or(
        `first_name.ilike.%${q}%,last_name.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%`
      );
    }

    const { data, error } = await qb;
    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id,
      firstName: p.first_name,
      lastName: p.last_name,
      phone: p.phone,
      email: p.email,
      country: p.country,
      city: p.city,
      ticketType: p.ticket_type as TicketType,
      source: p.source,
      gaveLifeToJesus: p.gave_life_to_jesus,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      tickets: (p.tickets || []).map((t: any) => ({
        id: t.id,
        ticketNumber: t.ticket_number,
        qrToken: t.qr_token,
        ticketType: t.ticket_type as TicketType,
        status: t.status as TicketStatus,
        scannedAt: t.scanned_at,
        scannedBy: t.scanned_by,
        participantId: t.participant_id,
        createdAt: t.created_at,
      })),
    }));
  }

  /**
   * Lister les billets avec filtres
   */
  async getTickets(options: {
    search?: string;
    status?: string;
    ticketType?: string;
  }) {
    const supabase = getSupabaseServerClient();
    let qb = supabase
      .from("tickets")
      .select("*, participants(*)")
      .order("created_at", { ascending: false });

    if (options.status && options.status !== "ALL") {
      qb = qb.eq("status", options.status);
    }

    if (options.ticketType && options.ticketType !== "ALL") {
      qb = qb.eq("ticket_type", options.ticketType);
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim();
      qb = qb.ilike("ticket_number", `%${q}%`);
    }

    const { data, error } = await qb;
    if (error || !data) return [];

    return data.map((t) => ({
      id: t.id,
      ticketNumber: t.ticket_number,
      qrToken: t.qr_token,
      ticketType: t.ticket_type,
      status: t.status,
      scannedAt: t.scanned_at,
      scannedBy: t.scanned_by,
      participantId: t.participant_id,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      participant: t.participants
        ? {
            firstName: t.participants.first_name,
            lastName: t.participants.last_name,
            phone: t.participants.phone,
            email: t.participants.email,
            city: t.participants.city,
            country: t.participants.country,
            gaveLifeToJesus: t.participants.gave_life_to_jesus,
          }
        : undefined,
    }));
  }

  /**
   * Récupérer un administrateur ou staff par son identifiant court ou son email
   */
  async getAdminByUsernameOrEmail(identifier: string): Promise<AdminUser | null> {
    const supabase = getSupabaseServerClient();
    const clean = identifier.trim().toLowerCase();

    // Recherche insensible à la casse sur username OU email
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .or(`username.ilike.${clean},email.ilike.${clean}`)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      name: data.name,
      passwordHash: data.password_hash,
      salt: data.salt,
      role: data.role as AdminRole,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Créer un nouvel utilisateur administrateur ou staff auxiliaire
   */
  async createAdminUser(data: {
    username: string;
    name: string;
    password: string;
    role?: AdminRole;
    email?: string | null;
  }): Promise<Omit<AdminUser, "passwordHash" | "salt">> {
    const supabase = getSupabaseServerClient();
    const cleanUsername = data.username.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanEmail = data.email?.trim().toLowerCase() || null;
    const role: AdminRole = data.role === "ADMIN" ? "ADMIN" : "STAFF";

    // Vérifier l'unicité de l'identifiant
    const existing = await this.getAdminByUsernameOrEmail(cleanUsername);
    if (existing) {
      throw new Error(`L'identifiant '${cleanUsername}' est déjà utilisé.`);
    }

    // Hachage cryptographique du mot de passe avec scrypt
    const { hash, salt } = hashPassword(data.password);

    const { data: newUser, error } = await supabase
      .from("admin_users")
      .insert({
        username: cleanUsername,
        name: cleanName,
        email: cleanEmail,
        password_hash: hash,
        salt,
        role,
      })
      .select("id, username, email, name, role, created_at, updated_at")
      .single();

    if (error || !newUser) {
      console.error("Erreur création admin_user:", error);
      throw new Error(`Impossible de créer le compte utilisateur: ${error?.message || "erreur inconnue"}`);
    }

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as AdminRole,
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at,
    };
  }

  /**
   * Lister tous les utilisateurs administratifs et staff
   */
  async listAdminUsers(): Promise<Omit<AdminUser, "passwordHash" | "salt">[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, email, name, role, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Erreur récupération admin_users:", error);
      return [];
    }

    return data.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      name: u.name,
      role: u.role as AdminRole,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
    }));
  }

  /**
   * Supprimer un utilisateur administratif ou staff par son ID
   */
  async deleteAdminUser(id: string): Promise<boolean> {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur suppression admin_user:", error);
      throw new Error(`Impossible de supprimer le compte: ${error.message}`);
    }

    return true;
  }
}

export const supabaseStorage = new SupabaseStorage();

