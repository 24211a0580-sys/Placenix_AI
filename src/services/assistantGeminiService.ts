import { GoogleGenAI } from '@google/genai';

// Retrieve API keys from environment
const rawKeys = (import.meta as any).env?.VITE_GEMINI_API_KEYS || '';
const apiKeys: string[] = rawKeys ? rawKeys.split(',').map(k => k.trim()).filter(Boolean) : [];

if (apiKeys.length === 0) {
    console.warn('VITE_GEMINI_API_KEYS is missing. PlaceNixAssistant will not be able to generate responses.');
}

let currentKeyIndex = 0;

function getClient(): GoogleGenAI {
    return new GoogleGenAI({ apiKey: apiKeys[currentKeyIndex] });
}

function rotateApiKey() {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.log(`Rotated API key to index ${currentKeyIndex}`);
}

const LANGUAGE_SYSTEM_PROMPTS: Record<string, string> = {
    'te-IN': `You are PlaceNix AI assistant. Always respond ONLY in Telugu using natural Telugu slang and casual Hyderabadi Telugu style. Use words like "ra", "bro", "cheppandi", "ayindi", "entante", "konchem". Help students with placement prep, resume tips, interview questions. Be friendly like a Telugu college senior helping juniors.`,
    'en-IN': `You are PlaceNix AI assistant. Respond in Indian English with a friendly, campus-style tone. Use phrases like "yaar", "basically", "simply put", "no worries". Help with placements, resume, interviews.`,
    'hi-IN': `You are PlaceNix AI assistant. Respond ONLY in Hindi using casual Delhi/Hinglish style. Use words like "yaar", "bhai", "matlab", "seedha baat", "tension mat le". Help students with placement prep in simple Hindi. Mix Hindi-English naturally like Indian students actually speak.`,
    'ta-IN': `You are PlaceNix AI assistant. Respond ONLY in Tamil using casual Chennai Tamil slang. Use words like "da", "pa", "sollu", "paarunga", "theriyuma". Help students with placement prep like a Tamil college senior would.`,
    'mr-IN': `You are PlaceNix AI assistant. Respond ONLY in Marathi using casual Pune-style Marathi. Use words like "bagh", "kay", "aahe", "kara", "chaan aahe". Help students prepare for campus placements in simple friendly Marathi.`,
    'ml-IN': `You are PlaceNix AI assistant. Respond ONLY in Malayalam using casual Kerala slang. Use words like "മോനേ", "ചേട്ടാ", "ആണല്ലോ", "പറയൂ", "okay aano". Help students with placement and interview prep in natural conversational Malayalam.`
};

const BASE_SYSTEM_PROMPT = `
You have knowledge about: resume analysis tips, company interview rounds (Amazon, Google, TCS, Infosys, Wipro, Microsoft, Zoho), aptitude test patterns, DSA coding questions, HR interview answers, placement readiness.
Keep responses concise (under 100 words) and actionable.
`;

export type Message = {
    role: 'user' | 'model';
    content: string;
};

