"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Lock, LayoutDashboard, Calendar, Newspaper, Video, 
  Map, Brain, Bot, Plus, Trash2, Save, LogOut, ArrowLeft, 
  Eye, CheckCircle, AlertCircle, PlusCircle, MinusCircle,
  FileText, Upload, Users, RefreshCw, Clock, Star,
  BarChart3, TrendingUp, MousePointerClick, Globe, Smartphone,
  Laptop, Activity, DownloadCloud, ExternalLink, FileSpreadsheet,
  Layers, Search, Share2, ChevronRight, Flame, ArrowUpRight
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { 
  getAnalyticsSummary, 
  resetAnalyticsData, 
  exportAnalyticsCSV, 
  AnalyticsSummary 
} from "@/utils/analytics";

// Initial imports of data
import initialTimeline from "@/data/timeline.json";
import initialActualites from "@/data/actualites.json";
import initialQuizzes from "@/data/quizzes.json";
import initialRealizations from "@/data/realizations.json";
import initialDocuments from "@/data/documents.json";
import initialVideos from "@/data/videos.json";
import initialDocumentsFiles from "@/data/documents_files.json";
import initialScenarios from "@/data/scenarios.json";

interface TimelineEvent {
  year: string;
  title: string;
  category: string;
  importance: number;
  description: string;
  media: string | string[];
}

interface Actualite {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface Realization {
  id: string;
  domain: string;
  title: string;
  description: string;
  objectifs: string[];
  resultats: string[];
  kpis: { label: string; value: string }[];
  media: string;
}

interface DocumentRAG {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
}

interface VideoItem {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  duration: string;
  date: string;
  featured?: boolean;
}

interface DocumentFile {
  title: string;
  type: string;
  size: string;
  downloads: string;
  description: string;
  link?: string;
}

interface Contributor {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface ScenarioEvent {
  id: string;
  date: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  theme: string;
  image: string;
}

export default function AdminPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Notifications State
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Contributors State
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loadingContributors, setLoadingContributors] = useState(false);

  const fallbackContributors = (): Contributor[] => [
    { id: "c1", email: "moustapha.ndiaye@pastef.sn", full_name: "Moustapha Ndiaye", created_at: "2026-03-15T10:30:00.000Z" },
    { id: "c2", email: "fatou.diop@orange.sn", full_name: "Fatou Diop", created_at: "2026-04-12T14:15:00.000Z" },
    { id: "c3", email: "ousmane.sarr@gmail.sn", full_name: "Ousmane Sarr", created_at: "2026-05-01T09:00:00.000Z" },
    { id: "c4", email: "aminata.tall@icloud.com", full_name: "Aminata Tall", created_at: "2026-05-22T18:45:00.000Z" },
    { id: "c5", email: "saliou.diallo@yahoo.fr", full_name: "Saliou Diallo", created_at: "2026-06-10T11:20:00.000Z" }
  ];

