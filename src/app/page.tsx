"use client";

import Link from "next/link";
import { Sparkles, Clock, Bot } from "lucide-react";
import dynamic from "next/dynamic";
import CitationCard from "@/components/citation-card";
import WaveButton from "@/components/wave-button";

// Squelette de chargement pour les composants dynamiques
const LoadingSkeleton = ({ title }: { title: string }) => (
  <div className="w-full h-80 rounded-2xl glass-panel border border-brand-emerald/10 flex flex-col items-center justify-center gap-3 bg-brand-green-dark/5">
    <div className="w-8 h-8 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin" />
    <span className="text-xs font-mono text-foreground/45 tracking-wider">{title}...</span>
  </div>
);

// Importations dynamiques pour réduire la taille du bundle initial et fluidifier le chargement
const Timeline360 = dynamic(() => import("@/components/timeline-360"), {
  ssr: false,
  loading: () => <LoadingSkeleton title="Chargement de la Timeline 360°" />,
});

const EventsSlider360 = dynamic(() => import("@/components/events-slider-360"), {
  ssr: false,
  loading: () => <LoadingSkeleton title="Chargement des récits chronologiques" />,
});

const SenegalMap = dynamic(() => import("@/components/senegal-map"), {
  ssr: false,
  loading: () => <LoadingSkeleton title="Chargement de la carte territoriale interactive" />,
});

const QuizGame = dynamic(() => import("@/components/quiz-game"), {
  ssr: false,
  loading: () => <LoadingSkeleton title="Chargement du grand quiz citoyen" />,
});

const AskSonko = dynamic(() => import("@/components/ask-sonko"), {
  ssr: false,
  loading: () => <LoadingSkeleton title="Chargement de l'assistant IA" />,
});

