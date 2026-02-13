import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { genre, keyword, decadeName } = await req.json();

    if (!genre || !keyword || !decadeName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: genre, keyword, decadeName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `אתה פייטן ומלחין מוזיקלי מומחה. אתה כותב שירים בעברית בלבד.
כשמבקשים ממך לכתוב שיר, אתה מחזיר תמיד את התשובה במבנה הבא בדיוק:

🎤 בית 1:
(טקסט הבית הראשון - 4 שורות)

🎶 פזמון:
(טקסט הפזמון - 4 שורות)

🎤 בית 2:
(טקסט הבית השני - 4 שורות)

🎶 פזמון:
(חזרה על הפזמון)

🌉 גשר:
(טקסט הגשר - 2-3 שורות)

🎶 פזמון:
(חזרה אחרונה על הפזמון)

---

🎵 מבנה מומלץ:
• קצב: (קצב מתאים לסגנון)
• מפתח: (מפתח מוזיקלי מומלץ)
• כלי נגינה: (כלים אופייניים לסגנון)
• מבנה: בית → פזמון → בית → פזמון → גשר → פזמון

חשוב: השיר חייב להיות בעברית, להתאים לסגנון המוזיקלי שנבחר ולעשור הרלוונטי, ולכלול את מילת המפתח באופן טבעי בתוך הטקסט.`;

    const userPrompt = `כתוב שיר בסגנון ${genre} מהתקופה של ${decadeName}. מילת המפתח/נושא השיר: "${keyword}".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "יותר מדי בקשות, נסה שוב בעוד כמה שניות" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "נגמרו הקרדיטים, יש להוסיף קרדיטים בהגדרות" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "שגיאה ביצירת השיר" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Split into lyrics and structure
    const parts = content.split("---");
    const lyrics = (parts[0] || content).trim();
    const structure = (parts[1] || "").trim();

    return new Response(
      JSON.stringify({ lyrics, structure }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-song error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה לא ידועה" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
