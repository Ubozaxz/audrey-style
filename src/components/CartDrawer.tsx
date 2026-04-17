import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { Link } from "react-router-dom";

export const CartDrawer = () => {
  const { items, isOpen, close, updateQty, remove } = useCart();
  const totalItems = items.reduce((n, i) => n + i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] bg-cream flex flex-col shadow-elegant"
            aria-label="Sélection"
          >
            <header className="flex items-center justify-between px-6 py-5 hairline border-t-0 border-b border-border">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-forest mb-1">
                  Votre Sélection
                </p>
                <h2 className="font-serif text-2xl text-charcoal">
                  L'Atelier <span className="italic font-light">Selection</span>
                </h2>
              </div>
              <button
                onClick={close}
                className="p-2 -mr-2 text-charcoal hover:text-forest transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-cream-deep flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-charcoal-soft" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                    </svg>
                  </div>
                  <p className="font-serif text-xl text-charcoal mb-2">Votre sélection est vide</p>
                  <p className="text-sm text-charcoal-soft mb-6 max-w-xs">
                    Découvrez nos pièces et composez votre atelier personnel.
                  </p>
                  <Link
                    to="/catalogue"
                    onClick={close}
                    className="text-xs uppercase tracking-[0.2em] text-forest border-b border-forest pb-1 hover:opacity-70 transition"
                  >
                    Explorer le catalogue
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item, idx) => (
                    <motion.li
                      key={`${item.productId}-${item.size}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4 group"
                    >
                      <div className="w-24 h-28 rounded-md overflow-hidden bg-cream-deep flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <p className="font-serif text-base text-charcoal leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-charcoal-soft mt-1">
                          Taille {item.size} · {item.colorName}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-border rounded-full px-1 py-0.5">
                            <button
                              onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                              className="w-6 h-6 flex items-center justify-center text-charcoal-soft hover:text-forest"
                              aria-label="Diminuer"
                            >
                              <Minus className="w-3 h-3" strokeWidth={1.5} />
                            </button>
                            <span className="text-sm w-5 text-center tabular-nums">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                              className="w-6 h-6 flex items-center justify-center text-charcoal-soft hover:text-forest"
                              aria-label="Augmenter"
                            >
                              <Plus className="w-3 h-3" strokeWidth={1.5} />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(item.productId, item.size)}
                            className="text-charcoal-soft hover:text-destructive transition-colors p-1"
                            aria-label="Retirer"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="px-6 py-5 border-t border-border bg-cream-deep/40">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-charcoal-soft">
                    Pièces sélectionnées
                  </span>
                  <span className="font-serif text-2xl text-charcoal tabular-nums">
                    {totalItems}
                  </span>
                </div>
                <Link
                  to="/commande"
                  onClick={close}
                  className="block w-full bg-forest text-primary-foreground text-center text-xs uppercase tracking-[0.25em] py-4 rounded-full hover:bg-forest/90 transition-colors"
                >
                  Finaliser la commande
                </Link>
                <p className="text-[11px] text-center text-charcoal-soft mt-3">
                  Coordination & paiement via WhatsApp
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
