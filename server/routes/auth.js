import express from 'express';
import * as db from '../db.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();
const GUEST_USER_ID = 1;

// ══════════════════════════════════════
// POST /api/auth/signup
// ══════════════════════════════════════
router.post('/signup', (req, res) => {
  try {
    const { name, email, mobile, college, branch, year, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if already exists
    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Create user
    const userId = db.createUser({ name, email, mobile, college, branch, year, password });
    const user = db.findUserById(userId);
    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ══════════════════════════════════════
// POST /api/auth/login
// ══════════════════════════════════════
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'No account found with this email' });
    }

    if (!db.verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    db.updateLastLogin(user.id);
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ══════════════════════════════════════
// POST /api/auth/send-otp
// ══════════════════════════════════════
router.post('/send-otp', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Generate 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    db.storeOTP(email, code);

    // In production, send via EmailJS/Nodemailer/etc.
    // For dev, we return the OTP in response (remove in prod!)
    console.log(`[OTP] Code for ${email}: ${code}`);

    res.json({ 
      message: 'OTP sent successfully',
      // DEV ONLY — remove in production:
      _dev_otp: code
    });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// ══════════════════════════════════════
// POST /api/auth/verify-otp
// ══════════════════════════════════════
router.post('/verify-otp', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const valid = db.verifyOTP(email, code);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Check if user exists; if not, create a temporary account
    let user = db.findUserByEmail(email);
    if (!user) {
      // Auto-create account for OTP-only login
      const userId = db.createUser({
        name: email.split('@')[0],
        email,
        password: 'otp_' + Date.now() // placeholder — they logged in via OTP
      });
      user = db.findUserById(userId);
    }

    db.updateLastLogin(user.id);
    const token = generateToken(user);

    res.json({
      message: 'OTP verified successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ══════════════════════════════════════
// GET /api/auth/me (Protected)
// ══════════════════════════════════════
router.get('/me', (req, res) => {
  try {
    const user = db.findUserById(GUEST_USER_ID);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const progress = db.getUserProgress(GUEST_USER_ID);

    res.json({
      user,
      progress: progress ? {
        xp: progress.xp,
        streak_days: progress.streak_days,
        questions_solved: JSON.parse(progress.questions_solved || '[]'),
        bookmarks: JSON.parse(progress.bookmarks || '[]')
      } : null
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ══════════════════════════════════════
// POST /api/auth/logout (client-side token removal, but log it)
// ══════════════════════════════════════
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ══════════════════════════════════════
// POST /api/auth/progress/solve
// ══════════════════════════════════════
router.post('/progress/solve', (req, res) => {
  try {
    const { questionId, xp = 10 } = req.body;
    if (!questionId) return res.status(400).json({ error: 'Question ID is required' });

    db.updateUserProgress(GUEST_USER_ID, { solve_question: questionId, xp });
    res.json({ message: 'Progress updated successfully' });
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// ══════════════════════════════════════
// POST /api/auth/progress/bookmark
// ══════════════════════════════════════
router.post('/progress/bookmark', (req, res) => {
  try {
    const { questionId } = req.body;
    if (!questionId) return res.status(400).json({ error: 'Question ID is required' });

    db.updateUserProgress(GUEST_USER_ID, { bookmark_question: questionId });
    res.json({ message: 'Bookmark updated successfully' });
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

export default router;
