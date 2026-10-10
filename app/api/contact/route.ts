import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/db/storage";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { ContactSchema } from "@/lib/validation/contact";

export async function POST(req: NextRequest) {
  if (!rateLimit(`contact:${clientIp(req.headers)}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez plus tard." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Veuillez vérifier les informations saisies.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { website, ...data } = parsed.data;
  if (website) {
    // Robot : on repond comme si tout allait bien, sans rien enregistrer.
    return NextResponse.json({ success: true });
  }

  try {
    storage.addContactMessage({ ...data, phone: data.phone || undefined });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}
