import express from 'express';
import * as db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/dashboard/summary
 * Aggregates user progress across all modules
 */
router.get('/summary', authMiddleware, (req, res) => {
  try {
    const summary = db.getDashboardSummary(req.user.id);
    res.json({
      success: true,
      data: summary
    });
  } catch (err) {
    console.error('Dashboard Summary Error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

export default router;
