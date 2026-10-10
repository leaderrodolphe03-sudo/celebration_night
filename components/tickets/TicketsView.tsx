"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  MapPin,
  Printer,
  Share2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BadgeGenerator from "@/components/ticket/BadgeGenerator";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

interface TicketData {
  ticketNumber: string;
  status: "valid" | "used" | "cancelled";
  qrSvg: string;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  tickets: TicketData[];
}

type State =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: RegistrationData };

const STATUS_LABEL: Record<TicketData["status"], string> = {
  valid: "Valide",
  used: "Déjà utilisé",
  cancelled: "Annulé",
};

/** La cle est lue dans le fragment (#cle=...), jamais envoye au serveur par le navigateur. */
function readKeyFromHash(): string | null {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return params.get("cle");
}

async function svgToPngDataUrl(svg: string, size = 800): Promise<string> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function TicketsView({ justRegistered }: { justRegistered: boolean }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const key = readKeyFromHash();
    if (!key) {
      setState({ kind: "missing" });
      return;
    }
    const res = await fetch("/api/billets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cle: key }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (!res?.ok) {
      setState({ kind: "error", message: data?.error ?? "Impossible de charger vos billets." });
      return;
    }
    setState({ kind: "ready", data });
  }, []);

  useEffect(() => {
    // Lecture du fragment d'URL : uniquement possible cote navigateur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, [load]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href.replace(/[?&]nouveau=1/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadQr = async (ticket: TicketData) => {
    const a = document.createElement("a");
    a.href = await svgToPngDataUrl(ticket.qrSvg);
    a.download = `billet-${ticket.ticketNumber}.png`;
    a.click();
  };

  if (state.kind === "loading") {
    return (
      <p className="py-20 text-center text-muted-foreground" role="status">
        Chargement de vos billets…
      </p>
    );
  }

  if (state.kind === "missing" || state.kind === "error") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <ShieldAlert className="mx-auto size-10 text-primary" aria-hidden />
        <h2 className="mt-4 font-heading text-3xl uppercase tracking-wide">
          {state.kind === "missing" ? "Lien incomplet" : "Billets introuvables"}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {state.kind === "error"
            ? state.message
            : "Pour des raisons de sécurité, vos billets ne s'affichent qu'avec le lien personnel reçu lors de l'inscription."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/mon-billet">Retrouver mes billets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/inscription">M&apos;inscrire</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { data } = state;
  const fullName = `${data.firstName} ${data.lastName}`;
  const plural = data.tickets.length > 1;

  return (
    <div className="space-y-10">
      {justRegistered && (
        <div
          role="status"
          className="rounded-2xl border border-success/40 bg-success/10 p-5 sm:p-6 print:hidden"
        >
          <p className="flex items-center gap-2 font-heading text-3xl uppercase tracking-wide">
            <CheckCircle2 className="size-7 text-success" aria-hidden /> Inscription confirmée
          </p>
          <p className="mt-2 text-foreground/90">
            Merci {data.firstName} !{" "}
            {plural ? `Vos ${data.tickets.length} billets sont prêts.` : "Votre billet est prêt."}{" "}
            Présentez {plural ? "chaque QR code" : "le QR code"} à l&apos;entrée.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5 sm:p-6 print:hidden">
        <p className="font-semibold">Gardez ce lien précieusement</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Il est personnel et donne accès à vos billets. Ajoutez cette page à vos favoris ou
          envoyez-vous le lien. Ne le publiez pas.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={copyLink}>
            <Copy /> {copied ? "Lien copié !" : "Copier mon lien"}
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer /> Imprimer {plural ? "mes billets" : "mon billet"}
          </Button>
        </div>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 print:block">
        {data.tickets.map((ticket, i) => (
          <li
            key={ticket.ticketNumber}
            className="overflow-hidden rounded-3xl border border-primary/40 bg-card print:mb-6 print:break-inside-avoid print:border-black print:bg-white print:text-black"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 print:border-black">
              <div>
                <p className="font-heading text-2xl uppercase tracking-wide text-primary print:text-black">
                  {EVENT.name} {EVENT.edition}
                </p>
                <p className="text-xs text-muted-foreground print:text-black">
                  Billet {i + 1} / {data.tickets.length}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                  ticket.status === "valid" && "border-success/50 text-success",
                  ticket.status === "used" && "border-muted-foreground/50 text-muted-foreground",
                  ticket.status === "cancelled" && "border-destructive/50 text-destructive"
                )}
              >
                {STATUS_LABEL[ticket.status]}
              </span>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <div
                className={cn(
                  "mx-auto w-52 rounded-2xl bg-white p-2 sm:w-44 [&_svg]:h-auto [&_svg]:w-full",
                  ticket.status !== "valid" && "opacity-40"
                )}
                role="img"
                aria-label={`QR code du billet ${ticket.ticketNumber}`}
                // SVG produit par le serveur (bibliotheque qrcode) a partir d'un jeton aleatoire.
                dangerouslySetInnerHTML={{ __html: ticket.qrSvg }}
              />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground print:text-black">
                    Participant
                  </dt>
                  <dd className="font-heading text-2xl uppercase tracking-wide">{fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground print:text-black">
                    Numéro
                  </dt>
                  <dd className="font-mono">{ticket.ticketNumber}</dd>
                </div>
                <div className="flex gap-2">
                  <CalendarDays
                    className="size-4 shrink-0 text-primary print:text-black"
                    aria-hidden
                  />
                  <dd>
                    {EVENT.dateLabel} · {EVENT.timeLabel}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <MapPin className="size-4 shrink-0 text-primary print:text-black" aria-hidden />
                  <dd>
                    {EVENT.venue}, {EVENT.city}
                    {!EVENT.venueConfirmed && " (à confirmer)"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-border px-5 py-4 print:hidden">
              <Button variant="ghost" size="sm" onClick={() => downloadQr(ticket)}>
                <Download /> Télécharger le QR code
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <section
        aria-labelledby="partage"
        className="rounded-3xl border border-border bg-card/60 p-5 sm:p-8 print:hidden"
      >
        <h2
          id="partage"
          className="flex items-center gap-2 font-heading text-3xl uppercase tracking-wide"
        >
          <Share2 className="size-7 text-primary" aria-hidden /> Invite tes proches
        </h2>
        <p className="mt-2 text-muted-foreground">
          Crée ton visuel « J&apos;y serai » avec ta photo et partage-le sur WhatsApp ou Instagram.
          Il ne contient pas ton billet : son QR code invite tes amis à s&apos;inscrire.
        </p>
        <div className="mt-6">
          <BadgeGenerator
            fullName={fullName}
            qrToken={`${window.location.origin}/inscription`}
            showDownloadButton
          />
        </div>
      </section>
    </div>
  );
}
