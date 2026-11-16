import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { evaluateAnswer, generateCustomQuestions } from '../services/aiService';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'interviewmate_secret_key_2026';

// Middleware to verify JWT token
export function authenticateToken(req: any, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// --- AUTH ROUTES ---
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, preferred_job_role } = req.body;
    console.log('Register request received:', { name, email, preferred_job_role });
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const stmt = db.prepare('INSERT INTO users (name, email, password_hash, preferred_job_role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, email, password_hash, preferred_job_role || 'Java Developer');
    const userId = result.lastInsertRowid;

    const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: userId,
        name,
        email,
        preferred_job_role: preferred_job_role || 'Java Developer'
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferred_job_role: user.preferred_job_role
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

router.get('/auth/me', authenticateToken, (req: any, res: Response) => {
  try {
    const user = db.prepare('SELECT id, name, email, preferred_job_role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/auth/profile', authenticateToken, (req: any, res: Response) => {
  try {
    const { name, preferred_job_role } = req.body;
    db.prepare('UPDATE users SET name = ?, preferred_job_role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(name, preferred_job_role, req.user.id);

    const user = db.prepare('SELECT id, name, email, preferred_job_role FROM users WHERE id = ?').get(req.user.id);
    res.json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- JOB ROLES ---
router.get('/job-roles', (req: Request, res: Response) => {
  try {
    const roles = db.prepare('SELECT * FROM job_roles').all();
    res.json(roles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- INTERVIEW SESSIONS ---
router.post('/interviews/sessions', authenticateToken, async (req: any, res: Response) => {
  try {
    const { job_role_id, interview_type, difficulty, num_questions } = req.body;
    const count = parseInt(num_questions) || 5;

    // Get job role title
    const role = db.prepare('SELECT title FROM job_roles WHERE id = ?').get(job_role_id) as any;
    const roleTitle = role ? role.title : 'Software Engineer';

    // Fetch questions from database matching role and difficulty
    let questions = db.prepare('SELECT id, question_text, difficulty, sample_answer FROM interview_questions WHERE job_role_id = ? AND difficulty = ? LIMIT ?')
      .all(job_role_id, difficulty || 'Intermediate', count) as any[];

    // If not enough questions, generate or fetch any
    if (questions.length < count) {
      const moreQ = db.prepare('SELECT id, question_text, difficulty, sample_answer FROM interview_questions WHERE job_role_id = ? LIMIT ?')
        .all(job_role_id, count) as any[];
      questions = moreQ;
    }

    if (questions.length === 0) {
      // Fallback AI generation
      const aiQs = await generateCustomQuestions(roleTitle, difficulty || 'Intermediate', count);
      const insertQStmt = db.prepare('INSERT INTO interview_questions (job_role_id, question_text, difficulty, sample_answer) VALUES (?, ?, ?, ?)');
      for (const q of aiQs) {
        const resQ = insertQStmt.run(job_role_id, q.question_text, q.difficulty, q.sample_answer);
        questions.push({ id: resQ.lastInsertRowid, ...q });
      }
    }

    // Create session
    const sessionStmt = db.prepare(`
      INSERT INTO interview_sessions (user_id, job_role_id, interview_type, difficulty, total_questions, status)
      VALUES (?, ?, ?, ?, ?, 'in_progress')
    `);
    const sessionRes = sessionStmt.run(req.user.id, job_role_id, interview_type || 'Technical', difficulty || 'Intermediate', questions.length);
    const sessionId = sessionRes.lastInsertRowid;

    res.json({
      sessionId,
      jobRole: roleTitle,
      interview_type,
      difficulty,
      questions: questions.map(q => ({ id: q.id, question_text: q.question_text, difficulty: q.difficulty }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/interviews/sessions/:sessionId', authenticateToken, (req: any, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = db.prepare(`
      SELECT s.*, jr.title as job_role_title, jr.icon as job_role_icon
      FROM interview_sessions s
      JOIN job_roles jr ON s.job_role_id = jr.id
      WHERE s.id = ? AND s.user_id = ?
    `).get(sessionId, req.user.id) as any;

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    // Get answers and feedback if submitted
    const answers = db.prepare(`
      SELECT a.*, q.question_text, q.sample_answer, f.score, f.strengths, f.missing_concepts, f.suggestions, f.sample_improved_answer
      FROM interview_answers a
      JOIN interview_questions q ON a.question_id = q.id
      LEFT JOIN interview_feedback f ON f.session_id = a.session_id AND f.question_id = a.question_id
      WHERE a.session_id = ?
    `).all(sessionId);

    res.json({ session, answers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/interviews/sessions/:sessionId/submit', authenticateToken, async (req: any, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body; // Array of { question_id, user_answer }

    const session = db.prepare('SELECT * FROM interview_sessions WHERE id = ? AND user_id = ?').get(sessionId, req.user.id) as any;
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const role = db.prepare('SELECT title FROM job_roles WHERE id = ?').get(session.job_role_id) as any;
    const roleTitle = role ? role.title : 'Software Engineer';

    let totalScore = 0;
    let evaluatedCount = 0;

    const insertAnswer = db.prepare('INSERT INTO interview_answers (session_id, question_id, user_answer) VALUES (?, ?, ?)');
    const insertFeedback = db.prepare(`
      INSERT INTO interview_feedback (session_id, question_id, score, strengths, missing_concepts, suggestions, sample_improved_answer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const ans of answers) {
      const { question_id, user_answer } = ans;
      insertAnswer.run(sessionId, question_id, user_answer || 'No answer provided.');

      // Get sample answer
      const qObj = db.prepare('SELECT question_text, sample_answer FROM interview_questions WHERE id = ?').get(question_id) as any;
      const questionText = qObj ? qObj.question_text : '';
      const sampleAns = qObj ? qObj.sample_answer : 'Standard industry best practices.';

      // AI Evaluation
      const evalResult = await evaluateAnswer(roleTitle, questionText, user_answer || '', sampleAns);

      totalScore += evalResult.score;
      evaluatedCount++;

      insertFeedback.run(
        sessionId,
        question_id,
        evalResult.score,
        JSON.stringify(evalResult.strengths),
        JSON.stringify(evalResult.missingConcepts),
        JSON.stringify(evalResult.suggestions),
        evalResult.sampleImprovedAnswer
      );
    }

    const averageScore = evaluatedCount > 0 ? Number((totalScore / evaluatedCount).toFixed(1)) : 0;

    db.prepare('UPDATE interview_sessions SET score = ?, status = ? WHERE id = ?')
      .run(averageScore, 'completed', sessionId);

    res.json({
      message: 'Interview submitted and evaluated successfully',
      sessionId,
      averageScore
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/interviews/history', authenticateToken, (req: any, res: Response) => {
  try {
    const history = db.prepare(`
      SELECT s.*, jr.title as job_role_title, jr.icon as job_role_icon
      FROM interview_sessions s
      JOIN job_roles jr ON s.job_role_id = jr.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `).all(req.user.id);

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- DASHBOARD STATS ---
router.get('/stats', authenticateToken, (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const completedSessions = db.prepare("SELECT COUNT(*) as count FROM interview_sessions WHERE user_id = ? AND status = 'completed'").get(userId) as any;
    const avgScoreObj = db.prepare("SELECT AVG(score) as avg_score FROM interview_sessions WHERE user_id = ? AND status = 'completed'").get(userId) as any;
    const questionsAttempted = db.prepare(`
      SELECT COUNT(a.id) as count 
      FROM interview_answers a
      JOIN interview_sessions s ON a.session_id = s.id
      WHERE s.user_id = ?
    `).get(userId) as any;

    const recentHistory = db.prepare(`
      SELECT s.*, jr.title as job_role_title, jr.icon as job_role_icon
      FROM interview_sessions s
      JOIN job_roles jr ON s.job_role_id = jr.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      LIMIT 5
    `).all(userId);

    // Score trend over time for chart
    const scoreTrend = db.prepare(`
      SELECT created_at, score, interview_type 
      FROM interview_sessions 
      WHERE user_id = ? AND status = 'completed'
      ORDER BY created_at ASC
      LIMIT 10
    `).all(userId);

    res.json({
      totalInterviewsCompleted: completedSessions.count || 0,
      averageScore: avgScoreObj.avg_score ? Number(avgScoreObj.avg_score.toFixed(1)) : 0,
      questionsAttempted: questionsAttempted.count || 0,
      recentHistory,
      scoreTrend
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
