import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type Stats = {
  total: number;
  pending: number;
  delivered: number;
  today: number;
  recent: any[];
};

const STATUS_LABEL: Record<string, string> = {
  recue: "Reçue",
  confirmee: "Confirmée",
  preparation: "En préparation",
  livree: "Livrée",
  annulee: "Annulée",
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!orders) return;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setStats({
        total: orders.length,
        pending: orders.filter((o) => ["recue", "confirmee", "preparation"].includes(o.status)).length,
        delivered: orders.filter((o) => o.status === "livree").length,
        today: orders.filter((o) => new Date(o.created_at) >= today).length,
        recent: orders.slice(0, 5),
      });
    };
    load();

    // Realtime updates
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cards = [
    { label: "Commandes totales", value: stats?.total ?? 0, icon: ShoppingBag, accent: "text-primary" },
    { label: "Aujourd'hui", value: stats?.today ?? 0, icon: TrendingUp, accent: "text-primary" },
    { label: "En cours", value: stats?.pending ?? 0, icon: Clock, accent: "text-foreground" },
    { label: "Livrées", value: stats?.delivered ?? 0, icon: CheckCircle2, accent: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.label}</p>
              <c.icon className={`w-4 h-4 ${c.accent}`} strokeWidth={1.5} />
            </div>
            <p className="font-serif text-3xl text-foreground tabular-nums">{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-foreground">Dernières commandes</h2>
          <Link to="/admin/orders" className="text-xs uppercase tracking-[0.2em] text-primary hover:underline">
            Tout voir →
          </Link>
        </div>
        {stats?.recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Aucune commande pour l'instant. Elles apparaîtront ici en temps réel.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {stats?.recent.map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.item_count} article{o.item_count > 1 ? "s" : ""} · {o.delivery_location}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-muted text-foreground whitespace-nowrap">
                  {STATUS_LABEL[o.status] || o.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
