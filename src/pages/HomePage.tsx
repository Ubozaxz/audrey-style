import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Sparkles, Truck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import textureImg from "@/assets/texture.jpg";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const HomePage = () => {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] pt-16 md:pt-20 flex items-center bg-gradient-cream overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-8 md:gap-16 items-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 md:order-1"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-forest mb-5">
              Édition Atelier · Abidjan
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal leading-[0.95] text-balance">
              L'élégance
              <br />
              du <span className="italic">100%</span>
              <br />
              Coton.
            </h1>
            <p className="mt-6 text-base md:text-lg text-charcoal-soft max-w-md leading-relaxed">
              Des t-shirts pensés pour la chaleur ivoirienne. Coton longues fibres, coupes affirmées, finitions main.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center gap-2 bg-forest text-primary-foreground px-8 py-4 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-forest/90 transition-colors group"
              >
                Découvrir le catalogue
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
              <Link
                to="/histoire"
                className="inline-flex items-center justify-center text-xs uppercase tracking-[0.25em] text-charcoal hover:text-forest transition-colors px-4 py-4"
              >
                Notre histoire
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 md:order-2 relative"
          >
            <div className="aspect-[4/5] rounded-md overflow-hidden bg-cream-deep shadow-elegant">
              <img
                src={heroImg}
                alt="Femme portant un t-shirt 100% coton Audrey Style"
                width={1080}
                height={1350}
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden md:block absolute -left-6 bottom-8 glass-card rounded-2xl p-5 max-w-[220px] shadow-glass"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-forest mb-2">Signature</p>
              <p className="font-serif text-base text-charcoal leading-snug">
                "Le coton qui caresse, jamais qui pèse."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            {[
              { icon: Leaf, title: "Coton naturel", text: "100% coton longues fibres, biologique pour nos modèles Signature." },
              { icon: Sparkles, title: "Finitions main", text: "Chaque pièce est contrôlée et finie dans notre atelier d'Abidjan." },
              { icon: Truck, title: "Livraison Abidjan", text: "Livraison sous 24h sur tout Abidjan. Paiement à la livraison possible." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <v.icon className="w-6 h-6 text-forest mb-4" strokeWidth={1.2} />
                <h3 className="font-serif text-2xl text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-charcoal-soft leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEXTURE BANNER */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img src={textureImg} alt="Texture du coton" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream/70 mb-4">La matière</p>
            <h2 className="font-serif text-4xl md:text-6xl text-cream leading-tight max-w-3xl mx-auto text-balance">
              Une douceur qui se vit, jour après jour.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-forest mb-3">Sélection Atelier</p>
              <h2 className="font-serif text-4xl md:text-5xl text-charcoal">Pièces du moment</h2>
            </div>
            <Link
              to="/catalogue"
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal hover:text-forest border-b border-charcoal hover:border-forest pb-1 transition-colors"
            >
              Tout voir
              <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-forest border-b border-forest pb-1"
            >
              Voir tout le catalogue
              <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
