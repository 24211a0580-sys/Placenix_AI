import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult, DetectedObject } from "../types/netraTypes.ts";

// Load API Keys from environment variables (Vite uses import.meta.env)
const envKeys = import.meta.env.VITE_GEMINI_API_KEYS || "";
const API_KEYS = envKeys ? envKeys.split(',').map((k: string) => k.trim()) : [];

let currentKeyIndex = 0;

// Helper to get a client instance with the next key
const getAIClient = () => {
  if (API_KEYS.length === 0) {
    // If no key is set, try to read from the global window config
    const windowKeys = (window as any).__GEMINI_KEYS__ || "";
    if (windowKeys) {
      const parsedKeys = windowKeys.split(',').map((k: string) => k.trim());
      const key = parsedKeys[currentKeyIndex];
      currentKeyIndex = (currentKeyIndex + 1) % parsedKeys.length;
      return new GoogleGenAI({ apiKey: key });
    }
    throw new Error("No Gemini API Keys found. Please check your .env configuration.");
  }
  const key = API_KEYS[currentKeyIndex];
  console.log(`[NETRA System] Rotating to API Key Index: ${currentKeyIndex}`);
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return new GoogleGenAI({ apiKey: key });
};

// Helper to sanitize JSON response from Gemini
const parseJSON = (text: string | undefined): any => {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("JSON Parse Error:", e);
    const arrayMatch = text.match(/\[.*\]/s);
    if (arrayMatch) {
      try { return JSON.parse(arrayMatch[0]); } catch (e2) { }
    }
    return null;
  }
};

export const detectObjectsLive = async (base64Image: string): Promise<DetectedObject[]> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "List 3-5 distinct, prominent objects. JSON array: [{name, shortDetails, ymin, xmin, ymax, xmax}]. 0-1000 scale." }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      maxOutputTokens: 500,
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            shortDetails: { type: Type.STRING },
            ymin: { type: Type.NUMBER },
            xmin: { type: Type.NUMBER },
            ymax: { type: Type.NUMBER },
            xmax: { type: Type.NUMBER },
          },
          required: ["name", "shortDetails", "ymin", "xmin", "ymax", "xmax"]
        }
      }
    }
  });

  const data = parseJSON(response.text) || [];

  return Array.isArray(data) ? data.map((obj: any, index: number) => ({
    ...obj,
    id: `obj-${obj.name.replace(/\s/g, '')}-${index}`
  })) : [];
};

export const identifyObject = async (base64Image: string, focusObject?: string): Promise<DetectionResult> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: `Analyze target "${focusObject}". NETRA Agent. Female Voice. Short visual description for visually impaired. JSON: {objectName, details, spokenDescription, safetyWarning, expiryDate}. Max 40 words spoken.` }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      maxOutputTokens: 300,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          objectName: { type: Type.STRING },
          details: { type: Type.STRING },
          spokenDescription: { type: Type.STRING },
          safetyWarning: { type: Type.STRING },
          expiryDate: { type: Type.STRING }
        },
        required: ["objectName", "details", "spokenDescription"]
      }
    }
  });

  return parseJSON(response.text) || {
    objectName: "Unknown",
    details: "Analysis failed.",
    spokenDescription: "Target acquisition failed. Please realign sensor."
  };
};

export const chatWithScene = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `COMMAND: ${prompt}` }
        ]
      },
      config: {
        systemInstruction: "Agent NETRA. Tactical AI (Female). Concise, authoritative. Read text if asked. First person.",
        maxOutputTokens: 150
      }
    });

    return response.text || "Visuals unclear. Repeat command.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Link instability detected. Unable to process command.";
  }
};

export const describeLocation = async (lat: number, lng: number): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts: [{ text: "Describe location (City/District). No coords." }] },
      config: {
        tools: [{ googleSearch: {} }], // Use standard googleSearch instead of deprecated googleMaps
        maxOutputTokens: 150
      }
    });
    return response.text || "Unknown sector.";
  } catch (error) {
    console.error("Location error:", error);
    return "Location data unavailable.";
  }
};
