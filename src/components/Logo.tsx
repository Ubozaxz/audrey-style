import { Link } from "react-router-dom";
import logoSonon from "@/assets/logo-sonon.jpg";

/**
 * SONON Shopping — official brand logo (image asset).
 * Used across navigation, footer, admin, and PWA.
 */
export const Logo = ({
  className = "",
  textClass = "",
  showText = false,
  size = "md",
}: {
  className?: string;
  textClass?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const dim =
    size === "sm" ? "w-10 h-10" : size === "lg" ? "w-16 h-16" : "w-12 h-12";
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
      aria-label="SONON Shopping — Accueil"
    >
      <LogoMark className={`${dim} transition-transform group-hover:scale-105`} />
      {showText && (
        <span
          className={`font-serif tracking-[0.22em] text-foreground ${textSize} ${textClass}`}
        >
          SONON <span className="font-light italic tracking-normal">Shopping</span>
        </span>
      )}
    </Link>
  );
};

/** Standalone logo mark — official SONON Shopping image. */
export const LogoMark = ({ className = "" }: { className?: string }) => (
  <img
    src={logoSonon}
    alt="SONON Shopping"
    className={`object-contain rounded-full bg-background ring-1 ring-border ${className}`}
    loading="eager"
    decoding="async"
  />
);
