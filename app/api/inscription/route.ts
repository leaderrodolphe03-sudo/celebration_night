import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { CapacityReachedError, registrations } from "@/lib/registrations";
import { RegistrationSchema } from "@/lib/validation/registration";

export async function POST(req: NextRequest) {
  if (!rateLimit(`inscription:${clientIp(req.headers)}`, 10, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  const parsed = RegistrationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Veuillez vérifier les informations saisies.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { firstName, lastName, phone, email, city, seats, heardFrom, website } = parsed.data;
  const input = { firstName, lastName, phone, email, city, seats, heardFrom };
  if (website) {
    return NextResponse.json({ error: "Requête refusée." }, { status: 400 });
  }

  try {
    const { accessKey, ticketNumbers } = await registrations.create(input);
    return NextResponse.json(
      { cle: accessKey, ticketNumbers },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof CapacityReachedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Erreur API inscription:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}
