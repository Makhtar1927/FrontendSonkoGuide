"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, TrendingUp, CheckCircle, MapPin, Award, ExternalLink, Zap, Shield, Sparkles, Map, Compass, Palette } from "lucide-react";

interface Project {
  title: string;
  category: string;
  status: "Terminé" | "En Cours" | "Planifié";
  description: string;
}

interface Region {
  id: string;
  name: string;
  capital: string;
  poleId: string;
  coords: string;
  center: { x: number; y: number };
}

interface PoleData {
  id: string;
  name: string;
  vocation: string;
  focus: string;
  pibShare: string;
  pibTarget: string;
  agropoles: string;
  color: string;
  borderClass: string;
  regions: string[];
  projects: Project[];
}

const REGIONS: Region[] = [
  { id: "DK", name: "Dakar", capital: "Dakar", poleId: "pole-1", coords: "M 40,240 L 60,230 L 75,245 L 60,265 L 45,260 Z", center: { x: 55, y: 245 } },
  { id: "TH", name: "Thiès", capital: "Thiès", poleId: "pole-2", coords: "M 75,245 L 85,210 L 110,215 L 120,240 L 110,270 L 80,265 Z", center: { x: 95, y: 240 } },
  { id: "SL", name: "Saint-Louis", capital: "Saint-Louis", poleId: "pole-4", coords: "M 85,210 L 100,150 L 130,120 L 180,110 L 220,130 L 200,165 L 140,185 L 110,215 Z", center: { x: 155, y: 155 } },
  { id: "LG", name: "Louga", capital: "Louga", poleId: "pole-4", coords: "M 110,215 L 140,185 L 200,165 L 230,200 L 180,225 L 120,240 Z", center: { x: 165, y: 205 } },
  { id: "MT", name: "Matam", capital: "Matam", poleId: "pole-4", coords: "M 200,165 L 220,130 L 280,175 L 280,210 L 200,240 L 230,200 Z", center: { x: 240, y: 180 } },
  { id: "DB", name: "Diourbel", capital: "Diourbel", poleId: "pole-3", coords: "M 120,240 L 130,218 L 145,222 L 142,243 Z", center: { x: 132, y: 231 } },
  { id: "FT", name: "Fatick", capital: "Fatick", poleId: "pole-3", coords: "M 80,265 L 110,270 L 115,285 L 85,295 Z", center: { x: 97, y: 278 } },
  { id: "KL", name: "Kaolack", capital: "Kaolack", poleId: "pole-3", coords: "M 120,240 L 150,230 L 160,260 L 140,290 L 110,270 Z", center: { x: 138, y: 258 } },
  { id: "KF", name: "Kaffrine", capital: "Kaffrine", poleId: "pole-3", coords: "M 140,290 L 160,260 L 195,290 L 175,310 Z", center: { x: 168, y: 285 } },
  { id: "TC", name: "Tambacounda", capital: "Tambacounda", poleId: "pole-6", coords: "M 200,240 L 280,210 L 300,250 L 330,290 L 270,300 L 280,360 L 240,360 L 195,290 Z", center: { x: 250, y: 285 } },
  { id: "KD", name: "Kédougou", capital: "Kédougou", poleId: "pole-6", coords: "M 270,300 L 330,290 L 360,330 L 340,380 L 280,360 Z", center: { x: 310, y: 335 } },
  { id: "ZC", name: "Ziguinchor", capital: "Ziguinchor", poleId: "pole-5", coords: "M 60,370 L 90,372 L 90,400 L 50,400 Z", center: { x: 72, y: 385 } },
  { id: "SD", name: "Sédhiou", capital: "Sédhiou", poleId: "pole-5", coords: "M 90,372 L 125,375 L 125,400 L 90,400 Z", center: { x: 108, y: 386 } },
  { id: "KO", name: "Kolda", capital: "Kolda", poleId: "pole-5", coords: "M 125,375 L 195,380 L 195,400 L 125,400 Z", center: { x: 160, y: 388 } }
];

