import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useCart } from "@/store/cart";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "2250768426720";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  phone: z
    .string()
    .trim()
    .min(8, "Numéro invalide")
    .max(20, "Numéro invalide")
    .regex(/^[0-9+\s().-]+$/, "Numéro invalide"),
  location: z.string().trim().min(2, "Lieu requis").max(120, "Lieu trop long"),
  note: z.string().trim().max(300, "Note trop longue").optional(),
});

export const CheckoutPage = () => {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", location: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 container text-center">
        <p className="font-serif text-2xl text-charcoal mb-4">Votre sélection est vide.</p>
        <Link to="/catalogue" className="text-xs uppercase tracking-[0.2em] text-forest border-b border-forest pb-1">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const buildMessage = () => {
    const list = items
      .map((i) => `• ${i.name} (Taille ${i.size}, ${i.colorName}) × ${i.qty}`)
      .join("\n");
    const note = form.note ? `\n\nNote : ${form.note}` : "";
    return `Bonjour Audrey Style, je souhaite commander :\n\n${list}\n\nMon nom : ${form.name}\nTéléphone : ${form.phone}\nLivraison à : ${form.location}${note}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Vérifiez vos informations");
      return;
    }
    setErrors({});
    const msg = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    toast.success("Redirection vers WhatsApp…", {
      description: "Notre équipe vous attend pour finaliser.",
    });
    setTimeout(() => {
      clear();
      navigate("/");
    }, 1500);
  };

  const fields = [
    { id: "name", label: "Nom complet", placeholder: "Awa Konan", type: "text" },
    { id: "phone", label: "Téléphone (WhatsApp)", placeholder: "+225 07 XX XX XX XX", type: "tel" },
    { id: "location", label: "Lieu de livraison", placeholder: "Cocody, Riviera 2", type: "text" },
  ] as const;

  const totalItems = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="pt-20 md:pt-24 pb-20">
      <div className="container max-w-3xl">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal-soft hover:text-forest mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Continuer mes achats
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-forest mb-3">Finaliser</p>
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-3 leading-tight">
            La touche finale.
          </h1>
          <p className="text-charcoal-soft mb-12 max-w-lg">
            Renseignez vos informations. Notre équipe vous contactera sur WhatsApp pour confirmer le prix, la disponibilité et la livraison.
          </p>
        </motion.div>

        {/* Recap */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-cream-deep/50 rounded-2xl p-6 mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-forest mb-4">
            Votre sélection ({totalItems} pièce{totalItems > 1 ? "s" : ""})
          </p>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="flex gap-4">
                <div className="w-14 h-16 rounded overflow-hidden bg-cream flex-shrink-0">
                  <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="font-serif text-base text-charcoal leading-tight">{i.name}</p>
                    <p className="text-xs text-charcoal-soft mt-0.5">
                      Taille {i.size} · {i.colorName}
                    </p>
                  </div>
                  <span className="text-sm tabular-nums text-charcoal">× {i.qty}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-6"
          noValidate
        >
          {fields.map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-[10px] uppercase tracking-[0.25em] text-charcoal-soft mb-2">
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.id]}
                onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                className="w-full bg-transparent border-b border-border focus:border-forest pb-3 text-base text-charcoal placeholder:text-charcoal-soft/50 focus:outline-none transition-colors"
                required
              />
              {errors[f.id] && <p className="text-xs text-destructive mt-2">{errors[f.id]}</p>}
            </div>
          ))}

          <div>
            <label htmlFor="note" className="block text-[10px] uppercase tracking-[0.25em] text-charcoal-soft mb-2">
              Note (optionnel)
            </label>
            <textarea
              id="note"
              placeholder="Une précision pour la livraison ?"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
              maxLength={300}
              className="w-full bg-transparent border-b border-border focus:border-forest pb-3 text-base text-charcoal placeholder:text-charcoal-soft/50 focus:outline-none transition-colors resize-none"
            />
            {errors.note && <p className="text-xs text-destructive mt-2">{errors.note}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-forest text-primary-foreground py-5 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-forest/90 transition-colors flex items-center justify-center gap-3 mt-10"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            Finaliser sur WhatsApp
          </button>
          <p className="text-[11px] text-center text-charcoal-soft">
            En cliquant, vous serez redirigé vers WhatsApp pour coordonner le paiement et la livraison avec notre équipe.
          </p>
        </motion.form>
      </div>
    </div>
  );
};
