// src/services/feedbackService.ts
import { assistantGeminiService } from './assistantGeminiService';
import { EvaluationResult } from './evaluationService';

export interface Feedback {
    summary: string;
    strengths: string[];
    improvements: string[];
    suggestedResources: { title: string; url: string }[];
}

export const feedbackService = {
    async generatePersonalizedFeedback(
        question: string,
        answer: string,
        evaluation: EvaluationResult
    ): Promise<Feedback> {
        const prompt = `
            You are a senior career advisor. 
            Evaluate this interview answer for a job interview.
            
            Question: "${question}"
            User Answer: "${answer}"
            Scores (out of 10): Clarity: ${evaluation.clarity}, Depth: ${evaluation.depth}, Confidence: ${evaluation.confidence}.
            
            Provide a strict JSON response with:
            - summary: 1-2 sentence overview of their performance.
            - strengths: list of 2 key strengths shown in the answer.
            - improvements: list of 2 specific ways to improve this exact answer.
            - suggestedResources: list of 2 object with "title" and "url" (relevant technical topics or coding links).
            
            Respond ONLY with the JSON object.
        `;

        try {
            const responseText = await assistantGeminiService.generateResponse(
                [{ role: 'user', content: prompt }],
                'en-IN',
                '/interview'
            );

            const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonStr);

            return {
                summary: result.summary || "Good effort. Try to be more specific.",
                strengths: result.strengths || ["Grammar and Flow", "Technical terminology"],
                improvements: result.improvements || ["Add more quantifiable results", "Structure using the STAR method"],
                suggestedResources: result.suggestedResources || [
                    { title: "STAR Method Guide", url: "https://www.themuse.com/advice/star-method-interview-questions" },
                    { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
                ]
            };
        } catch (err) {
            console.error("Feedback Error:", err);
            return {
                summary: "Your answer shows promise but needs more technical detail.",
                strengths: ["Clear communication", "Confident tone"],
                improvements: ["Add more specific examples", "Explain the 'Why' behind your solution"],
                suggestedResources: [
                    { title: "GeeksforGeeks Interview Prep", url: "https://www.geeksforgeeks.org/" },
                    { title: "LeetCode Prep", url: "https://leetcode.com/explore/interview/card/top-interview-questions-easy/" }
                ]
            };
        }
    }
};
