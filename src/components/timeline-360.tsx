"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, Filter, Sliders, ChevronLeft, ChevronRight, BookOpen, User, Briefcase, Landmark } from "lucide-react";
import { supabase } from "@/utils/supabase";
import timelineData from "@/data/timeline.json";

interface TimelineEvent {
  year: string;
  title: string;
  category: string;
  importance: number;
  description: string;
  media: string | string[];
}

export default function Timeline360() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(timelineData as TimelineEvent[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minImportance, setMinImportance] = useState<number>(3); // Default to major milestones (>=3)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  // Image index is stored alongside the event title so it auto-resets when the displayed event changes
  const [imageState, setImageState] = useState<{ eventTitle: string | null; index: number }>({ eventTitle: null, index: 0 });
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const { data, error } = await supabase
          .from("timeline")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setTimeline(data as unknown as TimelineEvent[]);
        }
      } catch (err) {
        console.warn("Could not fetch timeline from Supabase, using local fallback", err);
      }
    };
    fetchTimeline();
  }, []);

  // (image index reset is handled via imageState — see below)

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hide scroll hint once user starts scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollLeft > 10) setShowScrollHint(false);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { id: "all", label: "Tous", icon: Filter },
    { id: "personal", label: "Jeunesse & Personnel", icon: User },
    { id: "academic", label: "Académique", icon: BookOpen },
    { id: "professional", label: "Professionnel", icon: Briefcase },
    { id: "political", label: "Politique", icon: Landmark },
  ];

  // Filter events based on criteria
  const filteredEvents = useMemo(() => {
    return timeline.filter((event) => {
      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.year.includes(searchQuery);
      const matchesImportance = event.importance >= minImportance;
      
      return matchesCategory && matchesSearch && matchesImportance;
    }).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [timeline, selectedCategory, searchQuery, minImportance]);

  // Derive the displayed event without state mutation in effects
  const activeEvent = useMemo(() => {
    if (filteredEvents.length === 0) return null;
    if (!selectedEvent) return filteredEvents[0];
    const stillExists = filteredEvents.some(e => e.title === selectedEvent.title);
    return stillExists ? selectedEvent : filteredEvents[0];
  }, [filteredEvents, selectedEvent]);

  // Current image index — auto-resets to 0 when the displayed event changes
  const currentImageIndex = imageState.eventTitle === activeEvent?.title ? imageState.index : 0;

  // Navigation handlers for horizontal scroll
  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 340; // Approx card width
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setShowScrollHint(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "personal": return <User className="w-4 h-4" />;
      case "academic": return <BookOpen className="w-4 h-4" />;
      case "professional": return <Briefcase className="w-4 h-4" />;
      case "political": return <Landmark className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "personal": return "border-blue-500 text-blue-400 bg-blue-500/10";
      case "academic": return "border-purple-500 text-purple-400 bg-purple-500/10";
      case "professional": return "border-orange-500 text-orange-400 bg-orange-500/10";
      case "political": return "border-brand-gold text-brand-gold bg-brand-gold/10";
      default: return "border-brand-emerald text-brand-emerald bg-brand-emerald/10";
    }
  };

  return (
    <div className="w-full relative py-8">
      {/* Background glow lines */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-emerald/20 to-transparent -translate-y-1/2 pointer-events-none" />

      {/* Control panel (Filters + Search + Importance Slider) */}
      <div className="glass-panel p-6 rounded-2xl mb-8 flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center relative z-10">
        
        {/* Categories row */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-gold text-brand-green-dark border-brand-gold shadow-lg shadow-brand-gold/15"
                    : "bg-emerald-50 dark:bg-brand-green/20 border-brand-emerald/20 text-foreground/80 hover:bg-emerald-100 dark:hover:bg-brand-green/40 hover:border-brand-gold/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Importance row */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Rechercher une date, événement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-50/60 dark:bg-brand-green/20 border border-brand-emerald/25 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:border-brand-gold text-foreground placeholder:text-foreground/45 transition-all"
            />
            <Search className="w-4 h-4 text-foreground/50 absolute left-3 top-3" />
          </div>

          {/* Slider */}
          <div className="flex items-center gap-3 bg-emerald-50/60 dark:bg-brand-green/10 border border-brand-emerald/15 px-4 py-1.5 rounded-xl">
            <Sliders className="w-4 h-4 text-brand-gold" />
            <div className="flex flex-col">
              <span className="text-[10px] text-foreground/55 font-mono leading-none">IMPORTANCE</span>
              <input
                type="range"
                min="1"
                max="5"
                value={minImportance}
                onChange={(e) => setMinImportance(parseInt(e.target.value))}
                title="Importance minimale"
                aria-label="Importance minimale"
                className="w-24 h-1 bg-brand-green-dark rounded-lg appearance-none cursor-pointer accent-brand-gold mt-1"
              />
            </div>
            <span className="text-xs font-mono font-bold text-brand-gold bg-brand-green/35 px-1.5 py-0.5 rounded">
              +{minImportance}
            </span>
          </div>
        </div>
      </div>

      {/* Main interactive horizontal scroll section */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl">
          <p className="text-foreground/50 text-sm">Aucun événement ne correspond à vos filtres.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Arrow navigation buttons */}
          <button
            onClick={() => scroll("left")}
            title="Défiler vers la gauche"
            aria-label="Défiler vers la gauche"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-brand-green/80 border border-brand-gold/30 hover:bg-brand-emerald text-white shadow-2xl transition-all hover:scale-110 cursor-pointer hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            title="Défiler vers la droite"
            aria-label="Défiler vers la droite"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-brand-green/80 border border-brand-gold/30 hover:bg-brand-emerald text-white shadow-2xl transition-all hover:scale-110 cursor-pointer hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrolling items wrapper */}
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto px-4 md:px-12 py-6 scrollbar-thin select-none relative snap-x snap-mandatory"
          >
            {filteredEvents.map((event, index) => {
              const isActive = activeEvent?.title === event.title;
              return (
                <div
                  key={event.title}
                  onClick={() => setSelectedEvent(event)}
                  className="flex-shrink-0 w-[300px] md:w-[320px] cursor-pointer snap-start"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`h-[180px] p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                      isActive 
                        ? "glass-panel-gold border-brand-gold shadow-lg shadow-brand-gold/10" 
                        : "glass-card hover:border-brand-emerald/60"
                    }`}
                  >
                    {/* Event header card info */}
                    <div className="flex justify-between items-start">
                      <span className="text-2xl font-bold font-display text-brand-gold tracking-tight">
                        {event.year}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>

                    {/* Event title */}
                    <h3 className="text-base font-bold text-foreground line-clamp-2 mt-2 group-hover:text-brand-gold transition-colors">
                      {event.title}
                    </h3>

                    {/* Footer decoration */}
                    <div className="flex justify-between items-center mt-3 border-t border-brand-emerald/10 pt-2">
                      <div className="flex gap-1">
                        {Array.from({ length: event.importance }).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                        ))}
                      </div>
                      <span className="text-[10px] text-foreground/45 flex items-center gap-1">
                        Voir détails {getCategoryIcon(event.category)}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Scroll hint — visible only on small screens where arrow buttons are hidden */}
          <AnimatePresence>
            {showScrollHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                className="md:hidden pointer-events-none absolute inset-y-0 right-0 flex items-center"
              >
                {/* Fade gradient */}
                <div className="w-20 h-full bg-gradient-to-r from-transparent to-brand-dark-base/90 rounded-r-2xl" />
                {/* Bouncing arrow badge */}
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-2 flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 backdrop-blur-sm shadow-lg"
                >
                  <ChevronRight className="w-4 h-4 text-brand-gold" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Expanded detail panel for the active event */}
      <AnimatePresence mode="wait">
        {activeEvent && (
          <motion.div
            key={activeEvent.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-12 glass-panel p-6 md:p-8 rounded-2xl border-l-4 border-l-brand-gold relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-brand-green/10 to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Event Text Detail */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl font-extrabold text-brand-gold font-display text-glow-gold">
                    {activeEvent.year}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs uppercase font-bold border ${getCategoryColor(activeEvent.category)}`}>
                    {activeEvent.category}
                  </span>
                  <span className="text-xs text-foreground/45 flex items-center gap-1 ml-auto">
                    Importance {activeEvent.importance}/5
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {activeEvent.title}
                </h2>

                <p className="text-sm md:text-base text-foreground/85 leading-relaxed font-sans">
                  {activeEvent.description}
                </p>
              </div>

              {/* Event Image / Media */}
              <div className="lg:col-span-5 relative h-[220px] md:h-[260px] rounded-xl overflow-hidden border border-brand-emerald/20 shadow-2xl group/media">
                {(() => {
                  const mediaUrls = Array.isArray(activeEvent.media) 
                    ? activeEvent.media 
                    : [activeEvent.media];
                  
                  const hasMultiple = mediaUrls.length > 1;
                  const currentUrl = mediaUrls[currentImageIndex] || "";

                  if (!currentUrl.startsWith("http")) {
                    return (
                      <div className="w-full h-full bg-brand-green-dark flex items-center justify-center text-brand-gold/40">
                        Image Indisponible
                      </div>
                    );
                  }

                  return (
                    <div className="relative w-full h-full">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentUrl}
                          src={currentUrl}
                          alt={`${activeEvent.title} - Image ${currentImageIndex + 1}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {hasMultiple && (
                        <>
                          {/* Navigation Chevrons */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageState({ eventTitle: activeEvent?.title ?? null, index: currentImageIndex === 0 ? mediaUrls.length - 1 : currentImageIndex - 1 });
                            }}
                            title="Image précédente"
                            aria-label="Image précédente"
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-brand-green-dark/80 border border-brand-gold/30 hover:bg-brand-emerald text-white opacity-0 group-hover/media:opacity-100 transition-opacity cursor-pointer z-10"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageState({ eventTitle: activeEvent?.title ?? null, index: currentImageIndex === mediaUrls.length - 1 ? 0 : currentImageIndex + 1 });
                            }}
                            title="Image suivante"
                            aria-label="Image suivante"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-brand-green-dark/80 border border-brand-gold/30 hover:bg-brand-emerald text-white opacity-0 group-hover/media:opacity-100 transition-opacity cursor-pointer z-10"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Image count index badge */}
                          <div className="absolute top-2 right-2 bg-brand-green-dark/80 border border-brand-emerald/30 text-brand-gold font-mono text-[10px] px-2 py-0.5 rounded-md font-bold z-10">
                            {currentImageIndex + 1} / {mediaUrls.length}
                          </div>

                          {/* Dots indicator */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-brand-green-dark/60 px-2 py-1 rounded-full border border-brand-emerald/15">
                            {mediaUrls.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageState({ eventTitle: activeEvent?.title ?? null, index: dotIdx });
                                }}
                                title={`Aller à l'image ${dotIdx + 1}`}
                                aria-label={`Aller à l'image ${dotIdx + 1}`}
                                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                  dotIdx === currentImageIndex 
                                    ? "bg-brand-gold w-3" 
                                    : "bg-white/40 hover:bg-white/75"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-base via-transparent to-transparent opacity-65 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
