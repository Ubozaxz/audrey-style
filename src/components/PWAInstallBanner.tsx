import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Plus } from "lucide-react";

const DISMISSED_KEY = "audrey-pwa-dismissed";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export const PWAInstallBanner = () => {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    const recentlyDismissed = Date.now() - dismissedAt < 7 * 24 * 3600 * 1000;
    if (recentlyDismissed) return;

    // Already installed (standalone)
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-ignore iOS
      window.navigator.standalone === true;
    if (standalone) return;

    const ua = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    const mobile = /android|iphone|ipad|ipod|mobile/.test(ua);
    setIsIOS(ios);

    if (ios && mobile) {
      // iOS doesn't fire beforeinstallprompt — show manual instructions
      setTimeout(() => setVisible(true), 2500);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
    setShowIOS(false);
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setVisible(false);
      setDeferred(null);
    } else if (isIOS) {
      setShowIOS(true);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 240 }}
          className="md:hidden fixed bottom-3 left-3 right-3 z-50 glass-card rounded-2xl shadow-elegant p-4 pr-3"
        >
          {!showIOS ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-forest flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base text-foreground leading-tight">
                  Installer Audrey Style
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Accès rapide depuis ton écran d'accueil
                </p>
              </div>
              <button
                onClick={install}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium"
              >
                Installer
              </button>
              <button
                onClick={dismiss}
                aria-label="Fermer"
                className="p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <p className="font-serif text-base text-foreground">Installer sur iPhone</p>
                <button onClick={dismiss} aria-label="Fermer" className="p-1 -mr-1 -mt-1 text-muted-foreground">
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              <ol className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-primary">1.</span> Touche
                  <Share className="w-3.5 h-3.5 inline" strokeWidth={1.5} /> Partager
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">2.</span> Choisis
                  <Plus className="w-3.5 h-3.5 inline" strokeWidth={1.5} /> Sur l'écran d'accueil
                </li>
                <li>
                  <span className="text-primary">3.</span> Touche <strong>Ajouter</strong>
                </li>
              </ol>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
