import type { Metadata } from "next";
import Link from "next/link";
import { RecoverForm } from "@/components/forms/RecoverForm";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = {
  title: "Retrouver mes billets",
  robots: { index: false },
};

export default function RecoverPage() {
  return (
    <>
      <PageHeader
        eyebrow="Billetterie"
        title="Retrouver mes billets"
        intro="Vous avez perdu le lien de vos billets ? Indiquez le téléphone et le nom utilisés lors de l'inscription."
      />
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
          <RecoverForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore inscrit ?{" "}
          <Link href="/inscription" className="font-semibold text-primary hover:underline">
            Je m&apos;inscris
          </Link>
        </p>
      </div>
    </>
  );
}
