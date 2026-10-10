"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_SUBJECTS, ContactSchema, type ContactInput } from "@/lib/validation/contact";
import { cn } from "@/lib/utils/cn";

const field =
  "mt-1.5 block w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive">
      {message}
    </p>
  );
}

export function ContactForm({ defaultSubject }: { defaultSubject?: ContactInput["subject"] }) {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: defaultSubject ?? "Renseignement",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => null);
    if (res?.ok) {
      setStatus("sent");
      reset();
      return;
    }
    const data = await res?.json().catch(() => null);
    setServerError(
      data?.error ?? "Impossible d'envoyer le message. Vérifiez votre connexion et réessayez."
    );
    setStatus("error");
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-success/40 bg-success/10 p-6">
        <CheckCircle2 className="size-8 text-success" aria-hidden />
        <p className="mt-3 font-heading text-3xl uppercase tracking-wide">Message envoyé</p>
        <p className="mt-2 text-muted-foreground">
          Merci ! L&apos;équipe d&apos;organisation vous répondra dès que possible.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => setStatus("idle")}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Nom complet{" "}
          <span aria-hidden className="text-primary">
            *
          </span>
        </label>
        <input
          id="name"
          autoComplete="name"
          className={field}
          aria-invalid={!!errors.name}
          aria-describedby="name-err"
          {...register("name")}
        />
        <FieldError id="name-err" message={errors.name?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Téléphone / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+229 …"
            className={field}
            aria-invalid={!!errors.phone}
            aria-describedby="phone-err"
            {...register("phone")}
          />
          <FieldError id="phone-err" message={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={field}
            aria-invalid={!!errors.email}
            aria-describedby="email-err"
            {...register("email")}
          />
          <FieldError id="email-err" message={errors.email?.message} />
        </div>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">Un email ou un téléphone suffit.</p>

      <div>
        <label htmlFor="subject" className="text-sm font-medium">
          Objet
        </label>
        <select id="subject" className={cn(field, "appearance-none")} {...register("subject")}>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Message{" "}
          <span aria-hidden className="text-primary">
            *
          </span>
        </label>
        <textarea
          id="message"
          rows={6}
          className={field}
          aria-invalid={!!errors.message}
          aria-describedby="message-err"
          {...register("message")}
        />
        <FieldError id="message-err" message={errors.message?.message} />
      </div>

      {/* Champ piege pour les robots, invisible pour les humains et les lecteurs d'ecran. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          {serverError}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Vos coordonnées servent uniquement à vous répondre. Voir la{" "}
        <a href="/confidentialite" className="underline hover:text-foreground">
          politique de confidentialité
        </a>
        .
      </p>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        <Send /> {isSubmitting ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
