"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Download, Star, Play, Library } from "lucide-react";

interface Video {
  id: string;
  title: string;
  category: "Discours" | "Interviews" | "Débats" | "Conférences" | "Podcasts";
  youtubeId: string;
  duration: string;
  date: string;
  featured?: boolean;
}

interface DocumentItem {
  title: string;
  type: string;
  size: string;
  downloads: string;
  description: string;
  link?: string;
}

import { supabase } from "@/utils/supabase";
import VIDEOS_DATA from "@/data/videos.json";
import DOCUMENTS_DATA from "@/data/documents_files.json";

export default function BibliothequePage() {
  const [activeTab, setActiveTab] = useState<"videos" | "documents">("videos");
  const [videoFilter, setVideoFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>(VIDEOS_DATA as Video[]);
  const [documents, setDocuments] = useState<DocumentItem[]>(DOCUMENTS_DATA as DocumentItem[]);

  useEffect(() => {
    const fetchVideosAndDocs = async () => {
      try {
        const { data: vData, error: vError } = await supabase.from("videos").select("*");
        if (vError) throw vError;
        if (vData && vData.length > 0) {
          const mappedVideos = vData.map((item: { id: string; title: string; category: string; youtube_id: string; duration: string; date: string; featured?: boolean }) => ({
            id: item.id,
            title: item.title,
            category: item.category as Video["category"],
            youtubeId: item.youtube_id, // map youtube_id -> youtubeId
            duration: item.duration,
            date: item.date,
            featured: item.featured ?? false
          }));
          setVideos(mappedVideos);
        }

        const { data: dData, error: dError } = await supabase.from("documents_files").select("*");
        if (dError) throw dError;
        if (dData && dData.length > 0) {
          setDocuments(dData as DocumentItem[]);
        }
      } catch (err) {
        console.warn("Could not fetch media data from Supabase, using local fallback", err);
      }
    };
    fetchVideosAndDocs();
  }, []);

  // Load favorites from localstorage
  useEffect(() => {
    const saved = localStorage.getItem("sonko-favorites");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Promise.resolve().then(() => {
          setFavorites(parsed);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleFavorite = (id: string) => {
    let updated = [];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("sonko-favorites", JSON.stringify(updated));
  };

  const filteredVideos = videos.filter(vid => {
    const matchesCategory = videoFilter === "all" || 
      (videoFilter === "favorites" ? favorites.includes(vid.id) : vid.category === videoFilter);
    const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vid.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredDocs = documents.filter(doc => {
    return doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full animate-slide-up bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/20 via-brand-dark-base to-brand-dark-base py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Médiathèque</span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-white mt-3 text-glow-gold">
            Bibliothèque & Vidéothèque
          </h1>
          <p className="text-sm text-foreground/60 mt-3 max-w-xl mx-auto leading-relaxed">
            Consultez les discours vidéos officiels, interviews phares, et téléchargez les livres et documents programmatiques de référence.
          </p>
        </div>

        {/* Section switcher */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-2 bg-brand-green-dark/30 p-1.5 rounded-2xl border border-brand-emerald/10">
            <button
              onClick={() => { setActiveTab("videos"); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "videos"
                  ? "bg-brand-gold text-brand-green-dark shadow-md"
                  : "text-foreground/75 hover:bg-brand-green/30"
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Vidéothèque YouTube</span>
            </button>
            <button
              onClick={() => { setActiveTab("documents"); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-brand-gold text-brand-green-dark shadow-md"
                  : "text-foreground/75 hover:bg-brand-green/30"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Centre de Documentation (PDF)</span>
            </button>
          </div>
        </div>

        {/* VIDÉOS SECTION */}
        {activeTab === "videos" && (
          <div>
            {/* VIDÉO À LA UNE */}
            {(() => {
              const featuredVid = videos.find(v => v.featured);
              if (!featuredVid) return null;
              return (
                <div className="mb-10 rounded-3xl overflow-hidden border border-brand-gold/20 shadow-2xl shadow-brand-gold/5 relative">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold text-brand-green-dark text-[10px] font-black uppercase tracking-wider shadow-lg">
                    <Star className="w-3 h-3 fill-brand-green-dark" />
                    Vidéo à la une
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-brand-dark-base/80 border border-brand-emerald/20 text-[10px] font-mono text-foreground/70">
                    {featuredVid.duration}
                  </div>

                  {/* Iframe player */}
                  <div className="relative w-full aspect-[21/9]">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${featuredVid.youtubeId}?rel=0&modestbranding=1`}
                      title={featuredVid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Info bar */}
                  <div className="bg-brand-green-dark/60 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-2 py-0.5 rounded border border-brand-gold/20">
                        {featuredVid.category}
                      </span>
                      <h2 className="text-white font-bold text-base md:text-lg mt-2 leading-snug">
                        {featuredVid.title}
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono text-foreground/45 whitespace-nowrap">{featuredVid.date}</span>
                  </div>
                </div>
              );
            })()}
            {/* Search and Sub-filters */}
            <div className="glass-panel p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {["all", "Discours", "Interviews", "Débats", "Conférences", "Podcasts", "favorites"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setVideoFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      videoFilter === filter
                        ? "bg-brand-gold text-brand-green-dark border-brand-gold shadow-sm"
                        : "bg-brand-green/15 border-brand-emerald/15 text-foreground/75 hover:bg-brand-green/30"
                    }`}
                  >
                    {filter === "all" ? "Toutes" : filter === "favorites" ? "Mes Favoris ⭐" : filter}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  placeholder="Rechercher une vidéo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-green/20 border border-brand-emerald/25 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:border-brand-gold text-foreground transition-all"
                />
                <Search className="w-4 h-4 text-foreground/50 absolute left-3 top-3" />
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredVideos.map((vid) => (
                  <motion.div
                    key={vid.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between border border-brand-emerald/10 relative"
                  >
                    {/* Mock Video player wrapper */}
                    <div className="relative aspect-video w-full bg-black border-b border-brand-emerald/10">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                        title={vid.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      
                      {/* Favorites star button */}
                      <button
                        onClick={() => toggleFavorite(vid.id)}
                        title={favorites.includes(vid.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                        aria-label={favorites.includes(vid.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                        className="absolute top-2 right-2 p-2 rounded-full bg-brand-dark-base/80 border border-brand-emerald/10 hover:border-brand-gold/45 text-foreground/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(vid.id) ? "fill-brand-gold text-brand-gold" : "text-foreground/60"}`} />
                      </button>
                    </div>

                    {/* Card Content details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-2 py-0.5 rounded border border-brand-gold/20">
                          {vid.category}
                        </span>
                        <h4 className="font-bold text-sm text-foreground mt-3 line-clamp-2 leading-snug">
                          {vid.title}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-brand-emerald/10 flex justify-between items-center text-[10px] text-foreground/45 font-mono">
                        <span>{vid.date}</span>
                        <span>Durée: {vid.duration}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredVideos.length === 0 && (
                <div className="col-span-3 text-center py-20 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl">
                  <p className="text-foreground/50 text-sm">Aucune vidéo ne correspond à vos critères.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DOCUMENTS SECTION */}
        {activeTab === "documents" && (
          <div>
            {/* Search inputs */}
            <div className="glass-panel p-6 rounded-2xl mb-8 flex justify-between items-center">
              <h3 className="text-sm font-mono font-bold text-brand-gold uppercase tracking-wider flex items-center gap-2">
                <Library className="w-4 h-4" />
                <span>Base Documentaire Téléchargeable</span>
              </h3>
              
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="Filtrer les documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-green/20 border border-brand-emerald/25 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:border-brand-gold text-foreground transition-all"
                />
                <Search className="w-4 h-4 text-foreground/50 absolute left-3 top-3" />
              </div>
            </div>

            {/* Documents Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredDocs.map((doc, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="glass-panel p-6 rounded-2xl border-l-4 border-l-brand-emerald flex justify-between items-start gap-4 hover:border-brand-gold/40 transition-all group"
                  >
                    <div className="flex-1">
                      <span className="text-[10px] font-mono font-bold text-brand-gold/60 uppercase block mb-1">
                        {doc.type}
                      </span>
                      <h4 className="text-lg font-bold text-white font-display leading-snug group-hover:text-brand-gold transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
                        {doc.description}
                      </p>

                      <div className="flex gap-4 mt-4 text-[10px] font-mono text-foreground/40">
                        <span>Poids: {doc.size}</span>
                        <span>•</span>
                        <span>Téléchargements: {doc.downloads}</span>
                      </div>
                    </div>

                    {doc.link ? (
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Télécharger le document"
                        aria-label="Télécharger le document"
                        className="p-3.5 rounded-xl bg-brand-green/30 border border-brand-emerald/15 hover:bg-brand-gold hover:text-brand-green-dark hover:border-brand-gold transition-all text-brand-gold cursor-pointer flex items-center justify-center"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    ) : (
                      <button
                        onClick={() => alert(`Le document '${doc.title}' est en cours de mise en ligne.`)}
                        title="Document non disponible"
                        aria-label="Document non disponible"
                        className="p-3.5 rounded-xl bg-brand-green/10 border border-brand-emerald/5 text-foreground/30 cursor-not-allowed flex items-center justify-center"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredDocs.length === 0 && (
                <div className="col-span-2 text-center py-20 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl">
                  <p className="text-foreground/50 text-sm">Aucun document ne correspond à votre recherche.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
