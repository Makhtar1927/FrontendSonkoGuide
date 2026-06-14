"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ShieldAlert, Scale, Flag, UserCheck, Award, Activity, Calendar } from "lucide-react";
import { supabase } from "@/utils/supabase";
import initialScenarios from "@/data/scenarios.json";

interface EventScenario {
  id: string;
  date: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  theme: string;
  image: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert: ShieldAlert,
  Scale: Scale,
  Flag: Flag,
  UserCheck: UserCheck,
  Award: Award,
  Activity: Activity
};

export default function EventsSlider360() {
  const [scenarios, setScenarios] = useState<EventScenario[]>(initialScenarios as EventScenario[]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const { data, error } = await supabase
          .from("scenarios")
          .select("*")
          .order("date", { ascending: true }); // order chronologically if needed, or by date/year
        if (error) throw error;
        if (data && data.length > 0) {
          // Sort manually by year/date or use the returned order
          const sorted = [...data].sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearA - yearB;
          });
          setScenarios(sorted as unknown as EventScenario[]);
        }
      } catch (err) {
        console.warn("Could not fetch scenarios from Supabase, using local fallback", err);
      }
    };
    fetchScenarios();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 320; // Approximately the circle diameter + gap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full relative">
      {/* Scroll controls */}
      <div className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 z-20">
        <button
          onClick={() => scroll("left")}
          className="p-3 rounded-full bg-brand-green-dark/80 border border-brand-emerald/20 hover:border-brand-gold hover:text-brand-gold text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
          title="Précédent"
          aria-label="Précédent"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 z-20">
        <button
          onClick={() => scroll("right")}
          className="p-3 rounded-full bg-brand-green-dark/80 border border-brand-emerald/20 hover:border-brand-gold hover:text-brand-gold text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
          title="Suivant"
          aria-label="Suivant"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Sliding circles list container */}
      <div
        ref={containerRef}
        className="flex gap-8 overflow-x-auto py-8 px-4 md:px-12 scrollbar-none select-none snap-x snap-mandatory scroll-smooth"
      >
        {scenarios.map((scenario) => {
          const Icon = ICON_MAP[scenario.icon] || Calendar;
          return (
            <div
              key={scenario.id}
              className="snap-center flex-shrink-0 relative group"
            >
              {/* Spinning decorative ring on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-gold/0 group-hover:border-brand-gold/40 group-hover:rotate-180 transition-all duration-1000 scale-[1.05] pointer-events-none z-10" />

              {/* The Circle Element */}
              <div className={`w-72 h-72 rounded-full border flex flex-col items-center justify-center p-8 text-center relative overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-xl ${scenario.theme}`}>
                
                {/* Background Image with zoom on hover */}
                {/* eslint-disable-next-line react/forbid-dom-props */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-750 group-hover:scale-110"
                  style={{ backgroundImage: `url(${scenario.image})` }}
                />

                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-base via-brand-green-dark/85 to-brand-green-dark/40 group-hover:via-brand-green-dark/90 transition-all duration-300" />

                {/* Content Container (relative z-10 for layering) */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  {/* Icon wrapper */}
                  <div className="w-11 h-11 rounded-full bg-brand-dark-base/70 border border-brand-emerald/20 flex items-center justify-center mb-3.5 text-brand-gold shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {/* Event Metadata */}
                  <span className="text-[9.5px] font-mono font-bold text-brand-gold/90 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{scenario.date}</span>
                  </span>

                  {/* Event Title */}
                  <h3 className="text-sm font-extrabold text-white font-display leading-tight mb-2 group-hover:text-brand-gold transition-colors px-1 text-glow-gold">
                    {scenario.title}
                  </h3>

                  {/* Event Description */}
                  <p className="text-[10px] text-foreground/80 leading-relaxed font-sans line-clamp-3 px-2">
                    {scenario.description}
                  </p>
                  
                  {/* Tiny indicator decoration */}
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/30 mt-3 group-hover:bg-brand-gold transition-colors duration-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
