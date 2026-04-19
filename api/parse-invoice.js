const ANTHROPIC_KEY = "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";

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const prompt = `Eres un asistente para crear facturas. Extrae la información de este texto hablado (puede ser español, inglés o Spanglish) y devuelve SOLAMENTE un objeto JSON válido, sin markdown, sin explicaciones.

Texto: "${text}"

Formato JSON:
{
  "clientName": "nombre de la empresa o cliente",
  "clientContact": "nombre del contacto si se menciona, sino vacío",
  "clientEmail": "email si se menciona, sino vacío",
  "clientPhone": "teléfono si se menciona, sino vacío",
  "clientAddress": "dirección o ciudad si se menciona, sino vacío",
  "services": [
    {
      "desc": "descripción profesional y detallada del servicio",
      "qty": 1,
      "price": 0
    }
  ]
}

Devuelve SOLO el JSON sin ningún texto adicional.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
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

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const rawText = data?.content?.[0]?.text || "";
    const clean   = rawText.replace(/```json|```/g, "").trim();
    const parsed  = JSON.parse(clean);

    res.status(200).json(parsed);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
}
