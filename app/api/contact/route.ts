import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storage } from "@/lib/db/storage";

const ContactSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(3, "L'objet est requis"),
  message: z.string().min(10, "Le message doit comporter au moins 10 caractères"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Veuillez vérifier les informations saisies.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    storage.addContactMessage(parsed.data);

    return NextResponse.json({
      success: true,
      message: "Votre message a bien été envoyé. L'équipe HAGIAZO vous répondra sous peu.",
    });
  } catch (error) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}
