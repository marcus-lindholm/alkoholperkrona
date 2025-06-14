import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { guests, budget, eventType, duration, preferences = [] } = req.body;
    
    if (!guests || !budget || !eventType || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const prompt = `Jag planerar ${eventType} för ${guests} personer som kommer att pågå i ungefär ${duration} timmar.
    Min budget för drycker är ${budget} SEK. Preferenser att ta hänsyn till: ${preferences.join(', ')}.

    Skapa en inköpslista från Systembolaget med specifika produkter, kvantiteter, och förklara varför varje produkt valdes.
    Fokusera på produkter med högt APK-värde (alkohol per krona) samtidigt som kvaliteten bibehålls och preferenserna beaktas.

    Vänligen strukturera ditt svar med tydliga rubriker för varje sektion:
    1. En kort introduktion om planeringen
    2. En översikt över dryckesrekommendationerna
    3. Detaljerad inköpslista med varje produkt på en egen rad
    4. En kort kommentar om hur man kan servera dryckerna

    Använd markdown för formatering:
    - Använd ## för huvudrubriker
    - Använd ### för underrubriker
    - Använd punktlistor med - för varje produkt
    - Lämna tomma rader mellan stycken för ökad läsbarhet

    Svara på svenska.`;
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY || ''
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ 
        plan: data.candidates[0].content.parts[0].text 
      });
    } else {
      console.error('Unexpected API response format:', data);
      return res.status(500).json({ 
        error: 'Failed to generate party plan', 
        details: data 
      });
    }
  } catch (error) {
    console.error('Error in party-planner API:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}