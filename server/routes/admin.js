import express from 'express';
import * as db from '../db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import os from 'os';

const router = express.Router();

/**
 * POST /api/admin/verify-pin
 * Verifies the 4-digit admin PIN
 */
router.post('/verify-pin', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { pin } = req.body;
    const adminPin = db.db.prepare("SELECT config_value FROM settings WHERE config_key = 'admin_pin'").get();
    
    if (pin === adminPin?.config_value) {
      res.json({ success: true, message: 'PIN verified' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid Admin PIN' });
    }
  } catch (err) {
    console.error('PIN Verification Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/admin/stats
 * Overview metrics
 */
router.get('/stats', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const totalUsers = db.db.prepare("SELECT COUNT(*) as count FROM users").get().count;
    const totalResumes = db.db.prepare("SELECT COUNT(*) as count FROM resume_analyses").get().count;
    const totalInterviews = db.db.prepare("SELECT COUNT(*) as count FROM interview_sessions").get().count;
    const totalQuestions = db.db.prepare("SELECT COUNT(*) as count FROM questions").get().count;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        totalInterviews,
        totalQuestions
      }
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/admin/users
 */
router.get('/users', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const users = db.db.prepare("SELECT id, name, email, role, created_at, last_login, is_active FROM users").all();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Admin Users Error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/admin/health
 */
router.get('/health', authMiddleware, adminMiddleware, (req, res) => {
  try {
    res.json({
      success: true,
      health: {
        nodeVersion: process.version,
        platform: os.platform(),
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        dbStatus: 'Online (SQLite3)',
        uptime: `${Math.round(process.uptime())}s`
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

/**
 * GET /api/admin/settings
 */
router.get('/settings', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const settings = db.db.prepare("SELECT config_key, config_value, config_description FROM settings").all();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * POST /api/admin/settings
 */
router.post('/settings', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { config_key, config_value } = req.body;
    db.db.prepare("UPDATE settings SET config_value = ? WHERE config_key = ?").run(config_value, config_key);
    res.json({ success: true, message: 'Setting updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export default router;
