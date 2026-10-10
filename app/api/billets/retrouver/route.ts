import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { registrations } from "@/lib/registrations";

const RecoverSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ().-]{8,20}$/, "Numéro de téléphone invalide."),
  lastName: z.string().trim().min(2, "Indiquez votre nom.").max(60),
});

// Retrouve une inscription par telephone + nom et genere un NOUVEAU lien.
// Reponse identique que l'inscription existe ou non (pas d'enumeration),
// sauf pour la cle, renvoyee uniquement en cas de correspondance.
export async function POST(req: NextRequest) {
  if (!rateLimit(`retrouver:${clientIp(req.headers)}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans 15 minutes." },
      { status: 429 }
    );
  }

  const parsed = RecoverSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Veuillez vérifier les informations saisies.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const key = await registrations.recover(parsed.data.phone, parsed.data.lastName);
    if (!key) {
      return NextResponse.json(
        { error: "Aucune inscription ne correspond à ce téléphone et à ce nom." },
        { status: 404 }
      );
    }
    return NextResponse.json({ cle: key }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Erreur API retrouver:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
