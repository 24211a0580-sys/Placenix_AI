import express from 'express';
import * as db from '../db.js';

const router = express.Router();

// ══════════════════════════════════════
// GET /api/questions
// ══════════════════════════════════════
router.get('/', (req, res) => {
  try {
    const { category, difficulty, type, search, company } = req.query;
    const questions = db.getQuestions({ category, difficulty, type, search, company });
    res.json(questions);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// ══════════════════════════════════════
// GET /api/questions/companies
// ══════════════════════════════════════
router.get('/companies', (req, res) => {
  try {
    const companies = db.getCompanies();
    res.json(companies);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// ══════════════════════════════════════
// GET /api/questions/:id
// ══════════════════════════════════════
router.get('/:id', (req, res) => {
  try {
    const question = db.getQuestionById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

export default router;
