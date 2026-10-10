import { permanentRedirect } from "next/navigation";

// Ancienne page de billet accessible par simple numero (faille : les numeros
// se suivent). Les billets s'affichent desormais sur /mes-billets avec une cle.
export default function LegacyTicketPage() {
  permanentRedirect("/mon-billet");
}