const POLE_DATA: Record<string, PoleData> = {
  "pole-1": {
    id: "pole-1",
    name: "Pôle Dakar",
    vocation: "Hub de services de haut niveau, économie numérique, innovation technologique, places financières et industries créatives.",
    focus: "Technologie, Services Financiers, Startups, Industries Culturelles, Hub Numérique.",
    pibShare: "46 %",
    pibTarget: "29 %",
    agropoles: "1 Parc Technologique d'Élite",
    color: "#3b82f6",
    borderClass: "border-blue-500/30",
    regions: ["Dakar"],
    projects: [
      { title: "Hub Technologique de Diamniadio", category: "Numérique", status: "En Cours", description: "Déploiement d'infrastructures de cloud national et incubateurs pour l'innovation technologique." },
      { title: "Régulation du Port Autonome & Dématérialisation", category: "Infrastructures", status: "Terminé", description: "Mise en place de guichets uniques numériques pour réduire les délais de dédouanement." },
      { title: "Réseau Express et BRT Électrique", category: "Mobilité", status: "Terminé", description: "Liaisons régulières et transports collectifs à énergie propre pour décongestionner la capitale." }
    ]
  },
  "pole-2": {
    id: "pole-2",
    name: "Pôle Thiès",
    vocation: "Hub logistique majeur, industries manufacturières, extraction minière (phosphates, zircon) et maraîchage.",
    focus: "Mines, Industrie Manufacturière, Horticulture, Fret Aérien & Ferroviaire.",
    pibShare: "Moyenne",
    pibTarget: "Croissance Forte",
    agropoles: "1 Agropole Horticole Intermédiaire",
    color: "#a855f7",
    borderClass: "border-purple-500/30",
    regions: ["Thiès"],
    projects: [
      { title: "Extension de la Zone Aéroportuaire (AIBD)", category: "Logistique", status: "En Cours", description: "Création d'un hub logistique de fret aérien connecté pour l'exportation des produits locaux." },
      { title: "Modernisation des Agropoles Maraîchères", category: "Agro-industrie", status: "En Cours", description: "Unités de stockage frigorifique et de conditionnement pour la production horticole (Kayar, Niayes)." },
      { title: "Connectivité Ferroviaire Nationale", category: "Transport", status: "Planifié", description: "Réhabilitation des voies ferrées voyageurs et marchandises reliant Dakar à Kidira." }
    ]
  },
  "pole-3": {
    id: "pole-3",
    name: "Pôle Centre",
    vocation: "Le bassin arachidier se transforme en un grand pôle agro-industriel pour la souveraineté alimentaire.",
    focus: "Arachide, Céréales locales (mil, maïs, sorgho), Filière Sel, Stockage & Huileries.",
    pibShare: "12 %",
    pibTarget: "51 %",
    agropoles: "Agropole Centre (12 Parcs Agro-industriels)",
    color: "#f59e0b",
    borderClass: "border-amber-500/30",
    regions: ["Diourbel", "Kaolack", "Fatick", "Kaffrine"],
    projects: [
      { title: "Agropole Centre de Kaolack", category: "Agro-industrie", status: "En Cours", description: "Parc industriel regroupant des huileries modernes et des unités de transformation céréalière." },
      { title: "Rénovation du Port Fluvial de Kaolack", category: "Logistique", status: "Planifié", description: "Dragage et réaménagement pour faciliter le transit des marchandises du bassin arachidier." },
      { title: "Valorisation de la Filière Sel de Fatick", category: "Industrie", status: "Terminé", description: "Modernisation des usines de traitement et d'iodation du sel local." }
    ]
  },
  "pole-4": {
    id: "pole-4",
    name: "Pôle Nord",
    vocation: "Sécurité alimentaire nationale, transition énergétique et agro-industrie irriguée.",
    focus: "Hydrocarbures offshore, Riziculture de la vallée, Élevage extensif, Lait & Cuirs.",
    pibShare: "15 %",
    pibTarget: "Stable & Structuré",
    agropoles: "Agropole Nord (Saint-Louis, Louga, Matam)",
    color: "#10b981",
    borderClass: "border-emerald-500/30",
    regions: ["Saint-Louis", "Louga", "Matam"],
    projects: [
      { title: "Projet Gazier Grand Tortue Ahmeyim", category: "Énergie", status: "En Cours", description: "Exploitation de gaz offshore et redistribution des redevances énergétiques pour le pôle." },
      { title: "Sécurisation Rizicole de la Vallée (SAED)", category: "Agriculture", status: "Terminé", description: "Aménagements de canaux d'irrigation et distribution de semences de riz subventionnées." },
      { title: "Centre de Transformation Laitière de Dahra", category: "Élevage", status: "En Cours", description: "Collecte moderne de lait local pour réduire la dépendance aux importations de poudre." }
    ]
  },
  "pole-5": {
    id: "pole-5",
    name: "Pôle Sud",
    vocation: "Agropole Sud axé sur l'arboriculture, la valorisation de la biodiversité et la pêche.",
    focus: "Arboriculture (mangue, anacarde), Riziculture de bas-fonds, Pêche et Transformation halieutique.",
    pibShare: "7 %",
    pibTarget: "Forte Valeur Ajoutée",
    agropoles: "Agropole Sud Casamance (10 Parcs Industriels)",
    color: "#06b6d4",
    borderClass: "border-cyan-500/30",
    regions: ["Ziguinchor", "Sédhiou", "Kolda"],
    projects: [
      { title: "Agropole Sud de Casamance", category: "Agro-industrie", status: "En Cours", description: "Création d'usines de transformation locale pour la mangue et la noix de cajou (anacarde)." },
      { title: "Rétablissement du Cabotage Dakar-Ziguinchor", category: "Transport", status: "Terminé", description: "Navettes maritimes régulières de passagers et de fret pour désenclaver la région." },
      { title: "Modernisation des ports de pêche artisanaux", category: "Pêche", status: "Planifié", description: "Infrastructures de froid et fabriques de glace autonomes à Ziguinchor et Cap Skirring." }
    ]
  },
  "pole-6": {
    id: "pole-6",
    name: "Pôle Est / Sud-Est",
    vocation: "Hub minier majeur, corridor logistique de l'Afrique de l'Ouest et agro-sylvo-pastoral.",
    focus: "Or, Ressources Minières, Coton, Banane, Miel, Karité & Corridor Mali.",
    pibShare: "4 %",
    pibTarget: "20 %",
    agropoles: "Agropole Est (Tambacounda, Kédougou)",
    color: "#e11d48",
    borderClass: "border-rose-500/30",
    regions: ["Tambacounda", "Kédougou"],
    projects: [
      { title: "Encadrement de l'Orpaillage & Partage Fiscal", category: "Mines", status: "En Cours", description: "Structuration des exploitations minières de Kédougou pour augmenter les redevances locales." },
      { title: "Hôpital Régional Amath Dansokho", category: "Santé", status: "Terminé", description: "Mise en service d'un hôpital moderne de niveau 3 pour le sud-est du pays." },
      { title: "Corridor d'infrastructures Tambacounda-Mali", category: "Infrastructures", status: "En Cours", description: "Amélioration des routes de fret et sécurisation des transports transfrontaliers." }
    ]
  },
  "pole-7": {
    id: "pole-7",
    name: "Pôle Tourisme Durable (Transversal)",
    vocation: "Pôle transversal combinant valorisation éco-touristique, préservation des façades maritimes et économie bleue.",
    focus: "Éco-tourisme, Préservation des Mangroves, Hôtellerie responsable, Cabotage maritime.",
    pibShare: "Transversal",
    pibTarget: "Attractivité Globale",
    agropoles: "Façades Maritimes & Parcs Nationaux",
    color: "#14b8a6",
    borderClass: "border-teal-500/30",
    regions: ["Saint-Louis", "Dakar", "Thiès", "Fatick", "Ziguinchor"],
    projects: [
      { title: "Éco-tourisme au Delta du Saloum", category: "Environnement", status: "En Cours", description: "Soutien aux gîtes villageois éco-responsables et protection de la biosphère." },
      { title: "Aménagement touristique de la Petite Côte", category: "Tourisme", status: "Planifié", description: "Modernisation des infrastructures de Saly dans le respect des normes écologiques." },
      { title: "Préservation du Littoral de Guet Ndar", category: "Environnement", status: "En Cours", description: "Lutte contre l'érosion côtière et valorisation de l'ancienne escale fluviale." }
    ]
  },
  "pole-8": {
    id: "pole-8",
    name: "Pôle Artisanat & Industries Créatives (Transversal)",
    vocation: "Pôle transversal axé sur la valorisation du patrimoine national, l'artisanat d'exportation et le design.",
    focus: "Maroquinerie, Tissage, Poterie, Design contemporain, Label Qualité Sénégal.",
    pibShare: "Transversal",
    pibTarget: "Souveraineté Culturelle",
    agropoles: "Centres de labellisation nationaux",
    color: "#f43f5e",
    borderClass: "border-rose-400/30",
    regions: ["Dakar", "Saint-Louis", "Thiès", "Diourbel", "Kaolack"],
    projects: [
      { title: "Labellisation 'Artisanat du Sénégal'", category: "Artisanat", status: "En Cours", description: "Création d'un label d'excellence pour l'exportation des produits en cuir et textile." },
      { title: "Villages Artisanaux de Thiès et Saint-Louis", category: "Culture", status: "Terminé", description: "Modernisation des ateliers des artisans locaux et formation aux normes d'export." },
      { title: "Incubateur de Design et Métiers d'Art", category: "Créativité", status: "Planifié", description: "Lieu de rencontre entre designers modernes et artisans détenteurs de savoir-faire ancestraux." }
    ]
  }
};

