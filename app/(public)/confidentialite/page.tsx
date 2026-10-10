import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";

export const metadata: Metadata = { title: "Politique de confidentialité" };

const h2 = "font-heading text-3xl uppercase tracking-wide";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vos données"
        title="Confidentialité"
        intro="Nous collectons le strict nécessaire pour organiser la soirée et vous accueillir."
      />
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-16 leading-relaxed text-foreground/90 sm:px-6">
        <section>
          <h2 className={h2}>Données collectées</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Inscription :</strong> nom, prénom, téléphone, email (facultatif), ville,
              nombre de places et la manière dont vous avez connu l&apos;événement.
            </li>
            <li>
              <strong>Contact :</strong> nom, email ou téléphone, objet et message.
            </li>
          </ul>
        </section>
        <section>
          <h2 className={h2}>Utilisation</h2>
          <p className="mt-3">
            Ces données servent uniquement à gérer votre inscription, à générer votre billet, à
            contrôler l&apos;accès le jour de l&apos;événement, à établir des statistiques de
            participation et à vous répondre. Elles ne sont ni vendues ni cédées à des tiers.
          </p>
        </section>
        <section>
          <h2 className={h2}>Billet et QR code</h2>
          <p className="mt-3">
            Le QR code de votre billet ne contient aucune donnée personnelle : seulement un code
            aléatoire que notre équipe d&apos;accueil vérifie à l&apos;entrée.
          </p>
        </section>
        <section>
          <h2 className={h2}>Accès et sécurité</h2>
          <p className="mt-3">
            Seuls les membres autorisés de l&apos;équipe d&apos;organisation accèdent aux données,
            selon leur rôle. L&apos;équipe d&apos;accueil ne voit que les informations nécessaires à
            la vérification des billets.
          </p>
        </section>
        <section>
          <h2 className={h2}>Durée de conservation</h2>
          <p className="mt-3 text-muted-foreground">
            À définir par l&apos;organisation ; les données ne seront pas conservées au-delà de ce
            qui est nécessaire à l&apos;organisation de l&apos;événement.
          </p>
        </section>
        <section>
          <h2 className={h2}>Vos droits</h2>
          <p className="mt-3">
            Conformément au Code du numérique de la République du Bénin, vous pouvez demander
            l&apos;accès, la rectification ou la suppression de vos données en écrivant à
            l&apos;organisation via la{" "}
            <a href="/contact" className="text-primary underline">
              page contact
            </a>
            . Vous pouvez également saisir l&apos;Autorité de Protection des Données à caractère
            Personnel (APDP).
          </p>
        </section>
      </div>
    </>
  );
}
