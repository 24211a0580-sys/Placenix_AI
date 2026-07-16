import express from 'express';
import * as db from '../db.js';

const router = express.Router();
const GUEST_USER_ID = 1;

/**
 * GET /api/dashboard/summary
 * Aggregates user progress across all modules
 */
router.get('/summary', (req, res) => {
  try {
    const summary = db.getDashboardSummary(GUEST_USER_ID);
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
