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
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
import { ScanResult } from "@/lib/types";

export default function AdminScannerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // États de la caméra
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // États du scan
  const [scanning, setScanning] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<ScanResult | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Saisie manuelle d'urgence
  const [manualCode, setManualCode] = useState("");
  const [submittingManual, setSubmittingManual] = useState(false);

  // Système Audio Web Audio API
  const playSound = (type: "VALID" | "ALREADY_USED" | "INVALID") => {
    if (!soundEnabled || typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "VALID") {
        // Deux tonalités ascendantes (accord de succès)
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
        // Double bip d'avertissement
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
        // Son d'erreur (buzz grave)
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

  // Vibration haptique smartphone
  const vibratePhone = (type: "VALID" | "ALREADY_USED" | "INVALID") => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "VALID") {
        navigator.vibrate([100, 50, 100]);
      } else if (type === "ALREADY_USED") {
        navigator.vibrate([200, 100, 200]);
      } else {
        navigator.vibrate(300);
      }
    }
  };

  // Vérification de session
  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) router.push("/admin/login");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  // Initialisation de la caméra
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

  // Boucle de détection vidéo en temps réel via BarcodeDetector API (si supporté)
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
          // Ignorer les erreurs frame par frame
        }
      }, 250);

      return () => {
        isScanningActive = false;
        clearInterval(detectInterval);
      };
    }
  }, [cameraActive, scanning, lastScannedResult]);

  // Traitement et validation d'un code scanné ou saisi
  const handleProcessCode = async (tokenOrNumber: string) => {
    if (scanning) return;
    setScanning(true);

    try {
      const res = await fetch("/api/admin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenOrNumber: tokenOrNumber.trim() }),
      });

      const data: ScanResult = await res.json();
      setLastScannedResult(data);

      playSound(data.status);
      vibratePhone(data.status);

      if (data.status === "VALID") {
        setSessionCount((prev) => prev + 1);
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

  const switchCameraFacing = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="min-h-screen bg-cn-black text-white">
      <AdminNav user={user} />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
        {/* Bandeau d'en-tête du scanner */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cn-gold">
              Portique de Contrôle
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl uppercase tracking-wider text-white">
              Scanner QR Code
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg border border-white/15 bg-white/5 text-cn-gray-300 hover:text-white transition-colors"
              title={soundEnabled ? "Couper le son" : "Activer le son"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 text-xs font-bold font-mono">
              {sessionCount} validé(s)
            </span>
          </div>
        </div>

        {/* MODALE OU AFFICHAGE PLEIN ÉCRAN DU RÉSULTAT DE SCAN */}
        {lastScannedResult && (
          <div
            className={`rounded-3xl p-6 sm:p-10 border shadow-2xl text-center animate-in zoom-in-95 duration-200 ${
              lastScannedResult.status === "VALID"
                ? "bg-gradient-to-b from-emerald-950/70 via-cn-black to-cn-deep border-emerald-400/80 shadow-[0_0_60px_rgba(52,211,153,0.3)]"
                : lastScannedResult.status === "ALREADY_USED"
                ? "bg-gradient-to-b from-amber-950/70 via-cn-black to-cn-deep border-amber-400/80 shadow-[0_0_60px_rgba(251,191,36,0.3)]"
                : "bg-gradient-to-b from-red-950/70 via-cn-black to-cn-deep border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.3)]"
            }`}
          >
            {/* Statut 1 : BILLET VALIDE */}
            {lastScannedResult.status === "VALID" && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={46} />
                </div>

                <div className="space-y-1">
                  <span className="rounded-full bg-emerald-400 text-black px-4 py-1 text-xs font-extrabold uppercase tracking-widest inline-block">
                    ✓ BILLET VALIDE
                  </span>
                  <h2 className="font-heading text-4xl sm:text-5xl uppercase tracking-wider text-white mt-2">
                    {lastScannedResult.participant?.firstName}{" "}
                    {lastScannedResult.participant?.lastName}
                  </h2>
                  <p className="text-xs text-emerald-200">
                    {lastScannedResult.participant?.city}, {lastScannedResult.participant?.country}
                  </p>
                </div>

                <div className="mx-auto max-w-sm rounded-xl bg-black/50 border border-white/10 p-4 text-xs font-mono grid grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="text-cn-gray-400 block uppercase">N° Billet</span>
                    <span className="font-bold text-white text-sm">
                      {lastScannedResult.ticket?.ticketNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-cn-gray-400 block uppercase">Catégorie</span>
                    <span className="font-bold text-cn-gold text-sm">
                      {lastScannedResult.ticket?.ticketType}
                    </span>
                  </div>
                  <div className="col-span-2 border-t border-white/10 pt-2 text-[11px] text-emerald-300">
                    Validé à : {new Date(lastScannedResult.scannedAt || "").toLocaleTimeString("fr-FR")}
                  </div>
                </div>
              </div>
            )}

            {/* Statut 2 : BILLET DÉJÀ UTILISÉ */}
            {lastScannedResult.status === "ALREADY_USED" && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 animate-bounce">
                  <AlertTriangle size={46} />
                </div>

                <div className="space-y-1">
                  <span className="rounded-full bg-amber-400 text-black px-4 py-1 text-xs font-extrabold uppercase tracking-widest inline-block">
                    ⚠ BILLET DÉJÀ UTILISÉ
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-amber-200 mt-2">
                    Entrée Déjà Enregistrée
                  </h2>
                  <p className="text-xs text-amber-300 font-semibold max-w-md mx-auto">
                    {lastScannedResult.message}
                  </p>
                </div>

                <div className="mx-auto max-w-sm rounded-xl bg-black/60 border border-amber-500/30 p-4 text-xs font-mono text-left space-y-2">
                  <div>
                    <span className="text-cn-gray-400 block">Titulaire :</span>
                    <span className="font-bold text-white">
                      {lastScannedResult.participant?.firstName}{" "}
                      {lastScannedResult.participant?.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-cn-gray-400 block">Premier scan effectué le :</span>
                    <span className="font-bold text-amber-400">
                      {lastScannedResult.previousScanAt
                        ? new Date(lastScannedResult.previousScanAt).toLocaleString("fr-FR")
                        : "Heure non renseignée"}
                    </span>
                  </div>
                  {lastScannedResult.previousScannedBy && (
                    <div className="text-[11px] text-cn-gray-400">
                      Par l&apos;agent : {lastScannedResult.previousScannedBy}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Statut 3 : BILLET INVALIDE */}
            {lastScannedResult.status === "INVALID" && (
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500">
                  <XCircle size={46} />
                </div>

                <div className="space-y-1">
                  <span className="rounded-full bg-red-500 text-white px-4 py-1 text-xs font-extrabold uppercase tracking-widest inline-block">
                    ✕ BILLET INVALIDE
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-red-200 mt-2">
                    Accès Refusé
                  </h2>
                  <p className="text-xs text-red-300 max-w-md mx-auto">
                    {lastScannedResult.message}
                  </p>
                </div>

                <p className="text-xs text-cn-gray-400">
                  Le QR code scanné n&apos;appartient pas à la base de données de CELEBRATION NIGHT ou
                  a été révoqué.
                </p>
              </div>
            )}

            {/* Bouton de réarmement pour le scan suivant */}
            <div className="mt-8">
              <Button
                type="button"
                onClick={resetForNextScan}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[260px] justify-center"
              >
                Scanner le billet suivant
              </Button>
            </div>
          </div>
        )}

        {/* CADRE DU VISEUR VIDÉO CAMÉRA (si pas de résultat affiché) */}
        {!lastScannedResult && (
          <div className="relative rounded-3xl border border-white/10 bg-cn-dark overflow-hidden shadow-2xl">
            {/* Flux Vidéo */}
            <div className="relative aspect-[4/3] sm:aspect-video w-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
              />

              {!cameraActive && (
                <div className="p-8 text-center space-y-3">
                  <CameraOff size={40} className="mx-auto text-cn-gray-500" />
                  <p className="text-xs text-cn-gray-400 max-w-xs mx-auto">
                    {cameraError || "Caméra désactivée ou en attente d'autorisation."}
                  </p>
                  <Button
                    type="button"
                    onClick={startCamera}
                    variant="primary"
                    size="sm"
                  >
                    Activer la caméra
                  </Button>
                </div>
              )}

              {/* Viseur Holographique & Ligne laser de balayage */}
              {cameraActive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {/* Cadre de visée */}
                  <div className="relative h-64 w-64 rounded-2xl border-2 border-cn-gold/70 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    {/* Coins renforcés */}
                    <div className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-cn-gold" />
                    <div className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-cn-gold" />
                    <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-cn-gold" />
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-cn-gold" />

                    {/* Faisceau laser de scan animé */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cn-gold to-transparent shadow-[0_0_8px_#F59E0B] animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Barre de contrôle sous la vidéo */}
            <div className="bg-cn-black p-4 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-cn-gray-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Viseur actif • Placez le QR code au centre
              </span>

              <button
                type="button"
                onClick={switchCameraFacing}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
              >
                <SwitchCamera size={14} />
                <span>Changer caméra</span>
              </button>
            </div>
          </div>
        )}

        {/* SAISIE MANUELLE DE SECOURS (Numéro CN-2026-...) */}
        <div className="rounded-2xl border border-white/10 bg-cn-dark/90 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <Keyboard size={18} className="text-cn-gold-light" />
            <h3 className="font-heading text-xl uppercase tracking-wide text-white">
              Saisie Manuelle d&apos;Urgence
            </h3>
          </div>
          <p className="text-xs text-cn-gray-300 mb-4">
            Si l&apos;écran du smartphone du participant est cassé ou déchargé, tapez directement
            le numéro de billet officiel (ex: <code className="text-cn-gold-light font-mono">CN-2026-000001</code>).
          </p>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="CN-2026-000001"
              className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-xs uppercase font-mono text-white placeholder-cn-gray-500 focus:border-cn-gold focus:outline-none focus:ring-1 focus:ring-cn-gold transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={scanning || !manualCode.trim()}
              className="px-6"
            >
              Valider
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
