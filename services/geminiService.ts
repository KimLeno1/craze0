
import { TrendReport } from "../types";

// Local Style Archive for "AI" simulation
const ADVICE_DATABASE = [
  "Incorporate high-shine vinyl textures with oversized archival denim. The juxtaposition signals a 'Vanguard' status in high-density urban sectors.",
  "Leverage monochromatic void-black silhouettes. The absence of color creates a high-velocity visual impact that dominates the New Tokyo circuit.",
  "Merge tactical utility harnesses with fine silk underlays. This synergy provides 15% more aesthetic efficiency for late-night gala objectives.",
  "Adopt the 'Liquid Chrome' palette. Reflective surfaces bypass social filters and establish an immediate authority baseline in any arena."
];

const MOCK_DREAM_OUTFITS = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800"
];

export const getStylingAdvice = async (mood: string, occasion: string) => {
  // Simulate network latency for immersion
  await new Promise(resolve => setTimeout(resolve, 1500));
  const randomIndex = Math.floor(Math.random() * ADVICE_DATABASE.length);
  return `Target mood '${mood.toUpperCase()}' for objective '${occasion.toUpperCase()}' analyzed. ${ADVICE_DATABASE[randomIndex]}`;
};

export const getTrendIntelligence = async (archetype: string): Promise<TrendReport> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const reports: Record<string, string> = {
    'CYBER': "Market Anomaly detected in Neo Tokyo Sector 01. Tech-wear silhouettes are seeing a 42% demand surge. Archival peak for 'Fiber-Optic' fabrics imminent.",
    'VOID': "Global signals indicate a mass shift toward Minimalist Void aesthetics. Silhouette density is dropping as 'Zero Point' styling becomes the new authority standard.",
    'LUXE': "Demand for 'Quiet Luxury' archival pieces has triggered a regional scarcity multiplier. Elite archivers are pivoting to sculpted silk and vacuum-plated accessories."
  };

  return {
    text: reports[archetype] || reports['CYBER'],
    sources: [
      { title: "Neo Tokyo Market Feed", uri: "https://archives.closetcraze.nt/trends" },
      { title: "Neural Style Weekly", uri: "https://vibe.circuit.net/intel" }
    ]
  };
};

export const generateDreamOutfit = async (description: string) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  // Return a random high-quality fashion image as the "materialized" blueprint
  return MOCK_DREAM_OUTFITS[Math.floor(Math.random() * MOCK_DREAM_OUTFITS.length)];
};
