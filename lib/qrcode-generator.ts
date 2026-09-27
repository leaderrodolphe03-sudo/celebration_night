import QRCode from "qrcode";

/**
 * Génère un QR Code sous forme de Data URL (PNG base64) haute définition.
 * Utilisable dans les balises <img src="..." /> ou pour le téléchargement.
 */
export async function generateQrCodeDataUrl(token: string): Promise<string> {
  try {
    return await QRCode.toDataURL(token, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 400,
      color: {
        dark: "#17165A", // Bleu nuit de la charte CÉLÉBRATION NIGHT
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Erreur génération QR code:", error);
    throw new Error("Impossible de générer le QR code");
  }
}

/**
 * Génère un QR Code sous forme de balise SVG brute.
 * Idéal pour l'impression vectorielle haute précision et sans flou de pixellisation.
 */
export async function generateQrCodeSvg(token: string): Promise<string> {
  try {
    return await QRCode.toString(token, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#17165A",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Erreur génération QR code SVG:", error);
    throw new Error("Impossible de générer le QR code SVG");
  }
}
