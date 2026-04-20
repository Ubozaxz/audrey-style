import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/produit/${product.id}`} className="block group">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-md mb-4">
          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] bg-background/90 text-foreground px-2.5 py-1 rounded-full backdrop-blur-sm">
            {product.collection}
          </span>
        </div>
        <div className="px-1">
          <h3 className="font-serif text-lg md:text-xl text-foreground leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="w-3 h-3 rounded-full border border-border"
              style={{ backgroundColor: product.colorHex }}
              aria-hidden
            />
            <span className="text-xs text-muted-foreground tracking-wide">
              {product.colorName}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
