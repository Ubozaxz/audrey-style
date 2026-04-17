import { motion } from "framer-motion";
import { Menu, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/store/cart";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navigation = ({ onOpenAI }: { onOpenAI: () => void }) => {
  const { count, open } = useCart();
  const cartCount = count();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Atelier" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/histoire", label: "Histoire" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-40 glass-nav transition-shadow ${scrolled ? "shadow-glass" : ""}`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <button className="md:hidden p-2 -ml-2 text-charcoal" aria-label="Menu">
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <Link to="/" className="flex-1 md:flex-none text-center md:text-left">
          <span className="font-serif text-xl md:text-2xl tracking-[0.2em] text-charcoal">
            AUDREY <span className="font-light italic">Style</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-xs uppercase tracking-[0.2em] transition-colors hover:text-forest ${
                location.pathname === item.href ? "text-forest" : "text-charcoal-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenAI}
            aria-label="Conseillère IA"
            className="p-2 rounded-full text-charcoal hover:text-forest transition-colors hidden sm:inline-flex"
          >
            <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
          <button
            onClick={open}
            aria-label="Ma sélection"
            className="relative p-2 rounded-full text-charcoal hover:text-forest transition-colors"
          >
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-forest text-primary-foreground text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
};
