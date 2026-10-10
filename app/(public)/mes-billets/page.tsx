import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { TicketsView } from "@/components/tickets/TicketsView";

export const metadata: Metadata = {
  title: "Mes billets",
  robots: { index: false, follow: false },
  // La cle des billets est dans le fragment d'URL : on n'envoie aucun referent.
  referrer: "no-referrer",
};

export default async function MyTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ nouveau?: string }>;
}) {
  const { nouveau } = await searchParams;
  return (
    <>
      <div className="print:hidden">
        <PageHeader eyebrow="Billetterie" title="Mes billets" />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 print:p-0">
        <TicketsView justRegistered={nouveau === "1"} />
      </div>
    </>
  );
}
