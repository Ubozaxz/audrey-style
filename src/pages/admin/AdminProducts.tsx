import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { PRODUCTS } from "@/data/products";

type Product = {
  id: string;
  name: string;
  description: string | null;
  collection: string;
  color: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
};

const COLLECTIONS = ["essentials", "signature", "saison"];

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [draft, setDraft] = useState({ name: "", collection: "essentials", color: "", description: "", image_url: "" });

  const load = async () => {
    const { data, error } = await supabase.from("products").select("*").order("display_order");
    if (error) toast.error("Erreur de chargement");
    setProducts((data || []) as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const seedFromCatalog = async () => {
    setSeeding(true);
    const rows = PRODUCTS.map((p, i) => ({
      name: p.name,
      description: p.description,
      collection: p.collection.toLowerCase(),
      color: p.colorName,
      image_url: p.image,
      display_order: i,
      is_active: true,
    }));
    const { error } = await supabase.from("products").insert(rows);
    setSeeding(false);
    if (error) toast.error("Import échoué");
    else {
      toast.success(`${rows.length} articles importés`);
      load();
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name) return;
    const { error } = await supabase.from("products").insert({
      ...draft,
      display_order: products.length,
    });
    if (error) toast.error("Création impossible");
    else {
      toast.success("Article ajouté");
      setDraft({ name: "", collection: "essentials", color: "", description: "", image_url: "" });
      load();
    }
  };

  const toggleActive = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) toast.error("Échec");
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Échec suppression");
    else load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {products.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Aucun article enregistré dans la base.</p>
          <button
            onClick={seedFromCatalog}
            disabled={seeding}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-primary/90 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />}
            Importer le catalogue actuel
          </button>
        </div>
      )}

      <form onSubmit={create} className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4">
        <h2 className="font-serif text-xl text-foreground">Nouvel article</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="Nom"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none text-foreground"
            required
          />
          <select
            value={draft.collection}
            onChange={(e) => setDraft({ ...draft, collection: e.target.value })}
            className="bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none text-foreground"
          >
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            placeholder="Couleur (ex. Vert Forêt)"
            value={draft.color}
            onChange={(e) => setDraft({ ...draft, color: e.target.value })}
            className="bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none text-foreground"
          />
          <input
            placeholder="URL image (optionnel)"
            value={draft.image_url}
            onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
            className="bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none text-foreground"
          />
        </div>
        <textarea
          placeholder="Description"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={2}
          className="w-full bg-transparent border-b border-border focus:border-primary pb-2 text-sm focus:outline-none text-foreground resize-none"
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-primary/90"
        >
          Ajouter
        </button>
      </form>

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            {p.image_url && (
              <div className="w-14 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.collection} · {p.color}</p>
            </div>
            <button
              onClick={() => toggleActive(p)}
              className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${
                p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {p.is_active ? "Actif" : "Masqué"}
            </button>
            <button
              onClick={() => remove(p.id)}
              className="p-1.5 text-muted-foreground hover:text-destructive"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
