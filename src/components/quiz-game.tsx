"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  Trophy, 
  User, 
  ShieldCheck, 
  Download, 
  Users, 
  Flame, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import quizData from "@/data/quizzes.json";
import { supabase } from "@/utils/supabase";
import { trackEvent } from "@/utils/analytics";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: "debutant" | "expert" | "champion";
  category: "biographie" | "parti" | "programme" | "institutions";
}

type CategoryId = "all" | "biographie" | "parti" | "programme" | "institutions";

interface LeaderboardUser {
  rank: number;
  name: string;
  score: number;
  badge: string;
  time: string;
}

const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Moustapha Ndiaye", score: 100, badge: "Platine", time: "1m 14s" },
  { rank: 2, name: "Fatoumata Diallo", score: 100, badge: "Platine", time: "1m 35s" },
  { rank: 3, name: "Ibrahima Sarr", score: 93, badge: "Or", time: "2m 05s" },
  { rank: 4, name: "Awa Diop", score: 90, badge: "Or", time: "1m 45s" },
  { rank: 5, name: "Amadou Beye", score: 86, badge: "Argent", time: "2m 12s" }
];

const CATEGORIES = [
  {
    id: "all",
    name: "Défi Général",
    description: "Toutes thématiques confondues pour tester l'intégralité de vos connaissances de citoyen-patriote.",
    icon: Trophy,
    color: "from-brand-gold/20 to-brand-gold-light/10 border-brand-gold/30 text-brand-gold",
    badgeColor: "bg-brand-gold/20 text-brand-gold border-brand-gold/30 font-bold"
  },
  {
    id: "biographie",
    name: "Biographie & Parcours",
    description: "Jeunesse, études à l'UGB, entrée à l'ENA, carrière de haut fonctionnaire et ascension politique du leader.",
    icon: User,
    color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold"
  },
  {
    id: "parti",
    name: "PASTEF & Histoire",
    description: "La fondation en 2014, le syndicalisme au SAID, la radiation, les coalitions historiques et les victoires électorales.",
    icon: Users,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold"
  },
  {
    id: "programme",
    name: "Sénégal 2050 & Économie",
    description: "L'agenda national de transformation, le patriotisme économique, la souveraineté et le développement territorial.",
    icon: TrendingUp,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30 font-bold"
  },
  {
    id: "institutions",
    name: "Institutions & Citoyenneté",
    description: "L'éthique publique, la reddition de comptes, l'indépendance de la justice, le civisme et le service de la Patrie.",
    icon: Building2,
    color: "from-purple-500/20 to-violet-500/10 border-purple-500/30 text-purple-400",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30 font-bold"
  }
];

