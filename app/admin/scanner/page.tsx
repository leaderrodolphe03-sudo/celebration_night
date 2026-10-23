"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  CameraOff,
  SwitchCamera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  Keyboard,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Flame,
  Ticket,
  Phone,
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
import { ScanResult } from "@/lib/types";

export default function AdminScannerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Mode de scan : "ENTRY" (Contrôle des entrées) ou "GAVE_LIFE" (Âmes pour Christ)
  const [scanMode, setScanMode] = useState<"ENTRY" | "GAVE_LIFE">("ENTRY");

  // États de la caméra
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // États du scan
  const [scanning, setScanning] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<ScanResult | null>(null);
  const [sessionEntryCount, setSessionEntryCount] = useState(0);
  const [sessionGaveLifeCount, setSessionGaveLifeCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Saisie manuelle d'urgence
  const [manualCode, setManualCode] = useState("");
  const [submittingManual, setSubmittingManual] = useState(false);

  // Système Audio Web Audio API
  const playSound = (type: "VALID" | "ALREADY_USED" | "INVALID" | "GAVE_LIFE_SAVED") => {
    if (!soundEnabled || typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "VALID" || type === "GAVE_LIFE_SAVED") {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now); // Do5
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // Mi5

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(659.25, now);
        osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // Sol5

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
      } else if (type === "ALREADY_USED") {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(260, now + 0.15);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(140, now);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.warn("Audio Context indisponible:", e);
    }
  };

  const vibratePhone = (type: "VALID" | "ALREADY_USED" | "INVALID" | "GAVE_LIFE_SAVED") => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "VALID" || type === "GAVE_LIFE_SAVED") {
        navigator.vibrate([100, 50, 100]);
      } else if (type === "ALREADY_USED") {
        navigator.vibrate([200, 100, 200]);
      } else {
        navigator.vibrate(300);
      }
    }
  };

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) router.push("/admin/login");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'accès à la caméra n'est pas supporté par ce navigateur.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error("Erreur caméra:", err);
      setCameraError(
        err.message || "Permission caméra refusée ou aucun périphérique vidéo disponible."
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  useEffect(() => {
    if (!cameraActive || !videoRef.current) return;

    let isScanningActive = true;
    const hasBarcodeDetector = typeof window !== "undefined" && "BarcodeDetector" in window;

    if (hasBarcodeDetector) {
      const barcodeDetector = new (window as any).BarcodeDetector({
        formats: ["qr_code"],
      });

      const detectInterval = setInterval(async () => {
        if (!isScanningActive || scanning || lastScannedResult) return;
        if (!videoRef.current || videoRef.current.readyState < 2) return;

        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            if (rawValue) {
              handleProcessCode(rawValue);
            }
          }
        } catch (e) {
          // Ignorer frame errors
        }
      }, 250);

      return () => {
        isScanningActive = false;
        clearInterval(detectInterval);
      };
    }
  }, [cameraActive, scanning, lastScannedResult, scanMode]);

  const handleProcessCode = async (tokenOrNumber: string) => {
    if (scanning) return;
    setScanning(true);

    try {
      const res = await fetch("/api/admin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenOrNumber: tokenOrNumber.trim(),
          mode: scanMode,
        }),
      });

      const data: ScanResult = await res.json();
      setLastScannedResult(data);

      playSound(data.status);
      vibratePhone(data.status);

      if (data.status === "VALID") {
        setSessionEntryCount((prev) => prev + 1);
      } else if (data.status === "GAVE_LIFE_SAVED") {
        setSessionGaveLifeCount((prev) => prev + 1);
      }
    } catch (err) {
      setLastScannedResult({
        status: "INVALID",
        message: "Erreur de communication avec le serveur de contrôle.",
      });
      playSound("INVALID");
    } finally {
      setScanning(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleProcessCode(manualCode.trim());
    setManualCode("");
  };

  const resetForNextScan = () => {
    setLastScannedResult(null);
  };

  return (
    <div className="min-h-screen bg-cn-black text-white pb-20 md:pb-12">
      <AdminNav user={user} />

      <main className="mx-auto max-w-3xl px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {/* SÉLECTEUR DE MODE & CONTRÔLES TACTILES */}
        <div className="mb-4 sm:mb-6 rounded-2xl border border-white/10 bg-cn-dark/95 p-2 sm:p-3 shadow-xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Commutateur segmenté 2 modes */}
            <div className="grid grid-cols-2 p-1 bg-black/50 rounded-xl border border-white/10 gap-1 flex-1">
              <button
                type="button"
                onClick={() => {
                  setScanMode("ENTRY");
                  setLastScannedResult(null);
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[42px] ${
                  scanMode === "ENTRY"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                    : "text-cn-gray-400 hover:text-white"
                }`}
              >
                <Ticket size={15} className="shrink-0" />
                <span className="truncate">Entrées ({sessionEntryCount})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScanMode("GAVE_LIFE");
                  setLastScannedResult(null);
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[42px] ${
                  scanMode === "GAVE_LIFE"
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.45)]"
                    : "text-cn-gray-400 hover:text-white"
                }`}
              >
                <Flame size={15} className="shrink-0" />
                <span className="truncate">Âmes ({sessionGaveLifeCount})</span>
              </button>
            </div>

            {/* Outils secondaires : Son & Caméra */}
            <div className="flex items-center justify-end gap-2 text-xs self-end sm:self-center">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
                  soundEnabled
                    ? "bg-white/[0.06] border-white/15 text-white"
                    : "bg-black/40 border-white/10 text-cn-gray-500"
                }`}
                title={soundEnabled ? "Couper le signal audio" : "Activer le signal audio"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="text-[10px] uppercase font-semibold hidden xs:inline">
                  {soundEnabled ? "Son actif" : "Muet"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFacingMode(facingMode === "environment" ? "user" : "environment")}
                className="p-2.5 rounded-xl border border-white/15 bg-white/[0.06] text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                title="Basculer vers la caméra avant / arrière"
              >
                <SwitchCamera size={16} />
                <span className="text-[10px] uppercase font-semibold hidden xs:inline">
                  {facingMode === "environment" ? "Arrière" : "Avant"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Message d'état du mode actif */}
        <div className="mb-4 text-center">
          {scanMode === "GAVE_LIFE" ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cn-gold-light">
              <Flame size={13} className="text-amber-400 shrink-0" />
              <span>Mode actif : Enregistrement des décisions pastorales</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <Ticket size={13} className="shrink-0" />
              <span>Mode actif : Validation des accès en salle</span>
            </div>
          )}
        </div>

        {/* AFFICHAGE DU RÉSULTAT DU SCAN */}
        {lastScannedResult && (
          <div
            className={`rounded-3xl p-5 sm:p-8 border shadow-2xl text-center animate-in zoom-in-95 duration-200 mb-6 ${
              lastScannedResult.status === "GAVE_LIFE_SAVED"
                ? "bg-gradient-to-b from-amber-950/80 via-cn-black to-cn-dark border-cn-gold shadow-[0_0_50px_rgba(245,158,11,0.35)]"
                : lastScannedResult.status === "VALID"
                ? "bg-gradient-to-b from-emerald-950/80 via-cn-black to-cn-dark border-emerald-400/80 shadow-[0_0_50px_rgba(52,211,153,0.3)]"
                : lastScannedResult.status === "ALREADY_USED"
                ? "bg-gradient-to-b from-amber-950/80 via-cn-black to-cn-dark border-amber-400/80 shadow-[0_0_50px_rgba(251,191,36,0.3)]"
                : "bg-gradient-to-b from-red-950/80 via-cn-black to-cn-dark border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
            }`}
          >
            {/* Cas : ÂMES POUR CHRIST */}
            {lastScannedResult.status === "GAVE_LIFE_SAVED" && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/20 border-2 border-cn-gold flex items-center justify-center text-cn-gold-light shadow-gold">
                  <Flame size={44} className="text-amber-400" />
                </div>

                <div className="space-y-1">
                  <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3.5 py-1 text-[11px] font-black uppercase tracking-wider inline-block">
                    Décision pour Christ Enregistrée
                  </span>
                  <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-wider text-white mt-2">
                    {lastScannedResult.participant?.firstName}{" "}
                    {lastScannedResult.participant?.lastName}
                  </h2>
                  <p className="text-xs font-semibold text-cn-gold-light">
                    {lastScannedResult.message}
                  </p>
                </div>

                <div className="mx-auto max-w-sm rounded-xl bg-black/60 border border-cn-gold/30 p-3.5 text-xs font-mono text-left space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-cn-gray-400">Numéro de téléphone :</span>
                    <a
                      href={`tel:${lastScannedResult.participant?.phone}`}
                      className="font-bold text-white text-sm flex items-center gap-1.5 hover:underline"
                    >
                      <Phone size={13} className="text-emerald-400" />
                      {lastScannedResult.participant?.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cn-gray-400">Ville / Pays :</span>
                    <span className="font-bold text-cn-gold">
                      {lastScannedResult.participant?.city}, {lastScannedResult.participant?.country}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-cn-gray-400 max-w-md mx-auto">
                  Le participant est classé dans l&apos;onglet <strong>Âmes pour Christ</strong> pour l&apos;équipe pastorale.
                </p>
              </div>
            )}

            {/* Cas : ENTRÉE VALIDÉE */}
            {lastScannedResult.status === "VALID" && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={44} />
                </div>

                <div className="space-y-1">
                  <span className="rounded-full bg-emerald-400 text-black px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider inline-block">
                    Entrée Validée
                  </span>
                  <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-wider text-white mt-2">
                    {lastScannedResult.participant?.firstName}{" "}
                    {lastScannedResult.participant?.lastName}
                  </h2>
                  <p className="text-xs text-emerald-200">
                    {lastScannedResult.participant?.city}, {lastScannedResult.participant?.country}
                  </p>
                </div>

                <div className="mx-auto max-w-sm rounded-xl bg-black/60 border border-white/10 p-3.5 text-xs font-mono grid grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="text-cn-gray-400 block uppercase text-[10px]">N° Billet</span>
                    <span className="font-bold text-white text-sm">
                      {lastScannedResult.ticket?.ticketNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-cn-gray-400 block uppercase text-[10px]">Catégorie</span>
                    <span className="font-bold text-cn-gold text-sm">
                      {lastScannedResult.ticket?.ticketType}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Cas : DÉJÀ UTILISÉ */}
            {lastScannedResult.status === "ALREADY_USED" && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
                  <AlertTriangle size={44} />
                </div>
                <div className="space-y-1">
                  <span className="rounded-full bg-amber-400 text-black px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider inline-block">
                    Billet Déjà Validé
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wider text-amber-200 mt-2">
                    Accès Précédemment Enregistré
                  </h2>
                  <p className="text-xs text-amber-300 font-semibold max-w-md mx-auto">
                    {lastScannedResult.message}
                  </p>
                </div>
              </div>
            )}

            {/* Cas : INVALIDE */}
            {lastScannedResult.status === "INVALID" && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500">
                  <XCircle size={44} />
                </div>
                <div className="space-y-1">
                  <span className="rounded-full bg-red-500 text-white px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider inline-block">
                    Billet Invalide
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl uppercase tracking-wider text-red-200 mt-2">
                    Code Introuvable
                  </h2>
                  <p className="text-xs text-red-300 max-w-md mx-auto">
                    {lastScannedResult.message}
                  </p>
                </div>
              </div>
            )}

            {/* Bouton géant tactile pour réarmer */}
            <div className="mt-6">
              <Button
                type="button"
                onClick={resetForNextScan}
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm py-4 rounded-xl shadow-gold"
              >
                Prêt pour le scan suivant
              </Button>
            </div>
          </div>
        )}

        {/* CADRE DU VISEUR CAMÉRA : Optimisé pour format mobile */}
        {!lastScannedResult && (
          <div className="relative rounded-3xl border border-white/10 bg-cn-dark overflow-hidden shadow-2xl">
            <div className="relative aspect-[3/4] sm:aspect-video w-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
              />

              {/* Viseur visuel avec animation laser douce */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                <div
                  className={`relative h-60 w-60 sm:h-72 sm:w-72 rounded-2xl border-2 transition-colors ${
                    scanMode === "GAVE_LIFE"
                      ? "border-cn-gold shadow-[0_0_40px_rgba(245,158,11,0.4)]"
                      : "border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]"
                  }`}
                >
                  {/* Micro-coins géométriques */}
                  <div className="absolute -top-1 -left-1 h-4 w-4 border-t-4 border-l-4 border-white" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 border-t-4 border-r-4 border-white" />
                  <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-4 border-l-4 border-white" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-4 border-r-4 border-white" />

                  <div
                    className={`absolute inset-x-0 h-0.5 bg-gradient-to-r animate-bounce top-1/2 ${
                      scanMode === "GAVE_LIFE"
                        ? "from-transparent via-amber-400 to-transparent"
                        : "from-transparent via-emerald-400 to-transparent"
                    }`}
                  />
                </div>
              </div>

              {!cameraActive && (
                <div className="absolute inset-0 bg-cn-dark/95 flex flex-col items-center justify-center p-6 text-center">
                  <CameraOff size={40} className="text-cn-gray-400 mb-3" />
                  <p className="text-sm font-semibold text-white">Caméra en attente</p>
                  <p className="text-xs text-cn-gray-400 mt-1 max-w-xs">
                    {cameraError || "Veuillez autoriser l'accès à la caméra pour scanner les QR Codes."}
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={startCamera}
                    className="mt-4"
                  >
                    Réessayer d&apos;activer la caméra
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saisie manuelle d'urgence : optimisée mobile */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="N° de billet (ex: CN-2026-000001)"
              className="flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-xs sm:text-sm text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none"
            />
            <Button type="submit" variant="secondary" size="md" className="shrink-0 justify-center">
              Valider le code
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
