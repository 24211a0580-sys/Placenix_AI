import { GoogleGenAI } from "@google/genai";
import { Message } from "../types/netraTypes.ts";

// Retrieve API keys from environment (Vite env is VITE_GEMINI_API_KEYS)
const envKeys = import.meta.env.VITE_GEMINI_API_KEYS || "";
const API_KEYS = envKeys ? envKeys.split(',').map((k: string) => k.trim()).filter(Boolean) : [];

let currentKeyIndex = 0;

const getAIClient = () => {
  let keys = API_KEYS;
  if (keys.length === 0) {
    const windowKeys = (window as any).__GEMINI_KEYS__ || "";
    if (windowKeys) {
      keys = windowKeys.split(',').map((k: string) => k.trim()).filter(Boolean);
    }
  }
  
  if (keys.length === 0) {
    throw new Error("No Gemini API Keys found. Please check your .env configuration.");
  }
  
  const key = keys[currentKeyIndex];
  console.log(`[NETRA Coach] API Key rotating index: ${currentKeyIndex}`);
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return new GoogleGenAI({ apiKey: key });
};

// System instruction mappings for different Indian languages
const COACH_SYSTEM_PROMPTS: Record<string, string> = {
    'te-IN': `You are Netra AI - the Placement and Career Coach. Respond ONLY in Telugu using Telugu script (తెలుగు). Speak like a helpful, friendly, and knowledgeable college senior who helps students with their career, resume preparation, DSA tips, and placement tests. Use local Telugu student words naturally.`,
    
    'en-IN': `You are Netra AI - the Placement and Career Coach. Respond in clear Indian English with a professional yet encouraging tone. Guide students on resume scoring, mock interviews, aptitude prep, system design, coding rounds (like Amazon, Google, TCS), and placement pathways.`,
    
    'hi-IN': `You are Netra AI - the Placement and Career Coach. Respond ONLY in Hindi using Devanagari script (हिंदी). Speak in a friendly, mentor-like student senior style. Clear career and placement doubts in a encouraging and easy-to-understand student friendly tone.`,
    
    'ta-IN': `You are Netra AI - the Placement and Career Coach. Respond ONLY in Tamil using Tamil script (தமிழ்). Explain placement questions, resume feedback, and career queries in a encouraging, senior college student tone.`,
    
    'mr-IN': `You are Netra AI - the Placement and Career Coach. Respond ONLY in Marathi using Marathi script (मराठी). Provide helpful, direct placement preparation advice and explain coding/interview strategy clearly.`,
    
    'ml-IN': `You are Netra AI - the Placement and Career Coach. Respond ONLY in Malayalam using Malayalam script (മലയാളം). Be an encouraging and highly informative placement senior guiding students to crack tests and technical coding rounds.`
};

const BASE_COACH_INSTRUCTIONS = `
Core Topics: resume reviews, DSA questions, system design, companies prep (Amazon, TCS, Google, Zoho), HR behavioral questions, career path choosing.
Guidelines: Give structured, encouraging, and highly actionable suggestions. Keep replies concise (usually under 120 words) so they are easy to read and suitable for text-to-speech.
`;

const LANGUAGE_ENFORCEMENT: Record<string, string> = {
    'te-IN': 'CRITICAL: Provide your entire response strictly translated to NATIVE Telugu Script (తెలుగు). ABSOLUTELY DO NOT use English letters or Latin alphabet. NO ENGLISH WORDS ALLOWED.',
    'hi-IN': 'CRITICAL: Provide your entire response strictly translated to NATIVE Devanagari Script (हिंदी). ABSOLUTELY DO NOT use English letters or Latin alphabet. NO ENGLISH WORDS ALLOWED.',
    'ta-IN': 'CRITICAL: Provide your entire response strictly translated to NATIVE Tamil Script (தமிழ்). ABSOLUTELY DO NOT use English letters or Latin alphabet. NO ENGLISH WORDS ALLOWED.',
    'mr-IN': 'CRITICAL: Provide your entire response strictly translated to NATIVE Marathi Script (मराठी). ABSOLUTELY DO NOT use English letters or Latin alphabet. NO ENGLISH WORDS ALLOWED.',
    'ml-IN': 'CRITICAL: Provide your entire response strictly translated to NATIVE Malayalam Script (മലയാളം). ABSOLUTELY DO NOT use English letters or Latin alphabet. NO ENGLISH WORDS ALLOWED.',
    'en-IN': 'Respond in simple, clear Indian English.'
};

export const generateCareerCoachResponse = async (
    messageHistory: Message[],
    langCode: string
): Promise<string> => {
    const coachPrompt = COACH_SYSTEM_PROMPTS[langCode] || COACH_SYSTEM_PROMPTS['en-IN'];
    const enforcement = LANGUAGE_ENFORCEMENT[langCode] || LANGUAGE_ENFORCEMENT['en-IN'];
    const finalSystemInstruction = `${coachPrompt}\n\n${BASE_COACH_INSTRUCTIONS}\n\n${enforcement}`;

    // Format history for @google/genai SDK
    const formattedHistory = messageHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
    }));

    const isNewChat = formattedHistory.length === 1;

    try {
        const ai = getAIClient();
        let responseText = "";

        if (isNewChat) {
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: formattedHistory,
                config: {
                    systemInstruction: finalSystemInstruction,
                    temperature: 0.7,
                }
            });
            responseText = response.text || "";
        } else {
            const chat = ai.chats.create({
                model: 'gemini-2.0-flash',
                config: {
                    systemInstruction: finalSystemInstruction,
                    temperature: 0.7
                },
                history: formattedHistory.slice(0, -1)
            });

            const lastMsg = formattedHistory[formattedHistory.length - 1];
            const response = await chat.sendMessage({
                message: lastMsg.parts[0].text
            });
            responseText = response.text || "";
        }

        return responseText;
    } catch (error) {
        console.error("Netra Career Coach API Error:", error);
        
        // Fallback to text generator API if keys fail or rate limits are hit
        try {
            const systemPrompt = `${coachPrompt}\n\n${BASE_COACH_INSTRUCTIONS}\n\n${enforcement}`;
            const apiMessages = [
                { role: 'system', content: systemPrompt },
                ...messageHistory.map(m => ({
                    role: m.role === 'model' ? 'assistant' : 'user',
                    content: m.content
                }))
            ];

            const response = await fetch('https://text.pollinations.ai/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    model: 'openai',
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices?.[0]?.message?.content || "Could you repeat that? I encountered a connection issue.";
            } else {
                throw new Error(`Pollinations API returned status ${response.status} (${response.statusText})`);
            }
        } catch (fallbackError: any) {
            console.error("Pollinations fallback error:", fallbackError);
            throw new Error(`Gemini error: ${geminiError}. Fallback error: ${fallbackError.message || fallbackError}`);
        }
    }
};
