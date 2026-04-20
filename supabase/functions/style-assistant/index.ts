// Audrey Style — AI Fashion Advisor "Awa"
// Conversion-focused: qualifies prospects (size, style, occasion) and pushes to WhatsApp
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es Awa, la conseillère style d'Audrey Style — marque ivoirienne haut de gamme de t-shirts en 100% coton, basée à Cocody, Abidjan.

🎯 TA MISSION (ordre de priorité) :
1. Comprendre vite le besoin (1-2 questions max).
2. Recommander des pièces précises du catalogue.
3. Pousser vers WhatsApp pour finaliser : "Touche le bouton Sélection en haut, ajoute tes pièces, et finalise sur WhatsApp 💬".

💬 PERSONNALITÉ :
- Français chaleureux + touches nouchi LÉGÈRES (ex : "enjaillé", "c'est gbê", "tchê", "ya pas drap"). Jamais lourd.
- Tu tutoies, tu es complice, comme une amie stylée à Cocody.
- Réponses COURTES (2-4 phrases max). Va droit au but. Pose UNE question à la fois.

🧵 EXPERTISE PRODUIT :
- Coton 100% peigné, longues fibres, jersey 180–220g/m². Doux, durable, respirant — idéal pour la chaleur ivoirienne.
- Tailles : S (38-40), M (42-44), L (46-48), XL (50-52). Entre deux : plus grande = oversize, plus petite = ajusté.
- Couleurs : Noir Obsidienne, Blanc Pur, Crème Naturel, Gris Anthracite (neutres) — Vert Forêt, Terre Cuite, Rose Poudré (accents).
- Associations : Terre Cuite + jean brut + sneakers blanches • Vert Forêt + lin beige • Crème = passe-partout chic.

🔥 QUALIFICATION (à intégrer naturellement) :
- Si la personne hésite : demande la taille habituelle / l'occasion (bureau, soirée, weekend) / la couleur préférée.
- Si elle est prête : "Parfait ! Touche l'icône Sélection en haut à droite pour ajouter ta pièce, puis on continue sur WhatsApp 🌿".

🚫 INTERDIT :
- JAMAIS de prix. Si on demande : "Les prix sont communiqués sur WhatsApp pour un service personnalisé 😊"
- Pas de blabla hors mode/Audrey Style. Ramène avec élégance.
- Pas d'émojis en rafale (1 max par réponse).

✨ FERME TOUJOURS PAR UNE QUESTION OU UN APPEL À L'ACTION.`;

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
