import './env.js';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { connectDB } from './db.js';
import { User, Lesson, Quiz, QuizAttempt, LessonProgress } from './models.js';
import { signToken, toProfile, requireAuth, requireRole, touchStreak, uniqueCode, findChild } from './auth.js';
import portalRouter from './portal.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ---------- AUTH ----------
const ROLES = ['student', 'teacher', 'parent'];

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      name, rollNo, password, grade, stateBoard, schoolHub, avatar, language,
      classCode, childRollNo, parentCode,
    } = req.body;
    const role = ROLES.includes(req.body.role) ? req.body.role : 'student';

    if (!name || !rollNo || !password) {
      return res.status(400).json({ error: 'Name, login ID and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const exists = await User.findOne({ rollNo: String(rollNo).toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: 'This login ID is already registered' });

    const extra = {};
    let child = null;

    if (role === 'student') {
      if (classCode) {
        const teacher = await User.findOne({
          role: 'teacher',
          classCode: String(classCode).toUpperCase().trim(),
        });
        if (!teacher) return res.status(400).json({ error: 'Class code not found. Ask your teacher.' });
        extra.teacherId = teacher._id;
        if (!schoolHub) extra.schoolHub = teacher.schoolHub;
      }
      extra.parentCode = await uniqueCode('parentCode');
    }
    if (role === 'teacher') {
      extra.classCode = await uniqueCode('classCode');
    }
    if (role === 'parent' && (childRollNo || parentCode)) {
      child = await findChild(childRollNo, parentCode);
      if (!child) {
        return res.status(400).json({ error: 'Child not found. Check the roll number and parent code.' });
      }
    }

    const user = await User.create({
      name,
      rollNo,
      role,
      passwordHash: await bcrypt.hash(password, 10),
      grade: role === 'student' ? grade : undefined,
      stateBoard,
      schoolHub,
      avatar,
      language,
      ...extra,
    });
    if (child) {
      user.childIds.push(child._id);
      await user.save();
    }
    res.status(201).json({ token: signToken(user._id), profile: toProfile(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { rollNo, password } = req.body;
    const user = await User.findOne({ rollNo: String(rollNo || '').toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ error: 'Wrong roll number or password' });
    }
    if (user.role === 'student' && !user.parentCode) user.parentCode = await uniqueCode('parentCode');
    if (user.role === 'student') touchStreak(user);
    await user.save();
    res.json({ token: signToken(user._id), profile: toProfile(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ profile: toProfile(req.user) });
});

// ---------- CONTENT ----------
// built-in content (teacherId null) + content from the student's own teacher
const visibleTo = (u) => ({ $or: [{ teacherId: null }, { teacherId: u.teacherId || null }] });

app.get('/api/lessons', requireAuth, async (req, res) => {
  const lessons = await Lesson.find(visibleTo(req.user)).lean();
  res.json(lessons.map(({ _id, __v, lessonId, teacherId, createdAt, updatedAt, ...rest }) => ({ id: lessonId, ...rest })));
});

app.get('/api/quizzes', requireAuth, async (req, res) => {
  const quizzes = await Quiz.find(visibleTo(req.user)).lean();
  res.json(quizzes.map(({ _id, __v, quizId, teacherId, createdAt, updatedAt, ...rest }) => ({ id: quizId, ...rest })));
});

// ---------- STUDENT ACTIVITY ----------
// Save a quiz result (also used by the offline sync queue later)
app.post('/api/quizzes/:quizId/attempt', requireAuth, requireRole('student'), async (req, res) => {
  try {
    const { score, total, answers, timeTakenSec, clientId } = req.body;
    if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0 || score < 0 || score > total) {
      return res.status(400).json({ error: 'Invalid score' });
    }
    const quiz = await Quiz.findOne({ quizId: req.params.quizId }).lean();
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Offline retry safety: same clientId is never saved twice
    if (clientId) {
      const dup = await QuizAttempt.findOne({ userId: req.user._id, clientId });
      if (dup) return res.json({ duplicate: true, profile: toProfile(req.user) });
    }

    await QuizAttempt.create({
      userId: req.user._id, quizId: quiz.quizId, score, total, answers, timeTakenSec, clientId,
    });

    const ratio = total ? score / total : 0;
    req.user.xp += Math.round((quiz.xpReward || 0) * ratio);
    if (ratio >= 0.8) req.user.stars += 1;
    touchStreak(req.user);
    await req.user.save();

    res.status(201).json({ profile: toProfile(req.user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save quiz result' });
  }
});

// Save lesson progress; XP is given only the first time a lesson is completed
app.post('/api/progress', requireAuth, requireRole('student'), async (req, res) => {
  try {
    const { lessonId, slidesDone = 0, completed = false } = req.body;
    const lesson = await Lesson.findOne({ lessonId }).lean();
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const before = await LessonProgress.findOne({ userId: req.user._id, lessonId });
    const firstCompletion = completed && !before?.completed;

    await LessonProgress.findOneAndUpdate(
      { userId: req.user._id, lessonId },
      { slidesDone: Math.max(slidesDone, before?.slidesDone || 0), completed: completed || before?.completed || false },
      { upsert: true }
    );

    if (firstCompletion) req.user.xp += lesson.xpReward || 0;
    touchStreak(req.user);
    await req.user.save();

    res.json({ profile: toProfile(req.user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save progress' });
  }
});

app.get('/api/progress', requireAuth, requireRole('student'), async (req, res) => {
  const rows = await LessonProgress.find({ userId: req.user._id }).lean();
  res.json(rows.map(({ lessonId, slidesDone, completed }) => ({ lessonId, slidesDone, completed })));
});

// ---------- TEACHER / PARENT PORTAL ----------
app.use('/api', portalRouter);

export default app;