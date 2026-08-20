"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Avoid hydration mismatch by rendering a consistent placeholder until mounted
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border border-brand-emerald/15 bg-brand-green/10 flex items-center justify-center ${className}`}
        aria-hidden="true"
      >
        <span className="w-4 h-4 rounded-full bg-brand-gold/30 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative group flex items-center gap-2 p-2 rounded-xl border transition-all duration-300 cursor-pointer select-none active:scale-95 ${
        isDark
          ? "bg-brand-green-dark/40 border-brand-emerald/25 hover:border-brand-gold/50 text-brand-gold hover:bg-brand-green-dark/70 shadow-sm shadow-brand-green/20"
          : "bg-emerald-50/80 border-brand-emerald/20 hover:border-brand-gold text-brand-green hover:bg-emerald-100/80 shadow-sm shadow-emerald-500/5"
      } ${className}`}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode Clair" : "Mode Sombre"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-500 transform ${
            isDark
              ? "rotate-90 scale-0 opacity-0 absolute"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 text-brand-gold transition-all duration-500 transform ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0 absolute"
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide">
          {isDark ? "Mode Sombre" : "Mode Clair"}
        </span>
      )}
    </button>
  );
}