  const fetchContributors = async () => {
    setLoadingContributors(true);
    try {
      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setContributors(data);
      } else {
        setContributors(fallbackContributors());
      }
    } catch (err) {
      console.warn("Supabase fetch failed or table doesn't exist, falling back to mock data.", err);
      setContributors(fallbackContributors());
    } finally {
      setLoadingContributors(false);
    }
  };

  const deleteContributor = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contributeur ?")) return;
    
    try {
      const { error } = await supabase
        .from("contributors")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      showToast("success", "Contributeur supprimé avec succès !");
    } catch (err) {
      console.warn("Could not delete from database, updating local state only.", err);
      showToast("success", "Contributeur retiré de l'affichage (mode hors-ligne)");
    }
    
    setContributors(prev => prev.filter(c => c.id !== id));
  };

  // Data States
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimeline as unknown as TimelineEvent[]);
  const [actualites, setActualites] = useState<Actualite[]>(initialActualites as unknown as Actualite[]);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes as unknown as Quiz[]);
  const [realizations, setRealizations] = useState<Realization[]>(initialRealizations as unknown as Realization[]);
  const [documents, setDocuments] = useState<DocumentRAG[]>(initialDocuments as unknown as DocumentRAG[]);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos as unknown as VideoItem[]);
  const [documentsFiles, setDocumentsFiles] = useState<DocumentFile[]>(initialDocumentsFiles as unknown as DocumentFile[]);
  const [scenarios, setScenarios] = useState<ScenarioEvent[]>(initialScenarios as unknown as ScenarioEvent[]);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | null>(null);

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"7d" | "30d" | "all">("7d");
  const [selectedChartMetric, setSelectedChartMetric] = useState<"views" | "clicks">("views");
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await getAnalyticsSummary();
      setAnalytics(data);
    } catch (err) {
      console.warn("Could not load analytics:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      if (!analytics) {
        showToast("error", "Aucune donnée analytics chargée. Rafraîchissez d'abord.");
        return;
      }
      setIsExportingCSV(true);
      const csvContent = exportAnalyticsCSV(analytics);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `sonko_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("success", "Rapport Analytics exporté avec succès (CSV) !");
    } catch (err) {
      showToast("error", "Erreur lors de l'export du rapport CSV");
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleResetAnalytics = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser les événements analytiques de test ?")) {
      resetAnalyticsData();
      void fetchAnalytics();
      showToast("success", "Événements de test réinitialisés avec succès.");
    }
  };

  // Selected Items for Editing
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number | null>(null);
  const [selectedActualiteIndex, setSelectedActualiteIndex] = useState<number | null>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [selectedRealizationIndex, setSelectedRealizationIndex] = useState<number | null>(null);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [selectedDocumentFileIndex, setSelectedDocumentFileIndex] = useState<number | null>(null);

  // Fetch all modules from Supabase for editing
  const fetchDatabaseData = async () => {
    try {
      // 1. Timeline
      const { data: tData } = await supabase.from("timeline").select("*").order("id", { ascending: true });
      if (tData && tData.length > 0) {
        setTimeline(tData as unknown as TimelineEvent[]);
      }

      // 2. Actualités (map read_time -> readTime)
      const { data: actData } = await supabase.from("actualites").select("*");
      if (actData && actData.length > 0) {
        const mapped = actData.map((item: { id: string; title: string; summary: string; content: string; date: string; read_time: string; category: string; image: string; author?: string }) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          content: item.content,
          date: item.date,
          readTime: item.read_time,
          category: item.category,
          image: item.image,
          author: item.author || "Secrétariat Général de PASTEF"
        }));
        setActualites(mapped);
      }

      // 3. Quizzes (map correct_answer -> correctAnswer)
      const { data: qData } = await supabase.from("quizzes").select("*");
      if (qData && qData.length > 0) {
        const mapped = qData.map((item: { id: string; question: string; options: string[]; correct_answer: number; explanation: string; category: string; difficulty?: string }) => ({
          id: item.id,
          question: item.question,
          options: item.options,
          correctAnswer: item.correct_answer,
          explanation: item.explanation,
          category: item.category,
          difficulty: item.difficulty || "debutant"
        }));
        setQuizzes(mapped);
      }

      // 4. Realizations
      const { data: rData } = await supabase.from("realizations").select("*");
      if (rData && rData.length > 0) {
        setRealizations(rData as unknown as Realization[]);
      }

      // 5. Documents (RAG)
      const { data: docData } = await supabase.from("documents").select("*");
      if (docData && docData.length > 0) {
        setDocuments(docData as unknown as DocumentRAG[]);
      }

      // 6. Videos (map youtube_id -> youtubeId)
      const { data: vData } = await supabase.from("videos").select("*");
      if (vData && vData.length > 0) {
        const mapped = vData.map((item: { id: string; title: string; category: string; youtube_id: string; duration: string; date: string; featured?: boolean }) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          youtubeId: item.youtube_id,
          duration: item.duration,
          date: item.date,
          featured: item.featured ?? false
        }));
        setVideos(mapped);
      }

      // 7. Documents Files
      const { data: dfData } = await supabase.from("documents_files").select("*");
      if (dfData && dfData.length > 0) {
        setDocumentsFiles(dfData as unknown as DocumentFile[]);
      }

      // 8. Scenarios
      const { data: scData } = await supabase.from("scenarios").select("*");
      if (scData && scData.length > 0) {
        setScenarios(scData as unknown as ScenarioEvent[]);
      }
    } catch (err) {
      console.error("Error fetching admin dashboard data from Supabase:", err);
    }
  };

  // Check login state on load
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_auth_token");
    if (savedToken) {
      setTimeout(() => {
        setIsAuthenticated(true);
        setToken(savedToken);
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void (async () => {
        fetchContributors();
        await fetchDatabaseData();
        await fetchAnalytics();
      })();
    }
    // fetchContributors and fetchDatabaseData are stable references defined in component scope
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Show Toast helper
  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setToken(data.token);
        localStorage.setItem("admin_auth_token", data.token);
      } else {
        setAuthError(data.error || "Identifiants invalides");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Erreur de connexion avec le serveur");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    localStorage.removeItem("admin_auth_token");
  };

  // Save changes handler for API writing
  const saveFile = async (fileName: string, data: unknown) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ file: fileName, data }),
      });

      if (res.status === 401 || res.status === 403) {
        showToast("error", "Session expirée. Veuillez vous reconnecter.");
        handleLogout();
        return false;
      }

      const resData = await res.json();
      if (resData.success) {
        showToast("success", `Modifications enregistrées dans ${fileName}.json avec succès !`);
        return true;
      } else {
        if (resData.error && resData.error.includes("Session")) {
          showToast("error", "Session expirée. Veuillez vous reconnecter.");
          handleLogout();
        } else {
          showToast("error", resData.error || `Erreur de sauvegarde de ${fileName}`);
        }
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Erreur réseau lors de la sauvegarde");
      return false;
    }
  };

  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handleDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/admin/upload-drive`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch (_jsonErr) {
        throw new Error(`Erreur serveur (${res.status}) : Veuillez configurer les identifiants GOOGLE_DRIVE_CLIENT_EMAIL et GOOGLE_DRIVE_PRIVATE_KEY dans votre fichier .env.local.`);
      }

      if (data.success && data.url) {
        const updated = [...documentsFiles];
        const sizeStr = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;

        updated[idx] = { 
          ...updated[idx], 
          link: data.url, 
          size: sizeStr,
          title: updated[idx].title === "Nouveau Document" ? file.name.replace(/\.[^/.]+$/, "") : updated[idx].title
        };
        setDocumentsFiles(updated);
        showToast("success", "Document téléversé sur Google Drive avec succès !");
      } else {
        showToast("error", data.error || "Échec du téléversement vers Google Drive");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Erreur réseau lors du téléversement";
      showToast("error", errorMessage);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUploadSuccess: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onUploadSuccess(data.url);
        showToast("success", "Image téléversée avec succès dans Cloudinary !");
      } else {
        showToast("error", data.error || "Échec du téléversement de l'image");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Erreur réseau lors du téléversement";
      showToast("error", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Authentication wrapper
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark-base px-4 py-12">
        <div className="max-w-md w-full glass-panel border border-brand-emerald/10 p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-green/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-display text-center">
              Administration
            </h2>
            <p className="text-xs text-foreground/50 mt-1 font-mono uppercase tracking-wider">
              Accès Réservé
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password-input" className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2">
                Mot de Passe de Sécurité
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Saisir le mot de passe"
                className="w-full bg-brand-green/10 border border-brand-emerald/20 focus:border-brand-gold/80 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none transition-all"
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Se Connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-foreground/50 hover:text-brand-gold transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Retourner sur le site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-brand-dark-base text-foreground font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-slide-up ${
          notification.type === "success" 
            ? "bg-brand-green-dark/90 border-brand-emerald text-white" 
            : "bg-red-950/90 border-red-500/30 text-red-200"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-brand-dark-card/95 border-r border-brand-emerald/15 flex flex-col justify-between flex-shrink-0 z-20 shadow-2xl backdrop-blur-md">
        <div className="overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
          {/* Brand header */}
          <div className="h-16 flex items-center px-5 border-b border-brand-emerald/10 gap-3 sticky top-0 bg-brand-dark-card/95 backdrop-blur-md z-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold to-brand-gold-light flex items-center justify-center text-brand-green-dark font-black text-sm shadow-md shadow-brand-gold/10">
              S
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold font-display text-sm tracking-wider text-white leading-tight">SONKO ADMIN</span>
              <span className="text-[9px] font-mono text-brand-gold uppercase tracking-widest leading-none mt-0.5">Console CMS & Analytics</span>
            </div>
          </div>

          {/* Nav links grouped with clear left-alignment */}
          <div className="p-3.5 space-y-5">
            {/* Section 1: Général */}
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-gold/70 uppercase tracking-wider px-3 mb-1.5 block text-left">
                Général & Trafic
              </span>
              <div className="space-y-1">
                {[
                  { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard, badge: null },
                  { id: "analytics", label: "Statistiques & Visites", icon: BarChart3, badge: "LIVE" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id === "analytics") void fetchAnalytics();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-brand-green/35 border border-brand-emerald/30 text-brand-gold shadow-md shadow-brand-green/10"
                          : "text-foreground/70 hover:bg-brand-green/15 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brand-gold" : "text-foreground/50"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-brand-gold/20 text-brand-gold border border-brand-gold/30 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Contenus & Médias */}
            <div>
              <span className="text-[10px] font-mono font-bold text-foreground/40 uppercase tracking-wider px-3 mb-1.5 block text-left">
                Contenus & Multimédia
              </span>
              <div className="space-y-1">
                {[
                  { id: "timeline", label: "Chronologie 360°", icon: Calendar, count: timeline.length },
                  { id: "actualites", label: "Actualités & Réformes", icon: Newspaper, count: actualites.length },
                  { id: "videos", label: "Vidéothèque YouTube", icon: Video, count: videos.length },
                  { id: "realizations", label: "Réalisations Pôles", icon: Map, count: realizations.length },
                  { id: "quizzes", label: "Quiz Citoyen", icon: Brain, count: quizzes.length },
                  { id: "scenarios", label: "Scénarios 2021-2024", icon: Clock, count: scenarios.length },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-brand-green/35 border border-brand-emerald/30 text-brand-gold shadow-md shadow-brand-green/10"
                          : "text-foreground/70 hover:bg-brand-green/15 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-left truncate">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brand-gold" : "text-foreground/50"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-green-dark/40 border border-brand-emerald/10 text-foreground/50">
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Intelligence & Citoyenneté (Highlighted & Left-Aligned) */}
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider px-3 mb-1.5 block text-left">
                Intelligence & Citoyenneté
              </span>
              <div className="space-y-1.5">
                {[
                  { 
                    id: "documents", 
                    label: "IA RAG (Base de connaissances)", 
                    icon: Bot, 
                    count: documents.length,
                    desc: "Index sémantique IA"
                  },
                  { 
                    id: "documents_files", 
                    label: "Documents Téléchargeables", 
                    icon: FileText, 
                    count: documentsFiles.length,
                    desc: "Fichiers PDF publics"
                  },
                  { 
                    id: "contributors", 
                    label: "Contributeurs & Citoyens", 
                    icon: Users, 
                    count: contributors.length,
                    desc: "Membres & inscrits"
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-brand-green/50 to-brand-green/25 border border-brand-gold/40 text-brand-gold shadow-lg shadow-brand-green/10"
                          : "text-foreground/80 hover:bg-brand-green/20 hover:text-white border border-brand-emerald/10 bg-brand-green-dark/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-left min-w-0 pr-2">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${isActive ? "bg-brand-gold text-brand-green-dark" : "bg-brand-green/30 text-brand-gold"}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col text-left truncate">
                          <span className="truncate leading-tight">{item.label}</span>
                          <span className="text-[9px] font-mono text-foreground/45 font-normal truncate">{item.desc}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                        isActive ? "bg-brand-gold/20 text-brand-gold" : "bg-brand-green/20 text-foreground/60"
                      }`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* User logout section */}
        <div className="p-3.5 border-t border-brand-emerald/10 space-y-2 bg-brand-dark-card/95">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-brand-green/10 border border-brand-emerald/15 hover:bg-brand-green/20 text-xs font-bold text-foreground transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-brand-gold" />
            <span>Voir le site public</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-950/20 border border-red-500/10 hover:bg-red-950/40 text-xs font-bold text-red-400 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/5 via-brand-dark-base to-brand-dark-base">
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Tableau de Bord</h1>
                <p className="text-sm text-foreground/55 mt-1">
                  Vue d&apos;ensemble, métriques d&apos;audience et gestion des modules du site.
                </p>
              </div>

              <button
                onClick={() => {
                  void fetchAnalytics();
                  setActiveTab("analytics");
                }}
                className="px-4 py-2.5 rounded-xl bg-brand-green/25 border border-brand-gold/30 hover:bg-brand-green/40 text-brand-gold font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Voir les statistiques détaillées</span>
              </button>
            </div>

            {/* Live Analytics Highlights Banner */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-gold/30 bg-gradient-to-r from-brand-green/30 via-brand-dark-card to-brand-green/15 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider">
                      Audience & Trafic en Direct {analyticsLoading && <span className="animate-pulse">⟳</span>}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white font-display">
                    {analyticsLoading ? "Chargement…" : analytics
                      ? `${analytics.totalViews.toLocaleString("fr-FR")} pages consultées • ${analytics.uniqueVisitors.toLocaleString("fr-FR")} visiteurs uniques`
                      : "Aucune donnée — activez le tracking"}
                  </h2>
                  <p className="text-xs text-foreground/70 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>⚡ {(analytics?.totalClicks ?? 0).toLocaleString("fr-FR")} clics & interactions</span>
                    {analytics?.topPages[0] && <><span>•</span><span>🥇 Page #1 : {analytics.topPages[0].name} ({analytics.topPages[0].percentage}%)</span></>}
                    {analytics?.deviceBreakdown[0] && <><span>•</span><span>📱 {analytics.deviceBreakdown[0].percentage}% {analytics.deviceBreakdown[0].name.split(" ")[0]}</span></>}
                    {analytics?.dataSource && <><span>•</span><span className="text-emerald-400">Source : {analytics.dataSource === "supabase" ? "🟢 Supabase (données réelles)" : analytics.dataSource === "localStorage" ? "🟡 Session courante" : "⚪ Aucune donnée"}</span></>}
                  </p>
                </div>

                <button
                  onClick={() => {
                    void fetchAnalytics();
                    setActiveTab("analytics");
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark font-extrabold text-xs flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-gold/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Consulter toutes les statistiques</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Chronologie 360°", count: timeline.length, tab: "timeline", desc: "Jalons historiques et photos", icon: Calendar },
                { label: "Articles d'Actualité", count: actualites.length, tab: "actualites", desc: "Rapports et revues politiques", icon: Newspaper },
                { label: "Vidéos YouTube", count: videos.length, tab: "videos", desc: "Conférences, discours et podcasts", icon: Video },
                { label: "Réalisations (Pôles)", count: realizations.length, tab: "realizations", desc: "Projets territoriaux Sénégal 2050", icon: Map },
                { label: "Questions de Quiz", count: quizzes.length, tab: "quizzes", desc: "Test de connaissance pour la jeunesse", icon: Brain },
                { label: "Documents IA (RAG)", count: documents.length, tab: "documents", desc: "Base RAG pour l'assistant intelligent", icon: Bot },
                { label: "Documents PDF", count: documentsFiles.length, tab: "documents_files", desc: "Fichiers officiels à télécharger", icon: FileText },
                { label: "Contributeurs Citoyens", count: contributors.length, tab: "contributors", desc: "Utilisateurs inscrits via l'Espace Citoyen", icon: Users },
                { label: "Scénarios Mutation (360°)", count: scenarios.length, tab: "scenarios", desc: "Moments clés de la mutation 2021-2024", icon: Clock },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="glass-card p-6 rounded-2xl border border-brand-emerald/10 hover:border-brand-emerald/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-foreground/50 font-bold uppercase tracking-wider font-mono">{stat.label}</span>
                        <div className="p-2 rounded-lg bg-brand-green/20 text-brand-gold">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-4xl font-black font-display text-white mt-4">{stat.count}</div>
                      <p className="text-xs text-foreground/60 mt-1">{stat.desc}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab(stat.tab)}
                      className="mt-6 w-full py-2 px-4 rounded-xl bg-brand-green/10 border border-brand-emerald/15 hover:bg-brand-green/25 hover:text-brand-gold text-xs font-bold transition-all cursor-pointer"
                    >
                      Gérer ce module
                    </button>
                  </div>
                );
              })}
            </div>

            {/* System Info Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-brand-gold" />
                <span>Console CMS Active</span>
              </h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                Ce panel permet d&apos;enregistrer des données en temps réel directement dans vos fichiers JSON locaux. 
                Toute modification sauvegardée est immédiatement visible sur le site sans redémarrage nécessaire.
              </p>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider">
                    Tableau de Bord d&apos;Audience & Clics
                  </span>
                </div>
                <h1 className="text-3xl font-bold font-display text-white">Statistiques & Visites du Site</h1>
                <p className="text-sm text-foreground/55 mt-1">
                  Analyse détaillée du trafic, des pages les plus visitées, des clics sur les boutons et des comportements citoyens.
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5">
                 <button
                  onClick={() => void fetchAnalytics()}
                  title="Rafraîchir les données"
                  className="px-3.5 py-2 rounded-xl bg-brand-green/20 border border-brand-emerald/20 hover:bg-brand-green/35 text-xs font-bold text-foreground hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-brand-gold ${analyticsLoading ? 'animate-spin' : ''}`} />
                  <span>{analyticsLoading ? 'Chargement…' : 'Rafraîchir'}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  disabled={isExportingCSV}
                  title="Exporter les statistiques en format CSV"
                  className="px-3.5 py-2 rounded-xl bg-brand-gold/15 border border-brand-gold/30 hover:bg-brand-gold/25 text-xs font-bold text-brand-gold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Exporter CSV</span>
                </button>

                <button
                  onClick={handleResetAnalytics}
                  title="Réinitialiser les événements de test"
                  className="px-3 py-2 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-[11px] font-semibold text-red-400 transition-all cursor-pointer"
                >
                  <span>Reset Test</span>
                </button>
              </div>
            </div>

            {/* 4 Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Pageviews */}
              <div className="glass-card p-5 rounded-2xl border border-brand-emerald/15 hover:border-brand-gold/30 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] text-foreground/50 font-bold uppercase tracking-wider font-mono">Visites Totales</span>
                  <div className="p-2 rounded-xl bg-brand-green/30 text-brand-gold">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black font-display text-white mt-3">
                  {analyticsLoading ? (
                    <span className="animate-pulse text-foreground/30">---</span>
                  ) : (
                    (analytics?.totalViews ?? 0).toLocaleString("fr-FR")
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{analytics ? (analytics.totalViews > 0 ? `${analytics.totalViews} événements enregistrés` : "Aucune visite encore") : "Données non disponibles"}</span>
                </div>
              </div>

              {/* Unique Visitors */}
              <div className="glass-card p-5 rounded-2xl border border-brand-emerald/15 hover:border-brand-gold/30 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] text-foreground/50 font-bold uppercase tracking-wider font-mono">Visiteurs Uniques</span>
                  <div className="p-2 rounded-xl bg-brand-green/30 text-brand-gold">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black font-display text-white mt-3">
                  {analyticsLoading ? (
                    <span className="animate-pulse text-foreground/30">---</span>
                  ) : (
                    (analytics?.uniqueVisitors ?? 0).toLocaleString("fr-FR")
                  )}
                </div>
                <div className="text-[11px] text-foreground/50 mt-2">
                  <span>{analytics?.dataSource === "supabase" ? "🟢 Source : Supabase (multi-utilisateurs)" : analytics?.dataSource === "localStorage" ? "🟡 Source : Session courante" : "En attente de données…"}</span>
                </div>
              </div>

              {/* Total Clicks & Interactions */}
              <div className="glass-card p-5 rounded-2xl border border-brand-emerald/15 hover:border-brand-gold/30 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] text-foreground/50 font-bold uppercase tracking-wider font-mono">Clics & Interactions</span>
                  <div className="p-2 rounded-xl bg-brand-green/30 text-brand-gold">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black font-display text-white mt-3">
                  {analyticsLoading ? (
                    <span className="animate-pulse text-foreground/30">---</span>
                  ) : (
                    (analytics?.totalClicks ?? 0).toLocaleString("fr-FR")
                  )}
                </div>
                <div className="text-[11px] text-brand-gold font-semibold mt-2">
                  <span>{analytics?.topClicks.length ? analytics.topClicks.map(c => c.category).join(", ") : "Dons Wave, Quiz, PDF, IA"}</span>
                </div>
              </div>

              {/* Engagement & Session Time */}
              <div className="glass-card p-5 rounded-2xl border border-brand-emerald/15 hover:border-brand-gold/30 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] text-foreground/50 font-bold uppercase tracking-wider font-mono">Temps Moyen / Rebond</span>
                  <div className="p-2 rounded-xl bg-brand-green/30 text-brand-gold">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black font-display text-white mt-3">
                  {analyticsLoading ? (
                    <span className="animate-pulse text-foreground/30">---</span>
                  ) : (
                    analytics?.avgSessionDuration || "—"
                  )}
                </div>
                <div className="text-[11px] text-foreground/50 mt-2">
                  <span>Taux de rebond : {analytics?.bounceRate || "—"}</span>
                </div>
              </div>
            </div>

            {/* Daily Traffic Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/15">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4.5 h-4.5 text-brand-gold" />
                    <span>Évolution de l&apos;Audience & Clics Quotidiens</span>
                  </h3>
                  <p className="text-xs text-foreground/50 mt-0.5">Activité enregistrée au cours des 7 derniers jours</p>
                </div>

                {/* Metric toggle */}
                <div className="flex items-center bg-brand-green/20 p-1 rounded-xl border border-brand-emerald/20 text-xs">
                  <button
                    onClick={() => setSelectedChartMetric("views")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedChartMetric === "views"
                        ? "bg-brand-gold text-brand-green-dark shadow-sm"
                        : "text-foreground/70 hover:text-white"
                    }`}
                  >
                    Vues de pages
                  </button>
                  <button
                    onClick={() => setSelectedChartMetric("clicks")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedChartMetric === "clicks"
                        ? "bg-brand-gold text-brand-green-dark shadow-sm"
                        : "text-foreground/70 hover:text-white"
                    }`}
                  >
                    Clics & Actions
                  </button>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 border-b border-brand-emerald/10 pb-4">
                  {(analytics?.dailyTraffic || []).map((day, idx) => {
                    const value = selectedChartMetric === "views" ? day.views : day.clicks;
                    const maxVal = selectedChartMetric === "views" ? 3500 : 1200;
                    const heightPercent = Math.min(100, Math.max(15, Math.round((value / maxVal) * 100)));

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                        {/* Tooltip value */}
                        <div className="text-[11px] font-mono font-bold text-brand-gold opacity-80 group-hover:opacity-100 transition-opacity">
                          {value.toLocaleString("fr-FR")}
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[48px] bg-brand-green/20 rounded-t-xl overflow-hidden relative flex items-end h-full">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-125 ${
                              selectedChartMetric === "views"
                                ? "bg-gradient-to-t from-brand-emerald/80 to-brand-gold"
                                : "bg-gradient-to-t from-sky-600 to-sky-400"
                            }`}
                          />
                        </div>

                        {/* Date label */}
                        <span className="text-[10px] font-mono text-foreground/50 uppercase truncate">
                          {day.dayLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2-Column: Most Visited Pages & Top Click Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* TOP VISITED PAGES */}
              <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-brand-emerald/15 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Globe className="w-4.5 h-4.5 text-brand-gold" />
                        <span>Pages les plus visitées</span>
                      </h3>
                      <p className="text-xs text-foreground/50 mt-0.5">Classement par volume de consultations</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-brand-green/20 text-brand-gold border border-brand-emerald/20">
                      Top 7 URLs
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-brand-emerald/10 text-foreground/45 font-mono text-[10px] uppercase">
                          <th className="pb-3 font-semibold">Rang & Page</th>
                          <th className="pb-3 font-semibold text-right">Vues</th>
                          <th className="pb-3 font-semibold text-right">Part</th>
                          <th className="pb-3 font-semibold text-right hidden sm:table-cell">Temps</th>
                          <th className="pb-3 font-semibold text-right hidden md:table-cell">Rebond</th>
                          <th className="pb-3 font-semibold text-center w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-emerald/5">
                        {(analytics?.topPages || []).map((page, idx) => (
                          <tr key={page.path} className="hover:bg-brand-green/10 transition-colors group">
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                                  idx === 0 ? "bg-brand-gold text-brand-green-dark" : "bg-brand-green/30 text-foreground/60"
                                }`}>
                                  {idx + 1}
                                </span>
                                <div>
                                  <div className="font-bold text-white group-hover:text-brand-gold transition-colors">
                                    {page.name}
                                  </div>
                                  <div className="text-[10px] font-mono text-foreground/45">{page.path}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-right font-mono font-bold text-white">
                              {page.views.toLocaleString("fr-FR")}
                            </td>
                            <td className="py-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <span className="font-mono text-brand-gold font-bold">{page.percentage}%</span>
                                <div className="w-12 bg-brand-green/20 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                  <div style={{ width: `${page.percentage}%` }} className="bg-brand-gold h-full rounded-full" />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-right font-mono text-foreground/60 hidden sm:table-cell">
                              {page.avgDuration}
                            </td>
                            <td className="py-3 text-right font-mono text-foreground/60 hidden md:table-cell">
                              {page.bounceRate}
                            </td>
                            <td className="py-3 text-center">
                              <Link
                                href={page.path}
                                target="_blank"
                                title="Voir cette page"
                                className="p-1 rounded text-foreground/40 hover:text-brand-gold hover:bg-brand-green/20 inline-block transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* TOP CLICKS & INTERACTIONS */}
              <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-brand-emerald/15 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <MousePointerClick className="w-4.5 h-4.5 text-brand-gold" />
                        <span>Clics & Actions Clés (CTA)</span>
                      </h3>
                      <p className="text-xs text-foreground/50 mt-0.5">Interactions des visiteurs avec les fonctionnalités</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(analytics?.topClicks || []).map((click, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-brand-green/15 border border-brand-emerald/10 hover:border-brand-emerald/25 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-green-dark text-brand-gold border border-brand-gold/20">
                              {click.category}
                            </span>
                            <h4 className="text-xs font-bold text-white">{click.label}</h4>
                          </div>
                          <span className="font-mono font-black text-sm text-brand-gold">
                            {click.count.toLocaleString("fr-FR")}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-brand-green/30 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.max(8, click.percentage)}%` }}
                            className="bg-gradient-to-r from-brand-gold to-brand-gold-light h-full rounded-full"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-foreground/45 mt-1.5">
                          <span>Action : {click.action}</span>
                          <span>{click.percentage}% des interactions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Card Row: Devices, Geography, RAG Searches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Devices */}
              <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/15">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-brand-gold" />
                  <span>Répartition par Terminal</span>
                </h3>
                <div className="space-y-3.5">
                  {(analytics?.deviceBreakdown || []).map((d) => (
                    <div key={d.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground/75 font-semibold">{d.name}</span>
                        <span className="font-mono font-bold text-white">{d.percentage}%</span>
                      </div>
                      <div className="w-full bg-brand-green/20 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${d.percentage}%`, backgroundColor: d.color }} className="h-full rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geography */}
              <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/15">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-gold" />
                  <span>Origine Géographique Estimée</span>
                </h3>
                <div className="space-y-3.5">
                  {(analytics?.geoBreakdown || []).length === 0 ? (
                    <div className="text-center py-6 text-foreground/35 text-xs">
                      <Globe className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Géolocalisation non disponible</p>
                      <p className="text-[10px] mt-1 text-foreground/25">Nécessite une API GeoIP (ex. ipapi.co)</p>
                    </div>
                  ) : (
                    (analytics?.geoBreakdown || []).map((g) => (
                      <div key={g.region} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground/75 font-semibold">{g.region}</span>
                          <span className="font-mono font-bold text-white">{g.percentage}%</span>
                        </div>
                        <div className="w-full bg-brand-green/20 h-2 rounded-full overflow-hidden">
                          <div style={{ width: `${g.percentage}%` }} className="bg-brand-emerald h-full rounded-full" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RAG Searches */}
              <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/15">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-brand-gold" />
                  <span>Recherches Populaires dans l&apos;IA</span>
                </h3>
                <div className="space-y-2.5">
                  {(analytics?.topSearches || []).length === 0 ? (
                    <div className="text-center py-6 text-foreground/35 text-xs">
                      <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Aucune recherche IA enregistrée</p>
                      <p className="text-[10px] mt-1 text-foreground/25">Les questions des visiteurs à Ask Sonko apparaîtront ici</p>
                    </div>
                  ) : (
                    (analytics?.topSearches || []).slice(0, 5).map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-brand-green/10 border border-brand-emerald/10 flex justify-between items-center gap-2 text-xs">
                        <span className="text-foreground/80 truncate font-medium">{s.query}</span>
                        <span className="font-mono text-[10px] font-bold text-brand-gold px-1.5 py-0.5 rounded bg-brand-green/30 flex-shrink-0">
                          {s.count} req
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* LIVE EVENT LOG FEED */}
            <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/15">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-brand-gold" />
                    <span>Journal des Visites & Clics en Temps Réel</span>
                  </h3>
                  <p className="text-xs text-foreground/50 mt-0.5">Flux instantané des événements capturés sur le site</p>
                </div>
                <button
                  onClick={() => void fetchAnalytics()}
                  className="text-xs text-brand-gold hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${analyticsLoading ? 'animate-spin' : ''}`} />
                  <span>Actualiser le flux</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-brand-emerald/10 text-foreground/45 font-mono text-[10px] uppercase">
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold">Action / Description</th>
                      <th className="pb-3 font-semibold">Page URL</th>
                      <th className="pb-3 font-semibold">Terminal</th>
                      <th className="pb-3 font-semibold text-right">Horodatage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-emerald/5 font-sans">
                    {(analytics?.recentEvents || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-foreground/40 text-sm">
                          {analyticsLoading ? (
                            <span className="animate-pulse">Chargement des événements…</span>
                          ) : (
                            <span>
                              Aucun événement enregistré pour l&apos;instant.<br />
                              <span className="text-xs text-foreground/30">Les visites et clics des visiteurs apparaîtront ici en temps réel.</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      (analytics?.recentEvents || []).map((ev) => (
                        <tr key={ev.id} className="hover:bg-brand-green/10 transition-colors">
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              ev.type === "pageview"
                                ? "bg-blue-900/40 text-blue-300 border border-blue-500/20"
                                : ev.category === "Donations"
                                ? "bg-sky-900/40 text-sky-300 border border-sky-500/20"
                                : ev.type === "rag"
                                ? "bg-purple-900/40 text-purple-300 border border-purple-500/20"
                                : ev.type === "quiz"
                                ? "bg-amber-900/40 text-amber-300 border border-amber-500/20"
                                : "bg-emerald-900/40 text-emerald-300 border border-emerald-500/20"
                            }`}>
                              {ev.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2.5 font-medium text-white max-w-xs truncate">
                            {ev.label || ev.action}
                          </td>
                          <td className="py-2.5 font-mono text-[11px] text-foreground/60">
                            {ev.path}
                          </td>
                          <td className="py-2.5 font-mono text-[11px] text-foreground/60">
                            {ev.device} {ev.city ? `• ${ev.city}` : ""}
                          </td>
                          <td className="py-2.5 text-right font-mono text-[10px] text-foreground/45">
                            {new Date(ev.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Chronologie 360°</h1>
                <p className="text-sm text-foreground/55 mt-1">Ajouter, modifier ou supprimer des jalons de l&apos;histoire d&apos;Ousmane Sonko.</p>
              </div>
              <button
                onClick={() => {
                  const newEvent = {
                    year: new Date().getFullYear().toString(),
                    title: "Nouvel Événement",
                    category: "political",
                    importance: 3,
                    description: "Description de l'événement.",
                    media: ""
                  };
                  const updated = [...timeline, newEvent];
                  setTimeline(updated);
                  setSelectedTimelineIndex(updated.length - 1);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green border border-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un jalon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Event List */}
              <div className="lg:col-span-5 glass-panel p-4 rounded-2xl max-h-[600px] overflow-y-auto space-y-2">
                {timeline.map((event, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTimelineIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedTimelineIndex === idx 
                        ? "bg-brand-gold/15 border-brand-gold text-brand-gold font-bold" 
                        : "bg-brand-green/5 border-brand-emerald/10 hover:bg-brand-green/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-green/30 border border-brand-emerald/20 text-brand-gold">{event.year}</span>
                      <span className="text-xs truncate max-w-[150px]">{event.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = timeline.filter((_, i) => i !== idx);
                        setTimeline(updated);
                        setSelectedTimelineIndex(null);
                        saveFile("timeline", updated);
                      }}
                      title="Supprimer ce jalon"
                      aria-label="Supprimer ce jalon"
                      className="p-1 text-foreground/45 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor panel */}
              <div className="lg:col-span-7">
                {selectedTimelineIndex !== null && timeline[selectedTimelineIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-brand-emerald/10 pb-3">Éditer le jalon</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="timeline-year" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Année</label>
                        <input
                          id="timeline-year"
                          type="text"
                          value={timeline[selectedTimelineIndex].year}
                          onChange={(e) => {
                            const updated = [...timeline];
                            updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], year: e.target.value };
                            setTimeline(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label htmlFor="timeline-category" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Catégorie</label>
                        <select
                          id="timeline-category"
                          value={timeline[selectedTimelineIndex].category}
                          onChange={(e) => {
                            const updated = [...timeline];
                            updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], category: e.target.value };
                            setTimeline(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        >
                          <option value="personal">Jeunesse & Personnel</option>
                          <option value="academic">Académique</option>
                          <option value="professional">Professionnel</option>
                          <option value="political">Politique</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="timeline-title" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Titre</label>
                      <input
                        id="timeline-title"
                        type="text"
                        value={timeline[selectedTimelineIndex].title}
                        onChange={(e) => {
                          const updated = [...timeline];
                          updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], title: e.target.value };
                          setTimeline(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor="timeline-importance" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Importance ({timeline[selectedTimelineIndex].importance}/5)</label>
                      <input
                        id="timeline-importance"
                        type="range"
                        min="1"
                        max="5"
                        value={timeline[selectedTimelineIndex].importance}
                        onChange={(e) => {
                          const updated = [...timeline];
                          updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], importance: parseInt(e.target.value) };
                          setTimeline(updated);
                        }}
                        className="w-full h-1 bg-brand-green-dark rounded-lg appearance-none cursor-pointer accent-brand-gold mt-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="timeline-desc" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        id="timeline-desc"
                        rows={4}
                        value={timeline[selectedTimelineIndex].description}
                        onChange={(e) => {
                          const updated = [...timeline];
                          updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], description: e.target.value };
                          setTimeline(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Images / Médias (URLs)</label>
                      {(() => {
                        const mediaVal = timeline[selectedTimelineIndex].media;
                        const isArr = Array.isArray(mediaVal);
                        
                        if (isArr) {
                          return (
                            <div className="space-y-2">
                              {(mediaVal as string[]).map((url, urlIdx) => (
                                <div key={urlIdx} className="flex flex-col gap-2 p-3 bg-brand-green/5 border border-brand-emerald/10 rounded-xl">
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={url}
                                      onChange={(e) => {
                                        const updatedUrls = [...(mediaVal as string[])];
                                        updatedUrls[urlIdx] = e.target.value;
                                        const updated = [...timeline];
                                        updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], media: updatedUrls };
                                        setTimeline(updated);
                                      }}
                                      placeholder="URL de l'image"
                                      aria-label={`URL de l'image ${urlIdx + 1}`}
                                      className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
                                    />
                                    <button
                                      onClick={() => {
                                        const updatedUrls = (mediaVal as string[]).filter((_, uIdx) => uIdx !== urlIdx);
                                        const updated = [...timeline];
                                        updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], media: updatedUrls.length === 1 ? updatedUrls[0] : updatedUrls };
                                        setTimeline(updated);
                                      }}
                                      title="Supprimer l'image"
                                      aria-label="Supprimer l'image"
                                      className="p-2 bg-red-950/20 border border-red-500/10 text-red-400 rounded-xl hover:bg-red-950/40"
                                    >
                                      <MinusCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id={`upload-timeline-${selectedTimelineIndex}-${urlIdx}`}
                                      onChange={(e) => handleImageUpload(e, (uploadedUrl) => {
                                        const updatedUrls = [...(mediaVal as string[])];
                                        updatedUrls[urlIdx] = uploadedUrl;
                                        const updated = [...timeline];
                                        updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], media: updatedUrls };
                                        setTimeline(updated);
                                      })}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`upload-timeline-${selectedTimelineIndex}-${urlIdx}`}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green/30 border border-brand-emerald/20 hover:border-brand-gold text-foreground/80 hover:text-brand-gold text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                                    >
                                      <Upload className="w-3 h-3" />
                                      <span>{uploading ? "Téléversement..." : "Téléverser un fichier"}</span>
                                    </label>
                                    {url && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={url} alt="Aperçu" className="w-8 h-8 rounded object-cover border border-brand-emerald/20" />
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const updatedUrls = [...(mediaVal as string[]), ""];
                                  const updated = [...timeline];
                                  updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], media: updatedUrls };
                                  setTimeline(updated);
                                }}
                                className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold-light mt-1"
                              >
                                <PlusCircle className="w-3.5 h-3.5" /> Ajouter une image
                              </button>
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex flex-col gap-2 p-3 bg-brand-green/5 border border-brand-emerald/10 rounded-xl">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={mediaVal as string}
                                  onChange={(e) => {
                                    const updated = [...timeline];
                                    updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], media: e.target.value };
                                    setTimeline(updated);
                                  }}
                                  placeholder="URL de l'image"
                                  aria-label="URL de l'image"
                                  className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const updated = [...timeline];
                                    updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], media: [mediaVal as string, ""] };
                                    setTimeline(updated);
                                  }}
                                  className="px-3.5 py-2 bg-brand-green/10 border border-brand-emerald/20 text-brand-gold rounded-xl hover:bg-brand-green/20 text-xs font-bold"
                                >
                                  Mode Galerie
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`upload-timeline-${selectedTimelineIndex}-single`}
                                  onChange={(e) => handleImageUpload(e, (uploadedUrl) => {
                                    const updated = [...timeline];
                                    updated[selectedTimelineIndex] = { ...updated[selectedTimelineIndex], media: uploadedUrl };
                                    setTimeline(updated);
                                  })}
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`upload-timeline-${selectedTimelineIndex}-single`}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green/30 border border-brand-emerald/20 hover:border-brand-gold text-foreground/80 hover:text-brand-gold text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>{uploading ? "Téléversement..." : "Téléverser un fichier"}</span>
                                </label>
                                {mediaVal && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={mediaVal as string} alt="Aperçu" className="w-8 h-8 rounded object-cover border border-brand-emerald/20" />
                                )}
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    <button
                      onClick={() => saveFile("timeline", timeline)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <Calendar className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez un événement pour l&apos;éditer ou cliquez sur &quot;Ajouter&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTUALITES TAB */}
        {activeTab === "actualites" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Actualités</h1>
                <p className="text-sm text-foreground/55 mt-1">Ajouter, modifier ou supprimer des articles et communiqués de presse.</p>
              </div>
              <button
                onClick={() => {
                  const newArt = {
                    id: `art-${Date.now()}`,
                    title: "Nouvel Article",
                    summary: "Extrait de l'article.",
                    content: "Contenu entier de l'article.",
                    date: "12 Juin 2026",
                    readTime: "3 min",
                    category: "Communiqué",
                    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop"
                  };
                  const updated = [newArt, ...actualites];
                  setActualites(updated);
                  setSelectedActualiteIndex(0);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green border border-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* List */}
              <div className="lg:col-span-5 glass-panel p-4 rounded-2xl max-h-[600px] overflow-y-auto space-y-2">
                {actualites.map((art, idx) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedActualiteIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedActualiteIndex === idx 
                        ? "bg-brand-gold/15 border-brand-gold text-brand-gold font-bold" 
                        : "bg-brand-green/5 border-brand-emerald/10 hover:bg-brand-green/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-bold text-brand-gold bg-brand-green/30 px-1.5 py-0.5 rounded border border-brand-gold/10">{art.category}</span>
                      <span className="text-xs truncate max-w-[180px]">{art.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = actualites.filter((_, i) => i !== idx);
                        setActualites(updated);
                        setSelectedActualiteIndex(null);
                        saveFile("actualites", updated);
                      }}
                      title="Supprimer cet article"
                      aria-label="Supprimer cet article"
                      className="p-1 text-foreground/45 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="lg:col-span-7">
                {selectedActualiteIndex !== null && actualites[selectedActualiteIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-brand-emerald/10 pb-3">Éditer l&apos;article</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="art-category" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Catégorie</label>
                        <input
                          id="art-category"
                          type="text"
                          value={actualites[selectedActualiteIndex].category}
                          onChange={(e) => {
                            const updated = [...actualites];
                            updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], category: e.target.value };
                            setActualites(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label htmlFor="art-date" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Date</label>
                        <input
                          id="art-date"
                          type="text"
                          value={actualites[selectedActualiteIndex].date}
                          onChange={(e) => {
                            const updated = [...actualites];
                            updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], date: e.target.value };
                            setActualites(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="art-readtime" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Temps de lecture</label>
                        <input
                          id="art-readtime"
                          type="text"
                          value={actualites[selectedActualiteIndex].readTime}
                          onChange={(e) => {
                            const updated = [...actualites];
                            updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], readTime: e.target.value };
                            setActualites(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="art-image" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            id="art-image"
                            type="text"
                            value={actualites[selectedActualiteIndex].image}
                            onChange={(e) => {
                              const updated = [...actualites];
                              updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], image: e.target.value };
                              setActualites(updated);
                            }}
                            className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id={`upload-article-${selectedActualiteIndex}`}
                            onChange={(e) => handleImageUpload(e, (uploadedUrl) => {
                              const updated = [...actualites];
                              updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], image: uploadedUrl };
                              setActualites(updated);
                            })}
                            className="hidden"
                          />
                          <label
                            htmlFor={`upload-article-${selectedActualiteIndex}`}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-green/35 border border-brand-emerald/20 hover:border-brand-gold text-foreground/80 hover:text-brand-gold text-xs font-bold cursor-pointer transition-all active:scale-95"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{uploading ? "..." : "Téléverser"}</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="art-title" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Titre</label>
                      <input
                        id="art-title"
                        type="text"
                        value={actualites[selectedActualiteIndex].title}
                        onChange={(e) => {
                          const updated = [...actualites];
                          updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], title: e.target.value };
                          setActualites(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor="art-summary" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Chapeau / Extrait</label>
                      <textarea
                        id="art-summary"
                        rows={2}
                        value={actualites[selectedActualiteIndex].summary || ""}
                        onChange={(e) => {
                          const updated = [...actualites];
                          updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], summary: e.target.value };
                          setActualites(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="art-content" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Contenu</label>
                      <textarea
                        id="art-content"
                        rows={6}
                        value={actualites[selectedActualiteIndex].content}
                        onChange={(e) => {
                          const updated = [...actualites];
                          updated[selectedActualiteIndex] = { ...updated[selectedActualiteIndex], content: e.target.value };
                          setActualites(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <button
                      onClick={() => saveFile("actualites", actualites)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <Newspaper className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez un article pour l&apos;éditer ou cliquez sur &quot;Ajouter&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Vidéothèque</h1>
                <p className="text-sm text-foreground/55 mt-1">Gérer les discours officiels, conférences et émissions vidéos intégrés.</p>
              </div>
              <button
                onClick={() => {
                  const newVid = {
                    id: `vid-${Date.now()}`,
                    title: "Nouvelle Vidéo",
                    category: "Discours",
                    youtubeId: "dQw4w9WgXcQ",
                    duration: "10m",
                    date: "Juin 2026"
                  };
                  const updated = [...videos, newVid];
                  setVideos(updated);
                  setSelectedVideoIndex(updated.length - 1);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green border border-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une vidéo</span>
              </button>
            </div>

            {/* VIDÉO À LA UNE — Panneau dédié */}
            {(() => {
              const featuredVid = videos.find(v => v.featured);
              return (
                <div className="glass-panel p-5 rounded-2xl border border-brand-gold/20 flex gap-6 items-center">
                  <div className="flex items-center gap-2 text-brand-gold">
                    <Star className="w-5 h-5 fill-brand-gold" />
                    <span className="text-sm font-extrabold uppercase tracking-wider">Vidéo à la une</span>
                  </div>
                  {featuredVid ? (
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-32 aspect-video rounded-lg overflow-hidden border border-brand-emerald/20 flex-shrink-0 bg-black">
                        <iframe
                          className="w-full h-full pointer-events-none"
                          src={`https://www.youtube.com/embed/${featuredVid.youtubeId}`}
                          title={featuredVid.title}
                          tabIndex={-1}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-2 py-0.5 rounded border border-brand-gold/20">{featuredVid.category}</span>
                        <p className="text-sm font-bold text-white mt-1 line-clamp-2">{featuredVid.title}</p>
                        <p className="text-[10px] font-mono text-foreground/45 mt-0.5">{featuredVid.date} · {featuredVid.duration}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/45 italic flex-1">Aucune vidéo sélectionnée — cliquez sur ★ dans la liste ci-dessous.</p>
                  )}
                </div>
              );
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* List */}
              <div className="lg:col-span-5 glass-panel p-4 rounded-2xl max-h-[600px] overflow-y-auto space-y-2">
                {videos.map((vid, idx) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideoIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedVideoIndex === idx 
                        ? "bg-brand-gold/15 border-brand-gold text-brand-gold font-bold" 
                        : "bg-brand-green/5 border-brand-emerald/10 hover:bg-brand-green/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-1.5 py-0.5 rounded border border-brand-gold/10">{vid.category}</span>
                      <span className="text-xs truncate max-w-[140px]">{vid.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Featured toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = videos.map((v, i) => ({ ...v, featured: i === idx }));
                          setVideos(updated);
                          saveFile("videos", updated);
                        }}
                        title={vid.featured ? "Vidéo à la une (active)" : "Définir comme vidéo à la une"}
                        aria-label={vid.featured ? "Vidéo à la une active" : "Définir comme vidéo à la une"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          vid.featured
                            ? "text-brand-gold bg-brand-gold/15 border border-brand-gold/30"
                            : "text-foreground/30 hover:text-brand-gold hover:bg-brand-gold/10"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${vid.featured ? "fill-brand-gold" : ""}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = videos.filter((_, i) => i !== idx);
                          setVideos(updated);
                          setSelectedVideoIndex(null);
                          saveFile("videos", updated);
                        }}
                        title="Supprimer cette vidéo"
                        aria-label="Supprimer cette vidéo"
                        className="p-1 text-foreground/45 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="lg:col-span-7">
                {selectedVideoIndex !== null && videos[selectedVideoIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-brand-emerald/10 pb-3">Éditer la Vidéo</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="vid-category" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Catégorie</label>
                        <select
                          id="vid-category"
                          value={videos[selectedVideoIndex].category}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[selectedVideoIndex] = { ...updated[selectedVideoIndex], category: e.target.value };
                            setVideos(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        >
                          <option value="Discours">Discours</option>
                          <option value="Interviews">Interviews</option>
                          <option value="Débats">Débats</option>
                          <option value="Conférences">Conférences</option>
                          <option value="Podcasts">Podcasts</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="vid-date" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Date d&apos;émission</label>
                        <input
                          id="vid-date"
                          type="text"
                          value={videos[selectedVideoIndex].date}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[selectedVideoIndex] = { ...updated[selectedVideoIndex], date: e.target.value };
                            setVideos(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="vid-youtube-id" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">ID YouTube (ex: QTNnnxIW5yE)</label>
                        <input
                          id="vid-youtube-id"
                          type="text"
                          value={videos[selectedVideoIndex].youtubeId}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[selectedVideoIndex] = { ...updated[selectedVideoIndex], youtubeId: e.target.value };
                            setVideos(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="vid-duration" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Durée (ex: 45m)</label>
                        <input
                          id="vid-duration"
                          type="text"
                          value={videos[selectedVideoIndex].duration}
                          onChange={(e) => {
                            const updated = [...videos];
                            updated[selectedVideoIndex] = { ...updated[selectedVideoIndex], duration: e.target.value };
                            setVideos(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="vid-title" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Titre de la vidéo</label>
                      <input
                        id="vid-title"
                        type="text"
                        value={videos[selectedVideoIndex].title}
                        onChange={(e) => {
                          const updated = [...videos];
                          updated[selectedVideoIndex] = { ...updated[selectedVideoIndex], title: e.target.value };
                          setVideos(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <button
                      onClick={() => saveFile("videos", videos)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <Video className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez une vidéo pour l&apos;éditer ou cliquez sur &quot;Ajouter&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* REALIZATIONS TAB */}
        {activeTab === "realizations" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Réalisations & Projets</h1>
                <p className="text-sm text-foreground/55 mt-1">Gérer les projets territoriaux nationaux du projet Sénégal 2050.</p>
              </div>
              <button
                onClick={() => {
                  const newProj = {
                    id: `proj-${Date.now()}`,
                    domain: "Économie",
                    title: "Nouveau Projet",
                    description: "Description de la réalisation.",
                    objectifs: ["Objectif 1"],
                    resultats: ["Résultat 1"],
                    kpis: [
                      { label: "Horizon", value: "2050" }
                    ],
                    media: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop"
                  };
                  const updated = [...realizations, newProj];
                  setRealizations(updated);
                  setSelectedRealizationIndex(updated.length - 1);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green border border-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un projet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* List */}
              <div className="lg:col-span-5 glass-panel p-4 rounded-2xl max-h-[600px] overflow-y-auto space-y-2">
                {realizations.map((proj, idx) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedRealizationIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedRealizationIndex === idx 
                        ? "bg-brand-gold/15 border-brand-gold text-brand-gold font-bold" 
                        : "bg-brand-green/5 border-brand-emerald/10 hover:bg-brand-green/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-1.5 py-0.5 rounded border border-brand-gold/10">{proj.domain}</span>
                      <span className="text-xs truncate max-w-[180px]">{proj.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = realizations.filter((_, i) => i !== idx);
                        setRealizations(updated);
                        setSelectedRealizationIndex(null);
                        saveFile("realizations", updated);
                      }}
                      title="Supprimer ce projet"
                      aria-label="Supprimer ce projet"
                      className="p-1 text-foreground/45 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="lg:col-span-7">
                {selectedRealizationIndex !== null && realizations[selectedRealizationIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-brand-emerald/10 pb-3">Éditer le projet</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="proj-domain" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Domaine / Secteur</label>
                        <input
                          id="proj-domain"
                          type="text"
                          value={realizations[selectedRealizationIndex].domain}
                          onChange={(e) => {
                            const updated = [...realizations];
                            updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], domain: e.target.value };
                            setRealizations(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="proj-media" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Image URL</label>
                        <div className="flex gap-2">
                          <input
                            id="proj-media"
                            type="text"
                            value={realizations[selectedRealizationIndex].media}
                            onChange={(e) => {
                              const updated = [...realizations];
                              updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], media: e.target.value };
                              setRealizations(updated);
                            }}
                            className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id={`upload-realization-${selectedRealizationIndex}`}
                            onChange={(e) => handleImageUpload(e, (uploadedUrl) => {
                              const updated = [...realizations];
                              updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], media: uploadedUrl };
                              setRealizations(updated);
                            })}
                            className="hidden"
                          />
                          <label
                            htmlFor={`upload-realization-${selectedRealizationIndex}`}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-green/35 border border-brand-emerald/20 hover:border-brand-gold text-foreground/80 hover:text-brand-gold text-xs font-bold cursor-pointer transition-all active:scale-95"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{uploading ? "..." : "Téléverser"}</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="proj-title" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Titre du Projet</label>
                      <input
                        id="proj-title"
                        type="text"
                        value={realizations[selectedRealizationIndex].title}
                        onChange={(e) => {
                          const updated = [...realizations];
                          updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], title: e.target.value };
                          setRealizations(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor="proj-desc" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Description / Présentation</label>
                      <textarea
                        id="proj-desc"
                        rows={3}
                        value={realizations[selectedRealizationIndex].description}
                        onChange={(e) => {
                          const updated = [...realizations];
                          updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], description: e.target.value };
                          setRealizations(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    {/* Objectifs Array Editor */}
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Objectifs stratégiques</label>
                      <div className="space-y-2">
                        {realizations[selectedRealizationIndex].objectifs.map((obj, oIdx) => (
                          <div key={oIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={obj}
                              onChange={(e) => {
                                const updatedObj = [...realizations[selectedRealizationIndex].objectifs];
                                updatedObj[oIdx] = e.target.value;
                                const updated = [...realizations];
                                updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], objectifs: updatedObj };
                                setRealizations(updated);
                              }}
                              placeholder={`Objectif ${oIdx + 1}`}
                              aria-label={`Objectif ${oIdx + 1}`}
                              className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updatedObj = realizations[selectedRealizationIndex].objectifs.filter((_, i) => i !== oIdx);
                                const updated = [...realizations];
                                updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], objectifs: updatedObj };
                                setRealizations(updated);
                              }}
                              title="Supprimer l'objectif"
                              aria-label="Supprimer l'objectif"
                              className="p-2 bg-red-950/20 border border-red-500/10 text-red-400 rounded-xl hover:bg-red-950/40"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updatedObj = [...realizations[selectedRealizationIndex].objectifs, ""];
                            const updated = [...realizations];
                            updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], objectifs: updatedObj };
                            setRealizations(updated);
                          }}
                          className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold-light mt-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Ajouter un objectif
                        </button>
                      </div>
                    </div>

                    {/* Resultats Array Editor */}
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Résultats obtenus / Attendus</label>
                      <div className="space-y-2">
                        {realizations[selectedRealizationIndex].resultats.map((res, rIdx) => (
                          <div key={rIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={res}
                              onChange={(e) => {
                                const updatedRes = [...realizations[selectedRealizationIndex].resultats];
                                updatedRes[rIdx] = e.target.value;
                                const updated = [...realizations];
                                updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], resultats: updatedRes };
                                setRealizations(updated);
                              }}
                              placeholder={`Résultat ${rIdx + 1}`}
                              aria-label={`Résultat ${rIdx + 1}`}
                              className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updatedRes = realizations[selectedRealizationIndex].resultats.filter((_, i) => i !== rIdx);
                                const updated = [...realizations];
                                updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], resultats: updatedRes };
                                setRealizations(updated);
                              }}
                              title="Supprimer le résultat"
                              aria-label="Supprimer le résultat"
                              className="p-2 bg-red-950/20 border border-red-500/10 text-red-400 rounded-xl hover:bg-red-950/40"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updatedRes = [...realizations[selectedRealizationIndex].resultats, ""];
                            const updated = [...realizations];
                            updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], resultats: updatedRes };
                            setRealizations(updated);
                          }}
                          className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold-light mt-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Ajouter un résultat
                        </button>
                      </div>
                    </div>

                    {/* KPIs Array Editor */}
                    <div>
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">KPIs clés ({realizations[selectedRealizationIndex].kpis.length})</label>
                      <div className="space-y-2">
                        {realizations[selectedRealizationIndex].kpis.map((kpi, kIdx) => (
                          <div key={kIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={kpi.label}
                              placeholder="Libellé (ex: Impact)"
                              aria-label={`KPI ${kIdx + 1} Libellé`}
                              onChange={(e) => {
                                const updatedKpis = [...realizations[selectedRealizationIndex].kpis];
                                updatedKpis[kIdx] = { ...updatedKpis[kIdx], label: e.target.value };
                                const updated = [...realizations];
                                updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], kpis: updatedKpis };
                                setRealizations(updated);
                              }}
                              className="w-1/2 bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
                            />
                            <input
                              type="text"
                              value={kpi.value}
                              placeholder="Valeur (ex: +25%)"
                              aria-label={`KPI ${kIdx + 1} Valeur`}
                              onChange={(e) => {
                                const updatedKpis = [...realizations[selectedRealizationIndex].kpis];
                                updatedKpis[kIdx] = { ...updatedKpis[kIdx], value: e.target.value };
                                const updated = [...realizations];
                                updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], kpis: updatedKpis };
                                setRealizations(updated);
                              }}
                              className="w-1/2 bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const updatedKpis = realizations[selectedRealizationIndex].kpis.filter((_, i) => i !== kIdx);
                                const updated = [...realizations];
                                updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], kpis: updatedKpis };
                                setRealizations(updated);
                              }}
                              title="Supprimer le KPI"
                              aria-label="Supprimer le KPI"
                              className="p-2 bg-red-950/20 border border-red-500/10 text-red-400 rounded-xl hover:bg-red-950/40"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updatedKpis = [...realizations[selectedRealizationIndex].kpis, { label: "", value: "" }];
                            const updated = [...realizations];
                            updated[selectedRealizationIndex] = { ...updated[selectedRealizationIndex], kpis: updatedKpis };
                            setRealizations(updated);
                          }}
                          className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold-light mt-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Ajouter un KPI
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => saveFile("realizations", realizations)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <Map className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez un projet pour l&apos;éditer ou cliquez sur &quot;Ajouter&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUIZZES TAB */}
        {activeTab === "quizzes" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Quiz Citoyen</h1>
                <p className="text-sm text-foreground/55 mt-1">Gérer les questions de quiz pour éduquer et tester les citoyens.</p>
              </div>
              <button
                onClick={() => {
                  const newQuiz = {
                    id: `q-${Date.now()}`,
                    question: "Nouvelle Question",
                    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                    correctAnswer: 0,
                    explanation: "Explication de la réponse.",
                    category: "Histoire"
                  };
                  const updated = [...quizzes, newQuiz];
                  setQuizzes(updated);
                  setSelectedQuizIndex(updated.length - 1);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green border border-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une question</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* List */}
              <div className="lg:col-span-5 glass-panel p-4 rounded-2xl max-h-[600px] overflow-y-auto space-y-2">
                {quizzes.map((q, idx) => (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuizIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedQuizIndex === idx 
                        ? "bg-brand-gold/15 border-brand-gold text-brand-gold font-bold" 
                        : "bg-brand-green/5 border-brand-emerald/10 hover:bg-brand-green/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-1.5 py-0.5 rounded border border-brand-gold/10">{q.category}</span>
                      <span className="text-xs truncate max-w-[180px]">{q.question}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = quizzes.filter((_, i) => i !== idx);
                        setQuizzes(updated);
                        setSelectedQuizIndex(null);
                        saveFile("quizzes", updated);
                      }}
                      title="Supprimer cette question"
                      aria-label="Supprimer cette question"
                      className="p-1 text-foreground/45 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="lg:col-span-7">
                {selectedQuizIndex !== null && quizzes[selectedQuizIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-brand-emerald/10 pb-3">Éditer la question</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="q-category" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Catégorie</label>
                        <input
                          id="q-category"
                          type="text"
                          value={quizzes[selectedQuizIndex].category}
                          onChange={(e) => {
                            const updated = [...quizzes];
                            updated[selectedQuizIndex] = { ...updated[selectedQuizIndex], category: e.target.value };
                            setQuizzes(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label htmlFor="q-correct" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Bonne Réponse</label>
                        <select
                          id="q-correct"
                          value={quizzes[selectedQuizIndex].correctAnswer}
                          onChange={(e) => {
                            const updated = [...quizzes];
                            updated[selectedQuizIndex] = { ...updated[selectedQuizIndex], correctAnswer: parseInt(e.target.value) };
                            setQuizzes(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        >
                          <option value="0">Option 1</option>
                          <option value="1">Option 2</option>
                          <option value="2">Option 3</option>
                          <option value="3">Option 4</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="q-question" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Question</label>
                      <input
                        id="q-question"
                        type="text"
                        value={quizzes[selectedQuizIndex].question}
                        onChange={(e) => {
                          const updated = [...quizzes];
                          updated[selectedQuizIndex] = { ...updated[selectedQuizIndex], question: e.target.value };
                          setQuizzes(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    {/* Options (4 options) */}
                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Options de Réponse</label>
                      {quizzes[selectedQuizIndex].options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                            quizzes[selectedQuizIndex].correctAnswer === oIdx 
                              ? "bg-brand-gold text-brand-green-dark" 
                              : "bg-brand-green/20 text-foreground/60"
                          }`}>
                            {oIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updatedOpts = [...quizzes[selectedQuizIndex].options];
                              updatedOpts[oIdx] = e.target.value;
                              const updated = [...quizzes];
                              updated[selectedQuizIndex] = { ...updated[selectedQuizIndex], options: updatedOpts };
                              setQuizzes(updated);
                            }}
                            placeholder={`Option ${oIdx + 1}`}
                            aria-label={`Option ${oIdx + 1}`}
                            className="flex-1 bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label htmlFor="q-explanation" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Explication</label>
                      <textarea
                        id="q-explanation"
                        rows={3}
                        value={quizzes[selectedQuizIndex].explanation}
                        onChange={(e) => {
                          const updated = [...quizzes];
                          updated[selectedQuizIndex] = { ...updated[selectedQuizIndex], explanation: e.target.value };
                          setQuizzes(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <button
                      onClick={() => saveFile("quizzes", quizzes)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <Brain className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez un quiz pour l&apos;éditer ou cliquez sur &quot;Ajouter&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">IA RAG (Documents)</h1>
                <p className="text-sm text-foreground/55 mt-1">Gérer la base de connaissances consultée par l&apos;assistant IA d&apos;Ousmane Sonko.</p>
              </div>
              <button
                onClick={() => {
                  const newDoc = {
                    id: `doc-${Date.now()}`,
                    title: "Nouveau Document IA",
                    content: "Contenu informatif du document.",
                    source: "Source officielle",
                    category: "Politique"
                  };
                  const updated = [...documents, newDoc];
                  setDocuments(updated);
                  setSelectedDocumentIndex(updated.length - 1);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green border border-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* List */}
              <div className="lg:col-span-5 glass-panel p-4 rounded-2xl max-h-[600px] overflow-y-auto space-y-2">
                {documents.map((doc, idx) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocumentIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedDocumentIndex === idx 
                        ? "bg-brand-gold/15 border-brand-gold text-brand-gold font-bold" 
                        : "bg-brand-green/5 border-brand-emerald/10 hover:bg-brand-green/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-1.5 py-0.5 rounded border border-brand-gold/10">{doc.category}</span>
                      <span className="text-xs truncate max-w-[180px]">{doc.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = documents.filter((_, i) => i !== idx);
                        setDocuments(updated);
                        setSelectedDocumentIndex(null);
                        saveFile("documents", updated);
                      }}
                      title="Supprimer ce document"
                      aria-label="Supprimer ce document"
                      className="p-1 text-foreground/45 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="lg:col-span-7">
                {selectedDocumentIndex !== null && documents[selectedDocumentIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-brand-emerald/10 pb-3">Éditer le document IA</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="doc-category" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Catégorie</label>
                        <input
                          id="doc-category"
                          type="text"
                          value={documents[selectedDocumentIndex].category}
                          onChange={(e) => {
                            const updated = [...documents];
                            updated[selectedDocumentIndex] = { ...updated[selectedDocumentIndex], category: e.target.value };
                            setDocuments(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label htmlFor="doc-source" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Source du document</label>
                        <input
                          id="doc-source"
                          type="text"
                          value={documents[selectedDocumentIndex].source}
                          onChange={(e) => {
                            const updated = [...documents];
                            updated[selectedDocumentIndex] = { ...updated[selectedDocumentIndex], source: e.target.value };
                            setDocuments(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doc-title" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Titre du document</label>
                      <input
                        id="doc-title"
                        type="text"
                        value={documents[selectedDocumentIndex].title}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[selectedDocumentIndex] = { ...updated[selectedDocumentIndex], title: e.target.value };
                          setDocuments(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor="doc-content" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Contenu (Texte indexé par le RAG)</label>
                      <textarea
                        id="doc-content"
                        rows={8}
                        value={documents[selectedDocumentIndex].content}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[selectedDocumentIndex] = { ...updated[selectedDocumentIndex], content: e.target.value };
                          setDocuments(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <button
                      onClick={() => saveFile("documents", documents)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <Bot className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez un document RAG pour l&apos;éditer ou cliquez sur &quot;Ajouter&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS FILES TAB */}
        {activeTab === "documents_files" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Documents Téléchargeables</h1>
                <p className="text-sm text-foreground/55 mt-1">Gérer les livres, statuts et documents PDF officiels à télécharger.</p>
              </div>
              <button
                onClick={() => {
                  const newDocFile = {
                    title: "Nouveau Document",
                    type: "Livre Numérique",
                    size: "2.4 MB",
                    downloads: "15k",
                    description: "Description courte du document téléchargeable.",
                    link: "https://drive.google.com/drive/folders/11m9ap9I2zigaSDpMN84lFl3W-ytt58HQ?usp=drive_link"
                  };
                  const updated = [...documentsFiles, newDocFile];
                  setDocumentsFiles(updated);
                  setSelectedDocumentFileIndex(updated.length - 1);
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green border border-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* List */}
              <div className="lg:col-span-5 glass-panel p-4 rounded-2xl max-h-[600px] overflow-y-auto space-y-2">
                {documentsFiles.map((doc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedDocumentFileIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedDocumentFileIndex === idx 
                        ? "bg-brand-gold/15 border-brand-gold text-brand-gold font-bold" 
                        : "bg-brand-green/5 border-brand-emerald/10 hover:bg-brand-green/15"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-brand-gold bg-brand-green/30 px-1.5 py-0.5 rounded border border-brand-gold/10">{doc.type}</span>
                      <span className="text-xs truncate max-w-[180px]">{doc.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = documentsFiles.filter((_, i) => i !== idx);
                        setDocumentsFiles(updated);
                        setSelectedDocumentFileIndex(null);
                        saveFile("documents_files", updated);
                      }}
                      title="Supprimer ce document"
                      aria-label="Supprimer ce document"
                      className="p-1 text-foreground/45 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="lg:col-span-7">
                {selectedDocumentFileIndex !== null && documentsFiles[selectedDocumentFileIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-brand-emerald/10 pb-3">Éditer le document à télécharger</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="doc-file-type" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Type (ex: Livre Numérique)</label>
                        <input
                          id="doc-file-type"
                          type="text"
                          value={documentsFiles[selectedDocumentFileIndex].type}
                          onChange={(e) => {
                            const updated = [...documentsFiles];
                            updated[selectedDocumentFileIndex] = { ...updated[selectedDocumentFileIndex], type: e.target.value };
                            setDocumentsFiles(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label htmlFor="doc-file-size" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Taille du fichier (ex: 2.4 MB)</label>
                        <input
                          id="doc-file-size"
                          type="text"
                          value={documentsFiles[selectedDocumentFileIndex].size}
                          onChange={(e) => {
                            const updated = [...documentsFiles];
                            updated[selectedDocumentFileIndex] = { ...updated[selectedDocumentFileIndex], size: e.target.value };
                            setDocumentsFiles(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="doc-file-title" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Titre du document</label>
                        <input
                          id="doc-file-title"
                          type="text"
                          value={documentsFiles[selectedDocumentFileIndex].title}
                          onChange={(e) => {
                            const updated = [...documentsFiles];
                            updated[selectedDocumentFileIndex] = { ...updated[selectedDocumentFileIndex], title: e.target.value };
                            setDocumentsFiles(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label htmlFor="doc-file-downloads" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Nombre de téléchargements (ex: 85k)</label>
                        <input
                          id="doc-file-downloads"
                          type="text"
                          value={documentsFiles[selectedDocumentFileIndex].downloads}
                          onChange={(e) => {
                            const updated = [...documentsFiles];
                            updated[selectedDocumentFileIndex] = { ...updated[selectedDocumentFileIndex], downloads: e.target.value };
                            setDocumentsFiles(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doc-file-link" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Lien Google Drive du document</label>
                      <div className="flex gap-2">
                        <input
                          id="doc-file-link"
                          type="text"
                          value={documentsFiles[selectedDocumentFileIndex].link || ""}
                          onChange={(e) => {
                            const updated = [...documentsFiles];
                            updated[selectedDocumentFileIndex] = { ...updated[selectedDocumentFileIndex], link: e.target.value };
                            setDocumentsFiles(updated);
                          }}
                          placeholder="https://drive.google.com/..."
                          className="flex-1 bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`doc-upload-input-${selectedDocumentFileIndex}`)?.click()}
                          disabled={uploadingDoc}
                          className="px-4 py-2.5 rounded-xl bg-brand-green/20 border border-brand-emerald/25 hover:bg-brand-green/40 text-brand-gold text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{uploadingDoc ? "Téléversement..." : "Téléverser sur Drive"}</span>
                        </button>
                        <input
                          id={`doc-upload-input-${selectedDocumentFileIndex}`}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleDocFileUpload(e, selectedDocumentFileIndex)}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doc-file-desc" className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        id="doc-file-desc"
                        rows={4}
                        value={documentsFiles[selectedDocumentFileIndex].description}
                        onChange={(e) => {
                          const updated = [...documentsFiles];
                          updated[selectedDocumentFileIndex] = { ...updated[selectedDocumentFileIndex], description: e.target.value };
                          setDocumentsFiles(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <button
                      onClick={() => saveFile("documents_files", documentsFiles)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <FileText className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez un document pour l&apos;éditer ou cliquez sur &quot;Ajouter&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contributors" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Contributeurs & Citoyens</h1>
                <p className="text-sm text-foreground/55 mt-1">
                  Gérer la liste des citoyens inscrits sur la plateforme et synchronisés avec Supabase.
                </p>
              </div>
              <button
                onClick={fetchContributors}
                disabled={loadingContributors}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-green/20 border border-brand-emerald/20 hover:bg-brand-green/35 text-brand-gold text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingContributors ? "animate-spin" : ""}`} />
                <span>Actualiser</span>
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/10 font-sans">
              {loadingContributors ? (
                <div className="text-center py-20 text-xs text-foreground/45 font-mono">
                  Chargement des contributeurs en cours...
                </div>
              ) : contributors.length === 0 ? (
                <div className="text-center py-20 text-xs text-foreground/45 font-mono">
                  Aucun contributeur inscrit pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-emerald/10 text-[10px] font-mono font-bold text-brand-gold/80 uppercase tracking-wider">
                        <th className="pb-4 font-semibold font-mono">Nom Complet</th>
                        <th className="pb-4 font-semibold font-mono">Adresse Email</th>
                        <th className="pb-4 font-semibold font-mono">Date d&apos;inscription</th>
                        <th className="pb-4 font-semibold text-right font-mono font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-emerald/5 text-xs">
                      {contributors.map((contrib) => (
                        <tr key={contrib.id} className="group hover:bg-brand-green/5 transition-colors">
                          <td className="py-4 font-bold text-white font-display">{contrib.full_name}</td>
                          <td className="py-4 text-foreground/70 font-mono">{contrib.email}</td>
                          <td className="py-4 text-foreground/50 font-mono">
                            {new Date(contrib.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => deleteContributor(contrib.id)}
                              className="p-2 rounded-lg bg-red-950/20 border border-red-500/10 hover:bg-red-950/40 text-[#EF4444] transition-all cursor-pointer"
                              title="Supprimer ce contributeur"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "scenarios" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-display text-white">Scénarios Mutation 2021-2024 (360°)</h1>
                <p className="text-sm text-foreground/55 mt-1">
                  Ajouter, modifier ou supprimer des scénarios d&apos;événements du ruban circulaire de l&apos;accueil.
                </p>
              </div>
              <button
                onClick={() => {
                  const newEvent: ScenarioEvent = {
                    id: `ev-${Date.now()}`,
                    date: "Nouveau Mois",
                    year: new Date().getFullYear().toString(),
                    title: "Nouveau Scénario",
                    description: "Description de l'événement.",
                    icon: "ShieldAlert",
                    theme: "border-brand-gold/40 text-brand-gold hover:border-brand-gold",
                    image: ""
                  };
                  setScenarios([...scenarios, newEvent]);
                  setSelectedScenarioIndex(scenarios.length);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Scénario</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
              {/* Left Column: List of scenarios */}
              <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-brand-emerald/10 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin">
                <h3 className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider mb-2">Liste des Scénarios ({scenarios.length})</h3>
                {scenarios.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedScenarioIndex(index)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedScenarioIndex === index
                        ? "bg-brand-green/30 border-brand-gold text-white"
                        : "bg-brand-green-dark/10 border-brand-emerald/10 text-foreground/75 hover:bg-brand-green/10 hover:text-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <span className="text-[9px] font-mono text-brand-gold uppercase block">{item.date}</span>
                      <h4 className="text-xs font-bold truncate mt-0.5">{item.title}</h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Supprimer ce scénario ?")) {
                          const updated = scenarios.filter((_, i) => i !== index);
                          setScenarios(updated);
                          setSelectedScenarioIndex(null);
                          saveFile("scenarios", updated);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-950/20 text-[#EF4444] border border-red-500/10 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Column: Editor Form */}
              <div className="lg:col-span-7">
                {selectedScenarioIndex !== null && scenarios[selectedScenarioIndex] ? (
                  <div className="glass-panel p-6 rounded-2xl border border-brand-emerald/15 space-y-4">
                    <h3 className="text-sm font-mono font-bold text-brand-gold uppercase tracking-wider mb-2 border-b border-brand-emerald/10 pb-2">
                      Éditeur de Scénario
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`scenario-date-${selectedScenarioIndex}`} className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Mois / Date (ex: Mars 2021)</label>
                        <input
                          id={`scenario-date-${selectedScenarioIndex}`}
                          type="text"
                          value={scenarios[selectedScenarioIndex].date}
                          placeholder="ex: Mars 2021"
                          title="Mois / Date du scénario"
                          onChange={(e) => {
                            const updated = [...scenarios];
                            updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], date: e.target.value };
                            setScenarios(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label htmlFor={`scenario-year-${selectedScenarioIndex}`} className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Année (ex: 2021)</label>
                        <input
                          id={`scenario-year-${selectedScenarioIndex}`}
                          type="text"
                          value={scenarios[selectedScenarioIndex].year}
                          placeholder="ex: 2021"
                          title="Année du scénario"
                          onChange={(e) => {
                            const updated = [...scenarios];
                            updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], year: e.target.value };
                            setScenarios(updated);
                          }}
                          className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`scenario-title-${selectedScenarioIndex}`} className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Titre du Scénario</label>
                      <input
                        id={`scenario-title-${selectedScenarioIndex}`}
                        type="text"
                        value={scenarios[selectedScenarioIndex].title}
                        placeholder="Titre du Scénario"
                        title="Titre de l'événement"
                        onChange={(e) => {
                          const updated = [...scenarios];
                          updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], title: e.target.value };
                          setScenarios(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor={`scenario-icon-${selectedScenarioIndex}`} className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Icône (ex: ShieldAlert, Scale, Flag, UserCheck, Award, Activity)</label>
                      <input
                        id={`scenario-icon-${selectedScenarioIndex}`}
                        type="text"
                        value={scenarios[selectedScenarioIndex].icon}
                        placeholder="ex: ShieldAlert"
                        title="Nom de l'icône Lucide"
                        onChange={(e) => {
                          const updated = [...scenarios];
                          updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], icon: e.target.value };
                          setScenarios(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor={`scenario-theme-${selectedScenarioIndex}`} className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Bordure & Style CSS (ex: border-red-500/40 text-red-400...)</label>
                      <input
                        id={`scenario-theme-${selectedScenarioIndex}`}
                        type="text"
                        value={scenarios[selectedScenarioIndex].theme}
                        placeholder="Classes CSS de thème"
                        title="Style CSS personnalisé du cercle"
                        onChange={(e) => {
                          const updated = [...scenarios];
                          updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], theme: e.target.value };
                          setScenarios(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor={`scenario-image-${selectedScenarioIndex}`} className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Image d&apos;arrière-plan</label>
                      <div className="flex gap-2">
                        <input
                          id={`scenario-image-${selectedScenarioIndex}`}
                          type="text"
                          value={scenarios[selectedScenarioIndex].image}
                          onChange={(e) => {
                            const updated = [...scenarios];
                            updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], image: e.target.value };
                            setScenarios(updated);
                          }}
                          placeholder="Saisir l'URL ou téléverser"
                          title="Lien URL de l'image d'arrière-plan"
                          className="flex-1 bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`scenario-upload-input-${selectedScenarioIndex}`)?.click()}
                          disabled={uploading}
                          className="px-4 py-2.5 rounded-xl bg-brand-green/20 border border-brand-emerald/25 hover:bg-brand-green/45 text-brand-gold text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{uploading ? "Upload..." : "Téléverser"}</span>
                        </button>
                        <input
                          id={`scenario-upload-input-${selectedScenarioIndex}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const updated = [...scenarios];
                            updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], image: url };
                            setScenarios(updated);
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`scenario-description-${selectedScenarioIndex}`} className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        id={`scenario-description-${selectedScenarioIndex}`}
                        rows={4}
                        value={scenarios[selectedScenarioIndex].description}
                        placeholder="Description de l'événement..."
                        title="Description textuelle du scénario"
                        onChange={(e) => {
                          const updated = [...scenarios];
                          updated[selectedScenarioIndex] = { ...updated[selectedScenarioIndex], description: e.target.value };
                          setScenarios(updated);
                        }}
                        className="w-full bg-brand-green/10 border border-brand-emerald/20 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <button
                      onClick={() => saveFile("scenarios", scenarios)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gold text-brand-green-dark font-extrabold text-sm hover:shadow-lg hover:shadow-brand-gold/15 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer dans scenarios.json</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl text-foreground/40 text-sm">
                    <Clock className="w-12 h-12 text-foreground/20 mb-3" />
                    <span>Sélectionnez un scénario pour l&apos;éditer ou cliquez sur &quot;Ajouter un Scénario&quot;</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
