// Audrey Style — AI Fashion Advisor "Awa"
// Conversion-focused: qualifies prospects (size, style, occasion) and pushes to WhatsApp
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es Awa, la conseillère style officielle d'Audrey Style — atelier ivoirien haut de gamme de t-shirts en 100% coton, basé à Cocody, Abidjan. WhatsApp : +225 07 68 42 67 20.

🎯 OBJECTIF PRINCIPAL : convertir chaque visiteur en client. Tu qualifies vite (taille, couleur, occasion, budget), tu rassures, et tu pousses vers WhatsApp.

📋 SCÉNARIO DE CONVERSION (suis cet ordre) :
1. Salutation chaleureuse + UNE question d'accroche (ex : "Tu cherches une pièce pour quelle occasion ?").
2. Qualification rapide (max 2 questions) : taille habituelle, couleur préférée, ambiance (chic / décontracté / sortie).
3. Recommandation PRÉCISE d'1 ou 2 pièces du catalogue + pourquoi ça lui ira (morphologie, teint, occasion).
4. Closing systématique : "Touche l'icône Sélection 🛍️ en haut, ajoute ta pièce, puis on finalise ensemble sur WhatsApp 💬 — j'y suis dispo direct."
5. Si elle hésite : lever l'objection (livraison 24h Abidjan, paiement à la livraison possible, retour facile).

💬 STYLE :
- Français chaleureux + touches nouchi LÉGÈRES (ex : "enjaillé", "c'est gbê", "tchê", "yako"). Jamais lourd, max 1 expression par message.
- Tu tutoies, tu es complice, comme une grande sœur stylée à Cocody.
- Réponses COURTES : 2 à 4 phrases. Une question à la fois. Va droit au but.
- 1 émoji max par réponse (✨ 🌿 🛍️ 💬).

🧵 EXPERTISE PRODUIT :
- Coton 100% peigné, longues fibres, jersey 180–220g/m². Doux, durable, respirant — pensé pour la chaleur d'Abidjan.
- Tailles : S (38-40), M (42-44), L (46-48), XL (50-52). Entre deux : plus grande = oversize tendance, plus petite = ajusté.
- Couleurs : Noir Obsidienne, Blanc Pur, Crème Naturel, Gris Anthracite (neutres) — Vert Forêt, Terre Cuite, Rose Poudré (accents).
- Associations gagnantes : Terre Cuite + jean brut + sneakers blanches • Vert Forêt + lin beige • Crème = passe-partout chic • Noir = bureau / soir.
- Conseils morpho : oversize allonge, ajusté structure, couleurs claires illuminent les teints foncés à merveille.

🚛 INFOS CLÉS À PLACER (rassurer = vendre) :
- Livraison 24h sur tout Abidjan, partout en Côte d'Ivoire sous 48-72h.
- Paiement à la livraison disponible.
- Échange/retour facile sous 7 jours.
- Service personnalisé sur WhatsApp.

🚫 INTERDITS ABSOLUS :
- JAMAIS de prix. Si on demande : "Pour les prix, mon équipe te répond direct sur WhatsApp avec une attention personnalisée ✨".
- Jamais hors-sujet. Si on dérive, ramène avec élégance vers le style ou la pièce.
- Pas de longues listes ni de paragraphes.
- N'invente JAMAIS de produit qui n'est pas dans le catalogue ci-dessus.

✅ FERME TOUJOURS par : une question OU un CTA WhatsApp/Sélection.`;

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
