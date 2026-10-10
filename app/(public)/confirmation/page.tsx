import { permanentRedirect } from "next/navigation";

// Ancienne page de confirmation : les billets s'affichent desormais sur
// /mes-billets, avec la cle personnelle dans le fragment d'URL.
export default function LegacyConfirmationPage() {
  permanentRedirect("/mon-billet");
}
