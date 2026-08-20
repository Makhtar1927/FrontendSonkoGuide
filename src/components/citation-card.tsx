"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Check, Sparkles } from "lucide-react";

interface Quote {
  text: string;
  source: string;
  year?: string;
}

const CITATIONS: Quote[] = [
  {
    text: "Le patriotisme n'est pas un slogan, c'est un comportement de tous les jours, un dévouement absolu au service de son peuple.",
    source: "Solutions pour le Sénégal",
    year: "2017"
  },
  {
    text: "Nous n'avons pas le droit de décevoir cette jeunesse qui a tant sacrifié et qui porte l'espoir de toute une nation.",
    source: "Discours d'investiture",
    year: "2024"
  },
  {
    text: "Notre souveraineté ne se négocie pas, elle s'affirme par des politiques économiques courageuses et une indépendance réelle.",
    source: "Présentation de Sénégal 2050",
    year: "2024"
  },
  {
    text: "L'éthique doit redevenir la colonne vertébrale de notre action publique. Sans valeurs, aucun développement durable n'est possible.",
    source: "Manifeste de PASTEF",
    year: "2014"
  },
  {
    text: "Le Sénégal regorge de richesses humaines et naturelles. Il ne nous reste qu'à gouverner par l'exemple et le travail rigoureux.",
    source: "Message à la Nation",
    year: "2024"
  },
  {
    text: "Le développement n'est pas une question de milliards, c'est d'abord une question de mentalité, de méthode et d'organisation.",
    source: "Discours à l'Université Gaston Berger (UGB)",
    year: "2023"
  },
  {
    text: "Un peuple souverain ne tend pas la main. Il cultive sa terre, protège ses ressources et construit ses propres industries.",
    source: "Solutions pour le Sénégal",
    year: "2017"
  },
  {
    text: "Notre combat n'est pas dirigé contre des personnes, mais contre un système obsolète qui empêche notre pays de libérer son potentiel.",
    source: "Déclaration publique",
    year: "2021"
  },
  {
    text: "Le panafricanisme n'est plus une simple utopie intellectuelle. C'est une nécessité absolue de survie économique et géopolitique.",
    source: "Université d'été de PASTEF",
    year: "2022"
  },
  {
    text: "Le véritable dividende de notre engagement doit se mesurer au bien-être du citoyen le plus modeste dans le village le plus reculé.",
    source: "Message aux Patriotes",
    year: "2025"
  },
  {
    text: "L'Afrique doit cesser d'être le spectateur passif de son propre destin. Nous devons être les maîtres d'œuvre de notre avenir.",
    source: "Conférence publique à l'UCAD avec J-L Mélenchon",
    year: "2024"
  },
  {
    text: "La préservation de notre espace public, de notre littoral et de notre environnement est un devoir sacré pour chaque sentinelle.",
    source: "Lancement national de 'Sétal Sunu Réew'",
    year: "2024"
  },
  {
    text: "La reddition des comptes n'est pas une vengeance politique. C'est une exigence républicaine et un acte de respect envers le trésor public.",
    source: "Discours d'orientation à l'Assemblée nationale",
    year: "2026"
  }
];

