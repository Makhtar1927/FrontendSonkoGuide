"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BookOpen, Briefcase, Landmark, ShieldAlert, Award, ChevronRight } from "lucide-react";

export default function BiographiePage() {
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "professional" | "political">("general");
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollLeft > 10) setShowScrollHint(false);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset hint when tab changes (user might be on a new layout)

  const tabs = [
    { id: "general", label: "Présentation & Enfance", icon: User },
    { id: "academic", label: "Parcours Académique", icon: BookOpen },
    { id: "professional", label: "Parcours Professionnel", icon: Briefcase },
    { id: "political", label: "Parcours Politique", icon: Landmark }
  ];

  return (
    <div className="w-full animate-slide-up bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/20 via-brand-dark-base to-brand-dark-base py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em]">Profil Officiel</span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-white mt-3 text-glow-gold">
            Qui est Ousmane Sonko ?
          </h1>
          <p className="text-sm text-foreground/60 mt-3 max-w-xl mx-auto leading-relaxed">
            Biographie complète, histoire familiale, études universitaires et parcours politique d&apos;Ousmane Sonko, Guide de la Révolution et Président de l&apos;Assemblée nationale.
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="border-b border-brand-emerald/15 pb-px mb-12">
          <div className="relative">
            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 flex justify-start md:justify-center"
            >
              <div className="flex gap-2 bg-brand-green-dark/30 p-1.5 rounded-2xl border border-brand-emerald/10 whitespace-nowrap min-w-max mx-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as "general" | "academic" | "professional" | "political");
                        setShowScrollHint(true);
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-brand-gold text-brand-green-dark shadow-lg shadow-brand-gold/15"
                          : "text-foreground/75 hover:bg-brand-green/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scroll hint — visible only on small screens */}
            <AnimatePresence>
              {showScrollHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  className="md:hidden pointer-events-none absolute inset-y-0 right-0 flex items-center"
                >
                  {/* Fade gradient */}
                  <div className="w-16 h-full bg-gradient-to-r from-transparent to-brand-dark-base/90 rounded-r-2xl" />
                  {/* Arrow badge */}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-1 flex items-center justify-center w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold/40 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-4 h-4 text-brand-gold" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tab contents */}
        <div className="min-h-[400px]">
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Personal info card */}
              <div className="md:col-span-5 glass-panel p-6 rounded-2xl border-l-4 border-l-brand-gold shadow-xl">
                <h3 className="text-lg font-bold text-brand-gold font-display mb-4">Informations Personnelles</h3>
                <div className="space-y-4 text-sm font-mono">
                  <div className="flex justify-between border-b border-brand-emerald/10 pb-2">
                    <span className="text-foreground/50">NOM COMPLET :</span>
                    <span className="font-bold text-white text-right">Ousmane Sonko</span>
                  </div>
                  <div className="flex justify-between border-b border-brand-emerald/10 pb-2">
                    <span className="text-foreground/50">DATE DE NAISSANCE :</span>
                    <span className="font-bold text-white text-right">15 Juillet 1974</span>
                  </div>
                  <div className="flex justify-between border-b border-brand-emerald/10 pb-2">
                    <span className="text-foreground/50">LIEU DE NAISSANCE :</span>
                    <span className="font-bold text-white text-right">Thiès, Sénégal</span>
                  </div>
                  <div className="flex justify-between border-b border-brand-emerald/10 pb-2">
                    <span className="text-foreground/50">FONCTIONS :</span>
                    <span className="font-bold text-brand-gold text-right text-xs">Président Assemblée & Guide Révolution</span>
                  </div>
                  <div className="flex justify-between border-b border-brand-emerald/10 pb-2">
                    <span className="text-foreground/50">PARTI POLITIQUE :</span>
                    <span className="font-bold text-white text-right">PASTEF (Président réélu pour 6 ans)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">NATIONALITÉ :</span>
                    <span className="font-bold text-white text-right">Sénégalaise</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative details */}
              <div className="md:col-span-7 space-y-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white font-display mb-3">Enfance & Histoire Familiale</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                    Né à Thiès au cœur du Sénégal, Ousmane Sonko grandit principalement entre Sébikotane, une commune située près de la capitale Dakar, et la région naturelle de Casamance au Sud du Sénégal. Issu d&apos;un milieu familial modeste attaché aux valeurs d&apos;intégrité, de dignité et de travail rigoureux.
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed font-sans mt-3">
                    Son village natal et ses séjours réguliers en Casamance forgeront très tôt sa sensibilité paysanne et son attachement à la terre sénégalaise, à son agriculture et à l&apos;autonomie des régions.
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-brand-emerald">
                  <h3 className="text-xl font-bold text-white font-display mb-3">Éducation Religieuse & Valeurs</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                    Élevé dans une pure tradition religieuse musulmane, il fréquente durant sa jeunesse les écoles coraniques de son quartier. Cette éducation spirituelle joue un rôle fondamental dans la construction de ses valeurs morales : l&apos;éthique (Jom), la droiture, la lutte contre le vol et la justice sociale, des piliers qu&apos;il érigera plus tard en slogan pour PASTEF.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "academic" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Primary / Secondary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative">
                  <span className="text-xs font-mono font-bold text-brand-gold/70 block mb-2">ÉCOLE PRIMAIRE & SECONDAIRE</span>
                  <h3 className="text-lg font-bold text-white mb-3 font-display">Cursus Scolaire Régional</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed font-sans">
                    Ousmane Sonko effectue ses études primaires et secondaires à Sébikotane puis en Casamance. Brillant élève, il obtient son baccalauréat en 1993, ouvrant la voie à ses études universitaires supérieures.
                  </p>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl relative">
                  <span className="text-xs font-mono font-bold text-brand-gold/70 block mb-2">MAÎTRISE EN DROIT</span>
                  <h3 className="text-lg font-bold text-white mb-3 font-display">Université Gaston Berger de Saint-Louis (1993-1999)</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed font-sans">
                    Il s&apos;inscrit à l&apos;Université Gaston Berger (UGB) de Saint-Louis. En 1999, il obtient une Maîtrise en Droit Public, avec pour spécialisation le Droit des Affaires. Son mémoire de fin d&apos;études porte déjà sur le thème : <strong className="text-brand-gold">La fiscalité locale au Sénégal</strong>.
                  </p>
                </div>
              </div>

              {/* Higher education */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 glass-panel p-6 rounded-2xl border-l-4 border-l-brand-gold">
                  <span className="text-xs font-mono font-bold text-brand-gold/70 block mb-2">CONCOURS ET DIPLÔME MAJOR</span>
                  <h3 className="text-lg font-bold text-white mb-3 font-display">L&apos;École Nationale d&apos;Administration (ENA) du Sénégal</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed font-sans">
                    Reçu sur concours à la prestigieuse École Nationale d&apos;Administration (ENA) de Dakar, Ousmane Sonko choisit la section **Impôts et Domaines**. Il en ressort diplômé major ou haut gradé en 2001, prêt à entamer sa carrière de haut fonctionnaire dans l&apos;administration fiscale nationale.
                  </p>
                </div>

                <div className="md:col-span-4 bg-brand-green-dark/30 border border-brand-emerald/10 p-6 rounded-2xl flex flex-col justify-between items-center text-center">
                  <Award className="w-12 h-12 text-brand-gold mb-3 animate-pulse" />
                  <h4 className="font-bold text-white text-sm">Master 2 UCAD</h4>
                  <p className="text-xs text-foreground/60 mt-2">
                    En 2003, il complète ses compétences avec un Master en Finances Publiques et Fiscalité à l&apos;UCAD de Dakar.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "professional" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-panel p-6 md:p-8 rounded-2xl relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xl font-bold text-white font-display mb-4 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-brand-gold" />
                  Inspecteur des Impôts et des Domaines (2001 - 2016)
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                  Durant 15 ans, Ousmane Sonko sert avec rigueur l&apos;administration fiscale du Sénégal. Il a pour mission le contrôle fiscal, la gestion foncière et le recouvrement des taxes publiques. Ses audits et dossiers lui permettent de cartographier précisément l&apos;économie nationale et de relever les nombreuses failles du système fiscal (optimisations agressives et fraude fiscale).
                </p>
                
                <h4 className="font-bold text-brand-gold text-sm mt-6 mb-2 uppercase tracking-wide">Création du syndicat SAID</h4>
                <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                  En 2005, il co-fonde le **Syndicat Autonome des Agents des Impôts et Domaines (SAID)** et en devient le premier Secrétaire Général. Il milite pour de meilleures conditions de travail pour les inspecteurs, mais surtout pour une administration fiscale intègre, transparente et unie contre la corruption politique.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Radiation alert box */}
                <div className="md:col-span-8 glass-panel p-6 rounded-2xl border-l-4 border-l-[#EF4444] bg-[#EF4444]/5 flex gap-4 items-start">
                  <ShieldAlert className="w-8 h-8 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#EF4444] text-base font-display">La Radiation d&apos;Août 2016</h4>
                    <p className="text-xs md:text-sm text-foreground/75 leading-relaxed mt-2 font-sans">
                      En août 2016, après avoir rendu publics des dossiers fiscaux sensibles dénonçant les privilèges illégaux et le non-paiement de l&apos;impôt par les parlementaires et l&apos;entourage présidentiel, Ousmane Sonko est radié de la fonction publique par décret présidentiel. Cette décision politique propulse alors le haut fonctionnaire sur le devant de la scène politique en tant que figure de la dissidence et lance sa carrière d&apos;opposition à plein temps.
                    </p>
                  </div>
                </div>

                {/* Reforms list card */}
                <div className="md:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <h4 className="font-bold text-white text-sm font-display mb-3">Réformes Fiscales Proposées</h4>
                  <ul className="space-y-2 text-xs text-foreground/70">
                    <li className="flex items-center gap-1.5">• Suppression des passe-droits</li>
                    <li className="flex items-center gap-1.5">• Taxation juste des multinationales</li>
                    <li className="flex items-center gap-1.5">• Cadastre foncier numérisé</li>
                    <li className="flex items-center gap-1.5">• Redevabilité des dirigeants</li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-brand-emerald/10 text-center">
                    <span className="text-[10px] font-mono text-brand-gold">Auteur de solutions fiscales</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "political" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-panel p-6 md:p-8 rounded-2xl relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xl font-bold text-white font-display mb-4 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-brand-gold" />
                  De l&apos;Assemblée Nationale à la Révolution (2017 - 2026)
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed font-sans">
                  Après sa radiation en 2016, Ousmane Sonko se consacre exclusivement à la politique. Il est élu député en 2017 et publie son livre de réformes phare <strong className="text-brand-gold">Solutions</strong>. Sa candidature à la présidentielle de 2019 se solde par une troisième place historique (15,67% des voix). En 2022, il est élu maire de la ville de Ziguinchor.
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed font-sans mt-3">
                  Après la victoire de PASTEF à l&apos;élection présidentielle de 2024, il est nommé Premier Ministre. En mai 2026, à la suite de nouvelles élections législatives qui consolident la majorité, il est élu Président de l&apos;Assemblée nationale le 26 mai 2026 pour diriger les réformes législatives et institutionnelles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 glass-panel p-6 rounded-2xl border-l-4 border-l-brand-gold">
                  <h4 className="font-bold text-white text-base font-display">Guide de la Révolution & Congrès 2026</h4>
                  <p className="text-xs md:text-sm text-foreground/75 leading-relaxed mt-2 font-sans">
                    Lors du premier congrès extraordinaire de PASTEF-Les Patriotes les 6 et 7 juin 2026 à Diamniadio, Ousmane Sonko est réélu à l&apos;unanimité à la présidence du parti pour un mandat de 6 ans. Ce congrès le consacre officiellement comme le **Guide de la Révolution**, affirmant son rôle de guide spirituel, moral et politique de la transformation nationale et souveraine du Sénégal.
                  </p>
                </div>

                <div className="md:col-span-5 bg-brand-green-dark/30 border border-brand-emerald/10 p-6 rounded-2xl flex flex-col justify-between">
                  <h4 className="font-bold text-brand-gold text-sm font-display mb-3">Étapes Politiques Majeures</h4>
                  <ul className="space-y-2 text-xs text-foreground/70">
                    <li className="flex items-center gap-1.5">• 2014 : Fondation de PASTEF</li>
                    <li className="flex items-center gap-1.5">• 2017 : Élection comme Député</li>
                    <li className="flex items-center gap-1.5">• 2022 : Élu Maire de Ziguinchor</li>
                    <li className="flex items-center gap-1.5">• 2024 : Nommé Premier Ministre</li>
                    <li className="flex items-center gap-1.5">• 2026 : Élu Président de l&apos;Assemblée</li>
                    <li className="flex items-center gap-1.5">• 2026 : Réélu Président PASTEF (6 ans)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
