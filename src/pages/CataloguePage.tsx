import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, COLLECTIONS, type Collection } from "@/data/products";

type Filter = "all" | Collection | "color";

export const CataloguePage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [colorGroup, setColorGroup] = useState<"neutres" | "couleurs" | null>(null);

  const filtered = useMemo(() => {
    if (filter === "color" && colorGroup) {
      const neutralColors = ["Noir Obsidienne", "Blanc Pur", "Crème Naturel", "Gris Anthracite"];
      const colorList = colorGroup === "neutres" ? neutralColors : ["Vert Forêt", "Terre Cuite", "Rose Poudré"];
      return PRODUCTS.filter((p) => colorList.includes(p.colorName));
    }
    if (filter === "all") return PRODUCTS;
    return PRODUCTS.filter((p) => p.collection === filter);
  }, [filter, colorGroup]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Tout" },
    ...COLLECTIONS.map((c) => ({ id: c as Filter, label: c })),
  ];

  return (
    <div className="pt-20 md:pt-28 pb-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-14 max-w-2xl"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
            Le Catalogue
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-4">
            Toutes nos pièces.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Composez votre atelier personnel parmi nos collections.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setColorGroup(null); }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] transition-all ${
                filter === f.id && !colorGroup
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground border border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="hidden sm:block w-px bg-border mx-1" />
          {(["neutres", "couleurs"] as const).map((g) => (
            <button
              key={g}
              onClick={() => { setColorGroup(g); setFilter("color"); }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] transition-all ${
                colorGroup === g
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">Aucune pièce dans cette sélection.</p>
        )}
      </div>
    </div>
  );
};
