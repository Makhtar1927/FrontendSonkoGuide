"use client";

import { Info, Mail, Globe, Landmark, Code, Heart, ArrowRight } from "lucide-react";

export default function AProposPage() {
  return (
    <div className="w-full animate-slide-up bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/70 dark:from-brand-green/20 via-brand-dark-base to-brand-dark-base py-20 px-4 md:px-8 flex-grow flex items-center justify-center">
      <div className="max-w-4xl w-full relative">
        {/* Glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-12">
          <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
            <Info className="w-4 h-4 text-brand-gold" />
            <span>À Propos de la Plateforme</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display text-foreground mt-3 text-glow-gold">
            SONKO — Guide de la Révolution
          </h1>
          <p className="text-xs md:text-sm text-foreground/60 mt-2 max-w-lg mx-auto">
            Une encyclopédie interactive, citoyenne et éducative dédiée au Président de l&apos;Assemblée nationale du Sénégal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main info card */}
          <div className="md:col-span-7 glass-panel p-8 rounded-2xl border border-brand-emerald/20 relative shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground font-display mb-3 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-brand-gold" />
                <span>Notre Vision</span>
              </h2>
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
                Ce projet est né de la volonté d&apos;offrir au peuple sénégalais et à la diaspora une plateforme numérique centralisant toutes les données officielles, historiques et programmatiques d&apos;Ousmane Sonko. À travers des quiz interactifs, un chatbot intelligent basé sur des documents authentiques et une bibliothèque de documents officiels, nous œuvrons pour la vulgarisation de la vision &quot;Sénégal 2050&quot;.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-display mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-brand-gold" />
                <span>Technologies Utilisées</span>
              </h2>
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed">
                Construit avec les standards du Web moderne, le portail s&apos;appuie sur Next.js, du CSS personnalisé de haute précision, Supabase pour la synchronisation des données citoyennes et l&apos;API Google Drive pour un hébergement sécurisé et permanent des documents officiels.
              </p>
            </div>
          </div>

          {/* Developer card */}
          <div className="md:col-span-5 glass-panel p-6 rounded-2xl border-l-4 border-l-brand-gold relative shadow-xl space-y-6">
            <div className="flex flex-col items-center text-center pb-4 border-b border-brand-emerald/10">
              <div className="w-14 h-14 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-3">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-md font-bold text-foreground font-display">Développeur du Projet</h3>
              <span className="text-[10px] font-mono text-brand-gold font-bold uppercase tracking-wider mt-1 bg-emerald-50 dark:bg-brand-green/35 px-2.5 py-1 rounded border border-brand-gold/20">
                Patriote&apos;Dev
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-foreground/50 text-[9px] uppercase font-bold tracking-wider">Contact E-mail</span>
                <a href="mailto:papemakhtaraidara@gmail.com" className="font-bold text-foreground hover:text-brand-gold transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-gold" />
                  <span>papemakhtaraidara@gmail.com</span>
                </a>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-brand-emerald/10">
                <span className="text-foreground/50 text-[9px] uppercase font-bold tracking-wider">Portfolio en ligne</span>
                <a href="https://pma-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-brand-gold transition-colors flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-gold" />
                  <span>pma-portfolio.vercel.app</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-emerald/10">
              <a
                href="https://pma-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-xs hover:shadow-lg hover:shadow-brand-gold/15 transition-all active:scale-95 cursor-pointer text-center"
              >
                <span>Visiter mon Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 inline-block" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
