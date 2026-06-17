"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Filter, Search, Award, TrendingUp, CheckCircle } from "lucide-react";
import { supabase } from "@/utils/supabase";
import realizationsData from "@/data/realizations.json";

interface Project {
  id: string;
  domain: string;
  title: string;
  description: string;
  objectifs: string[];
  resultats: string[];
  kpis: { label: string; value: string }[];
  media: string;
}

export default function RealisationsPage() {
  const [realizations, setRealizations] = useState<Project[]>(realizationsData as Project[]);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchRealizations = async () => {
      try {
        const { data, error } = await supabase.from("realizations").select("*");
        if (error) throw error;
        if (data && data.length > 0) {
          setRealizations(data as Project[]);
        }
      } catch (err) {
        console.warn("Could not fetch realizations from Supabase, using local fallback", err);
      }
    };
    fetchRealizations();
  }, []);

  const domains = [
    "all",
    "Économie",
    "Emploi",
    "Agriculture",
    "Éducation",
    "Santé",
    "Infrastructures",
    "Numérique"
  ];

  const filteredProjects = useMemo(() => {
    return realizations.filter((proj) => {
      const matchesDomain = selectedDomain === "all" || proj.domain === selectedDomain;
      const matchesSearch = 
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.domain.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDomain && matchesSearch;
    });
  }, [realizations, selectedDomain, searchQuery]);

  return (
    <div className="w-full animate-slide-up bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/20 via-brand-dark-base to-brand-dark-base py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Bilan & Vision</span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-white mt-3 text-glow-gold">
            Réalisations & Projets
          </h1>
          <p className="text-sm text-foreground/60 mt-3 max-w-xl mx-auto leading-relaxed">
            Consultez les chantiers prioritaires, réformes fiscales et projets de développement national pilotés et inspirés par Ousmane Sonko.
          </p>
        </div>

        {/* Filter controls */}
        <div className="glass-panel p-6 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Domains filters */}
          <div className="flex flex-wrap gap-2">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                  selectedDomain === dom
                    ? "bg-brand-gold text-brand-green-dark border-brand-gold shadow-md"
                    : "bg-brand-green/15 border-brand-emerald/15 text-foreground/75 hover:bg-brand-green/30"
                }`}
              >
                {dom === "all" ? "Tous les Secteurs" : dom}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Rechercher une réalisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-green/20 border border-brand-emerald/25 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:border-brand-gold text-foreground transition-all"
            />
            <Search className="w-4 h-4 text-foreground/50 absolute left-3 top-3" />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-brand-emerald/15 hover:border-brand-gold/30 transition-all group"
              >
                {/* Media Image */}
                <div className="relative h-[200px] w-full overflow-hidden border-b border-brand-emerald/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.media}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-base via-transparent to-transparent opacity-75" />
                  
                  {/* Category label badge */}
                  <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-green-dark border border-brand-gold shadow-md">
                    {proj.domain}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display leading-tight group-hover:text-brand-gold transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-foreground/75 mt-3 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Objectives / Results */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider mb-2">Objectifs Clefs</h4>
                        <ul className="space-y-1.5 text-xs text-foreground/70">
                          {proj.objectifs.map((obj, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-brand-gold mt-0.5">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono font-bold text-brand-emerald-light uppercase tracking-wider mb-2">Résultats Obtenus</h4>
                        <ul className="space-y-1.5 text-xs text-foreground/70">
                          {proj.resultats.map((res, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-brand-emerald-light flex-shrink-0 mt-0.5" />
                              <span>{res}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* KPIs Footer */}
                  <div className="mt-8 pt-4 border-t border-brand-emerald/10 grid grid-cols-3 gap-2 text-center bg-brand-green-dark/15 rounded-xl p-3">
                    {proj.kpis.map((kpi, i) => (
                      <div key={i} className="border-r border-brand-emerald/10 last:border-none">
                        <span className="text-[9px] text-foreground/50 block font-mono uppercase">{kpi.label}</span>
                        <span className="text-sm font-extrabold text-brand-gold block mt-0.5">{kpi.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="col-span-2 text-center py-20 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl">
              <p className="text-foreground/50 text-sm">Aucune réalisation ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
