import { Router, Response } from 'express';
import crypto from 'crypto';
import db from '../db.js';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware.js';
import { logAuditEvent } from '../auth.js';

const router = Router();

// 1. GET ALL QUIZZES WITH QUESTION COUNT
router.get('/', (req, res) => {
  const quizzes = db.prepare(`
    SELECT q.id, q.title, q.category, q.description, q.created_at,
           COUNT(qu.id) as question_count
    FROM quizzes q
    LEFT JOIN questions qu ON q.id = qu.quiz_id
    GROUP BY q.id
    ORDER BY q.created_at DESC
  `).all();

  return res.json({ success: true, quizzes });
});

// 2. GET QUESTIONS AND OPTIONS FOR A QUIZ
router.get('/:id/questions', (req, res) => {
  const { id } = req.params;

  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(id) as any;
  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Test / Soru bankası bulunamadı.' });
  }

  const questions = db.prepare(`
    SELECT id, quiz_id, question_number, question_text, explanation, topic_summary, points
    FROM questions
    WHERE quiz_id = ?
    ORDER BY question_number ASC
  `).all(id) as any[];

  // Fetch options for each question
  const questionsWithOptions = questions.map((q) => {
    const options = db.prepare(`
      SELECT id, option_key, option_text, is_correct
      FROM question_options
      WHERE question_id = ?
      ORDER BY option_key ASC
    `).all(q.id);

    return {
      ...q,
      options
    };
  });

  return res.json({
    success: true,
    quiz,
    questions: questionsWithOptions
  });
});

// 3. SUBMIT ANSWERS AND SCORE QUIZ
router.post('/:id/submit', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { answers, duration_seconds } = req.body; // answers: { [questionId: string]: string (selectedOption) }
  const userId = req.user!.userId;

  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(id) as any;
  if (!quiz) {
    return res.status(404).json({ success: false, error: 'Test bulunamadı.' });
  }

  const questions = db.prepare('SELECT id, points FROM questions WHERE quiz_id = ?').all(id) as any[];
  if (questions.length === 0) {
    return res.status(400).json({ success: false, error: 'Test içinde soru bulunmuyor.' });
  }

  let totalScore = 0;
  let correctCount = 0;
  let wrongCount = 0;

  const attemptId = 'attempt-' + crypto.randomUUID();

  // Evaluate each question
  const evaluatedAnswers: any[] = [];
  for (const q of questions) {
    const selectedOption = answers ? answers[q.id] : null;
    
    // Find correct option for this question
    const correctOpt = db.prepare(`
      SELECT option_key FROM question_options WHERE question_id = ? AND is_correct = 1
    `).get(q.id) as any;

    const isCorrect = selectedOption && correctOpt && selectedOption === correctOpt.option_key ? 1 : 0;

    if (isCorrect) {
      totalScore += q.points || 10;
      correctCount++;
    } else {
      wrongCount++;
    }

    evaluatedAnswers.push({
      question_id: q.id,
      selected_option: selectedOption || 'BOŞ',
      correct_option: correctOpt ? correctOpt.option_key : '',
      is_correct: isCorrect
    });
  }

  // Insert attempt record
  db.prepare(`
    INSERT INTO user_quiz_attempts (id, user_id, quiz_id, score, total_questions, correct_count, wrong_count, duration_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(attemptId, userId, id, totalScore, questions.length, correctCount, wrongCount, duration_seconds || 0);

  // Insert individual answers
  const insertAnswerStmt = db.prepare(`
    INSERT INTO user_answers (id, attempt_id, user_id, question_id, selected_option, is_correct)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const ans of evaluatedAnswers) {
    insertAnswerStmt.run('ans-' + crypto.randomUUID(), attemptId, userId, ans.question_id, ans.selected_option, ans.is_correct);
  }

  logAuditEvent(userId, 'QUIZ_SUBMITTED', `Test tamamlandı: ${quiz.title} (Skor: ${totalScore}, Doğru: ${correctCount}/${questions.length})`, req.ip, req.get('User-Agent'));

  return res.json({
    success: true,
    attempt: {
      id: attemptId,
      quiz_id: id,
      quiz_title: quiz.title,
      score: totalScore,
      total_questions: questions.length,
      correct_count: correctCount,
      wrong_count: wrongCount,
      duration_seconds: duration_seconds || 0,
      details: evaluatedAnswers
    }
  });
});

// 4. GET MY PAST QUIZ ATTEMPTS
router.get('/attempts/my', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  const attempts = db.prepare(`
    SELECT a.id, a.quiz_id, q.title as quiz_title, q.category, a.score, a.total_questions,
           a.correct_count, a.wrong_count, a.duration_seconds, a.completed_at
    FROM user_quiz_attempts a
    JOIN quizzes q ON a.quiz_id = q.id
    WHERE a.user_id = ?
    ORDER BY a.completed_at DESC
  `).all(userId);

  return res.json({ success: true, attempts });
});

// 5. ADMIN: ADD NEW QUESTION WITH OPTIONS
router.post('/admin/questions', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { quiz_id, question_number, question_text, explanation, topic_summary, points, options } = req.body;

  if (!quiz_id || !question_text || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ success: false, error: 'Lütfen test ID, soru metni ve en az 2 şık (A-E) girin.' });
  }

  const questionId = 'q-' + crypto.randomUUID();
  const qNum = Number(question_number) || 1;
  const qPts = Number(points) || 10;

  db.prepare(`
    INSERT INTO questions (id, quiz_id, question_number, question_text, explanation, topic_summary, points)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(questionId, quiz_id, qNum, question_text.trim(), explanation ? explanation.trim() : null, topic_summary ? topic_summary.trim() : null, qPts);

  const insertOptStmt = db.prepare(`
    INSERT INTO question_options (id, question_id, option_key, option_text, is_correct)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const opt of options) {
    insertOptStmt.run('opt-' + crypto.randomUUID(), questionId, opt.option_key.toUpperCase(), opt.option_text.trim(), opt.is_correct ? 1 : 0);
  }

  logAuditEvent(req.user!.userId, 'ADMIN_ADD_QUESTION', `Yeni soru eklendi (Soru #${qNum})`, req.ip, req.get('User-Agent'));

  return res.status(201).json({
    success: true,
    message: 'Soru ve şıklar veritabanına eklendi!',
    questionId
  });
});

// 6. ADMIN: DELETE QUESTION
router.delete('/admin/questions/:id', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  db.prepare('DELETE FROM questions WHERE id = ?').run(id);
  logAuditEvent(req.user!.userId, 'ADMIN_DELETE_QUESTION', `Soru silindi (${id})`, req.ip, req.get('User-Agent'));

  return res.json({ success: true, message: 'Soru silindi.' });
});

export default router;
