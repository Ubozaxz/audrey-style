import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, MessageCircle, Trash2 } from "lucide-react";

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_location: string;
  items: any[];
  item_count: number;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUSES = [
  { v: "recue", l: "Reçue" },
  { v: "confirmee", l: "Confirmée" },
  { v: "preparation", l: "En préparation" },
  { v: "livree", l: "Livrée" },
  { v: "annulee", l: "Annulée" },
];

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erreur de chargement");
      return;
    }
    setOrders((data || []) as Order[]);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("orders-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) toast.error("Échec mise à jour");
    else toast.success("Statut mis à jour");
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast.error("Échec suppression");
    else toast.success("Commande supprimée");
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[{ v: "all", l: "Toutes" }, ...STATUSES].map((s) => (
          <button
            key={s.v}
            onClick={() => setFilter(s.v)}
            className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.15em] border transition-colors ${
              filter === s.v
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {s.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center bg-card border border-border rounded-2xl">
          Aucune commande pour ce filtre.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const isOpen = open === o.id;
            return (
              <div key={o.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-foreground font-medium">{o.customer_name}</p>
                      <span className="text-xs text-muted-foreground">·</span>
                      <p className="text-xs text-muted-foreground">{o.delivery_location}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {o.item_count} article{o.item_count > 1 ? "s" : ""} ·{" "}
                      {new Date(o.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-muted text-foreground whitespace-nowrap">
                    {STATUSES.find((s) => s.v === o.status)?.l ?? o.status}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border">
                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Téléphone</p>
                        <a href={`tel:${o.customer_phone}`} className="text-sm text-primary hover:underline">
                          {o.customer_phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">WhatsApp</p>
                        <a
                          href={`https://wa.me/${o.customer_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} /> Contacter
                        </a>
                      </div>
                    </div>

                    {o.notes && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Note</p>
                        <p className="text-sm text-foreground italic">"{o.notes}"</p>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Articles</p>
                      <ul className="space-y-2">
                        {(o.items || []).map((it: any, i: number) => (
                          <li key={i} className="flex items-center gap-3 text-sm">
                            {it.image && (
                              <div className="w-10 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-foreground">{it.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Taille {it.size} · {it.color}
                              </p>
                            </div>
                            <span className="tabular-nums text-foreground">× {it.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mr-2">Statut :</p>
                      {STATUSES.map((s) => (
                        <button
                          key={s.v}
                          onClick={() => updateStatus(o.id, s.v)}
                          className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.15em] transition-colors ${
                            o.status === s.v
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          {s.l}
                        </button>
                      ))}
                      <button
                        onClick={() => remove(o.id)}
                        className="ml-auto p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