export default function QuizGame() {
  const [userName, setUserName] = useState("");
  const [difficulty, setDifficulty] = useState<"debutant" | "expert" | "champion">("debutant");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [gameState, setGameState] = useState<"start" | "quiz" | "result">("start");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTimeStr, setElapsedTimeStr] = useState("0s");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .limit(7);

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else if (data && data.length > 0) {
        const mapped: LeaderboardUser[] = (data as Record<string, unknown>[]).map((item, idx) => ({
          rank: idx + 1,
          name: item.name as string,
          score: item.score as number,
          badge: item.badge as string,
          time: item.time as string,
        }));
        setLeaderboard(mapped);
      }
    } catch (err) {
      console.error("Error in fetchLeaderboard:", err);
    }
  };

  const [allQuizzes, setAllQuizzes] = useState<Question[]>(quizData as Question[]);

  useEffect(() => {
    fetchLeaderboard();
    const fetchQuizzes = async () => {
      try {
        const { data, error } = await supabase.from("quizzes").select("*");
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = (data as Record<string, unknown>[]).map((q) => ({
            id: Number(q.id) || Math.floor(Math.random() * 100000),
            question: q.question as string,
            options: q.options as string[],
            answer: q.correct_answer as number,
            explanation: q.explanation as string,
            difficulty: (q.difficulty as Question["difficulty"]) || "debutant",
            category: q.category as Question["category"]
          }));
          setAllQuizzes(mapped);
        }
      } catch (err) {
        console.warn("Could not fetch quizzes from Supabase, using local fallback", err);
      }
    };
    fetchQuizzes();
  }, []);

  const startQuiz = () => {
    if (!userName.trim()) {
      alert("Veuillez saisir votre nom complet pour commencer et personnaliser votre certificat.");
      return;
    }

    // Filter questions based on difficulty AND category
    let filtered = allQuizzes;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    filtered = filtered.filter(q => {
      if (difficulty === "debutant") return q.difficulty === "debutant";
      if (difficulty === "expert") return q.difficulty === "debutant" || q.difficulty === "expert";
      return true; // Champion has all questions
    });

    if (filtered.length === 0) {
      alert("Aucune question ne correspond à ces critères. Essayez un autre niveau de difficulté ou une autre thématique.");
      return;
    }

    // Shuffle questions
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    
    // Set limit based on level
    let limit = 10;
    if (difficulty === "expert") limit = 15;
    if (difficulty === "champion") limit = 20;

    setQuestions(shuffled.slice(0, Math.min(limit, shuffled.length)));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setStartTime(Date.now());
    setGameState("quiz");
    trackEvent("Quiz", "start_quiz", `Quiz démarré: ${selectedCategory} (${difficulty}) par ${userName.trim()}`, "quiz");
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
      
      // Fun milestone effects
      if (newStreak >= 3) {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }
    } else {
      setStreak(0);
    }
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const elapsedMs = Date.now() - startTime;
    const totalSecs = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    setElapsedTimeStr(timeStr);
    
    setGameState("result");
    const finalPercent = Math.round((score / questions.length) * 100);
    
    if (finalPercent >= 50) {
      // Trigger major confetti for success
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    const badge = getBadgeName(finalPercent);

    try {
      const { error } = await supabase.from("leaderboard").insert([
        { name: userName, score: finalPercent, difficulty, badge, time: timeStr }
      ]);
      if (error) {
        console.error("Error inserting to leaderboard:", error);
      }
      await fetchLeaderboard();
    } catch (err) {
      console.error("Error in finishQuiz Supabase call:", err);
      // Fallback local update
      const newEntry: LeaderboardUser = {
        rank: 0,
        name: userName,
        score: finalPercent,
        badge,
        time: timeStr
      };

      setLeaderboard(prev => {
        const updated = [...prev, newEntry]
          .sort((a, b) => b.score - a.score)
          .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
        return updated.slice(0, 7);
      });
    }
  };

  const getBadgeName = (percentage: number) => {
    if (percentage === 100) return "Platine";
    if (percentage >= 90) return "Or";
    if (percentage >= 70) return "Argent";
    if (percentage >= 50) return "Bronze";
    return "Aucun";
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Platine": return "bg-slate-300 text-slate-900 border-slate-400";
      case "Or": return "bg-yellow-400 text-yellow-950 border-yellow-500";
      case "Argent": return "bg-gray-400 text-gray-950 border-gray-500";
      case "Bronze": return "bg-amber-600 text-amber-50 border-amber-700";
      default: return "bg-brand-green/20 text-foreground/50 border-brand-emerald/10";
    }
  };

  const handleReset = () => {
    setGameState("start");
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const printCertificate = () => {
    window.print();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const percentScore = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const userBadge = getBadgeName(percentScore);
  
  // Find current category metadata
  const currentCategoryMeta = CATEGORIES.find(c => c.id === (currentQuestion?.category || selectedCategory)) || CATEGORIES[0];
  const CategoryIcon = currentCategoryMeta.icon;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Quiz Area */}
      <div className="lg:col-span-8 glass-panel p-6 md:p-10 rounded-2xl relative shadow-2xl overflow-hidden min-h-[550px] flex flex-col justify-between border border-brand-emerald/15">
        
        {/* START SCREEN */}
        {gameState === "start" && (
          <div className="flex-1 flex flex-col justify-center py-4">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex p-3 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/20 mb-4 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-display text-white text-glow-gold tracking-tight">
                Le Grand Quiz Ousmane Sonko
              </h2>
              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">
                Testez vos connaissances sur l&apos;histoire politique, la biographie, la vision économique et le programme Sénégal 2050 du leader national.
              </p>
            </div>

            {/* Form & Selection */}
            <div className="w-full space-y-6">
              
              {/* User Identity Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-brand-gold/80 mb-2 uppercase tracking-wide">
                    Identité du Participant
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: Moustapha Ndiaye (pour le certificat)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-brand-green/20 border border-brand-emerald/25 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-brand-gold text-foreground font-semibold"
                    />
                    <User className="w-4 h-4 text-foreground/45 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-brand-gold/80 mb-2 uppercase tracking-wide">
                    Niveau de Difficulté
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["debutant", "expert", "champion"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-3 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                          difficulty === level
                            ? "bg-brand-gold text-brand-green-dark border-brand-gold shadow-md font-extrabold scale-105"
                            : "bg-brand-green/10 border-brand-emerald/20 text-foreground/75 hover:bg-brand-green/35"
                        }`}
                      >
                        {level === "debutant" ? "Débutant" : level === "expert" ? "Expert" : "Champion"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-brand-gold/80 mb-2.5 uppercase tracking-wide">
                  Choisissez une thématique
                </label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => {
                    const CatBoxIcon = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id as CategoryId)}
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] relative group min-h-[110px] ${
                          isActive 
                            ? "bg-brand-green/40 border-brand-gold shadow-lg" 
                            : "bg-brand-green-dark/20 border-brand-emerald/15 hover:border-brand-emerald/40"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className={`p-1.5 rounded-lg border ${cat.color} flex items-center justify-center`}>
                            <CatBoxIcon className="w-4 h-4" />
                          </div>
                          {isActive && (
                            <span className="w-4 h-4 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5 stroke-[4]" />
                            </span>
                          )}
                        </div>

                        <div className="mt-3">
                          <h4 className={`text-xs font-black leading-tight ${isActive ? "text-brand-gold" : "text-white group-hover:text-brand-gold transition-colors"}`}>
                            {cat.name}
                          </h4>
                          <p className="text-[9px] text-foreground/45 mt-0.5 line-clamp-2 leading-snug">
                            {cat.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={startQuiz}
                  className="w-full md:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-extrabold text-sm md:text-base hover:shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Lancer le Questionnaire Citoyen</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ACTIVE QUIZ SCREEN */}
        {gameState === "quiz" && currentQuestion && (
          <div className="flex-1 flex flex-col justify-between">
            
            {/* Header info */}
            <div>
              <div className="flex flex-wrap gap-2 justify-between items-center border-b border-brand-emerald/15 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono capitalize ${currentCategoryMeta.badgeColor}`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                    <span>{currentCategoryMeta.name}</span>
                  </span>
                  
                  <span className="px-2.5 py-1 rounded bg-brand-green-dark/30 border border-brand-emerald/15 text-[10px] font-mono text-foreground/60 uppercase">
                    Niveau : {difficulty}
                  </span>
                </div>
                
                <span className="text-sm font-bold font-mono text-foreground/60">
                  Question {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-full h-1.5 bg-brand-green-dark/40 rounded-full overflow-hidden mb-6 border border-brand-emerald/5">
                <div 
                  className="progress-bar-fill h-full bg-gradient-to-r from-brand-gold to-brand-gold-light transition-all duration-300 rounded-full"
                  style={{ '--progress-width': `${((currentQuestionIndex) / questions.length) * 100}%` } as React.CSSProperties}
                />
              </div>

              {/* Active Combo/Streak notification */}
              {streak >= 2 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono font-bold animate-pulse"
                >
                  <Flame className="w-4 h-4 fill-red-500 text-red-500" />
                  <span>SÉRIE ACTIVE : 🔥 {streak} D&apos;AFFILÉE !</span>
                </motion.div>
              )}
            </div>

            {/* Question Card */}
            <div className="my-2 flex-grow">
              <h3 className="text-lg md:text-2xl font-bold text-white leading-snug font-display">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {currentQuestion.options.map((option, index) => {
                let optionStyle = "bg-brand-green-dark/20 border-brand-emerald/15 text-foreground/80 hover:bg-brand-green/30 hover:border-brand-emerald/40";
                
                if (selectedOption === index) {
                  optionStyle = "bg-brand-green/50 border-brand-gold text-brand-gold shadow-md ring-1 ring-brand-gold/30";
                }

                if (isAnswered) {
                  const isCorrect = index === currentQuestion.answer;
                  const isSelected = index === selectedOption;

                  if (isCorrect) {
                    optionStyle = "bg-[#10B981]/20 border-[#10B981] text-[#10B981] font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                  } else if (isSelected) {
                    optionStyle = "bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                  } else {
                    optionStyle = "bg-brand-green-dark/10 border-brand-emerald/10 text-foreground/30 pointer-events-none opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswered}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all flex justify-between items-center cursor-pointer min-h-[60px] ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono opacity-50 bg-brand-green/30 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && index === currentQuestion.answer && (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 ml-2" />
                    )}
                    {isAnswered && index === selectedOption && index !== currentQuestion.answer && (
                      <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            <div className="min-h-[90px] mt-6">
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-brand-green-dark/30 border border-brand-emerald/15 text-xs md:text-sm text-foreground/75 leading-relaxed"
                  >
                    <strong className="text-brand-gold font-bold flex items-center gap-1.5 mb-1 text-xs uppercase font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      Explication citoyenne
                    </strong>
                    {currentQuestion.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action footer */}
            <div className="mt-6 border-t border-brand-emerald/15 pt-6 flex justify-between items-center">
              <span className="text-xs font-mono text-foreground/45 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Durée estimée : {difficulty === "debutant" ? "~3 min" : difficulty === "expert" ? "~5 min" : "~8 min"}
              </span>

              {!isAnswered ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:bg-brand-gold-light hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Valider la Réponse
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-emerald text-white font-bold text-sm hover:bg-brand-emerald-light transition-all cursor-pointer animate-pulse"
                >
                  <span>{currentQuestionIndex === questions.length - 1 ? "Voir les résultats" : "Question Suivante"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULTS SCREEN / DIGITAL CERTIFICATE */}
        {gameState === "result" && (
          <div className="flex-1 flex flex-col items-center py-4">
            
            {/* Header info */}
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex p-3 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/20 mb-3">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-brand-gold font-display text-glow-gold">
                ÉVALUATION COMPLÉTÉE
              </h2>
              <p className="text-sm text-foreground/70 mt-1">
                Félicitations <strong className="text-white">{userName}</strong> ! Votre score a été enregistré avec succès.
              </p>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl mb-6">
              <div className="bg-brand-green-dark/20 border border-brand-emerald/15 p-3 rounded-xl text-center">
                <span className="text-[10px] font-mono text-foreground/45 block uppercase">Score Final</span>
                <span className="text-xl font-black text-brand-gold tracking-tight">{percentScore}%</span>
              </div>
              <div className="bg-brand-green-dark/20 border border-brand-emerald/15 p-3 rounded-xl text-center">
                <span className="text-[10px] font-mono text-foreground/45 block uppercase">Temps Écoulé</span>
                <span className="text-xl font-black text-white tracking-tight">{elapsedTimeStr}</span>
              </div>
              <div className="bg-brand-green-dark/20 border border-brand-emerald/15 p-3 rounded-xl text-center">
                <span className="text-[10px] font-mono text-foreground/45 block uppercase">Série Max</span>
                <span className="text-xl font-black text-red-400 tracking-tight flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-red-500 text-red-500 inline" />
                  {maxStreak}
                </span>
              </div>
              <div className="bg-brand-green-dark/20 border border-brand-emerald/15 p-3 rounded-xl text-center">
                <span className="text-[10px] font-mono text-foreground/45 block uppercase">Titre Obtenu</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase inline-block border mt-1.5 ${getBadgeColor(userBadge)}`}>
                  {userBadge}
                </span>
              </div>
            </div>

            {/* Stylized Digital Certificate */}
            <div 
              id="printable-certificate"
              className="w-full max-w-xl aspect-[1.414] glass-panel border-2 border-brand-gold/60 p-8 flex flex-col justify-between items-center text-center relative shadow-2xl rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-green/20 via-brand-dark-base to-brand-dark-base print:bg-white print:text-black print:border-black print:border-4 print:shadow-none"
            >
              {/* Gold borders and corners */}
              <div className="absolute inset-2 border border-brand-gold/20 pointer-events-none print:border-black" />
              <div className="absolute inset-4 border border-brand-gold/15 pointer-events-none print:border-black/50" />
              
              {/* Top seal */}
              <div className="flex flex-col items-center relative z-10">
                <ShieldCheck className="w-10 h-10 text-brand-gold print:text-black" />
                <span className="text-[9px] font-mono text-brand-gold tracking-[0.3em] font-extrabold uppercase mt-2 print:text-black">
                  République du Sénégal • Citoyenneté
                </span>
              </div>

              {/* Central text */}
              <div className="my-auto flex flex-col items-center relative z-10 py-2">
                <span className="text-[10px] font-serif italic text-foreground/60 print:text-black/60">
                  Le Comité d&apos;Attestation décerne ce
                </span>
                <span className="text-xl md:text-2xl font-black font-display text-white mt-1 border-b border-brand-gold/30 pb-1.5 px-6 print:text-black print:border-black">
                  BREVET DE MÉRITE CITOYEN
                </span>
                <span className="text-[9px] font-mono text-brand-gold/80 tracking-widest uppercase mt-1 print:text-black">
                  à l&apos;honorable patriote
                </span>
                <span className="text-2xl md:text-3xl font-extrabold font-display text-brand-gold mt-2 tracking-wide print:text-black">
                  {userName}
                </span>
                <span className="text-[10px] font-serif italic text-foreground/50 mt-3 max-w-sm leading-relaxed print:text-black/60">
                  pour avoir démontré une connaissance approfondie de la biographie, du parcours politique, et de la vision économique du leader national Ousmane Sonko (Sénégal 2050), avec un score d&apos;excellence de
                </span>
                <span className="text-3xl font-black font-mono text-brand-gold mt-2.5 print:text-black">
                  {percentScore}%
                </span>
                <span className="text-[10px] font-bold text-foreground/80 mt-1 print:text-black">
                  ({score} bonnes réponses sur {questions.length} questions)
                </span>
              </div>

              {/* Badge level and metadata */}
              <div className="w-full border-t border-brand-gold/25 pt-4 flex justify-between items-end print:border-black relative z-10">
                <div className="text-left flex flex-col justify-end">
                  <span className="text-[9px] font-mono text-foreground/40 print:text-black/50">TITRE ACCORDÉ</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase mt-1 border inline-block ${getBadgeColor(userBadge)}`}>
                    Badge {userBadge}
                  </span>
                </div>

                <div className="text-right flex flex-col justify-end">
                  <span className="text-[9px] font-mono text-foreground/40 print:text-black/50">DATE D&apos;OBTENTION</span>
                  <span className="text-[10px] font-mono font-bold text-foreground/85 mt-1 print:text-black">
                    {new Date().toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Print and share buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={printCertificate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green/20 border border-brand-emerald/30 hover:bg-brand-green/45 text-foreground text-sm font-semibold transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-brand-gold" />
                <span>Exporter PDF / Imprimer</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-extrabold text-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recommencer le Défi</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Leaderboard Area */}
      <div className="lg:col-span-4 glass-panel p-6 rounded-2xl relative shadow-xl border border-brand-emerald/15">
        <div className="flex items-center gap-2 border-b border-brand-emerald/15 pb-4 mb-4">
          <Trophy className="w-5 h-5 text-brand-gold animate-pulse" />
          <h3 className="text-lg font-bold text-foreground font-display">Classement National</h3>
        </div>
        <p className="text-xs text-foreground/50 mb-4">
          Tableau d&apos;honneur en direct des meilleurs citoyens-patriotes du pays.
        </p>

        <div className="space-y-2.5">
          {leaderboard.map((user, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                user.name === userName 
                  ? "bg-brand-gold/10 border-brand-gold shadow-md"
                  : "bg-brand-dark-card border-brand-emerald/10 hover:border-brand-emerald/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  user.rank === 1 ? "bg-yellow-400 text-yellow-950 font-black shadow-md shadow-yellow-400/20" : 
                  user.rank === 2 ? "bg-slate-300 text-slate-900 font-bold" :
                  user.rank === 3 ? "bg-amber-600 text-amber-50 font-bold" : 
                  "bg-brand-green/30 text-foreground/50"
                }`}>
                  {user.rank}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-foreground line-clamp-1">{user.name}</h4>
                  <span className="text-[9px] font-mono text-foreground/45 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {user.time}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-brand-gold block">{user.score}%</span>
                <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold border inline-block ${getBadgeColor(user.badge)}`}>
                  {user.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live league stats */}
        <div className="mt-6 pt-4 border-t border-brand-emerald/10 flex justify-between items-center text-[10px] text-foreground/40 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>284 en ligne</span>
          </span>
          <span className="uppercase tracking-wider">Ligue Souveraine</span>
        </div>
      </div>

    </div>
  );
}
