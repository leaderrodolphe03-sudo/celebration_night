"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, Download, RefreshCw, Sparkles, Image as ImageIcon, Check, AlertCircle, X, Share2, Smartphone } from "lucide-react";
import SquareBadge from "./SquareBadge";
import { renderBadgeToBlob, saveOrShareBadgeFile, SaveBadgeResult } from "@/lib/badge-canvas";
import Button from "@/components/ui/Button";

export interface BadgeGeneratorProps {
  fullName: string;
  ticketNumber?: string;
  qrToken?: string;
  onPhotoUploaded?: (photoDataUrl: string) => void;
  showDownloadButton?: boolean;
}

export default function BadgeGenerator({
  fullName,
  ticketNumber = "CN-2026-VALIDE",
  qrToken = "CN-2026-TOKEN-SAMPLE",
  onPhotoUploaded,
  showDownloadButton = true,
}: BadgeGeneratorProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalBadgeUrl, setModalBadgeUrl] = useState<string | null>(null);
  const [badgeBlob, setBadgeBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    // Tolérance d'extension pour les photos iOS / Safari (HEIC/JPEG)
    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
    if (!isImage) {
      setErrorMessage("Veuillez sélectionner une image valide (JPG, PNG, WEBP).");
      return;
    }

    // Vérification de la taille (max 12 Mo)
    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage("L'image est trop volumineuse. Veuillez choisir une photo de moins de 12 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotoUrl(result);
      if (onPhotoUploaded) {
        onPhotoUploaded(result);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Erreur lors de la lecture du fichier photo.");
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const generateBadgeBlob = async (): Promise<{ blob: Blob; filename: string }> => {
    const cleanName = (fullName || "participant").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const filename = `badge-j-y-serai-celebration-night-${cleanName}.png`;
    const blob = await renderBadgeToBlob({
      fullName: fullName || "Participant",
      ticketNumber,
      qrToken,
      photoUrl,
    });
    setBadgeBlob(blob);
    return { blob, filename };
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      const { blob, filename } = await generateBadgeBlob();
      const res: SaveBadgeResult = await saveOrShareBadgeFile(blob, filename, "Badge officiel — CELEBRATION NIGHT");
      if (res.method === "modal") {
        setModalBadgeUrl(res.objectUrl);
      }
    } catch (err: any) {
      console.error("Erreur de génération HD:", err);
      setErrorMessage("Impossible de générer le fichier HD. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenManualSave = async () => {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      const { blob } = await generateBadgeBlob();
      const objectUrl = URL.createObjectURL(blob);
      setModalBadgeUrl(objectUrl);
    } catch (err) {
      setErrorMessage("Impossible d'ouvrir l'aperçu HD.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Colonne Gauche : Badge J'y serai 4:5 en Direct */}
        <div className="w-full max-w-[390px] sm:max-w-[420px] shrink-0 flex flex-col items-center">
          <SquareBadge
            fullName={fullName}
            ticketNumber={ticketNumber}
            qrToken={qrToken}
            photoUrl={photoUrl}
          />
          <span className="mt-3 text-[11px] font-medium text-[#7A6D60] uppercase tracking-wider text-center">
            Aperçu instantané • Format officiel 4:5 pour WhatsApp &amp; Instagram
          </span>
        </div>

        {/* Colonne Droite : Contrôles d'Upload & Téléchargement */}
        <div className="w-full max-w-md space-y-5">
          {/* Zone d'upload / Drag & drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              dragOver
                ? "border-cn-gold bg-amber-50 scale-[1.01]"
                : photoUrl
                ? "border-cn-gold/70 bg-amber-50/60 hover:border-cn-gold"
                : "border-[#D8CABE] bg-[#FAF7F2] hover:border-cn-gold/60 hover:bg-white"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />

            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-white border border-cn-gold/50 flex items-center justify-center text-cn-amber shadow-sm">
                {photoUrl ? <Check size={26} className="text-emerald-500" /> : <Upload size={24} />}
              </div>

              <div>
                <p className="font-heading text-xl uppercase tracking-wide text-cn-black">
                  {photoUrl ? "Changer ma photo" : "Ajoute ta photo pour le badge"}
                </p>
                <p className="mt-1 font-body text-xs text-[#5A4D41]">
                  {photoUrl
                    ? "Cliquez ou glissez une autre photo pour la remplacer"
                    : "Glissez votre photo ici ou cliquez pour parcourir votre galerie"}
                </p>
                <span className="mt-2 inline-block text-[10px] uppercase font-bold tracking-wider text-cn-amber">
                  JPG, PNG • Portrait recommandé
                </span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-300 p-3 text-xs text-red-800">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="space-y-3">
            {showDownloadButton && (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={handleDownload}
                  loading={isGenerating}
                  variant="primary"
                  size="lg"
                  icon={<Download size={16} />}
                  className="w-full justify-center"
                >
                  {isGenerating ? "Génération du badge HD..." : "Télécharger mon badge J'y serai (HD)"}
                </Button>
                <p className="text-[11px] text-center text-[#7A6D60]">
                  Sur iPhone &amp; iPad : l&apos;enregistrement dans Photos ou le partage natif vous sera proposé.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenManualSave}
              disabled={isGenerating}
              className="w-full text-center text-xs font-medium text-cn-amber hover:text-cn-gold hover:underline transition-colors flex items-center justify-center gap-1.5 py-1"
            >
              <Smartphone size={14} />
              <span>Afficher le badge pour enregistrement manuel (iPhone)</span>
            </button>

            {photoUrl && (
              <Button
                type="button"
                onClick={() => setPhotoUrl(null)}
                variant="ghost"
                size="sm"
                className="w-full justify-center text-[#7A6D60] hover:text-cn-black"
              >
                Retirer la photo
              </Button>
            )}
          </div>

          {/* Conseil de partage */}
          <div className="rounded-xl p-4 text-xs text-[#5A4D41] space-y-1">
            <p className="leading-relaxed">
              Téléchargez votre badge et partagez-le sur votre statut WhatsApp, Instagram ou Facebook pour inviter vos proches à se joindre à la CELEBRATION !
            </p>
          </div>
        </div>
      </div>

      {/* Modale d'enregistrement dédiée iPhone & Sauvegarde manuelle */}
      {modalBadgeUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setModalBadgeUrl(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-cn-gold/30 bg-[#12071F] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Entête */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-heading text-xl uppercase tracking-wider text-white">
                  Enregistrement du badge
                </h3>
                <p className="text-[11px] text-cn-gray-300">Format HD officiel • 1080 × 1350 px</p>
              </div>
              <button
                type="button"
                onClick={() => setModalBadgeUrl(null)}
                className="rounded-full p-2 text-cn-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corps : Affichage du badge avec consigne claire */}
            <div className="my-5 flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalBadgeUrl}
                alt={`Badge officiel ${fullName}`}
                className="max-h-[52vh] w-auto rounded-2xl border border-white/15 shadow-2xl object-contain select-none touch-manipulation"
              />

              <div className="mt-4 w-full rounded-2xl border border-cn-gold/30 bg-cn-gold/10 p-4 text-center text-xs text-cn-gold-light">
                <p className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Consigne pour iPhone et iPad :
                </p>
                <p className="mt-1 leading-relaxed text-[#EADCC8]">
                  Maintenez votre doigt appuyé sur le badge ci-dessus, puis choisissez{" "}
                  <strong className="text-white">« Enregistrer dans Photos »</strong> dans le menu qui apparaît.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  icon={<Share2 size={16} />}
                  className="flex-1 justify-center"
                  onClick={async () => {
                    try {
                      let blob = badgeBlob;
                      if (!blob) {
                        const generated = await generateBadgeBlob();
                        blob = generated.blob;
                      }
                      const cleanName = (fullName || "participant").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
                      const file = new File([blob], `badge-celebration-night-${cleanName}.png`, { type: "image/png" });
                      if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                          files: [file],
                          title: "Badge officiel — CELEBRATION NIGHT",
                        });
                      }
                    } catch (e) {
                      // Action annulée ou non supportée
                    }
                  }}
                >
                  Partager l&apos;image
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                size="md"
                className="flex-1 justify-center text-white border-white/20 hover:bg-white/10"
                onClick={() => setModalBadgeUrl(null)}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
