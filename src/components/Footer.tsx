import { Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream/80 mt-24">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="font-serif text-2xl text-cream mb-3">
              Audrey <span className="italic font-light">Style</span>
            </h4>
            <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
              L'élégance du 100% Coton.
              <br />
              Atelier basé à Abidjan.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cream/50 mb-4">Atelier</p>
            <ul className="space-y-2 text-sm">
              <li>Cocody, Abidjan</li>
              <li>+225 07 68 42 67 20</li>
              <li>contact@audrey-style.ci</li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cream/50 mb-4">Suivez-nous</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm hover:text-forest-bright transition-colors"
            >
              <Instagram className="w-4 h-4" strokeWidth={1.5} />
              @audrey.style
            </a>
            <p className="text-xs text-cream/50 mt-6 leading-relaxed">
              Livraison à Abidjan & toute la Côte d'Ivoire.
              <br />
              Paiement à la livraison disponible.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-cream/50">
            © {new Date().getFullYear()} Audrey Style. Tous droits réservés.
          </p>
          <p className="text-xs text-cream/50 italic">
            Designed by <span className="text-forest-bright not-italic font-medium">Promé</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
