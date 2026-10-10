"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HEARD_FROM,
  RegistrationSchema,
  type RegistrationInput,
} from "@/lib/validation/registration";
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

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}{" "}
      {required && (
        <span aria-hidden className="text-primary">
          *
        </span>
      )}
    </label>
  );
}

export function RegistrationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      city: "",
      seats: 1,
      heardFrom: "Mon église",
      website: "",
    },
  });
  const seats = Number(useWatch({ control, name: "seats" })) || 1;

  const onSubmit = async (values: RegistrationInput) => {
    setServerError("");
    const res = await fetch("/api/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (!res?.ok || !data?.primaryTicket) {
      setServerError(
        data?.error ??
          "Impossible d'enregistrer l'inscription. Vérifiez votre connexion et réessayez."
      );
      return;
    }
    const params = new URLSearchParams({
      ticketNumber: data.primaryTicket.ticketNumber,
      name: `${values.firstName} ${values.lastName}`,
      count: String(values.seats),
    });
    router.push(`/confirmation?${params}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName" required>
            Prénom
          </Label>
          <input
            id="firstName"
            autoComplete="given-name"
            className={field}
            aria-invalid={!!errors.firstName}
            aria-describedby="firstName-err"
            {...register("firstName")}
          />
          <FieldError id="firstName-err" message={errors.firstName?.message} />
        </div>
        <div>
          <Label htmlFor="lastName" required>
            Nom
          </Label>
          <input
            id="lastName"
            autoComplete="family-name"
            className={field}
            aria-invalid={!!errors.lastName}
            aria-describedby="lastName-err"
            {...register("lastName")}
          />
          <FieldError id="lastName-err" message={errors.lastName?.message} />
        </div>
        <div>
          <Label htmlFor="phone" required>
            Téléphone / WhatsApp
          </Label>
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
          <Label htmlFor="email">Email (facultatif)</Label>
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
        <div>
          <Label htmlFor="city" required>
            Ville / quartier
          </Label>
          <input
            id="city"
            autoComplete="address-level2"
            className={field}
            aria-invalid={!!errors.city}
            aria-describedby="city-err"
            {...register("city")}
          />
          <FieldError id="city-err" message={errors.city?.message} />
        </div>
        <div>
          <Label htmlFor="heardFrom">Comment avez-vous connu l&apos;événement ?</Label>
          <select
            id="heardFrom"
            className={cn(field, "appearance-none")}
            {...register("heardFrom")}
          >
            {HEARD_FROM.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Nombre de places</legend>
        <div className="mt-2 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="Retirer une place"
            disabled={seats <= 1}
            onClick={() => setValue("seats", seats - 1, { shouldValidate: true })}
          >
            <Minus />
          </Button>
          <output
            aria-live="polite"
            className="min-w-16 text-center font-heading text-4xl text-primary"
          >
            {seats}
          </output>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="Ajouter une place"
            disabled={seats >= 10}
            onClick={() => setValue("seats", seats + 1, { shouldValidate: true })}
          >
            <Plus />
          </Button>
          <span className="text-sm text-muted-foreground">
            Un billet avec QR code par place, 10 au maximum.
          </span>
        </div>
        <FieldError id="seats-err" message={errors.seats?.message} />
      </fieldset>

      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-1 size-5 shrink-0 accent-[hsl(var(--primary))]"
            aria-invalid={!!errors.consent}
            aria-describedby="consent-err"
            {...register("consent")}
          />
          <span>
            J&apos;accepte que mes informations soient utilisées par l&apos;organisation de
            CELEBRATION NIGHT pour gérer mon inscription et l&apos;accès à l&apos;événement (
            <a href="/confidentialite" className="text-primary underline">
              politique de confidentialité
            </a>
            ).
          </span>
        </label>
        <FieldError id="consent-err" message={errors.consent?.message} />
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Inscription en cours…" : "Confirmer mon inscription"} <ArrowRight />
      </Button>
    </form>
  );
}