export default function Home() {
  return (
    <div className="flex flex-col w-full relative animate-slide-up">

      {/* 0. GUIDE DE LA RÉVOLUTION — Banner section */}
      <section className="relative w-full bg-brand-dark-base overflow-hidden border-b border-brand-emerald/15">
        {/* Ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_40%_50%,_rgba(7,71,47,0.25),_transparent)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/4 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch">

          {/* ── LEFT on desktop: Image ── / bottom on mobile ── */}
          <div className="w-full lg:w-[45%] xl:w-[42%] flex-shrink-0 relative order-2 lg:order-1 lg:self-stretch">
            <div className="relative w-full h-[420px] lg:h-full min-h-[480px] overflow-hidden">
              {/* Gold border on the right edge (desktop only) */}
              <div className="hidden lg:block absolute right-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent z-10" />
              <img
                src="/Gardien.png"
                alt="Ousmane Sonko — Guide de la Révolution"
                className="w-full h-full object-cover object-top"
              />
              {/* Fades RIGHT into the text column on desktop */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-l from-brand-dark-base via-brand-dark-base/15 to-transparent pointer-events-none" />
              {/* Bottom fade for mobile */}
              <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-brand-dark-base via-transparent to-transparent pointer-events-none" />

            </div>
          </div>

          {/* ── RIGHT on desktop: Text ── / top on mobile ── */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-16 lg:py-24 order-1 lg:order-2">
            {/* Eyebrow */}
            <span className="text-[10px] md:text-xs font-mono font-black text-brand-gold/70 uppercase tracking-[0.3em] mb-4 block">
              Sénégal · PASTEF · Président de l&apos;Assemblée Nationale
            </span>

            {/* Big title */}
            <h2 className="font-display font-extrabold leading-[1.05] text-white">
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
                Guide de la
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold">
                Révolution
              </span>
            </h2>

            {/* Sub-tagline */}
            <p className="mt-6 text-sm md:text-base text-foreground/60 max-w-md leading-relaxed font-sans">
              Ousmane Sonko — bâtisseur de souveraineté, porteur d&apos;une vision de rupture et de justice sociale pour le peuple sénégalais.
            </p>

            {/* Decorative separator */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-12 bg-brand-gold/60" />
              <span className="text-[10px] font-mono text-brand-gold/50 uppercase tracking-widest">Né le 15 juillet 1974 · Thiès, Sénégal</span>
            </div>
          </div>

        </div>
      </section>

      {/* 1. HERO BANNER SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 md:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/35 via-brand-dark-base to-brand-dark-base overflow-hidden">
        {/* Glow lines */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/30 border border-brand-emerald/25 text-xs text-brand-gold font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "4s" }} />
              <span>Encyclopédie Officielle & Interactive</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] text-white tracking-tight">
              Tout savoir sur <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-white text-glow-gold">
                Ousmane Sonko
              </span> <br />
              en un seul endroit.
            </h1>
            
            <p className="text-sm md:text-base text-foreground/75 mt-6 max-w-xl leading-relaxed">
              Explorez sa vie, ses ouvrages de réformes, son parcours professionnel d&apos;inspecteur et ses réalisations en tant que Guide de la Révolution et Président de l&apos;Assemblée nationale du Sénégal.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#timeline-360"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-extrabold text-sm md:text-base hover:shadow-lg hover:shadow-brand-gold/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Découvrir la Timeline 360°</span>
              </Link>
              
              <Link
                href="#ask-sonko"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green/20 border border-brand-emerald/25 text-foreground hover:bg-brand-green/45 hover:text-white font-bold text-sm md:text-base transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-brand-gold" />
                <span>Poser une question à l&apos;IA</span>
              </Link>
            </div>
          </div>

          {/* Featured Video Frame / Citation Card */}
          <div className="lg:col-span-5 w-full">
            <CitationCard />
          </div>
        </div>
      </section>

      {/* KEY STATS BAR */}
      <section className="bg-brand-green-dark/60 border-y border-brand-emerald/15 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <span className="text-3xl md:text-4xl font-extrabold font-display text-brand-gold block">1974</span>
            <span className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1 block">Naissance</span>
          </div>
          <div className="text-center border-l border-brand-emerald/15">
            <span className="text-3xl md:text-4xl font-extrabold font-display text-brand-gold block">2014</span>
            <span className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1 block">Création de PASTEF</span>
          </div>
          <div className="text-center border-l border-brand-emerald/15">
            <span className="text-3xl md:text-4xl font-extrabold font-display text-brand-gold block">15,67%</span>
            <span className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1 block">3e Présidentielle 2019</span>
          </div>
          <div className="text-center border-l border-brand-emerald/15">
            <span className="text-3xl md:text-4xl font-extrabold font-display text-brand-gold block">2026</span>
            <span className="text-xs text-foreground/50 uppercase tracking-widest font-bold mt-1 block">Président Assemblée</span>
          </div>
        </div>
      </section>

      {/* WAVE DONATION BANNER */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-brand-green-dark/40 via-brand-dark-base to-brand-green-dark/40 relative z-10 border-b border-brand-emerald/15">
        <div className="max-w-4xl mx-auto glass-panel p-6 md:p-8 rounded-2xl border border-[#1c9ff5]/20 hover:border-[#1c9ff5]/40 transition-all shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1c9ff5]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex-1 text-center md:text-left">
            <span className="text-[10px] font-mono text-[#1c9ff5] font-black uppercase tracking-[0.2em] block mb-2">Souveraineté & Contribution Citoyenne</span>
            <h3 className="text-xl md:text-2xl font-bold text-white font-display leading-tight">
              Soutenez l&apos;avancement du projet
            </h3>
            <p className="text-xs md:text-sm text-foreground/70 mt-2 max-w-xl leading-relaxed">
              Chaque contribution fortifie notre marche vers le développement. Soutenez cette initiative citoyenne pour nous aider à aller de l&apos;avant et à préserver notre souveraineté numérique.
            </p>
          </div>

          <div className="flex-shrink-0">
            <WaveButton
              className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#1c9ff5] hover:bg-[#1585cf] text-white font-black text-sm md:text-base hover:shadow-lg hover:shadow-sky-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
            >
              <img
                src="/Wave.svg"
                alt="Wave Mobile Money"
                className="w-6 h-6 rounded-md shadow-sm"
              />
              <span>Faire un Don Citoyen</span>
            </WaveButton>
          </div>
        </div>
      </section>

      {/* 2. CHRONOLOGIE 360° SECTION */}
      <section id="timeline-360" className="py-20 px-4 md:px-8 bg-brand-dark-base relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Histoire & Destinée</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mt-3">
              Sonko Timeline 360°
            </h2>
            <p className="text-sm text-foreground/60 mt-3 max-w-xl leading-relaxed">
              Explorez son parcours pas-à-pas, de son enfance et sa scolarité à son entrée dans la fonction publique et son ascension politique nationale.
            </p>
          </div>

          <Timeline360 />
        </div>
      </section>
      {/* 2.5 EVENT SCENARIOS 360 SLIDER */}
      <section className="py-20 px-4 md:px-8 bg-brand-dark-base relative border-t border-brand-emerald/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Chroniques de la Mutation (2021 - 2024)</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mt-3">
              Résistance, Rupture & Victoire 360°
            </h2>
            <p className="text-sm text-foreground/60 mt-3 max-w-xl leading-relaxed">
              Explorez sous forme de cercle de glisse latéral les moments décisifs et les scénarios d&apos;événements qui ont conduit le projet national au sommet de la République.
            </p>
          </div>

          <EventsSlider360 />
        </div>
      </section>

      {/* 3. INTERACTIVE MAP SECTION */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-brand-dark-base to-brand-green-dark/20 relative border-t border-brand-emerald/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Impact Territorial</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mt-3">
              Réalisations & Projets Régionaux
            </h2>
            <p className="text-sm text-foreground/60 mt-3 max-w-xl leading-relaxed">
              Découvrez la carte géospatiale des projets initiés, des réformes appliquées et de la vision du gouvernement région par région.
            </p>
          </div>

          <SenegalMap />
        </div>
      </section>

      {/* 4. IA ASK SONKO SECTION */}
      <section id="ask-sonko" className="py-20 px-4 md:px-8 bg-brand-dark-base relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Intelligence Documentaire</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mt-3">
              Posez vos Questions à l&apos;IA &quot;Ask Sonko&quot;
            </h2>
            <p className="text-sm text-foreground/60 mt-3 max-w-xl leading-relaxed">
              Une technologie RAG locale de pointe qui vous répond instantanément en s&apos;appuyant uniquement sur des documents officiels, livres et retranscriptions de discours.
            </p>
          </div>

          <AskSonko />
        </div>
      </section>

      {/* 5. GRAND QUIZ SECTION */}
      <section id="grand-quiz" className="py-20 px-4 md:px-8 bg-gradient-to-b from-brand-dark-base to-brand-green-dark/20 relative border-t border-brand-emerald/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Gamification Citoyenne</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mt-3">
              Le Défi &quot;Connais-tu Ousmane Sonko ?&quot;
            </h2>
            <p className="text-sm text-foreground/60 mt-3 max-w-xl leading-relaxed">
              Participez aux ligues nationales de connaissances. Obtenez vos badges Bronze, Argent, Or et Platine et générez votre certificat numérique.
            </p>
          </div>

          <QuizGame />
        </div>
      </section>

      {/* 6. FEATURED VIDEO EMBED SECTION */}
      <section className="py-20 px-4 md:px-8 bg-brand-dark-base relative border-t border-brand-emerald/10">
        <div className="max-w-5xl mx-auto glass-panel p-6 md:p-8 rounded-2xl relative shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <span className="text-xs font-mono text-brand-gold font-bold uppercase tracking-wider block mb-2">VIDÉO À LA UNE</span>
              <h3 className="text-2xl font-bold text-white font-display mb-4">Discours Historique du 1er Congrès de PASTEF</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                Visionnez la retranscription audiovisuelle officielle du discours d&apos;orientation lors du premier congrès extraordinaire de PASTEF à Diamniadio, consacrant sa réélection pour un mandat de 6 ans.
              </p>
              <div className="mt-6 flex gap-3 text-xs text-brand-gold font-mono font-semibold">
                <span>Date: Juin 2026</span>
                <span>•</span>
                <span>Durée: 1h 45min</span>
              </div>
            </div>
            
            <div className="w-full md:w-[360px] aspect-video bg-black rounded-xl overflow-hidden border border-brand-emerald/20 relative group shadow-2xl flex-shrink-0">
              {/* Mock Video player with YouTube Embed */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/aUv1_ytYBi4"
                title="Discours Ousmane Sonko"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
