// src/services/evaluationService.ts
import { assistantGeminiService } from './assistantGeminiService';

export interface EvaluationResult {
    clarity: number;     // 1-10
    depth: number;       // 1-10
    confidence: number;  // 1-10
    overallScore: number; // 0-100
    aiComment: string;
}

export const evaluationService = {
    async evaluateAnswer(
        question: string,
        answer: string,
        category: string
    ): Promise<EvaluationResult> {
        const prompt = `
            You are an expert interviewer for ${category} roles. 
            Evaluate the following answer to the question: "${question}"
            
            User Answer: "${answer}"
            
            Provide a strict JSON response with these keys:
            - clarity: score from 1-10 based on how clear and well-structured the answer is
            - depth: score from 1-10 based on technical depth or situational insight
            - confidence: score from 1-10 based on tone and assertiveness
            - overallScore: weighted score out of 100
            - aiComment: a 1-sentence summary of the answer quality.
            
            Respond ONLY with the JSON object.
        `;

        try {
            const responseText = await assistantGeminiService.generateResponse(
                [{ role: 'user', content: prompt }],
                'en-IN',
                '/interview'
            );

            // Clean up potentially returned markdown code blocks
            const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonStr);

            return {
                clarity: result.clarity || 5,
                depth: result.depth || 5,
                confidence: result.confidence || 5,
                overallScore: result.overallScore || 50,
                aiComment: result.aiComment || "Analysis complete."
            };
        } catch (err) {
            console.error("Evaluation Error:", err);
            // Fallback to basic heuristics if AI fails
            const len = answer.length;
            const base = Math.min(len / 20, 7);
            return {
                clarity: Math.round(base),
                depth: Math.round(base - 1),
                confidence: Math.round(base + 1),
                overallScore: Math.round(base * 10),
                aiComment: "AI Analysis unavailable. Evaluation based on answer length."
            };
        }
    }
};