export default function SenegalMap() {
  const [viewMode, setViewMode] = useState<"poles" | "regions">("poles");
  const [selectedPoleId, setSelectedPoleId] = useState<string>("pole-3"); // Default to Pôle Centre
  const [selectedRegionId, setSelectedRegionId] = useState<string>("KL"); // Default to Kaolack

  const selectedPole = POLE_DATA[selectedPoleId] || POLE_DATA["pole-3"];
  const selectedRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[7];

  const handleRegionClick = (regionId: string) => {
    const region = REGIONS.find(r => r.id === regionId);
    if (!region) return;
    
    setSelectedRegionId(regionId);
    if (viewMode === "poles") {
      setSelectedPoleId(region.poleId);
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Terminé": return "text-[#10B981] bg-[#10B981]/15 border-[#10B981]/30";
      case "En Cours": return "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
      case "Planifié": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-foreground/50 border-foreground/10";
    }
  };

  // Helper to determine if a region path on the map should be highlighted
  const isRegionHighlighted = (regId: string) => {
    if (viewMode === "regions") {
      return selectedRegionId === regId;
    }
    // In poles mode
    const reg = REGIONS.find(r => r.id === regId);
    if (!reg) return false;
    
    // Check if region is part of selected pole
    if (selectedPole.id === "pole-7" || selectedPole.id === "pole-8") {
      return selectedPole.regions.includes(reg.name);
    }
    return reg.poleId === selectedPole.id;
  };

  // Get color for region fill
  const getRegionFillColor = (regId: string) => {
    const reg = REGIONS.find(r => r.id === regId);
    if (!reg) return "#0E1813";

    if (viewMode === "regions") {
      return selectedRegionId === regId ? "#D4AF37" : "#0E1813";
    }

    // In poles mode, color by pole
    const pole = POLE_DATA[reg.poleId];
    if (isRegionHighlighted(regId)) {
      return pole ? pole.color : "#D4AF37";
    }
    return "#0E1813";
  };

  return (
    <div className="w-full glass-panel p-6 md:p-8 rounded-2xl relative shadow-2xl overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-emerald/10 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <Map className="w-6 h-6 text-brand-gold animate-pulse" />
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground font-display">Sénégal 2050 : Carte des Pôles</h2>
            <p className="text-xs text-foreground/50">La réorganisation souveraine des 14 régions du Sénégal pour rompre avec la centralisation.</p>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex bg-brand-green-dark/40 border border-brand-emerald/15 p-1 rounded-xl self-start md:self-center">
          <button
            onClick={() => {
              setViewMode("poles");
              // Sync pole
              const reg = REGIONS.find(r => r.id === selectedRegionId);
              if (reg) setSelectedPoleId(reg.poleId);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "poles" ? "bg-brand-gold text-brand-green-dark" : "text-foreground/60 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>8 Pôles Économiques</span>
          </button>
          <button
            onClick={() => setViewMode("regions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "regions" ? "bg-brand-gold text-brand-green-dark" : "text-foreground/60 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>14 Régions</span>
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Map Graphic */}
        <div className="xl:col-span-6 flex flex-col items-center bg-brand-green-dark/20 p-4 rounded-xl border border-brand-emerald/10 relative min-h-[420px] md:min-h-[480px] justify-between">
          
          {/* Map Selector for Transversal Poles (7 & 8) when in poles mode */}
          {viewMode === "poles" && (
            <div className="w-full flex justify-center gap-2 mb-4">
              <button
                onClick={() => setSelectedPoleId("pole-7")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                  selectedPoleId === "pole-7"
                    ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/10"
                    : "bg-brand-dark-base/40 text-foreground/50 border-brand-emerald/10 hover:text-white"
                }`}
              >
                <Palette className="w-3 h-3 text-teal-400" />
                <span>Pôle 7 : Tourisme Durable</span>
              </button>
              <button
                onClick={() => setSelectedPoleId("pole-8")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                  selectedPoleId === "pole-8"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10"
                    : "bg-brand-dark-base/40 text-foreground/50 border-brand-emerald/10 hover:text-white"
                }`}
              >
                <Palette className="w-3 h-3 text-rose-400" />
                <span>Pôle 8 : Artisanat Créatif</span>
              </button>
            </div>
          )}

          {/* SVG Map of Senegal */}
          <div className="w-full flex justify-center items-center flex-grow">
            <svg
              viewBox="0 0 400 450"
              width="400"
              height="450"
              className="w-full h-auto max-w-[380px] aspect-[400/450] flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rivers / Borders decoration */}
              <path d="M 50,340 C 90,340 100,345 130,342 C 160,340 180,348 200,345" fill="none" stroke="rgba(14, 115, 81, 0.12)" strokeWidth="6" />
              <path d="M 50,370 C 80,368 120,365 140,368 C 160,370 170,366 190,368" fill="none" stroke="rgba(14, 115, 81, 0.12)" strokeWidth="4" />

              {/* Render 14 Region paths */}
              {REGIONS.map((reg) => {
                const highlighted = isRegionHighlighted(reg.id);
                const fillColor = getRegionFillColor(reg.id);

                return (
                  <g key={reg.id}>
                    <path
                      d={reg.coords}
                      fill={fillColor}
                      stroke={highlighted ? "#D4AF37" : "rgba(14, 115, 81, 0.25)"}
                      strokeWidth={highlighted ? 2 : 1}
                      className="transition-all duration-300 cursor-pointer hover:fill-brand-green/80"
                      onClick={() => handleRegionClick(reg.id)}
                    />
                    
                    {/* Region Label (Name) */}
                    <text
                      x={reg.center.x}
                      y={reg.center.y}
                      className={`text-[8px] font-mono font-bold fill-white/80 pointer-events-none select-none transition-all duration-300 ${
                        highlighted ? "fill-brand-gold font-black scale-110" : ""
                      }`}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {reg.name}
                    </text>
                  </g>
                );
              })}

              {/* Casamance Archipelago Small Markers */}
              <circle 
                cx="50" 
                cy="385" 
                r="3" 
                fill={getRegionFillColor("ZC")} 
                stroke={isRegionHighlighted("ZC") ? "#D4AF37" : "rgba(14, 115, 81, 0.25)"} 
                className="cursor-pointer" 
                onClick={() => handleRegionClick("ZC")} 
              />
              <circle 
                cx="58" 
                cy="388" 
                r="2.5" 
                fill={getRegionFillColor("ZC")} 
                stroke={isRegionHighlighted("ZC") ? "#D4AF37" : "rgba(14, 115, 81, 0.25)"} 
                className="cursor-pointer" 
                onClick={() => handleRegionClick("ZC")} 
              />
            </svg>
          </div>

          {/* Compass / Legend overlay */}
          <div className="w-full flex justify-between items-center text-[9px] font-mono text-foreground/40 mt-4 bg-brand-dark-base/40 p-2.5 rounded border border-brand-emerald/10">
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded bg-brand-gold" /> 
                <span>Sélectionné</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded bg-[#0E1813] border border-brand-emerald/25" /> 
                <span>Autres Régions</span>
              </div>
            </div>
            <span>Source: Souveraineté Territoriale 2050</span>
          </div>
        </div>

        {/* Right Column: Information Display Panel */}
        <div className="xl:col-span-6 min-h-[460px]">
          <AnimatePresence mode="wait">
            {viewMode === "poles" ? (
              <motion.div
                key={selectedPole.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full justify-between"
              >
                {/* Pole Title & Header */}
                <div className={`p-5 rounded-2xl bg-brand-green-dark/20 border ${selectedPole.borderClass} shadow-xl relative`}>
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none" 
                    style={{ backgroundColor: `${selectedPole.color}15` }}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-black font-display text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedPole.color }} />
                      {selectedPole.name}
                    </h3>
                    
                    <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-green/30 px-2.5 py-1 rounded border border-brand-gold/20">
                      Vision 2050
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">Vocation & Rôle :</span>
                    <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                      {selectedPole.vocation}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-brand-emerald/10 pt-3 text-xs font-sans text-foreground/60 flex flex-wrap gap-x-4 gap-y-1">
                    <span><strong>Régions incluses :</strong> {selectedPole.regions.join(", ")}</span>
                  </div>
                </div>

                {/* Pole Focus & Target Numbers */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-brand-green-dark/20 border border-brand-emerald/10 p-3 rounded-xl text-center">
                    <span className="text-[9px] text-foreground/45 block uppercase font-mono font-bold">Focus Agricole/Indus</span>
                    <span className="text-xs font-bold text-brand-gold block mt-1 truncate" title={selectedPole.focus}>
                      {selectedPole.focus.split(",")[0]}
                    </span>
                  </div>
                  
                  <div className="bg-brand-green-dark/20 border border-brand-emerald/10 p-3 rounded-xl text-center">
                    <span className="text-[9px] text-foreground/45 block uppercase font-mono font-bold">PIB Actuel</span>
                    <span className="text-sm font-bold text-white block mt-1">
                      {selectedPole.pibShare}
                    </span>
                  </div>

                  <div className="bg-brand-green-dark/20 border border-brand-emerald/10 p-3 rounded-xl text-center">
                    <span className="text-[9px] text-foreground/45 block uppercase font-mono font-bold">Cible PIB 2050</span>
                    <span className="text-sm font-black text-brand-gold block mt-1">
                      {selectedPole.pibTarget}
                    </span>
                  </div>
                </div>

                {/* Project List */}
                <div className="mt-6 flex-grow">
                  <h4 className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Investissements & Projets Clés</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedPole.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="bg-brand-dark-card border border-brand-emerald/10 p-4 rounded-xl hover:border-brand-emerald/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-brand-emerald-light" />
                            <h5 className="font-bold text-xs text-foreground">{proj.title}</h5>
                          </div>
                          <p className="text-[11px] text-foreground/60 mt-1 sm:pl-6 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center sm:self-center flex-shrink-0">
                          <span className="text-[9px] font-mono font-bold bg-brand-green/35 text-brand-emerald-light px-2 py-0.5 rounded border border-brand-emerald/20">
                            {proj.category}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusColor(proj.status)}`}>
                            {proj.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footnote on agropoles */}
                <div className="mt-4 p-3 rounded-xl bg-brand-gold/5 border border-brand-gold/15 flex items-center gap-2.5 text-xs text-foreground/75 font-sans">
                  <Zap className="w-4 h-4 text-brand-gold animate-bounce" />
                  <span><strong>{selectedPole.agropoles}</strong> déployé(s) (électricité à &lt;60 FCFA/kWh).</span>
                </div>
              </motion.div>
            ) : (
              // REGIONS MODE PANEL
              <motion.div
                key={selectedRegion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full justify-between"
              >
                <div className="p-5 rounded-2xl bg-brand-green-dark/20 border border-brand-emerald/15 shadow-xl relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-gold" />
                      Région de {selectedRegion.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-green/30 px-2 py-0.5 rounded border border-brand-gold/20">
                      Chef-lieu : {selectedRegion.capital}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/75 mt-4 leading-relaxed font-sans">
                    La région de {selectedRegion.name} fait partie intégrante du <strong>{POLE_DATA[selectedRegion.poleId]?.name}</strong> dans le nouveau découpage de développement souverain. Cette organisation permet de mutualiser les infrastructures territoriales et d&apos;implanter des agropoles de transformation agricole adaptés au climat local.
                  </p>
                </div>

                {/* Local Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-brand-green-dark/20 border border-brand-emerald/10 p-3 rounded-xl text-center">
                    <span className="text-[9px] text-foreground/45 block uppercase font-mono font-bold">Région Administrative</span>
                    <span className="text-sm font-bold text-white block mt-1">
                      Sénégal
                    </span>
                  </div>
                  
                  <div className="bg-brand-green-dark/20 border border-brand-emerald/10 p-3 rounded-xl text-center">
                    <span className="text-[9px] text-foreground/45 block uppercase font-mono font-bold">Pôle Économique Rattaché</span>
                    <span className="text-sm font-bold text-brand-gold block mt-1">
                      {POLE_DATA[selectedRegion.poleId]?.name.replace("Pôle", "")}
                    </span>
                  </div>
                </div>

                {/* Sub-projects list */}
                <div className="mt-6 flex-grow">
                  <h4 className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Award className="w-3.5 h-3.5" />
                    <span>Projets Locaux & Réformes</span>
                  </h4>

                  <div className="space-y-3">
                    {POLE_DATA[selectedRegion.poleId]?.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="bg-brand-dark-card border border-brand-emerald/10 p-4 rounded-xl flex justify-between items-center gap-3"
                      >
                        <div>
                          <h5 className="font-bold text-xs text-foreground">{proj.title}</h5>
                          <p className="text-[10px] text-foreground/50 mt-0.5">
                            Focus local pour la souveraineté économique de {selectedRegion.name}.
                          </p>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex-shrink-0 ${getStatusColor(proj.status)}`}>
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-brand-emerald/10 flex items-center justify-between text-[10px] text-foreground/40 font-mono">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-brand-gold" />
                    Réf: Aménagement territorial
                  </span>
                  <a href="/realisations" className="hover:text-brand-gold transition-colors flex items-center gap-0.5">
                    Toutes les réalisations
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Strategic Info Banner at the bottom of the map card */}
      <div className="mt-8 pt-6 border-t border-brand-emerald/10 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-brand-dark-card/50 p-3.5 rounded-xl border border-brand-emerald/10 flex items-start gap-3">
          <Landmark className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-display">Macro-céphalie brisée</strong>
            <span className="text-[11px] text-foreground/50 leading-relaxed block mt-0.5">
              Le poids de Dakar dans le PIB national passera de 46 % à 29 % d&apos;ici 2050.
            </span>
          </div>
        </div>

        <div className="bg-brand-dark-card/50 p-3.5 rounded-xl border border-brand-emerald/10 flex items-start gap-3">
          <Zap className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-display">Agropoles Intégrées</strong>
            <span className="text-[11px] text-foreground/50 leading-relaxed block mt-0.5">
              47 parcs agro-industriels avec électricité garantie à moins de 60 FCFA/kWh.
            </span>
          </div>
        </div>

        <div className="bg-brand-dark-card/50 p-3.5 rounded-xl border border-brand-emerald/10 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-display">Contribution PIB Centre</strong>
            <span className="text-[11px] text-foreground/50 leading-relaxed block mt-0.5">
              Les régions du Centre pèseront pour 51 % du PIB national à terme.
            </span>
          </div>
        </div>

        <div className="bg-brand-dark-card/50 p-3.5 rounded-xl border border-brand-emerald/10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-display">Souveraineté Est</strong>
            <span className="text-[11px] text-foreground/50 leading-relaxed block mt-0.5">
              Le tiers Est du Sénégal représentera 20 % du PIB grâce au pôle minier.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
