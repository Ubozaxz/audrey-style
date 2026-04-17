import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { StyleAssistant, FloatingAIButton } from "@/components/StyleAssistant";

export const Layout = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation onOpenAI={() => setAiOpen(true)} />
      <main key={location.pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <StyleAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
      <FloatingAIButton onClick={() => setAiOpen(true)} hidden={aiOpen} />
    </div>
  );
};
