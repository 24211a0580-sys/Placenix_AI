import express from 'express';
import * as db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import fetch from 'node-fetch'; // Standard for Node.js fetch if using older node, but Node 20+ has it global. 
// However, better-safe-than-sorry, I'll assume global fetch in Node 20+.

const router = express.Router();

/**
 * POST /api/resume/analyze
 * Receives resume text and returns AI analysis
 */
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { text, filename } = req.body;
    if (!text) return res.status(400).json({ error: 'Resume text is required' });

    const prompt = `You are an expert ATS (Applicant Tracking System) and Senior Tech Recruiter.
Analyze the provided raw resume text and calculate unique, data-driven scores strictly based on the content.
Be critical and honest.

Return ONLY a raw JSON object with this exact structure:
{
  "overall_score": [Number 0-100],
  "scores": {
    "structure": [Number 0-100],
    "skills": [Number 0-100],
    "ats": [Number 0-100],
    "keywords": [Number 0-100]
  },
  "missing": ["Skill/Item 1", "Skill/Item 2", "..."],
  "strengths": ["Strength 1", "..."],
  "tips": [
    {"title": "Actionable Tip Title", "desc": "Detailed explanation..."}
  ]
}

Resume text for analysis:
${text.substring(0, 8000)}`;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEYS?.split(',')[0];
    if (!apiKey) {
      console.warn('GEMINI_API_KEY missing, using mock analysis');
      const mock = {
        overall_score: 75,
        scores: { structure: 80, skills: 70, ats: 85, keywords: 65 },
        missing: ["Cloud Architecture", "System Design"],
        strengths: ["Strong Frontend Proficiency", "Clean Code"],
        tips: [{ title: "Add Cloud Skills", desc: "Experience with AWS/GCP is highly valued." }]
      };
      db.saveResumeAnalysis(req.user.id, {
        filename,
        overall_score: mock.overall_score,
        analysis_json: mock,
        extracted_text: text
      });
      return res.json(mock);
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

    if (!aiRes.ok) {
      const err = await aiRes.json();
      throw new Error(err.error?.message || 'AI Analysis failed');
    }

    const data = await aiRes.json();
    const dataText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!dataText) throw new Error('Empty response from AI');

    const analysis = JSON.parse(dataText);

    // Save to DB
    db.saveResumeAnalysis(req.user.id, {
      filename: filename || 'resume.pdf',
      overall_score: analysis.overall_score,
      analysis_json: analysis,
      extracted_text: text
    });

    res.json(analysis);

  } catch (err) {
    console.error('Resume Analysis Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

/**
 * GET /api/resume/history
 * Returns user's resume analysis history
 */
router.get('/history', authMiddleware, (req, res) => {
  try {
    const history = db.getResumeHistory(req.user.id);
    res.json(history.map(h => ({
      ...h,
      analysis: JSON.parse(h.analysis_json)
    })));
  } catch (err) {
    console.error('History Error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
