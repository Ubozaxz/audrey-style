import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, Sparkles, Sun, Moon, X, Lock } from "lucide-react";
import { useCart } from "@/store/cart";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Logo } from "@/components/Logo";

export const Navigation = ({ onOpenAI }: { onOpenAI: () => void }) => {
  const { count, open } = useCart();
  const cartCount = count();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { href: "/", label: "Atelier" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/histoire", label: "Histoire" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-40 glass-nav transition-shadow ${scrolled ? "shadow-glass" : ""}`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <button
            className="md:hidden p-2 -ml-2 text-foreground"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>

          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Logo showText />
          </div>

          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-xs uppercase tracking-[0.2em] transition-colors hover:text-primary ${
                  location.pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
              className="p-2 rounded-full text-foreground hover:text-primary transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-[18px] h-[18px]" strokeWidth={1.5} />
              ) : (
                <Moon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              )}
            </button>
            <button
              onClick={onOpenAI}
              aria-label="Conseillère IA"
              className="p-2 rounded-full text-foreground hover:text-primary transition-colors hidden sm:inline-flex"
            >
              <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            <button
              onClick={open}
              aria-label="Ma sélection"
              className="relative p-2 rounded-full text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed top-16 inset-x-0 z-30 glass-nav border-b border-border"
            >
              <nav className="container py-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-2 py-3 font-serif text-2xl border-b border-border/50 transition-colors ${
                      location.pathname === item.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => { setMenuOpen(false); onOpenAI(); }}
                  className="px-2 py-3 font-serif text-2xl text-left flex items-center gap-3 border-b border-border/50 text-foreground"
                >
                  <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  Conseillère IA
                </button>
                <Link
                  to="/auth"
                  className="px-2 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mt-2"
                >
                  <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Espace admin
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
