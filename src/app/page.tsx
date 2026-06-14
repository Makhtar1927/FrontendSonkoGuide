import Link from "next/link";
import { Sparkles, Clock, Bot } from "lucide-react";
import CitationCard from "@/components/citation-card";
import Timeline360 from "@/components/timeline-360";
import SenegalMap from "@/components/senegal-map";
import QuizGame from "@/components/quiz-game";
import AskSonko from "@/components/ask-sonko";
import WaveButton from "@/components/wave-button";
import EventsSlider360 from "@/components/events-slider-360";

export default function Home() {
  return (
    <div className="flex flex-col w-full relative">
      
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
