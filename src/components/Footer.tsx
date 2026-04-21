import { Instagram, Facebook, Music2, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { usePWAInstall } from "@/components/PWAInstallBanner";
import { toast } from "sonner";

const SOCIALS = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61570741527163", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/sononshopping?igsh=YTk4YndkN2NjaGJo&utm_source=qr", label: "Instagram" },
  { icon: Music2, href: "https://www.tiktok.com/@wear.your.style5?_r=1&_t=ZS-95hCDIGqs7g", label: "TikTok" },
];

export const Footer = () => {
  const { canInstall, isIOS, installed, prompt: promptInstall } = usePWAInstall();
  const handleInstall = async () => {
    const r = await promptInstall();
    if (r === "ios") {
      toast("Installer sur iPhone", {
        description: "Touche Partager (carré ↑) puis « Sur l'écran d'accueil ».",
        duration: 6000,
      });
    } else if (r === "unsupported") {
      toast("Installation non disponible", {
        description: "Ouvre dans Chrome / Safari sur mobile pour installer.",
      });
    }
  };
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container py-16">
        {!installed && (canInstall || isIOS) && (
          <div className="mb-12 p-6 rounded-2xl border border-background/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary mb-1">Application mobile</p>
              <p className="font-serif text-xl text-background">Installe SONON Shopping sur ton téléphone</p>
              <p className="text-xs text-background/60 mt-1">Accès direct depuis ton écran d'accueil — comme une vraie app.</p>
            </div>
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Télécharger l'app
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <Logo showText textClass="text-background" />
            </div>
            <p className="text-sm leading-relaxed text-background/60 max-w-xs">
              L'élégance du 100% Coton.
              <br />
              Atelier basé à Abidjan.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-background/50 mb-4">Atelier</p>
            <ul className="space-y-2 text-sm text-background/80">
              <li>Cocody, Abidjan</li>
              <li>
                <a href="https://wa.me/2250768426720" className="hover:text-primary transition-colors">
                  +225 07 68 42 67 20
                </a>
              </li>
              <li>
                <Link to="/catalogue" className="hover:text-primary transition-colors">
                  Catalogue complet
                </Link>
              </li>
              <li>
                <Link to="/histoire" className="hover:text-primary transition-colors">
                  Notre histoire
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-background/50 mb-4">Suivez-nous</p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <p className="text-xs text-background/50 mt-6 leading-relaxed">
              Livraison à Abidjan & toute la Côte d'Ivoire.
              <br />
              Paiement à la livraison disponible.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-background/50">
            © {new Date().getFullYear()} Audrey Style. Tous droits réservés.
          </p>
          <p className="text-xs text-background/50 italic">
            Designed by <span className="text-primary not-italic font-medium">Promé</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
