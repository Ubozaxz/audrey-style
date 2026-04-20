import { motion } from "framer-motion";
import textureImg from "@/assets/texture.jpg";

export const StoryPage = () => {
  return (
    <div className="pt-20 md:pt-28 pb-20">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Notre Histoire</p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-8">
            Un atelier né
            <br />
            <span className="italic">à Abidjan</span>.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="aspect-[16/9] rounded-md overflow-hidden mb-12"
        >
          <img src={textureImg} alt="Notre coton" className="w-full h-full object-cover" loading="lazy" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-serif prose-headings:text-foreground prose-headings:font-light dark:prose-invert"
        >
          <p className="text-xl leading-relaxed text-foreground/90">
            Audrey Style est née d'une conviction simple : le t-shirt parfait existe, et il se fait avec du temps, du coton honnête, et beaucoup d'attention.
          </p>

          <h2 className="text-3xl mt-12">La matière, d'abord.</h2>
          <p>
            Nous travaillons exclusivement avec du coton 100% peigné, longues fibres, choisi pour sa douceur et sa durabilité. Sous le climat ivoirien, c'est plus qu'un confort : c'est une nécessité. Notre coton respire, absorbe, dure.
          </p>

          <h2 className="text-3xl mt-12">L'atelier, ensuite.</h2>
          <p>
            Chaque pièce est confectionnée à Abidjan, dans notre petit atelier à Cocody. Coupes ajustées, finitions main, contrôle qualité unitaire. Pas de série massive — juste de petites éditions, faites pour durer.
          </p>

          <h2 className="text-3xl mt-12">L'engagement.</h2>
          <p>
            Pas de prix gonflés, pas de marketing tape-à-l'œil. Le prix se communique sur WhatsApp, parce que la relation prime sur la vitrine. Vous achetez une pièce, vous gagnez aussi un atelier de confiance.
          </p>

          <p className="italic text-primary mt-12 font-serif text-2xl text-center">
            "L'élégance n'a pas besoin de crier."
          </p>
        </motion.div>
      </div>
    </div>
  );
};
