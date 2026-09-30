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

  // 1. Fond principal dégradé bordeaux / braise profonde
  const bgGrad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bgGrad.addColorStop(0, "#0A0304");
  bgGrad.addColorStop(0.35, "#24080C");
  bgGrad.addColorStop(0.7, "#140507");
  bgGrad.addColorStop(1, "#0A0304");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. Halos d'ambiance lumineux (rouge flamme et ambre sacré)
  const glowTop = ctx.createRadialGradient(SIZE / 2, 80, 20, SIZE / 2, 80, 520);
  glowTop.addColorStop(0, "rgba(229, 37, 42, 0.35)");
  glowTop.addColorStop(0.6, "rgba(183, 28, 28, 0.15)");
  glowTop.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowTop;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const glowGold = ctx.createRadialGradient(SIZE - 120, SIZE - 120, 10, SIZE - 120, SIZE - 120, 400);
  glowGold.addColorStop(0, "rgba(245, 185, 0, 0.2)");
  glowGold.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glowGold;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 3. Cadre extérieur esthétique avec bordure or & bordeaux
  ctx.lineWidth = 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  roundRect(ctx, 32, 32, SIZE - 64, SIZE - 64, 48);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#F5B900";
  roundRect(ctx, 42, 42, SIZE - 84, SIZE - 84, 40);
  ctx.stroke();

  // 4. En-tête : Organisation & Logo
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFD84A";
  ctx.font = "bold 24px Montserrat, sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("HAGIAZO MINISTRY PRÉSENTE", SIZE / 2, 95);

  // Titre événementiel : CÉLÉBRATION NIGHT
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 76px 'Bebas Neue', Montserrat, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("CÉLÉBRATION NIGHT", SIZE / 2, 175);

  // Date et lieu
  ctx.fillStyle = "#E5E5EA";
  ctx.font = "600 22px Montserrat, sans-serif";
  ctx.letterSpacing = "3px";
  const dateVenue = `${data.dateLabel || "SAMEDI 14 NOVEMBRE 2026"} • ${data.venueLabel || "ABIDJAN"}`;
  ctx.fillText(dateVenue.toUpperCase(), SIZE / 2, 215);

  // 5. Zone centrale : Photo du participant
  const photoSize = 420;
  const photoX = (SIZE - photoSize) / 2;
  const photoY = 260;

  // Ombre portée sous la photo
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 15;

  // Cadre blanc épais style poster / polaroid haut de gamme
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, photoX - 10, photoY - 10, photoSize + 20, photoSize + 20, 28);
  ctx.fill();
  ctx.restore();

  // Dessin de la photo ou placeholder
  ctx.save();
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 20);
  ctx.clip();

  if (data.photoUrl) {
    try {
      const userImg = await loadImage(data.photoUrl);
      // Recadrage cover au centre
      const scale = Math.max(photoSize / userImg.width, photoSize / userImg.height);
      const w = userImg.width * scale;
      const h = userImg.height * scale;
      const x = photoX + (photoSize - w) / 2;
      const y = photoY + (photoSize - h) / 2;
      ctx.drawImage(userImg, x, y, w, h);
    } catch {
      // En cas d'échec de chargement, fallback dégradé
      drawDefaultPhoto(ctx, photoX, photoY, photoSize, data.fullName);
    }
  } else {
    drawDefaultPhoto(ctx, photoX, photoY, photoSize, data.fullName);
  }
  ctx.restore();

  // Bordure dorée intérieure sur la photo
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#F5B900";
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 20);
  ctx.stroke();

  // 6. Macaron Flamboyant « J'Y SERAI ! » (incliné sur le coin inférieur droit de la photo)
  ctx.save();
  const stampX = photoX + photoSize - 60;
  const stampY = photoY + photoSize - 20;
  ctx.translate(stampX, stampY);
  ctx.rotate((-8 * Math.PI) / 180);

  // Ombre du macaron
  ctx.shadowColor = "rgba(229, 37, 42, 0.6)";
  ctx.shadowBlur = 24;

  // Fond du macaron
  const stampGrad = ctx.createLinearGradient(-110, -35, 110, 35);
  stampGrad.addColorStop(0, "#B71C1C");
  stampGrad.addColorStop(0.5, "#E5252A");
  stampGrad.addColorStop(1, "#F5B900");
  ctx.fillStyle = stampGrad;
  roundRect(ctx, -110, -32, 220, 64, 16);
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#FFFFFF";
  roundRect(ctx, -110, -32, 220, 64, 16);
  ctx.stroke();

  // Texte du macaron
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 32px 'Bebas Neue', Montserrat, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "2px";
  ctx.fillText("★ J'Y SERAI ! ★", 0, 10);
  ctx.restore();

  // 7. Bas du badge : Nom du participant et QR Code
  // Zone gauche : Informations Participant
  const bottomY = 740;
  ctx.textAlign = "left";

  // Badge catégorie
  ctx.fillStyle = "rgba(245, 185, 0, 0.15)";
  roundRect(ctx, 75, bottomY, 240, 38, 8);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(245, 185, 0, 0.4)";
  roundRect(ctx, 75, bottomY, 240, 38, 8);
  ctx.stroke();

  ctx.fillStyle = "#FFD84A";
  ctx.font = "bold 15px Montserrat, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("BILLET PARTICIPANT OFFICIEL", 90, bottomY + 24);

  // Nom complet en grand
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 44px 'Bebas Neue', Montserrat, sans-serif";
  ctx.letterSpacing = "2px";
  const nameToDisplay = data.fullName.trim() || "PARTICIPANT OFFICIEL";
  // Tronquer si trop long
  const truncatedName = nameToDisplay.length > 24 ? nameToDisplay.substring(0, 23) + "…" : nameToDisplay;
  ctx.fillText(truncatedName.toUpperCase(), 75, bottomY + 90);

  // Numéro de billet et statut
  ctx.fillStyle = "#A1A1AA";
  ctx.font = "600 20px Montserrat, sans-serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText(`N° ${data.ticketNumber || "CN-2026-VALIDE"}`, 75, bottomY + 130);

  ctx.fillStyle = "#34D399";
  ctx.font = "bold 16px Montserrat, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("● ENTRÉE GRATUITE CONFIRMÉE", 75, bottomY + 165);

  // Zone droite : QR Code individuel officiel
  const qrSize = 200;
  const qrX = SIZE - 75 - qrSize;
  const qrY = bottomY - 10;

  // Cadre blanc pour lecture optique parfaite au scanner
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 16);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#F5B900";
  roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 16);
  ctx.stroke();

  // Rendu du QR code dans le canvas
  const qrDataUrl = await QRCode.toDataURL(data.qrToken || data.ticketNumber || "CN-2026-OFFICIAL", {
    errorCorrectionLevel: "H",
    margin: 1,
    width: qrSize,
    color: {
      dark: "#0A0304",
      light: "#FFFFFF",
    },
  });
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Légende sous le QR
  ctx.textAlign = "center";
  ctx.fillStyle = "#E5E5EA";
  ctx.font = "600 13px Montserrat, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("SCANNEZ À L'ENTRÉE", qrX + qrSize / 2, qrY + qrSize + 28);

  // Pied de page légal / Hashtag
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "500 16px Montserrat, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("#CelebrationNight2026 • #HagiazoMinistry • www.celebrationnight.org", SIZE / 2, SIZE - 48);

  return canvas.toDataURL("image/png");
}

function drawDefaultPhoto(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  fullName: string
) {
  const grad = ctx.createLinearGradient(x, y, x + size, y + size);
  grad.addColorStop(0, "#24080C");
  grad.addColorStop(0.5, "#B71C1C");
  grad.addColorStop(1, "#140507");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, size, size);

  // Initiale
  const initial = (fullName.trim()[0] || "C").toUpperCase();
  ctx.fillStyle = "#FFD84A";
  ctx.font = "bold 140px 'Bebas Neue', Montserrat, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(initial, x + size / 2, y + size / 2 + 50);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "bold 18px Montserrat, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("PHOTO PARTICIPANT", x + size / 2, y + size - 35);
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
