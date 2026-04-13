import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: (import.meta.env.VITE_GEMINI_API_KEY) || (process.env.GEMINI_API_KEY) || '' 
});

export interface BallisticsAnalysis {
  caliber: string;
  manufacturer: string;
  markings: string;
  primerType: string;
  finish: string;
  condition: string;
  summary: string;
  confidence: number;
}

export async function analyzeCartridgeImage(base64Image: string): Promise<BallisticsAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: "Analyze this cartridge case headstamp image for forensic ballistics. Identify the caliber, manufacturer, and detailed markings. Determine the primer type (Boxer/Berdan), case finish, and physical condition (e.g., pristine, corroded, fired, deformed). Provide a comprehensive and detailed executive summary of the forensic significance, common usage, and any notable characteristics. Return the result in JSON format with confidence as a whole number between 0 and 100.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caliber: { type: Type.STRING, description: "The identified caliber (e.g., 9mm Luger, .45 ACP)" },
          manufacturer: { type: Type.STRING, description: "The identified manufacturer (e.g., Winchester, Federal, PMC)" },
          markings: { type: Type.STRING, description: "Detailed description of all text and symbols on the headstamp" },
          primerType: { type: Type.STRING, description: "Type of primer: Boxer, Berdan, or Unknown" },
          finish: { type: Type.STRING, description: "Case finish: Brass, Nickel, Steel, etc." },
          condition: { type: Type.STRING, description: "Physical condition of the case" },
          summary: { type: Type.STRING, description: "Detailed executive summary of forensic findings" },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100" },
        },
        required: ["caliber", "manufacturer", "markings", "primerType", "finish", "condition", "summary", "confidence"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      caliber: "Unknown",
      manufacturer: "Unknown",
      markings: "Could not analyze markings clearly.",
      primerType: "Unknown",
      finish: "Unknown",
      condition: "Unknown",
      summary: "No additional data available for this specimen.",
      confidence: 0,
    };
  }
}