export const assistantGeminiService = {
    async generateResponse(
        messageHistory: Message[],
        currentLanguageCode: string,
        pagePath: string
    ): Promise<string> {
        const PAGE_CONTEXT: Record<string, string> = {
            '/': 'User is on landing page, may need overview.',
            '/resume': 'User is analyzing their resume, give resume tips.',
            '/companies': 'User is browsing company interview prep.',
            '/interview': 'User is in mock interview mode, be encouraging.',
            '/dashboard': 'User is reviewing their progress and scores.',
            '/admin': 'User is an admin managing the system databases.'
        };
        const pathContext = PAGE_CONTEXT[pagePath] || 'User is navigating the PlaceNix platform.';
        const langPrompt = LANGUAGE_SYSTEM_PROMPTS[currentLanguageCode] || LANGUAGE_SYSTEM_PROMPTS['en-IN'];
        const langInstructions: Record<string, string> = {
            'te-IN': 'CRITICAL INSTRUCTION: You represent a purely Telugu assistant. Provide your entire final response translated to NATIVE Telugu Script (తెలుగు). ABSOLUTELY DO NOT use English words or Latin alphabet. NO ENGLISH ALLOWED.',
            'hi-IN': 'CRITICAL INSTRUCTION: You represent a purely Hindi assistant. Provide your entire final response translated to NATIVE Devanagari Script (हिंदी). ABSOLUTELY DO NOT use English words or Latin alphabet. NO ENGLISH ALLOWED.',
            'ta-IN': 'CRITICAL INSTRUCTION: You represent a purely Tamil assistant. Provide your entire final response translated to NATIVE Tamil Script (தமிழ்). ABSOLUTELY DO NOT use English words or Latin alphabet. NO ENGLISH ALLOWED.',
            'mr-IN': 'CRITICAL INSTRUCTION: You represent a purely Marathi assistant. Provide your entire final response translated to NATIVE Marathi Script (मराठी). ABSOLUTELY DO NOT use English words or Latin alphabet. NO ENGLISH ALLOWED.',
            'ml-IN': 'CRITICAL INSTRUCTION: You represent a purely Malayalam assistant. Provide your entire final response translated to NATIVE Malayalam Script (മലയാളം). ABSOLUTELY DO NOT use English words or Latin alphabet. NO ENGLISH ALLOWED.',
            'en-IN': 'Respond naturally in Indian English.'
        };
        const explicitEnforcement = langInstructions[currentLanguageCode] || langInstructions['en-IN'];
        const finalSystemPrompt = `${langPrompt}\n\n${BASE_SYSTEM_PROMPT}\n\nCurrent Page Context: ${pathContext}\n\n${explicitEnforcement}`;

        // Fallback to Free AI Endpoint if API Key missing
        if (apiKeys.length === 0 || apiKeys[0] === 'YOUR_API_KEY_HERE') {
            try {
                const messages = [
                    { role: 'system', content: finalSystemPrompt },
                    ...messageHistory.map((m, index) => {
                        let text = m.content;
                        if (index === messageHistory.length - 1 && currentLanguageCode !== 'en-IN') {
                            text += `\n\n(${explicitEnforcement})`;
                        }
                        return {
                            role: m.role === 'model' ? 'assistant' : 'user',
                            content: text
                        };
                    })
                ];

                const response = await fetch('https://text.pollinations.ai/openai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: messages,
                        model: 'openai', 
                        temperature: 0.7
                    })
                });

                if (!response.ok) throw new Error('Free AI endpoint Failed');
                
                const data = await response.json();
                return data.choices?.[0]?.message?.content || "Oops, my brain disconnected. Please try again.";
            } catch (err) {
                console.error("Pollinations API Error:", err);
                return "Hmm, the free AI server is busy right now. Please set up your own Gemini API Key in .env.local!";
            }
        }

        // Convert history format to GenAI format 
        // Format required for @google/genai: 
        // messages: [{role: 'user', parts: [{text: '..'}]}, {role: 'model', parts: [{text: '..'}]}]
        const formattedHistory = messageHistory.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        }));

        // Retrieve last message and slice history
        const isNewConversation = formattedHistory.length === 1;

        let retries = 0;
        const maxRetries = apiKeys.length;

        while (retries < maxRetries) {
            try {
                const ai = getClient();

                let responseText = '';

                // Use gemini-2.5-flash as requested
                if (isNewConversation) {
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: formattedHistory,
                        config: {
                            systemInstruction: finalSystemPrompt,
                            temperature: 0.7,
                        }
                    });
                    responseText = response.text || '';
                } else {
                    // Keep chat history intact
                    const chat = ai.chats.create({
                        model: 'gemini-2.5-flash',
                        config: {
                            systemInstruction: finalSystemPrompt,
                            temperature: 0.7
                        },
                        history: formattedHistory.slice(0, -1)
                    });

                    const lastUserMsg = formattedHistory[formattedHistory.length - 1];
                    const response = await chat.sendMessage({
                        message: lastUserMsg.parts[0].text
                    });
                    responseText = response.text || '';
                }

                return responseText;

            } catch (error: any) {
                console.error('Gemini API Error:', error);

                // Check for rate limit or quota exceeded
                if (error?.status === 429 || error?.message?.includes('429')) {
                    rotateApiKey();
                    retries++;
                    if (retries >= maxRetries) {
                        throw new Error('All API keys have exceeded their rate limits.');
                    }
                    // Brief wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    // Re-throw other errors (like 400 Bad Request, auth failures)
                    throw new Error('Failed to generate response. Please try again.');
                }
            }
        }

        throw new Error('Could not complete the request after retries.');
    }
};
