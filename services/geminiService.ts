
import { GoogleGenAI, Type } from "@google/genai";
import { TrendReport } from "../types";

// The exclusive source of API_KEY is process.env.API_KEY
// We initialize a new instance per call in dynamic scenarios to ensure the latest selected key is used.

/**
 * Fetches elite styling advice based on user mood and objective.
 */
export const getStylingAdvice = async (mood: string, occasion: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze user mood '${mood}' and objective '${occasion}'. Provide an elite, provocative styling verdict for 'Closet Kraze'.`,
    config: {
      systemInstruction: "You are a Senior Style Architect. Your tone is confident, modern, and clinical. Focus on silhouette weight and status signaling. Max 50 words.",
    },
  });

  return response.text || "Maintain baseline silhouette. Neural sensors offline.";
};

/**
 * Fetches market trend intelligence using Gemini 3 Pro for complex reasoning.
 */
export const getTrendIntelligence = async (archetype: string): Promise<TrendReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Provide an analytical fashion market intelligence report for the '${archetype}' archetype in Sector_01 for the current lunar cycle.`,
    config: {
      systemInstruction: "You are a market oracle. Return trend intel in JSON format. Be avant-garde and analytical. Focus on material scarcity and aesthetic shifts.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: 'The analytical report text.',
          },
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                uri: { type: Type.STRING },
              },
              required: ["title", "uri"],
            },
          },
        },
        required: ["text", "sources"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {
      text: "Global signals indicate a mass shift toward Minimalist Void aesthetics. Silhouette density is dropping as 'Zero Point' styling becomes the new authority standard.",
      sources: [{ title: "Neo Tokyo Market Feed", uri: "https://archives.closetkraze.nt/trends" }]
    };
  }
};

/**
 * Generates an outfit blueprint. Pro Image is used for high-fidelity requests.
 */
export const generateDreamOutfit = async (description: string, highFi: boolean = false) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = highFi ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [{ text: `High-fashion editorial blueprint for Closet Kraze. Subject: ${description}. Technical streetwear, luxury avant-garde, cinematic lighting.` }],
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
        imageSize: highFi ? "2K" : "1K"
      }
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800";
};
