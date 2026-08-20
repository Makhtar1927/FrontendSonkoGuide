"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone / installed mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");
      
      return Boolean(isStandaloneMode);
    };

    if (checkStandalone()) {
      setIsStandalone(true);
      return;
    }

    // 2. Check if user already dismissed the prompt in this session
    const dismissed = sessionStorage.getItem("sonko-pwa-dismissed");

    // 3. Robust iOS / iPadOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      (/iphone|ipad|ipod/.test(userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
        (userAgent.includes("macintosh") && navigator.maxTouchPoints > 1)) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;

    // 4. Capture BeforeInstallPrompt (Chrome, Edge, Android, Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!dismissed) {
        setTimeout(() => {
          setIsIOS(Boolean(isIOSDevice));
          setShowPrompt(true);
        }, 1800);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If on iOS and not dismissed, show iOS installation helper
    let iosTimer: NodeJS.Timeout | null = null;
    if (isIOSDevice && !dismissed) {
      iosTimer = setTimeout(() => {
        setIsIOS(true);
        setShowPrompt(true);
      }, 2200);
    }

    // Fallback: If on Android or Desktop and beforeinstallprompt fired early or user visits
    const fallbackTimer = setTimeout(() => {
      if (!dismissed && !checkStandalone()) {
        setIsIOS(Boolean(isIOSDevice));
        setShowPrompt(true);
      }
    }, 3000);

    // App installed event
    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (iosTimer) clearTimeout(iosTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      setShowPrompt(false);
      sessionStorage.setItem("sonko-pwa-dismissed", "true");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("sonko-pwa-dismissed", "true");
  };

  if (isStandalone || installedSuccess) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="pointer-events-auto w-full max-w-md bg-brand-dark-card border border-brand-emerald/30 shadow-2xl rounded-3xl p-5 sm:p-6 relative overflow-hidden"
          >
            {/* Ambient gold / green backdrop glows */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-gold/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-emerald/15 rounded-full blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full bg-brand-green/15 hover:bg-brand-green/30 text-foreground/60 hover:text-foreground transition-all cursor-pointer"
              aria-label="Fermer"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Header Card Info */}
            <div className="flex items-center gap-3.5 pr-8">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-brand-gold/60 shadow-md flex-shrink-0">
                <Image
                  src="/Sonko.jpg"
                  alt="SONKO — Guide de la Révolution"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-extrabold font-display text-foreground leading-tight">
                    SONKO
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-brand-gold text-brand-green-dark">
                    PWA
                  </span>
                </div>
                <span className="text-[10px] font-mono text-brand-gold font-bold tracking-wider block">
                  Guide de la Révolution
                </span>
              </div>
            </div>

            {/* Description or iOS Instructions */}
            {isIOS ? (
              /* iOS Instructions View */
              <div className="mt-4 space-y-3">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Installez l&apos;application sur votre iPhone ou iPad pour un accès instantané en 3 étapes simples :
                </p>

                <div className="space-y-2 p-3 rounded-2xl bg-emerald-50/50 dark:bg-brand-green-dark/30 border border-brand-emerald/15 text-xs text-foreground/85">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      1
                    </div>
                    <span className="flex items-center gap-1">
                      Appuyez sur <Share className="w-3.5 h-3.5 text-blue-500 inline mx-0.5" /> <strong>Partager</strong> en bas de Safari.
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      2
                    </div>
                    <span className="flex items-center gap-1">
                      Faites défiler et cliquez sur <PlusSquare className="w-3.5 h-3.5 text-brand-gold inline mx-0.5" /> <strong>Sur l&apos;écran d&apos;accueil</strong>.
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-brand-emerald/15 text-brand-emerald-light flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      3
                    </div>
                    <span>
                      Appuyez sur <strong>« Ajouter »</strong> en haut à droite.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleDismiss}
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-extrabold text-xs hover:shadow-lg transition-all active:scale-95 cursor-pointer text-center"
                  >
                    J&apos;ai compris
                  </button>
                </div>
              </div>
            ) : (
              /* Android / Desktop Install View */
              <div className="mt-4 space-y-4">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Ajoutez l&apos;application officielle sur votre écran d&apos;accueil pour naviguer plus vite, accéder aux quiz et consulter les discours même hors-ligne.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-foreground/75">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald-light flex-shrink-0" />
                    Rapide & Léger (0 Mo)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                    Accès direct 1-clic
                  </span>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    onClick={handleInstallClick}
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-extrabold text-xs shadow-md hover:shadow-lg hover:shadow-brand-gold/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installer l&apos;Application</span>
                  </button>

                  <button
                    onClick={handleDismiss}
                    type="button"
                    className="py-3 px-3 rounded-xl bg-emerald-50/70 dark:bg-brand-green/20 hover:bg-emerald-100 dark:hover:bg-brand-green/35 text-foreground/70 hover:text-foreground text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