export default function CitationCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeQuote = CITATIONS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CITATIONS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CITATIONS.length) % CITATIONS.length);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${activeQuote.text}" — Ousmane Sonko (${activeQuote.source})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Échec de la copie :", err);
    }
  };

  const shareSocial = (platform: "twitter" | "whatsapp" | "facebook") => {
    const shareText = encodeURIComponent(`"${activeQuote.text}" — Ousmane Sonko (${activeQuote.source})`);
    const shareUrl = "https://sonko.sn";
    let url = "";

    if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "whatsapp") {
      url = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
    } else if (platform === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${shareText}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadImage = () => {
    setGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions (high resolution for sharing)
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, "#052316"); // brand-green-dark
    grad.addColorStop(0.5, "#07472F"); // brand-green
    grad.addColorStop(1, "#060B08"); // brand-dark-base
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Draw decorative border lines
    ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1000, 1000);

    ctx.strokeStyle = "rgba(14, 115, 81, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, 970, 970);

    // Draw decorative corners
    ctx.fillStyle = "#D4AF37";
    // Top-left
    ctx.fillRect(35, 35, 40, 8);
    ctx.fillRect(35, 35, 8, 40);
    // Top-right
    ctx.fillRect(1005, 35, 40, 8);
    ctx.fillRect(1037, 35, 8, 40);
    // Bottom-left
    ctx.fillRect(35, 1037, 40, 8);
    ctx.fillRect(35, 1005, 8, 40);
    // Bottom-right
    ctx.fillRect(1005, 1037, 40, 8);
    ctx.fillRect(1037, 1005, 8, 40);

    // Draw watermark text/branding
    ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
    ctx.font = "bold 24px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SONKO GUIDE DE LA RÉVOLUTION  •  PATRIOTISME - ÉTHIQUE - SOUVERAINETÉ", 540, 100);

    // Draw Quote Icon
    ctx.font = "bold 180px 'Times New Roman', serif";
    ctx.fillStyle = "rgba(212, 175, 55, 0.15)";
    ctx.fillText("“", 540, 320);

    // Draw Quote Text (Word Wrap)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "italic 44px 'Georgia', serif";
    ctx.textAlign = "center";
    
    const words = activeQuote.text.split(" ");
    let line = "";
    const lines = [];
    const maxWidth = 800;
    const lineHeight = 65;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Calculate Y position to center text vertically
    const totalHeight = lines.length * lineHeight;
    let startY = 540 - totalHeight / 2;

    for (let k = 0; k < lines.length; k++) {
      ctx.fillText(lines[k].trim(), 540, startY);
      startY += lineHeight;
    }

    // Draw author and source
    ctx.fillStyle = "#D4AF37";
    ctx.font = "bold 36px 'Inter', sans-serif";
    ctx.fillText("Ousmane Sonko", 540, startY + 70);

    ctx.fillStyle = "rgba(243, 244, 246, 0.7)";
    ctx.font = "30px 'Inter', sans-serif";
    const sourceText = activeQuote.year 
      ? `${activeQuote.source} (${activeQuote.year})` 
      : activeQuote.source;
    ctx.fillText(sourceText, 540, startY + 120);

    // Generate link and trigger download
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `citation_sonko_${activeIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Échec de la génération de l'image :", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel p-8 md:p-10 rounded-2xl relative overflow-hidden shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Canvas for image generation hidden in DOM */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-emerald/20 pb-4 mb-8">
        <div className="flex items-center gap-2 text-brand-gold font-semibold tracking-wide text-sm md:text-base">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>CITATIONS PHARES</span>
        </div>
        <span className="text-xs text-foreground/50 font-mono">
          {activeIndex + 1} / {CITATIONS.length}
        </span>
      </div>

      {/* Main Quote Content */}
      <div className="min-h-[220px] md:min-h-[180px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-serif leading-relaxed italic relative px-6 md:px-12">
              <span className="text-4xl md:text-5xl text-brand-gold/30 font-serif absolute -top-4 left-0 select-none">“</span>
              {activeQuote.text}
              <span className="text-4xl md:text-5xl text-brand-gold/30 font-serif absolute -bottom-8 right-0 select-none">”</span>
            </p>
            
            <div className="mt-8 flex flex-col items-center">
              <h4 className="text-brand-gold font-bold text-base md:text-lg">Ousmane Sonko</h4>
              <p className="text-xs md:text-sm text-foreground/60 mt-1 font-sans">
                {activeQuote.source} {activeQuote.year && `(${activeQuote.year})`}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sharing and Action Buttons */}
      <div className="mt-10 border-t border-brand-emerald/10 pt-6 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center sm:justify-between">
        {/* Navigation */}
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-brand-green/30 border border-brand-emerald/20 text-foreground/85 hover:text-foreground hover:bg-emerald-100 dark:hover:bg-brand-green/60 hover:border-brand-gold/50 transition-all font-semibold text-sm cursor-pointer"
          >
            Précédente
          </button>
          <button 
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-emerald-50 dark:bg-brand-green/30 border border-brand-emerald/20 text-foreground/85 hover:text-foreground hover:bg-emerald-100 dark:hover:bg-brand-green/60 hover:border-brand-gold/50 transition-all font-semibold text-sm cursor-pointer"
          >
            Suivante
          </button>
        </div>

        {/* Quick Social Shares */}
        <div className="flex gap-2">
          <button
            onClick={() => shareSocial("whatsapp")}
            title="Partager sur WhatsApp"
            className="p-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20 cursor-pointer flex items-center justify-center"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
          </button>
          <button
            onClick={() => shareSocial("twitter")}
            title="Partager sur X (Twitter)"
            className="p-2.5 rounded-lg bg-emerald-50 dark:bg-white/5 text-foreground hover:bg-emerald-100 dark:hover:bg-white/10 transition-colors border border-brand-emerald/20 dark:border-white/10 cursor-pointer flex items-center justify-center"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
          <button
            onClick={() => shareSocial("facebook")}
            title="Partager sur Facebook"
            className="p-2.5 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors border border-[#1877F2]/20 cursor-pointer flex items-center justify-center"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </button>
        </div>

        {/* Copy and Download as Image */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 dark:bg-brand-green/20 border border-brand-emerald/20 hover:bg-emerald-100 dark:hover:bg-brand-green/40 text-foreground text-sm font-semibold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981]">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-brand-gold" />
                <span>Copier</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-bold text-sm hover:shadow-lg hover:shadow-brand-gold/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{generating ? "Génération..." : "Télécharger Image"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
