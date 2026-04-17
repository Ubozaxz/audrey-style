import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

export const ProductPage = () => {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const [size, setSize] = useState<string>("M");
  const { add } = useCart();

  if (!product) return <Navigate to="/catalogue" replace />;

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    add({
      productId: product.id,
      name: product.name,
      colorName: product.colorName,
      size,
      image: product.image,
    });
    toast.success("Ajouté à votre sélection", { description: `${product.name} · Taille ${size}` });
  };

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal-soft hover:text-forest mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Retour au catalogue
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="aspect-[4/5] rounded-md overflow-hidden bg-cream-deep"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-forest mb-3">
              {product.collection}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-base text-charcoal-soft leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-soft mb-3">
                Coloris
              </p>
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full border-2 border-forest p-1"
                  aria-hidden
                >
                  <span
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: product.colorHex }}
                  />
                </span>
                <span className="text-sm text-charcoal">{product.colorName}</span>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal-soft mb-3">
                Taille
              </p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 rounded-full text-sm font-medium transition-all ${
                      size === s
                        ? "bg-forest text-primary-foreground"
                        : "bg-cream-deep text-charcoal hover:bg-cream-deep/70"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-charcoal text-cream py-5 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-forest transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Check className="w-4 h-4" strokeWidth={1.5} />
              Ajouter à ma sélection
            </button>
            <p className="text-[11px] text-center text-charcoal-soft">
              Prix communiqué via WhatsApp · Paiement à la livraison possible
            </p>

            <div className="mt-10 pt-8 border-t border-border space-y-4">
              {[
                { label: "Composition", value: "100% coton longues fibres" },
                { label: "Grammage", value: "180–220 g/m²" },
                { label: "Entretien", value: "Lavage 30°, sans sèche-linge" },
                { label: "Origine", value: "Confectionné à Abidjan" },
              ].map((d) => (
                <div key={d.label} className="flex justify-between text-sm">
                  <span className="text-charcoal-soft">{d.label}</span>
                  <span className="text-charcoal">{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-24">
          <p className="text-[10px] uppercase tracking-[0.3em] text-forest mb-3">Vous aimerez aussi</p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-10">Pièces complémentaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
            {related.map((p, i) => (
              <Link key={p.id} to={`/produit/${p.id}`} className="block group">
                <div className="aspect-[4/5] rounded-md overflow-hidden bg-cream-deep mb-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-serif text-base text-charcoal">{p.name}</h3>
                <p className="text-xs text-charcoal-soft mt-1">{p.colorName}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
