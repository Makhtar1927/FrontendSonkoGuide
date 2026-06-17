import { Landmark } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex-grow bg-brand-dark-base flex flex-col items-center justify-center relative pointer-events-none">
      {/* Absolute top glowing loading bar */}
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden bg-brand-green-dark">
        <div className="h-full bg-gradient-to-r from-brand-emerald via-brand-gold to-brand-emerald-light rounded-full w-[200px] animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
      </div>
      
      {/* Centered themed loading indicator */}
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative flex items-center justify-center">
          {/* Pulsing glow rings */}
          <div className="absolute w-16 h-16 rounded-full border border-brand-gold/30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute w-20 h-20 rounded-full border border-brand-emerald/25 animate-pulse" />
          
          {/* Logo container */}
          <div className="w-14 h-14 rounded-full bg-brand-green border border-brand-emerald/30 flex items-center justify-center shadow-lg shadow-brand-emerald/20">
            <Landmark className="w-6 h-6 text-brand-gold animate-pulse" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-mono text-brand-gold tracking-[0.25em] uppercase font-bold">
            SONKO
          </span>
          <span className="text-[9px] font-mono text-foreground/45 mt-1.5 tracking-widest">
            Chargement de la page...
          </span>
        </div>
      </div>
    </div>
  );
}
