"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, HeartHandshake, Check, Copy, ExternalLink, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import WaveButton from "./wave-button";

interface WaveDonationCardProps {
  className?: string;
}

const WAVE_URL = "https://pay.wave.com/m/M_sn_2MOwdjUaQWQJ/c/sn/";

export default function WaveDonationCard({ className = "" }: WaveDonationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(WAVE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-[#1c9ff5]/30 hover:border-[#1c9ff5]/60 transition-all duration-500 shadow-2xl relative overflow-hidden group ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1c9ff5]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 group-hover:bg-[#1c9ff5]/15 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/15 transition-all duration-700" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-emerald/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left / Main Details Column */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Top category badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c9ff5]/10 border border-[#1c9ff5]/30 text-[#1c9ff5] text-xs font-mono font-black uppercase tracking-[0.2em] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1c9ff5] animate-ping" />
            <span>Souveraineté & Contribution Citoyenne</span>
          </div>

          {/* Headline */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-foreground leading-tight tracking-tight">
            Soutenez l&apos;avancement du projet
          </h3>

          {/* Subtext */}
          <p className="text-sm md:text-base text-foreground/80 mt-4 leading-relaxed font-sans max-w-xl">
            Chaque contribution fortifie notre marche vers le développement. Soutenez cette initiative citoyenne pour nous aider à aller de l&apos;avant et à préserver notre souveraineté numérique.
          </p>

          {/* Reassurance trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-md">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50/60 dark:bg-brand-green-dark/30 border border-brand-emerald/15 text-xs text-foreground/85 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-emerald-light flex-shrink-0" />
              <span>Paiement 100% sécurisé via Wave</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50/60 dark:bg-brand-green-dark/30 border border-brand-emerald/15 text-xs text-foreground/85 font-medium">
              <HeartHandshake className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>Contribution libre & instantanée</span>
            </div>
          </div>

          {/* Action Buttons — bouton principal réduit */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-8 w-full">
            <WaveButton
              href={WAVE_URL}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1c9ff5] hover:bg-[#1585cf] text-white font-bold text-xs shadow-md shadow-[#1c9ff5]/25 hover:shadow-lg hover:shadow-[#1c9ff5]/35 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group/btn"
            >
              <Image
                src="/Wave.svg"
                alt="Wave Mobile Money"
                width={16}
                height={16}
                className="rounded group-hover/btn:rotate-6 transition-transform flex-shrink-0"
                style={{ width: "16px", height: "16px" }}
              />
              <span>Faire un Don Citoyen</span>
              <ExternalLink className="w-3 h-3 opacity-80 flex-shrink-0" />
            </WaveButton>

            <button
              onClick={handleCopyLink}
              type="button"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50/80 dark:bg-brand-green/20 hover:bg-emerald-100 dark:hover:bg-brand-green/40 border border-brand-emerald/20 text-foreground text-xs font-bold transition-all active:scale-95 cursor-pointer"
              title="Copier le lien direct de don"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Lien copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-brand-gold" />
                  <span>Copier le lien</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right / QR Code Card Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative group/qr p-5 sm:p-6 rounded-3xl bg-white dark:bg-brand-dark-card border-2 border-[#1c9ff5]/30 hover:border-[#1c9ff5] shadow-2xl shadow-[#1c9ff5]/15 transition-all duration-300 hover:scale-[1.03]">
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-gold rounded-tl-lg pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-gold rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-gold rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-gold rounded-br-lg pointer-events-none" />

            {/* QR Header */}
            <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-gray-100 dark:border-brand-emerald/15">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#1c9ff5]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                  Scan Wave
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#1c9ff5]/15 text-[#1c9ff5]">
                Direct
              </span>
            </div>

            {/* The QR Code */}
            <div className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-inner">
              <QRCodeSVG
                value={WAVE_URL}
                size={160}
                bgColor="#FFFFFF"
                fgColor="#0C1E14"
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/Wave.svg",
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  opacity: 1,
                  excavate: true,
                }}
              />
            </div>

            {/* QR Footer caption */}
            <div className="mt-3.5 text-center">
              <span className="text-[10px] font-mono font-bold text-gray-600 dark:text-gray-400 block">
                Ouvrez Wave & Scannez
              </span>
              <span className="text-[9px] text-[#1c9ff5] font-semibold mt-0.5 block">
                Paiement instantané sans frais
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
