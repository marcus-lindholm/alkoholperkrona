import { NextApiRequest, NextApiResponse } from 'next';

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { foodType, dishDescription, mealType, preferences } = req.body;

  if (!foodType || !dishDescription) {
    return res.status(400).json({ error: 'Saknade parametrar' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Du är en expert på mat- och dryckespairings från Systembolaget i Sverige. 

Användaren vill ha dryckesförslag till följande måltid:
- Typ av måltid: ${mealType}
- Matkategori: ${foodType}
- Beskrivning av rätt: ${dishDescription}
${preferences.length > 0 ? `- Preferenser: ${preferences.join(', ')}` : ''}

Ge 3-5 konkreta förslag på VERKLIGA drycker från Systembolaget som passar perfekt till denna måltid.

VIKTIGT: Returnera svaret i följande JSON-format:
{
  "introduction": "En kort introduktion om varför dessa drycker passar",
  "pairings": [
    {
      "productName": "Exakt produktnamn från Systembolaget",
      "category": "Vin/Öl/Cider/Sprit",
      "description": "Varför den passar till rätten (smakprofil, balans, komplementära toner)",
      "priceRange": "Ungefärlig prisnivå i kr",
      "servingTip": "Serveringstips"
    }
  ],
  "generalTip": "Ett avslutande tips om servering"
}

Var konkret och använd VERKLIGA produktnamn från Systembolagets sortiment. Fokusera på:
- Smaker som kompletterar varandra
- Syra, sötma och kroppsfullhet
- Texturer och mouthfeel
- Traditionella pairings men våga också föreslå något oväntat

Returnera ENDAST JSON-objektet, ingen annan text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    let pairingsData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      pairingsData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      // Fallback to raw text if JSON parsing fails
      return res.status(200).json({ 
        pairings: [{
          productName: "Generiskt förslag",
          category: "Diverse",
          description: text,
          priceRange: "Varierande",
          servingTip: "Se beskrivning"
        }],
        introduction: "Här är några förslag baserat på din måltid:",
        generalTip: ""
      });
    }

    res.status(200).json(pairingsData);
  } catch (error) {
    console.error('Error generating food pairings:', error);
    res.status(500).json({ 
      error: 'Kunde inte generera dryckesförslag',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
