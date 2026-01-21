
import { GoogleGenAI } from "@google/genai";
import { TrendReport, TrendSource } from "../types";

export const getStylingAdvice = async (mood: string, occasion: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a high-fashion expert and stylist for the brand 'Closet Craze'. 
    A user feels '${mood}' and is heading to '${occasion}'. 
    Provide a sassy, encouraging, and detailed outfit recommendation using psychological triggers (scarcity, status, confidence).
    Keep it under 150 words.`,
    config: {
      temperature: 0.8,
    }
  });
  return response.text;
};

export const getTrendIntelligence = async (archetype: string): Promise<TrendReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze current high-fashion street style trends for the ${archetype} aesthetic in 2025. 
    Focus on specific textures, silhouettes, and cultural movements happening RIGHT NOW. 
    Provide a concise, authoritative report that makes the user feel like they are getting exclusive insider info.
    Use terms like 'Market Anomaly', 'Demand Surge', and 'Archival Peak'.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "Scanning global signals... The circuit is quiet.";
  const sources: TrendSource[] = [];

  // Extract grounding chunks for citations
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "External Feed",
          uri: chunk.web.uri,
        });
      }
    });
  }

  return { text, sources };
};

export const generateDreamOutfit = async (description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `High-fashion concept photography of: ${description}. Dramatic lighting, editorial style, 8k, luxury aesthetic.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};
