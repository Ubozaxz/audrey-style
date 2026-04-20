import { Link } from "react-router-dom";

export const Logo = ({ className = "", textClass = "" }: { className?: string; textClass?: string }) => (
  <Link to="/" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="Audrey Style — Accueil">
    {/* Monogram */}
    <span className="relative w-9 h-9 rounded-full bg-gradient-forest flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
      <span className="font-serif text-primary-foreground text-base leading-none italic">A</span>
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary" />
    </span>
    <span className={`font-serif text-lg md:text-xl tracking-[0.18em] text-foreground ${textClass}`}>
      AUDREY <span className="font-light italic tracking-normal">Style</span>
    </span>
  </Link>
);
