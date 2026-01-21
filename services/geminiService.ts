
import { GoogleGenAI } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
export const getStylingAdvice = async (mood: string, occasion: string) => {
  // Always initialize right before use
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
  // Use .text property directly
  return response.text;
};

export const generateDreamOutfit = async (description: string) => {
  // Always initialize right before use
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

  // Extract the image from candidates
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

export const generateAppLogo = async () => {
  // Always initialize right before use
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: "Minimalist luxury fashion logo for 'Closet Craze'. Monogram 'CC' with a stylized diamond hanger silhouette. Cyberpunk neon pink and metallic silver gradients on a solid black background. Vector style, symmetrical, sharp edges, premium brand identity, 4k." }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  // Extract the image from candidates
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};
