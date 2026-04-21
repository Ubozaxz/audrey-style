import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, MessageCircle, ShoppingBag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";

type Msg = { role: "user" | "assistant"; content: string };

const WHATSAPP_NUMBER = "2250768426720";

const SUGGESTIONS = [
  "Je cherche une pièce pour le bureau",
  "Quelle taille pour 1m70 / 65kg ?",
  "Une couleur qui me va si j'ai le teint foncé ?",
  "Comment se passe la livraison à Abidjan ?",
];

export const StyleAssistant = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { items, open: openCart } = useCart();
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Salut ✨ Moi c'est Awa, ta conseillère style chez Audrey. Dis-moi tout — taille, couleur, occasion… je te trouve la pièce parfaite et on continue sur WhatsApp pour finaliser !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant" as const, content: assistantSoFar }];
      });
    };

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/style-assistant`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Trop de demandes, attends un instant.");
        else if (resp.status === 402) toast.error("Crédits IA épuisés.");
        else toast.error("Awa est indisponible pour l'instant.");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Connexion impossible avec Awa.");
    } finally {
      setLoading(false);
    }
  };

  const directWhatsApp = () => {
    let msg = "Bonjour Audrey Style, je viens de discuter avec Awa sur le site et j'aimerais en savoir plus.";
    if (items.length) {
      const list = items.map((i) => `• ${i.name} (Taille ${i.size}, ${i.colorName}) × ${i.qty}`).join("\n");
      msg = `Bonjour Audrey Style, je suis intéressée par :\n\n${list}`;
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-0 sm:pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 inset-x-3 bottom-3 sm:inset-auto sm:right-6 sm:bottom-24 sm:w-[400px] h-[80vh] sm:h-[600px] glass-card rounded-3xl flex flex-col overflow-hidden shadow-elegant"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-forest flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-serif text-lg leading-none text-foreground">Awa</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary mt-0.5">
                    Conseillère Style · En ligne
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground" aria-label="Fermer">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.content || (loading && i === messages.length - 1 ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : null)}
                  </div>
                </motion.div>
              ))}
              {messages.length <= 1 && (
                <div className="pt-2 space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-left text-xs px-4 py-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conversion CTAs */}
            <div className="px-3 pt-2 pb-1 flex gap-2 border-t border-border/50">
              <button
                onClick={() => { onClose(); openCart(); }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.15em] py-2.5 rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                Ma sélection {items.length > 0 && `(${items.length})`}
              </button>
              <button
                onClick={directWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.15em] py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                WhatsApp
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="p-3 flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pose ta question style…"
                className="flex-1 bg-muted px-4 py-3 rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition"
                aria-label="Envoyer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const FloatingAIButton = ({ onClick, hidden }: { onClick: () => void; hidden?: boolean }) => (
  <AnimatePresence>
    {!hidden && (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-forest text-primary-foreground shadow-elegant flex items-center justify-center group"
        aria-label="Ouvrir la conseillère IA"
      >
        <Sparkles className="w-5 h-5" strokeWidth={1.5} />
        <span className="absolute -top-2 -right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
        </span>
      </motion.button>
    )}
  </AnimatePresence>
);
