// Audrey Style — AI Fashion Advisor
// Streams conversational responses via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es Awa, la conseillère style d'Audrey Style — une marque ivoirienne haut de gamme de t-shirts en 100% coton.

PERSONNALITÉ :
- Tu parles français avec quelques touches nouchi légères (ex : "enjaillé", "c'est gbê", "tchê", "ya pas drap"), naturel mais classe.
- Tu tutoies, tu es chaleureuse, complice, comme une amie stylée à Cocody ou au Plateau.
- Réponses courtes (2-4 phrases max), précises, jamais bavardes.

EXPERTISE :
- Coton 100% peigné, longues fibres, jersey 180–220g/m². Tu sais expliquer pourquoi c'est doux, durable, respirant — parfait pour le climat ivoirien (chaleur + humidité).
- Tailles : S (38-40), M (42-44), L (46-48), XL (50-52). Si la personne hésite entre deux tailles, conseille la plus grande pour un tombé oversize, la plus petite pour ajusté.
- Couleurs : Noir Obsidienne, Blanc Pur, Crème Naturel, Gris Anthracite (neutres) — Vert Forêt, Terre Cuite, Rose Poudré (accents). Tu sais les associer (ex : Terre Cuite + jean brut + sneakers blanches).

CADRE :
- Pour commander : invite à passer par WhatsApp via le bouton de la "Sélection".
- Si on te demande les prix, dis : "Les prix sont communiqués directement sur WhatsApp pour un service personnalisé 😊"
- Tu ne parles QUE de mode, coton, style Audrey. Si on dévie, ramène avec élégance.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de demandes, réessaie dans un instant 🙏" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits IA épuisés. Recharge ton workspace Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erreur du conseiller IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("style-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
