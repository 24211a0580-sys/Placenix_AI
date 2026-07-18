import express from 'express';
import * as db from '../db.js';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Since the app now uses frictionless onboarding (no JWT), use a stable guest user ID.
// The frontend may optionally pass { userName } in the request body for logging.
const GUEST_USER_ID = 1;

// ── Realistic mock for when API key is missing / quota exceeded ──
function getMockAnalysis() {
  return {
    overall_score: 72,
    scores: { structure: 78, skills: 68, ats: 80, keywords: 62 },
    missing: ['Cloud Architecture (AWS/GCP)', 'System Design', 'Docker / Kubernetes', 'CI/CD Pipelines'],
    strengths: ['Strong Frontend Proficiency', 'Clear Project Descriptions', 'Quantified Achievements'],
    tips: [
      { title: 'Add Cloud Skills', desc: 'Experience with AWS, GCP, or Azure is highly valued by ATS systems. Even a certification mention helps.' },
      { title: 'Improve Keyword Density', desc: 'Mirror the exact keywords from job descriptions — ATS scanners do literal string matching.' },
      { title: 'Quantify More Impact', desc: 'Replace "improved performance" with "improved load time by 40%" wherever possible.' }
    ]
  };
}

/**
 * POST /api/resume/analyze
 * Receives resume text and returns AI analysis
 */
router.post('/analyze', async (req, res) => {
  try {
    const { text, filename } = req.body;
    if (!text) return res.status(400).json({ error: 'Resume text is required' });

    const apiKey = process.env.GEMINI_API_KEY;

    const userId = GUEST_USER_ID;
    if (!apiKey) {
      console.warn('[Resume] No GEMINI_API_KEY set — returning mock analysis');
      const mock = getMockAnalysis();
      db.saveResumeAnalysis(userId, {
        filename: filename || 'resume.pdf',
        overall_score: mock.overall_score,
        analysis_json: mock,
        extracted_text: text
      });
      return res.json({ ...mock, _mock: true });
    }

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

    try {
      const genAI = new GoogleGenAI({ apiKey });
      const result = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const dataText = result.text;
      if (!dataText) throw new Error('Empty response from AI');

      let analysis;
      try {
        // Strip markdown code fences if present
        const clean = dataText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
        analysis = JSON.parse(clean);
      } catch (parseErr) {
        // Try substring extraction
        const start = dataText.indexOf('{');
        const end = dataText.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          try {
            analysis = JSON.parse(dataText.substring(start, end + 1));
          } catch (e2) {
            throw new Error('Failed to parse JSON from AI response: ' + parseErr.message);
          }
        } else {
          throw new Error('Failed to parse JSON from AI response: ' + parseErr.message);
        }
      }

      db.saveResumeAnalysis(userId, {
        filename: filename || 'resume.pdf',
        overall_score: analysis.overall_score,
        analysis_json: analysis,
        extracted_text: text
      });

      return res.json(analysis);

    } catch (aiErr) {
      const msg = aiErr.message || '';
      // Quota exceeded or rate limited — fall back gracefully
      if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('rate') || msg.includes('429')) {
        console.warn('[Resume] Gemini quota exceeded — returning mock analysis');
        const mock = getMockAnalysis();
        db.saveResumeAnalysis(userId, {
          filename: filename || 'resume.pdf',
          overall_score: mock.overall_score,
          analysis_json: mock,
          extracted_text: text
        });
        // _quota flag lets the frontend show a friendly warning
        return res.json({ ...mock, _quota: true });
      }
      throw aiErr; // re-throw unexpected errors
    }

  } catch (err) {
    console.error('Resume Analysis Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});


/**
 * GET /api/resume/history
 * Returns user's resume analysis history
 */
router.get('/history', (req, res) => {
  try {
    const history = db.getResumeHistory(GUEST_USER_ID);
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
