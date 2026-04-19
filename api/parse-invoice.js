const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "No text" });

  const prompt = `Extrae información de factura de este texto (español, inglés o Spanglish): "${text}"
Devuelve SOLO JSON válido sin markdown:
{"clientName":"","clientContact":"","clientEmail":"","clientPhone":"","clientAddress":"","services":[{"desc":"descripción profesional detallada","qty":1,"price":0}]}`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const raw = data?.content?.[0]?.text?.replace(/```json|```/g, "").trim();
    res.status(200).json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
