import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

export const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const links = [
    { to: "/admin", end: true, icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/admin/orders", icon: ShoppingBag, label: "Commandes" },
    { to: "/admin/products", icon: Package, label: "Articles" },
  ];

  return (
    <div className="pt-20 md:pt-24 pb-12 min-h-screen bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">Atelier · Administration</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">Espace Audrey</h1>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors px-3 py-2"
            >
              <Home className="w-3.5 h-3.5" strokeWidth={1.5} /> Site
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive transition-colors px-3 py-2"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Déconnexion
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 md:mx-0 px-4 md:px-0">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <l.icon className="w-4 h-4" strokeWidth={1.5} />
                {l.label}
              </NavLink>
            ))}
          </nav>
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
