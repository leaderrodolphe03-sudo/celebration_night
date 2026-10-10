import { permanentRedirect } from "next/navigation";

// Ancienne adresse conservee pour les liens deja partages.
export default function LegacyPage() {
  permanentRedirect("/intervenants");
}
