import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import WaveButton from "@/components/wave-button";
import { Landmark } from "lucide-react";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "SONKO — Guide de la Révolution",
  description: "Découvrez le parcours d'Ousmane Sonko : biographie, chronologie interactive 360°, réalisations nationales, quiz éducatifs, et assistant IA d'Ousmane Sonko, Guide de la Révolution et Président de l'Assemblée nationale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-brand-dark-base text-foreground" suppressHydrationWarning>
        
        {/* Header Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="bg-brand-green-dark/40 border-t border-brand-emerald/15 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-6 h-6 text-brand-gold" />
                <span className="font-extrabold font-display text-lg tracking-wide text-white">
                  SONKO
                </span>
              </div>
              <p className="text-xs text-foreground/50 max-w-sm leading-relaxed">
                &quot;Tout savoir sur Ousmane Sonko en un seul endroit.&quot; Une encyclopédie interactive, citoyenne et éducative dédiée au Guide de la Révolution et Président de l&apos;Assemblée nationale du Sénégal.
              </p>
              <div className="text-[10px] font-mono text-brand-gold mt-2">
                Patriotisme • Éthique • Fraternité
              </div>
              <div className="mt-4 flex flex-col items-start gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 font-bold">Collecte de dons</span>
                <WaveButton
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-green/35 border border-[#1c9ff5]/30 hover:border-[#1c9ff5] hover:bg-[#1c9ff5]/15 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
                >
                  <Image 
                    src="/Wave.svg" 
                    alt="Wave Mobile Money" 
                    width={18} 
                    height={18} 
                    className="rounded-sm"
                  />
                  <span>Soutenir avec Wave</span>
                </WaveButton>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest mb-4">Navigation</h4>
              <ul className="space-y-2 text-xs text-foreground/60">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/biographie" className="hover:text-white transition-colors">Biographie & Études</Link></li>
                <li><Link href="/realisations" className="hover:text-white transition-colors">Réalisations & Projets</Link></li>
                <li><Link href="/actualites" className="hover:text-white transition-colors">Actualités & Réformes</Link></li>
                <li><Link href="/bibliotheque" className="hover:text-white transition-colors">Bibliothèque Médias</Link></li>
                <li><Link href="/a-propos" className="text-brand-gold/80 hover:text-brand-gold font-semibold transition-colors">À Propos & Développeur</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest mb-4">Engagement</h4>
              <ul className="space-y-2 text-xs text-foreground/60">
                <li><Link href="/#grand-quiz" className="hover:text-white transition-colors">Grand Quiz Citoyen</Link></li>
                <li><Link href="/#ask-sonko" className="hover:text-white transition-colors">Assistant RAG IA</Link></li>
                <li><Link href="/#timeline-360" className="hover:text-white transition-colors">Chronologie 360°</Link></li>
                <li><Link href="/communaute" className="hover:text-white transition-colors">Espace Communauté</Link></li>
                <li><Link href="/admin" className="text-brand-gold/60 hover:text-brand-gold transition-colors font-semibold">Portail Admin</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-brand-emerald/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-foreground/45 font-mono">
            <div className="flex flex-col gap-1 items-center sm:items-start">
              <span>© {new Date().getFullYear()} SONKO — Guide de la Révolution. Tous droits réservés.</span>
              <span>
                Développé par{" "}
                <a 
                  href="https://pma-portfolio.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-gold hover:text-brand-gold-light hover:underline font-bold"
                >
                  Patriote&apos;Dev
                </a>{" "}
                (<a href="mailto:papemakhtaraidara@gmail.com" className="hover:text-white transition-colors">papemakhtaraidara@gmail.com</a>)
              </span>
            </div>
            <span className="text-right">Conçu pour la souveraineté numérique nationale.</span>
          </div>
        </footer>
        
      </body>
    </html>
  );
}
