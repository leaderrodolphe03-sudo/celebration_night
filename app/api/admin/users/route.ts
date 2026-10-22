import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth-session";
import { supabaseStorage } from "@/lib/db/supabase-storage";

const CreateUserSchema = z.object({
  username: z
    .string()
    .min(2, "L'identifiant doit comporter au moins 2 caractères.")
    .max(30, "L'identifiant ne peut dépasser 30 caractères.")
    .regex(/^[a-zA-Z0-9_-]+$/, "L'identifiant ne peut contenir que des lettres, chiffres, tirets et underscores."),
  name: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .max(60, "Le nom ne peut dépasser 60 caractères."),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères.")
    .max(100),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide.")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
    }

    const users = await supabaseStorage.listAdminUsers();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Erreur listing admin_users:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la récupération des utilisateurs." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateUserSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstErrorMessage = Object.values(fieldErrors).flat()[0] || "Données invalides.";
      return NextResponse.json({ error: firstErrorMessage, details: fieldErrors }, { status: 400 });
    }

    const data = parsed.data;
    const newUser = await supabaseStorage.createAdminUser({
      username: data.username,
      name: data.name,
      password: data.password,
      role: data.role,
      email: data.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Compte ${data.role === "ADMIN" ? "Admin" : "Staff"} '${data.username}' créé avec succès.`,
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur création utilisateur:", error);
    const isConflict = error?.message?.includes("déjà utilisé");
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la création de l'utilisateur." },
      { status: isConflict ? 409 : 500 }
    );
  }
}
