import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import teeCream from "@/assets/tee-cream.jpg";
import teeCharcoal from "@/assets/tee-charcoal.jpg";
import teeGreen from "@/assets/tee-green.jpg";
import teeTerracotta from "@/assets/tee-terracotta.jpg";
import teeRose from "@/assets/tee-rose.jpg";

export type Collection = "Essentials" | "Signature" | "Saison";

export type Product = {
  id: string;
  name: string;
  collection: Collection;
  colorName: string;
  colorHex: string;
  image: string;
  description: string;
  sizes: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "essentiel-noir",
    name: "L'Essentiel — Noir Obsidienne",
    collection: "Essentials",
    colorName: "Noir Obsidienne",
    colorHex: "#1A1A1A",
    image: teeBlack,
    description: "La pièce maîtresse. Un t-shirt en jersey 100% coton peigné, coupe ajustée, finitions main.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "essentiel-blanc",
    name: "L'Essentiel — Blanc Pur",
    collection: "Essentials",
    colorName: "Blanc Pur",
    colorHex: "#FAFAF7",
    image: teeWhite,
    description: "La toile blanche. 100% coton biologique, douceur incomparable, tombé impeccable.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "signature-creme",
    name: "Signature — Crème Naturel",
    collection: "Signature",
    colorName: "Crème Naturel",
    colorHex: "#EFE5D2",
    image: teeCream,
    description: "Coton non teinté. Une pièce brute, élégante, qui se patine avec le temps.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "signature-charcoal",
    name: "Signature — Charcoal",
    collection: "Signature",
    colorName: "Gris Anthracite",
    colorHex: "#3A3A3A",
    image: teeCharcoal,
    description: "Coupe oversize, jersey épais 220g/m². Pour celles et ceux qui aiment l'allure relâchée.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "saison-foret",
    name: "Saison — Vert Forêt",
    collection: "Saison",
    colorName: "Vert Forêt",
    colorHex: "#1F4F3F",
    image: teeGreen,
    description: "L'accent végétal de la saison. Teinture profonde, coton longues fibres.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "saison-terre",
    name: "Saison — Terre Cuite",
    collection: "Saison",
    colorName: "Terre Cuite",
    colorHex: "#C45A3A",
    image: teeTerracotta,
    description: "Inspiré des terres de chez nous. Une couleur chaude qui sublime tous les teints.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "saison-rose",
    name: "Saison — Rose Poudré",
    collection: "Saison",
    colorName: "Rose Poudré",
    colorHex: "#E8A5A0",
    image: teeRose,
    description: "Doux et affirmé à la fois. Une pièce signature pour casser les codes.",
    sizes: ["S", "M", "L", "XL"],
  },
];

export const COLLECTIONS: Collection[] = ["Essentials", "Signature", "Saison"];

export const COLOR_GROUPS = [
  { label: "Neutres", colors: ["Noir Obsidienne", "Blanc Pur", "Crème Naturel", "Gris Anthracite"] },
  { label: "Couleurs", colors: ["Vert Forêt", "Terre Cuite", "Rose Poudré"] },
];
