"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const field =
  "mt-1.5 block w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

export function RecoverForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const res = await fetch("/api/billets/retrouver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, lastName }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setPending(false);
    if (!res?.ok || !data?.cle) {
      setError(data?.error ?? "Impossible de retrouver vos billets. Vérifiez votre connexion.");
      return;
    }
    router.push(`/mes-billets#cle=${data.cle}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="recover-phone" className="text-sm font-medium">
          Téléphone utilisé à l&apos;inscription
        </label>
        <input
          id="recover-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+229 …"
          className={field}
        />
      </div>
      <div>
        <label htmlFor="recover-name" className="text-sm font-medium">
          Nom de famille
        </label>
        <input
          id="recover-name"
          autoComplete="family-name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={field}
        />
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        <Search /> {pending ? "Recherche…" : "Retrouver mes billets"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Pour votre sécurité, un nouveau lien personnel est créé : l&apos;ancien lien ne fonctionnera
        plus.
      </p>
    </form>
  );
}
