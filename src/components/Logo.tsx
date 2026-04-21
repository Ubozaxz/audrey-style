import { Link } from "react-router-dom";

/**
 * Audrey Style logo — inspired by the SONON monogram.
 * SVG monogram "A" in serif italic with elegant flourish + brand name.
 */
export const Logo = ({
  className = "",
  textClass = "",
  showText = true,
  size = "md",
}: {
  className?: string;
  textClass?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const dim = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const textSize =
    size === "sm"
      ? "text-base"
      : size === "lg"
      ? "text-2xl md:text-3xl"
      : "text-lg md:text-xl";

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 group ${className}`}
      aria-label="Audrey Style — Accueil"
    >
      <LogoMark className={`${dim} text-primary transition-transform group-hover:scale-105`} />
      {showText && (
        <span
          className={`font-serif tracking-[0.22em] text-foreground ${textSize} ${textClass}`}
        >
          AUDREY <span className="font-light italic tracking-normal">Style</span>
        </span>
      )}
    </Link>
  );
};

/** Standalone SVG mark — usable anywhere, inherits currentColor */
export const LogoMark = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* outer circle */}
    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
    {/* italic serif A flourish */}
    <path
      d="M22 46 L32 16 L42 46 M26 36 L38 36"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* sparkle accent */}
    <path
      d="M48 18 L50 22 L54 24 L50 26 L48 30 L46 26 L42 24 L46 22 Z"
      fill="currentColor"
      opacity="0.65"
    />
    {/* tiny dot */}
    <circle cx="14" cy="44" r="1.2" fill="currentColor" opacity="0.5" />
  </svg>
);
