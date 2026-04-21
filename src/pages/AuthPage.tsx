import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

const AuthPage = () => {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isAdmin) navigate("/admin", { replace: true });
  }, [user, isAdmin, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      toast.error("Identifiants invalides");
      return;
    }
    toast.success("Bienvenue Audrey ✨");
    setTimeout(() => navigate("/admin"), 300);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-gradient-cream">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-elegant">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl text-foreground">Espace Atelier</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Accès réservé à Audrey & son équipe.
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 mt-3">
              Identifiants test : 1234@gmail.com · 1234
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-transparent border-b border-border focus:border-primary pb-3 text-base text-foreground focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-transparent border-b border-border focus:border-primary pb-3 text-base text-foreground focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
