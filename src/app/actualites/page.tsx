"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, MessageSquare, Send, Search, Sparkles, X, Calendar, Share2 } from "lucide-react";
import { supabase } from "@/utils/supabase";
import actualitesData from "@/data/actualites.json";

interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
}

interface Comment {
  id: string;
  article_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<Article[]>(actualitesData as unknown as Article[]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  
  // Local fallback comments state (in case Supabase table comments isn't created yet)
  const [localComments, setLocalComments] = useState<Record<string, Comment[]>>({});

  interface ActualiteRow {
    id: string;
    title: string;
    summary: string;
    content: string;
    date: string;
    read_time: string;
    category: string;
    image: string;
    author?: string;
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase.from("actualites").select("*");
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = (data as ActualiteRow[]).map((item) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            content: item.content,
            date: item.date,
            readTime: item.read_time, // map read_time -> readTime
            category: item.category,
            image: item.image,
            author: item.author || "Secrétariat Général de PASTEF"
          }));
          setArticles(mapped);
        }
      } catch (err) {
        console.warn("Could not fetch articles from Supabase, using local fallback", err);
      }
    };
    fetchArticles();
  }, []);

  const categories = [
    "all",
    "Gouvernement",
    "Économie",
    "Diplomatie",
    "Réformes",
    "Discours"
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === "all" || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const fetchComments = async (articleId: string) => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not fetch comments from Supabase, falling back to local storage.", error.message);
        // Fallback to local storage or local state
        const localList = localComments[articleId] || [];
        setComments(localList);
      } else if (data) {
        setComments(data);
      }
    } catch (err) {
      console.error("Exception fetching comments:", err);
      const localList = localComments[articleId] || [];
      setComments(localList);
    } finally {
      setLoadingComments(false);
    }
  };

  // Fetch comments when an article is selected
  useEffect(() => {
    if (!selectedArticle) return;
    const articleId = selectedArticle.id;
    const load = async () => {
      setLoadingComments(true);
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("article_id", articleId)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Could not fetch comments from Supabase, falling back to local storage.", error.message);
          setComments((prev) => localComments[articleId] ?? prev);
        } else if (data) {
          setComments(data as Comment[]);
        }
      } catch (err) {
        console.error("Exception fetching comments:", err);
        setComments(localComments[articleId] ?? []);
      } finally {
        setLoadingComments(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArticle]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentContent.trim() || !selectedArticle) return;

    setPostingComment(true);
    const newCommentPayload = {
      article_id: selectedArticle.id,
      user_name: commentAuthor.trim(),
      content: commentContent.trim()
    };

    try {
      const { error } = await supabase
        .from("comments")
        .insert([newCommentPayload]);

      if (error) {
        console.warn("Failed to post comment to Supabase table, applying local fallback.", error.message);
        applyLocalFallbackComment(selectedArticle.id, newCommentPayload);
      } else {
        setCommentContent("");
        await fetchComments(selectedArticle.id);
      }
    } catch (err) {
      console.error("Exception posting comment:", err);
      applyLocalFallbackComment(selectedArticle.id, newCommentPayload);
    } finally {
      setPostingComment(false);
    }
  };

  const applyLocalFallbackComment = (articleId: string, payload: { user_name: string; content: string }) => {
    const fallbackComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      article_id: articleId,
      user_name: payload.user_name,
      content: payload.content,
      created_at: new Date().toISOString()
    };

    const updatedList = [fallbackComment, ...(localComments[articleId] || [])];
    setLocalComments(prev => ({
      ...prev,
      [articleId]: updatedList
    }));
    setComments(updatedList);
    setCommentContent("");
  };

  const handleShare = (article: Article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(`"${article.title}" - Lire l'actualité sur SONKO Guide de la Révolution`);
      alert("Lien copié dans le presse-papiers !");
    }
  };

  return (
    <div className="w-full animate-slide-up bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/20 via-brand-dark-base to-brand-dark-base py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-black text-brand-gold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-gold" />
            <span>Actualités & Réformes</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-white mt-3 text-glow-gold">
            Fil d&apos;Actualités Officielles
          </h1>
          <p className="text-sm text-foreground/60 mt-3 max-w-xl mx-auto leading-relaxed">
            Restez informé en temps réel des réformes, déclarations ministérielles, visites diplomatiques et projets d&apos;infrastructures.
          </p>
        </div>

        {/* Filters and search panel */}
        <div className="glass-panel p-6 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-gold text-brand-green-dark border-brand-gold shadow-md"
                    : "bg-brand-green/15 border-brand-emerald/15 text-foreground/75 hover:bg-brand-green/30"
                }`}
              >
                {cat === "all" ? "Toutes les catégories" : cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-green/20 border border-brand-emerald/25 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:border-brand-gold text-foreground transition-all"
            />
            <Search className="w-4 h-4 text-foreground/50 absolute left-3 top-3" />
          </div>
        </div>

        {/* News Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((art) => (
              <motion.article
                key={art.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between border border-brand-emerald/10 relative group"
              >
                {/* Article Image wrapper */}
                <div className="relative h-[200px] w-full overflow-hidden border-b border-brand-emerald/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-base via-transparent to-transparent opacity-75" />
                  
                  {/* Tag label */}
                  <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-green-dark border border-brand-gold shadow-md">
                    {art.category}
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[10px] text-foreground/45 font-mono mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-brand-gold" /> {art.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-brand-gold" /> {art.readTime}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-display leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/70 mt-3 leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-emerald/10 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-foreground/40 font-bold truncate max-w-[150px]">
                      Par {art.author}
                    </span>
                    
                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="text-xs font-black text-brand-gold hover:text-brand-gold-light transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Lire l&apos;article</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {filteredArticles.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-brand-green/5 border border-brand-emerald/10 rounded-2xl">
              <p className="text-foreground/50 text-sm">Aucun article ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>

      </div>

      {/* ARTICLE EXPANDED MODAL DETAIL */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-brand-dark-card border border-brand-emerald/25 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-thin"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                title="Fermer"
                aria-label="Fermer"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-brand-dark-base/80 border border-brand-emerald/10 hover:border-brand-gold/45 text-white hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Banner Image */}
              <div className="relative h-[250px] md:h-[320px] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-card via-transparent to-transparent" />
                
                {/* Category label */}
                <span className="absolute bottom-4 left-6 px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider bg-brand-gold text-brand-green-dark border border-brand-gold shadow-md">
                  {selectedArticle.category}
                </span>
              </div>

              {/* Content body */}
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/45 font-mono mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand-gold" /> {selectedArticle.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-gold" /> {selectedArticle.readTime} de lecture</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-brand-gold" /> {selectedArticle.author}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white leading-tight mb-6">
                  {selectedArticle.title}
                </h2>

                <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-sans mb-8 whitespace-pre-line border-l-2 border-brand-gold/40 pl-4">
                  {selectedArticle.content}
                </p>

                <div className="flex justify-end gap-3 border-t border-brand-emerald/10 pt-6 mb-8">
                  <button
                    onClick={() => handleShare(selectedArticle)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green/20 border border-brand-emerald/25 text-foreground hover:bg-brand-green/45 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Partager l&apos;article</span>
                  </button>
                </div>

                {/* COMMENTS SECTION */}
                <div className="border-t border-brand-emerald/15 pt-8">
                  <h3 className="text-lg font-bold text-white font-display mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-gold" />
                    <span>Espace de Discussion ({comments.length})</span>
                  </h3>

                  {/* Add comment Form */}
                  <form onSubmit={handlePostComment} className="glass-panel p-4 rounded-xl mb-6 space-y-4">
                    <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider block">
                      Ajouter une contribution citoyenne
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <input
                          type="text"
                          placeholder="Votre Nom / Pseudo"
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          required
                          className="w-full bg-brand-dark-base border border-brand-emerald/25 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-foreground transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Exprimez votre avis avec respect et courtoisie..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          required
                          className="w-full bg-brand-dark-base border border-brand-emerald/25 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-foreground transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={postingComment}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark text-xs font-extrabold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>{postingComment ? "Publication..." : "Publier"}</span>
                      </button>
                    </div>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                    {loadingComments ? (
                      <div className="text-center py-6 text-xs text-foreground/40 font-mono">
                        Chargement des commentaires...
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-8 bg-brand-green-dark/10 border border-brand-emerald/5 rounded-xl text-xs text-foreground/40 font-mono">
                        Aucun commentaire pour le moment. Soyez le premier à réagir !
                      </div>
                    ) : (
                      comments.map((comm) => (
                        <div key={comm.id} className="bg-brand-green-dark/15 border border-brand-emerald/10 p-4 rounded-xl">
                          <div className="flex justify-between items-center gap-3">
                            <span className="text-xs font-extrabold text-brand-gold font-display flex items-center gap-1">
                              <User className="w-3 h-3 text-foreground/50" />
                              {comm.user_name}
                            </span>
                            <span className="text-[9px] font-mono text-foreground/40">
                              {new Date(comm.created_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/80 mt-2 font-sans leading-relaxed">
                            {comm.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
