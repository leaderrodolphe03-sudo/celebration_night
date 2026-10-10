import "server-only";
import fs from "node:fs";
import path from "node:path";

export interface EditionPhoto {
  src: string;
  alt: string;
}

const PHOTO_EXT = /\.(jpe?g|png|webp|avif)$/i;

/**
 * Photos d'une edition, lues dans public/media/editions/<annee>/.
 * Deposer un fichier dans ce dossier suffit pour qu'il apparaisse sur le site
 * (apres un nouveau deploiement). La description vient de legendes.json
 * (nom du fichier -> texte) ; a defaut, du nom du fichier :
 * « 03-chantre-en-adoration.jpg » -> « Chantre en adoration ».
 */
export function getEditionPhotos(year: number): EditionPhoto[] {
  const dir = path.join(process.cwd(), "public", "media", "editions", String(year));
  let files: string[];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  let captions: Record<string, string> = {};
  try {
    captions = JSON.parse(fs.readFileSync(path.join(dir, "legendes.json"), "utf8"));
  } catch {
    // Pas de fichier de legendes : on se rabat sur le nom des fichiers.
  }
  return files
    .filter((f) => PHOTO_EXT.test(f))
    .sort((a, b) => a.localeCompare(b, "fr", { numeric: true }))
    .map((file) => {
      const label = file
        .replace(PHOTO_EXT, "")
        .replace(/^\d+[-_ ]*/, "")
        .replace(/[-_]+/g, " ")
        .trim();
      return {
        src: `/media/editions/${year}/${file}`,
        alt:
          captions[file] ||
          (label
            ? label.charAt(0).toUpperCase() + label.slice(1)
            : `Photo de CELEBRATION NIGHT ${year}`),
      };
    });
}
