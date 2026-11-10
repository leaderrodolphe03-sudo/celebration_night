import QRCode from "qrcode";

export interface BadgeData {
  fullName: string;
  ticketNumber?: string;
  qrToken?: string;
  photoUrl?: string | null;
  dateLabel?: string;
  venueLabel?: string;
}

/**
 * Charge une image à partir d'une URL ou d'une dataURL avec gestion d'erreur.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Ne définir crossOrigin que pour les requêtes HTTP/HTTPS distantes.
    // Les Data URLs et chemins locaux ne doivent pas avoir crossOrigin sur Safari WebKit.
    if (src.startsWith("http://") || src.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Impossible de charger l'image: ${src}`));
    img.src = src;
  });
}

/**
 * Dessine un rectangle avec coins arrondis.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Génère le Canvas 2D du badge officiel Celebration Night au format HD 1080x1350.
 */
export async function renderBadgeCanvas(data: BadgeData): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const WIDTH = 1080;
  const HEIGHT = 1350;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Impossible d'initialiser le contexte Canvas 2D.");
  }

  // 1. Fond sombre de base
  ctx.fillStyle = "#120520";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 2. Zone photo du participant (avec 3px de bleed sous les bordures opaques)
  const frameX = 58;
  const frameY = 227;
  const frameW = 487;
  const frameH = 590;
  const radius = 85;

  if (data.photoUrl) {
    try {
      const userImg = await loadImage(data.photoUrl);
      ctx.save();
      roundRect(ctx, frameX, frameY, frameW, frameH, radius);
      ctx.clip();

      // Recadrage 'cover' centré
      const scale = Math.max(frameW / userImg.width, frameH / userImg.height);
      const w = userImg.width * scale;
      const h = userImg.height * scale;
      const x = frameX + (frameW - w) / 2;
      const y = frameY + (frameH - h) / 2;
      ctx.drawImage(userImg, x, y, w, h);
      ctx.restore();
    } catch (err) {
      console.warn("Échec du chargement de la photo participant:", err);
    }
  } else {
    // Fond élégant en dégradé si pas de photo
    const grad = ctx.createLinearGradient(frameX, frameY, frameX + frameW, frameY + frameH);
    grad.addColorStop(0, "#2D0A4E");
    grad.addColorStop(0.5, "#1A0630");
    grad.addColorStop(1, "#0D0218");

    ctx.save();
    roundRect(ctx, frameX, frameY, frameW, frameH, radius);
    ctx.fillStyle = grad;
    ctx.fill();

    // Initiale du participant
    const initial = (data.fullName?.trim()?.[0] || "C").toUpperCase();
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "bold 120px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, frameX + frameW / 2, frameY + frameH / 2 - 20);

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("PARTICIPANT OFFICIEL", frameX + frameW / 2, frameY + frameH / 2 + 60);
    ctx.restore();
  }

  // 3. Dessiner le template officiel du badge par-dessus (détouré sur la zone photo)
  try {
    const fgImg = await loadImage("/images/badge_template_2026.png");
    ctx.drawImage(fgImg, 0, 0, WIDTH, HEIGHT);
  } catch (err) {
    console.warn("Échec du chargement du template officiel, essai du fallback:", err);
    try {
      const fallbackImg = await loadImage("/images/badge_foreground.png");
      ctx.drawImage(fallbackImg, 0, 0, WIDTH, HEIGHT);
    } catch (fallbackErr) {
      console.error("Échec du chargement du fallback badge:", fallbackErr);
    }
  }

  // 4. Dessiner le QR Code officiel individuel du participant
  const codeValue = (data.ticketNumber || data.qrToken || "CN-2026-VALIDE").trim();
  if (codeValue) {
    try {
      const qrDataUrl = await QRCode.toDataURL(codeValue, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 198,
        color: {
          dark: "#0F071A",
          light: "#FFFFFF",
        },
      });
      const qrImg = await loadImage(qrDataUrl);
      // Position exacte du QR code dans le cadre blanc (centré sur x: 81..196, y: 1196..1311)
      const qrSize = 99;
      const qrX = 89;
      const qrY = 1204;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    } catch (qrErr) {
      console.warn("Échec du dessin du QR Code officiel sur le badge:", qrErr);
    }
  }

  return canvas;
}

/**
 * Génère le badge officiel au format Data URL (PNG base64).
 */
export async function renderBadgeToDataUrl(data: BadgeData): Promise<string> {
  const canvas = await renderBadgeCanvas(data);
  return canvas.toDataURL("image/png");
}

/**
 * Génère le badge officiel au format Blob PNG (optimisé mémoire, idéal pour iOS et partages natifs).
 */
export async function renderBadgeToBlob(data: BadgeData): Promise<Blob> {
  const canvas = await renderBadgeCanvas(data);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Impossible de générer le fichier du badge."));
        }
      },
      "image/png"
    );
  });
}

export interface SaveBadgeResult {
  method: "shared" | "downloaded" | "modal";
  objectUrl: string;
}

/**
 * Sauvegarde ou partage le badge de façon optimale selon la plateforme :
 * - Sur iPhone/iOS & Android (support Web Share avec fichier) : ouvre la feuille native
 *   permettant de toucher directement « Enregistrer l'image » (dans Photos) ou partager sur WhatsApp.
 * - Sur ordinateur (Desktop) : déclenche le téléchargement immédiat du fichier PNG.
 * - En secours : signale le besoin d'afficher la modale pour un enregistrement tactile par appui long.
 */
export async function saveOrShareBadgeFile(
  blob: Blob,
  filename: string,
  title = "Badge J'y serai — CELEBRATION NIGHT"
): Promise<SaveBadgeResult> {
  const objectUrl = URL.createObjectURL(blob);

  // Détection des appareils mobiles (iPhone, iPad, Android)
  const isMobile =
    typeof navigator !== "undefined" &&
    (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  // 1. Sur Mobile : priorité à la feuille de partage native (permet d'enregistrer directement dans Photos sur iOS)
  if (isMobile) {
    try {
      const file = new File([blob], filename, { type: "image/png" });
      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title,
          text: "Voici mon badge officiel pour CELEBRATION NIGHT !",
        });
        return { method: "shared", objectUrl };
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { method: "modal", objectUrl };
      }
      console.warn("Partage natif non abouti, bascule vers la modale:", err);
      return { method: "modal", objectUrl };
    }

    // Si on est sur iPhone et que le partage natif n'est pas possible, ouvrir la vue d'appui long
    return { method: "modal", objectUrl };
  }

  // 2. Sur Ordinateur : téléchargement direct classique
  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { method: "downloaded", objectUrl };
  } catch (downloadErr) {
    console.warn("Échec du téléchargement direct:", downloadErr);
    return { method: "modal", objectUrl };
  }
}

/**
 * Déclenche le téléchargement du Data URL PNG sur le navigateur client (compatibilité descendante).
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
