"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, Download, RefreshCw, Sparkles, Image as ImageIcon, Check, AlertCircle } from "lucide-react";
import SquareBadge from "./SquareBadge";
import { renderBadgeToDataUrl, downloadDataUrl } from "@/lib/badge-canvas";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    // Vérification du type
    if (!file.type.startsWith("image/")) {
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

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const dataUrl = await renderBadgeToDataUrl({
        fullName: fullName || "Participant",
        ticketNumber,
        qrToken,
        photoUrl,
      });
      const cleanName = (fullName || "participant").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
      downloadDataUrl(dataUrl, `badge-j-y-serai-celebration-night-${cleanName}.png`);
    } catch (err: any) {
      console.error("Erreur de génération HD:", err);
      setErrorMessage("Impossible de générer le fichier HD. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Colonne Gauche : Badge Carré 1:1 en Direct */}
        <div className="w-full max-w-[420px] shrink-0 flex flex-col items-center">
          <SquareBadge
            fullName={fullName}
            ticketNumber={ticketNumber}
            qrToken={qrToken}
            photoUrl={photoUrl}
          />
          <span className="mt-3 text-[11px] font-medium text-cn-gray-400 uppercase tracking-wider text-center">
            Aperçu instantané • Format carré 1:1 pour WhatsApp &amp; Instagram
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
                ? "border-cn-gold bg-cn-gold/10 scale-[1.01]"
                : photoUrl
                ? "border-cn-gold/50 bg-cn-dark hover:border-cn-gold"
                : "border-white/15 bg-white/[0.03] hover:border-cn-gold/40 hover:bg-cn-dark/60"
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
              <div className="h-14 w-14 rounded-full bg-cn-dark border border-cn-gold/40 flex items-center justify-center text-cn-gold-light shadow-inner">
                {photoUrl ? <Check size={26} className="text-emerald-400" /> : <Upload size={24} />}
              </div>

              <div>
                <p className="font-heading text-xl uppercase tracking-wide text-white">
                  {photoUrl ? "Changer ma photo" : "Ajoute ta photo pour le badge"}
                </p>
                <p className="mt-1 font-body text-xs text-cn-gray-300">
                  {photoUrl
                    ? "Cliquez ou glissez une autre photo pour la remplacer"
                    : "Glissez votre photo ici ou cliquez pour parcourir votre galerie"}
                </p>
                <span className="mt-2 inline-block text-[10px] uppercase font-bold tracking-wider text-cn-gold-light">
                  JPG, PNG • Portrait recommandé
                </span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-red-950/60 border border-red-500/40 p-3 text-xs text-red-200">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="space-y-3">
            {showDownloadButton && (
              <Button
                type="button"
                onClick={handleDownload}
                loading={isGenerating}
                variant="primary"
                size="lg"
                icon={<Download size={16} />}
                className="w-full justify-center"
              >
                {isGenerating ? "Génération du badge HD..." : "Télécharger mon badge carré (HD PNG)"}
              </Button>
            )}

            {photoUrl && (
              <Button
                type="button"
                onClick={() => setPhotoUrl(null)}
                variant="ghost"
                size="sm"
                className="w-full justify-center text-cn-gray-400 hover:text-white"
              >
                Retirer la photo
              </Button>
            )}
          </div>

          {/* Conseil de partage */}
          <div className="rounded-xl border border-cn-gold/20 bg-cn-dark/90 p-4 text-xs text-cn-gray-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-cn-gold-light">
              <Sparkles size={14} />
              <span>Badge viral pour les réseaux</span>
            </div>
            <p className="leading-relaxed">
              Téléchargez votre badge carré avec le macaron <strong>« J&apos;Y SERAI ! »</strong> et partagez-le sur votre statut WhatsApp, Instagram ou Facebook pour inviter vos proches à se joindre à la célébration !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
