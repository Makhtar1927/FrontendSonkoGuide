import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import WaveButton from "@/components/wave-button";
import { Landmark } from "lucide-react";
import Navbar from "@/components/navbar";
import AnalyticsTracker from "@/components/analytics-tracker";
import { ThemeProvider } from "@/components/theme-provider";
import PWARegister from "@/components/pwa-register";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sonko.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#07472F" },
    { media: "(prefers-color-scheme: dark)", color: "#052316" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SONKO — Guide de la Révolution | Encyclopédie Interactive",
    template: "%s | SONKO — Guide de la Révolution",
  },
  description:
    "Découvrez Ousmane Sonko : biographie complète, chronologie 360°, réalisations nationales, quiz citoyen, bibliothèque et assistant IA. Guide de la Révolution & Président de l'Assemblée nationale du Sénégal.",
  keywords: [
    "Ousmane Sonko",
    "PASTEF",
    "Sénégal",
    "Guide de la Révolution",
    "Président Assemblée nationale",
    "biographie",
    "politique sénégalaise",
    "Sénégal 2050",
  ],
  authors: [{ name: "Patriote'Dev", url: "https://pma-portfolio.vercel.app/" }],
  creator: "Patriote'Dev",
  publisher: "PASTEF — Patriotes du Sénégal",
  // ─── Open Graph (WhatsApp, Facebook, LinkedIn) ───────────────────────────
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: SITE_URL,
    siteName: "SONKO — Guide de la Révolution",
    title: "SONKO — Guide de la Révolution | Encyclopédie Interactive",
    description:
      "Tout savoir sur Ousmane Sonko en un seul endroit : biographie, chronologie 360°, réalisations, quiz et assistant IA.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Ousmane Sonko — Guide de la Révolution & Président de l'Assemblée nationale",
        type: "image/jpeg",
      },
    ],
  },
  // ─── Twitter Card ────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "SONKO — Guide de la Révolution",
    description:
      "Tout savoir sur Ousmane Sonko en un seul endroit : biographie, chronologie 360°, réalisations, quiz et assistant IA.",
    images: [OG_IMAGE],
    creator: "@PASTEF_Officiel",
  },
  // ─── Icons ───────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/Sonko.jpg", sizes: "any" },
      { url: "/Sonko.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/Sonko.jpg", sizes: "32x32", type: "image/jpeg" },
    ],
    apple: [
      { url: "/Sonko.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
    shortcut: "/Sonko.jpg",
    other: [
      { rel: "apple-touch-icon", url: "/Sonko.jpg" },
      { rel: "apple-touch-icon-precomposed", url: "/Sonko.jpg" },
    ],
  },
  // ─── PWA Manifest ────────────────────────────────────────────────────────
  manifest: "/manifest.webmanifest",
  // ─── Robots / SEO ────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // ─── App Meta ─────────────────────────────────────────────────────────────
  applicationName: "SONKO — Guide de la Révolution",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SONKO",
    startupImage: "/Sonko.jpg",
  },
};

// Anti-FOUC script executed synchronously before initial render - defaults strictly to light
const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('sonko-theme');
      var theme = saved === 'dark' ? 'dark' : 'light';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased light" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <PWARegister />
          <PWAInstallPrompt />
          <AnalyticsTracker />
          
          {/* Header Navigation */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col">{children}</main>

          {/* Footer */}
          <footer className="bg-emerald-950/5 dark:bg-brand-green-dark/40 border-t border-brand-emerald/15 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Landmark className="w-6 h-6 text-brand-gold" />
                  <span className="font-extrabold font-display text-lg tracking-wide text-foreground">
                    SONKO
                  </span>
                </div>
                <p className="text-xs text-foreground/65 max-w-sm leading-relaxed">
                  &quot;Tout savoir sur Ousmane Sonko en un seul endroit.&quot; Une encyclopédie interactive, citoyenne et éducative dédiée au Guide de la Révolution et Président de l&apos;Assemblée nationale du Sénégal.
                </p>
                <div className="text-[10px] font-mono text-brand-gold font-bold mt-2">
                  Patriotisme • Éthique • Fraternité
                </div>
                <div className="mt-4 flex flex-col items-start gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 font-bold">Collecte de dons</span>
                  <WaveButton
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-green/10 dark:bg-brand-green/35 border border-[#1c9ff5]/30 hover:border-[#1c9ff5] hover:bg-[#1c9ff5]/15 text-xs font-bold text-foreground hover:text-brand-green dark:text-white transition-all active:scale-95 cursor-pointer"
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
                <ul className="space-y-2 text-xs text-foreground/70">
                  <li><Link href="/" className="hover:text-brand-gold transition-colors">Accueil</Link></li>
                  <li><Link href="/biographie" className="hover:text-brand-gold transition-colors">Biographie & Études</Link></li>
                  <li><Link href="/realisations" className="hover:text-brand-gold transition-colors">Réalisations & Projets</Link></li>
                  <li><Link href="/actualites" className="hover:text-brand-gold transition-colors">Actualités & Réformes</Link></li>
                  <li><Link href="/bibliotheque" className="hover:text-brand-gold transition-colors">Bibliothèque Médias</Link></li>
                  <li><Link href="/a-propos" className="text-brand-gold hover:text-brand-gold-light font-semibold transition-colors">À Propos & Développeur</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest mb-4">Engagement</h4>
                <ul className="space-y-2 text-xs text-foreground/70">
                  <li><Link href="/#grand-quiz" className="hover:text-brand-gold transition-colors">Grand Quiz Citoyen</Link></li>
                  <li><Link href="/#ask-sonko" className="hover:text-brand-gold transition-colors">Assistant RAG IA</Link></li>
                  <li><Link href="/#timeline-360" className="hover:text-brand-gold transition-colors">Chronologie 360°</Link></li>
                  <li><Link href="/communaute" className="hover:text-brand-gold transition-colors">Espace Communauté</Link></li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-brand-emerald/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-foreground/50 font-mono">
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
                  (<a href="mailto:papemakhtaraidara@gmail.com" className="hover:text-foreground transition-colors">papemakhtaraidara@gmail.com</a>)
                </span>
              </div>
              <span className="text-right">Conçu pour la souveraineté numérique nationale.</span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
