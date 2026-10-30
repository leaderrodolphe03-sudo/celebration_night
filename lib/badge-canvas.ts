import QRCode from "qrcode";

export interface BadgeData {
  fullName: string;
  ticketNumber: string;
  qrToken: string;
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
    img.crossOrigin = "anonymous";
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
 * Génère le badge officiel carré en format 1080x1080 pixels haute définition
 * et retourne le Data URL (PNG).
 */
export async function renderBadgeToDataUrl(data: BadgeData): Promise<string> {
  const canvas = document.createElement("canvas");
  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Impossible d'initialiser le contexte Canvas 2D.");
  }

  // 1. Fond officiel Celebration Night (affiche officielle nettoyée)
  try {
    const bgImg = await loadImage("/images/badge_template_clean.png");
    ctx.drawImage(bgImg, 0, 0, SIZE, SIZE);
  } catch (err) {
    console.warn("Échec du chargement du fond officiel, utilisation du fallback:", err);
    const bgGrad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bgGrad.addColorStop(0, "#1F0A2E");
    bgGrad.addColorStop(0.5, "#4A0E4E");
    bgGrad.addColorStop(1, "#120520");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  // 2. Photo du participant (dans un cadre propre et léger, aligné avec l'affiche sous J'Y SERAI)
  const frameX = 24;
  const frameY = 180;
  const frameW = 540;
  const frameH = 672;
  const radius = 22;

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

      // Cadre léger : contour fin blanc translucide
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      roundRect(ctx, frameX, frameY, frameW, frameH, radius);
      ctx.stroke();
    } catch (err) {
      console.warn("Échec du chargement de la photo participant:", err);
    }
  }

  // 3. Calque de premier plan officiel : J'Y SERAI en 3D, bandeau date, logos et flyer au-dessus de la photo
  try {
    const fgImg = await loadImage("/images/badge_foreground.png");
    ctx.drawImage(fgImg, 0, 0, SIZE, SIZE);
  } catch (err) {
    console.warn("Échec du chargement du premier plan officiel:", err);
  }

  // 4. QR Code dynamique officiel sur la carte d'entrée (bas-droite)
  // Coordonnées exactes : carte à X: 835..1047, Y: 815..1027, QR centré en (941, 921)
  const qrSize = 176;
  const qrX = 853;
  const qrY = 833;
  const tokenToEncode = data.qrToken || data.ticketNumber || "CN-2026-VALIDE";

  try {
    const qrDataUrl = await QRCode.toDataURL(tokenToEncode, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: qrSize,
      color: {
        dark: "#0F071A",
        light: "#FFFFFF",
      },
    });
    const qrImg = await loadImage(qrDataUrl);
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  } catch (err) {
    console.error("Erreur rendu QR code HD:", err);
  }

  return canvas.toDataURL("image/png");
}


/**
 * Déclenche le téléchargement du Data URL PNG sur le navigateur client.
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
