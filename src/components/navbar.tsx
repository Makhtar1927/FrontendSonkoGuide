"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Landmark, Award, Bot, Menu, X, ChevronRight, HelpCircle } from "lucide-react";
import WaveButton from "@/components/wave-button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/biographie", label: "Biographie" },
    { href: "/realisations", label: "Réalisations" },
    { href: "/actualites", label: "Actualités" },
    { href: "/bibliotheque", label: "Bibliothèque" },
    { href: "/communaute", label: "Communauté" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-brand-emerald/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group z-50">
          <Image 
            src="https://res.cloudinary.com/drj3gdpqz/image/upload/v1781306865/Sonko.jpg" 
            alt="Ousmane Sonko" 
            width={32} 
            height={32} 
            className="w-8 h-8 rounded-full border border-brand-gold/60 object-cover shadow-sm group-hover:scale-105 transition-all"
          />
          <div className="flex flex-col">
            <span className="font-extrabold font-display text-base tracking-wider text-white group-hover:text-brand-gold transition-colors">
              SONKO
            </span>
            <span className="text-[9px] font-mono text-brand-gold tracking-widest leading-none">
              GUIDE DE LA RÉVOLUTION
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-xs lg:text-sm font-semibold">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-foreground/75 hover:text-brand-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right buttons / Actions */}
        <div className="flex items-center gap-2 md:gap-3 z-50">
          {/* Support button - always visible */}
          <WaveButton 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1c9ff5] hover:bg-[#1585cf] text-white text-[11px] font-extrabold transition-all active:scale-95 shadow-md shadow-sky-500/15 cursor-pointer"
          >
            <Image 
              src="/Wave.svg" 
              alt="Wave Logo" 
              width={14} 
              height={14} 
              className="rounded-sm"
            />
            <span>Soutenir</span>
          </WaveButton>

          {/* Quiz Button - Hidden on mobile, visible on sm and up */}
          <Link 
            href="/#grand-quiz"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green/35 border border-brand-emerald/20 text-[11px] font-bold text-brand-gold hover:bg-brand-green/60 transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Défi Quiz</span>
          </Link>
          
          {/* Ask Sonko - Hidden on mobile/tablet, visible on md and up */}
          <Link 
            href="/#ask-sonko"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark text-[11px] font-black hover:shadow-lg hover:shadow-brand-gold/15 transition-all active:scale-95 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 animate-pulse" />
            <span>Ask Sonko</span>
          </Link>

          {/* Hamburger Menu Button (visible on mobile / below md) */}
          <button
            onClick={toggleMenu}
            className="flex md:hidden items-center justify-center p-2 rounded-lg bg-brand-green/20 border border-brand-emerald/15 hover:bg-brand-green/40 text-brand-gold transition-colors focus:outline-none cursor-pointer"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X className="w-5 h-5 animate-spin-once" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-brand-dark-base/95 backdrop-blur-xl border-b border-brand-emerald/15 animate-fade-in shadow-2xl z-40">
          <div className="px-4 pt-4 pb-6 space-y-4 font-sans max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Nav links */}
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-brand-green-dark/10 border border-brand-emerald/5 hover:border-brand-gold/25 hover:bg-brand-green/20 text-sm font-semibold text-foreground/80 hover:text-white transition-all"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-brand-gold/60" />
                </Link>
              ))}
            </div>

            {/* Mobile Actions divider */}
            <div className="border-t border-brand-emerald/10 pt-4 flex flex-col gap-2.5">
              {/* Quiz Link for Mobile */}
              <Link
                href="/#grand-quiz"
                onClick={() => setIsOpen(false)}
                className="flex sm:hidden items-center justify-between p-3 rounded-xl bg-brand-green-dark/25 border border-brand-emerald/15 text-sm font-bold text-brand-gold hover:bg-brand-green/40 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-gold" />
                  <span>Défi Quiz</span>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-gold/60" />
              </Link>

              {/* Ask Sonko Link for Mobile */}
              <Link
                href="/#ask-sonko"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-green-dark text-sm font-black hover:shadow-lg hover:shadow-brand-gold/15 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4.5 h-4.5 animate-pulse" />
                  <span>Ask Sonko (Assistant IA)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-green-dark/60" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
