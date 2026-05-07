import express from 'express';
import * as db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * POST /api/interview/feedback
 * Evaluates a single answer during the interview
 */
router.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const { question, answer, roundType } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });

    const prompt = `You are a Senior Technical Interviewer. 
Evaluate the candidate's answer for an ${roundType} round question: "${question}"
Candidate's Answer: "${answer}"

Provide a structured evaluation in JSON format with:
- clarity: score 0-10
- depth: score 0-10
- confidence: score 0-10
- feedback: a short sentence of constructive feedback.
- advice: one actionable tip to improve.

Return ONLY the JSON.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Mock if no key
      return res.json({
        clarity: 8,
        depth: 7,
        confidence: 9,
        feedback: "Your answer was clear but could use more technical detail.",
        advice: "Mention specific tools or frameworks to demonstrate depth."
      });
    }

    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const aiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!aiRes.ok) throw new Error('AI evaluation failed');
    const data = await aiRes.json();
    const dataText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json(JSON.parse(dataText));

  } catch (err) {
    console.error('Interview Feedback Error:', err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

/**
 * POST /api/interview/save
 * Saves the entire interview session
 */
router.post('/save', authMiddleware, (req, res) => {
  try {
    const { round_type, overall_score, transcript, feedback } = req.body;
    const result = db.saveInterviewSession(req.user.id, {
      round_type,
      overall_score,
      transcript_json: transcript,
      feedback_json: feedback
    });
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Save Interview Error:', err);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

/**
 * GET /api/interview/history
 */
router.get('/history', authMiddleware, (req, res) => {
  try {
    const history = db.getInterviewHistory(req.user.id);
    res.json(history.map(h => ({
      ...h,
      transcript: JSON.parse(h.transcript_json),
      feedback: JSON.parse(h.feedback_json)
    })));
  } catch (err) {
    console.error('History Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
