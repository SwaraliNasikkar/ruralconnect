import { Router } from 'express';
import { User, Lesson, Quiz, QuizAttempt, LessonProgress, Announcement } from './models.js';
import { requireAuth, requireRole, toProfile, findChild } from './auth.js';

const router = Router();

// ---------- helpers ----------
const ah = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
    res.status(500).json({ error: 'Server error' });
  });

const S = (x) => String(x);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
// built-in content (teacherId null) + this teacher's own content
const visible = (teacherId) => ({ $or: [{ teacherId: null }, { teacherId }] });
const finalScore = (a) => (a.teacherScore ?? a.score);
const pctOf = (a) => (a.total ? Math.round((finalScore(a) / a.total) * 100) : 0);
const avg = (arr) => (arr.length ? Math.round(arr.reduce((s, n) => s + n, 0) / arr.length) : null);
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const TEACHER = [requireAuth, requireRole('teacher')];
const PARENT = [requireAuth, requireRole('parent')];

async function classData(teacherId) {
  const students = await User.find({ role: 'student', teacherId }).sort({ name: 1 }).lean();
  const ids = students.map((s) => s._id);
  const [progress, attempts] = await Promise.all([
    LessonProgress.find({ userId: { $in: ids } }).lean(),
    QuizAttempt.find({ userId: { $in: ids } }).lean(),
  ]);
  return { students, progress, attempts };
}

// =====================================================
// STUDENT: join a class later (if no class code at sign-up)
// =====================================================
router.post('/student/join', requireAuth, requireRole('student'), ah(async (req, res) => {
  const code = String(req.body.classCode || '').toUpperCase().trim();
  const teacher = await User.findOne({ role: 'teacher', classCode: code });
  if (!teacher) return res.status(404).json({ error: 'Class code not found' });
  req.user.teacherId = teacher._id;
  if (!req.user.schoolHub) req.user.schoolHub = teacher.schoolHub;
  await req.user.save();
  res.json({ profile: toProfile(req.user) });
}));

// =====================================================
// NOTICES (read: teacher / student / parent)
// =====================================================
router.get('/notices', requireAuth, ah(async (req, res) => {
  let teacherIds = [];
  if (req.user.role === 'teacher') teacherIds = [req.user._id];
  else if (req.user.role === 'student') teacherIds = req.user.teacherId ? [req.user.teacherId] : [];
  else {
    const kids = await User.find({ _id: { $in: req.user.childIds } }).select('teacherId').lean();
    teacherIds = kids.map((k) => k.teacherId).filter(Boolean);
  }
  const list = await Announcement.find({ teacherId: { $in: teacherIds } })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('teacherId', 'name')
    .lean();
  res.json(
    list.map((n) => ({
      id: S(n._id),
      title: n.title,
      text: n.text,
      teacher: n.teacherId?.name || '',
      createdAt: n.createdAt,
    }))
  );
}));

// =====================================================
// TEACHER
// =====================================================

// ----- students in my class -----
router.get('/teacher/students', ...TEACHER, ah(async (req, res) => {
  const { students, progress, attempts } = await classData(req.user._id);
  res.json(
    students.map((s) => {
      const myProg = progress.filter((p) => S(p.userId) === S(s._id));
      const myAtt = attempts.filter((a) => S(a.userId) === S(s._id));
      return {
        id: S(s._id),
        name: s.name,
        rollNo: s.rollNo,
        grade: s.grade,
        avatar: s.avatar,
        xp: s.xp,
        stars: s.stars,
        streakDays: s.streakDays,
        lastActiveDate: s.lastActiveDate,
        lessonsCompleted: myProg.filter((p) => p.completed).length,
        quizzesTaken: new Set(myAtt.map((a) => a.quizId)).size,
        avgPct: avg(myAtt.map(pctOf)),
      };
    })
  );
}));

// ----- lectures -----
router.get('/teacher/lessons', ...TEACHER, ah(async (req, res) => {
  const { students, progress } = await classData(req.user._id);
  const lessons = await Lesson.find(visible(req.user._id)).lean();
  const rows = lessons.map((l) => {
    const done = progress.filter((p) => p.lessonId === l.lessonId && p.completed).map((p) => S(p.userId));
    return {
      id: l.lessonId,
      title: l.title,
      subject: l.subject,
      gradeBand: l.gradeBand,
      description: l.description,
      xpReward: l.xpReward,
      slidesCount: (l.slides || []).length,
      own: !!l.teacherId && S(l.teacherId) === S(req.user._id),
      createdAt: l.createdAt,
      completedCount: done.length,
      totalStudents: students.length,
      completedBy: students.filter((s) => done.includes(S(s._id))).map((s) => s.name),
      pendingBy: students.filter((s) => !done.includes(S(s._id))).map((s) => s.name),
    };
  });
  rows.sort((a, b) => Number(b.own) - Number(a.own) || new Date(b.createdAt) - new Date(a.createdAt));
  res.json(rows);
}));

router.post('/teacher/lessons', ...TEACHER, ah(async (req, res) => {
  const b = req.body || {};
  const title = String(b.title || '').trim();
  if (!title) return res.status(400).json({ error: 'Lecture title is required' });

  const slides = (Array.isArray(b.slides) ? b.slides : [])
    .map((s) => ({
      title: String(s.title || '').trim(),
      text: String(s.text || '').trim(),
      keyPoint: s.keyPoint ? String(s.keyPoint).trim() : undefined,
    }))
    .filter((s) => s.title && s.text);
  if (!slides.length) return res.status(400).json({ error: 'Add at least one slide with a title and text' });

  const gradeBand = b.gradeBand === 'secondary' ? 'secondary' : 'primary';
  const doc = {
    lessonId: newId('tl'),
    teacherId: req.user._id,
    title,
    subject: String(b.subject || 'General').trim() || 'General',
    gradeBand,
    minGrade: gradeBand === 'primary' ? 1 : 6,
    maxGrade: gradeBand === 'primary' ? 5 : 10,
    description: String(b.description || '').trim(),
    readTimeMin: clamp(Number(b.readTimeMin) || 5, 1, 120),
    sizeKb: Math.max(8, Math.round(JSON.stringify(slides).length / 1024) + 8),
    xpReward: clamp(Number(b.xpReward) || 20, 0, 200),
    thumbnailIcon: String(b.thumbnailIcon || '📘').slice(0, 4),
    slides,
  };
  const act = b.activity;
  if (act && String(act.title || '').trim()) {
    doc.practicalActivity = {
      title: String(act.title).trim(),
      instructions: (Array.isArray(act.instructions) ? act.instructions : [])
        .map((x) => String(x).trim())
        .filter(Boolean),
      villageContext: String(act.villageContext || '').trim(),
    };
  }
  const lesson = await Lesson.create(doc);
  res.status(201).json({ id: lesson.lessonId });
}));

router.delete('/teacher/lessons/:lessonId', ...TEACHER, ah(async (req, res) => {
  const gone = await Lesson.findOneAndDelete({ lessonId: req.params.lessonId, teacherId: req.user._id });
  if (!gone) return res.status(404).json({ error: 'Lecture not found (you can only delete your own)' });
  await LessonProgress.deleteMany({ lessonId: req.params.lessonId });
  res.json({ ok: true });
}));

// ----- quizzes -----
router.get('/teacher/quizzes', ...TEACHER, ah(async (req, res) => {
  const { students, attempts } = await classData(req.user._id);
  const quizzes = await Quiz.find(visible(req.user._id)).lean();
  const rows = quizzes.map((q) => {
    const att = attempts.filter((a) => a.quizId === q.quizId);
    return {
      id: q.quizId,
      title: q.title,
      subject: q.subject,
      gradeBand: q.gradeBand,
      questionCount: (q.questions || []).length,
      xpReward: q.xpReward,
      own: !!q.teacherId && S(q.teacherId) === S(req.user._id),
      createdAt: q.createdAt,
      attempts: att.length,
      studentsAttempted: new Set(att.map((a) => S(a.userId))).size,
      totalStudents: students.length,
      avgPct: avg(att.map(pctOf)),
    };
  });
  rows.sort((a, b) => Number(b.own) - Number(a.own) || new Date(b.createdAt) - new Date(a.createdAt));
  res.json(rows);
}));

router.post('/teacher/quizzes', ...TEACHER, ah(async (req, res) => {
  const b = req.body || {};
  const title = String(b.title || '').trim();
  if (!title) return res.status(400).json({ error: 'Quiz title is required' });

  const quizId = newId('tq');
  const questions = [];
  const input = Array.isArray(b.questions) ? b.questions : [];
  for (let i = 0; i < input.length; i++) {
    const q = input[i];
    const options = (Array.isArray(q.options) ? q.options : []).map((o) => String(o).trim());
    const n = i + 1;
    if (!String(q.question || '').trim()) return res.status(400).json({ error: `Question ${n}: text is required` });
    if (options.length < 2 || options.some((o) => !o)) {
      return res.status(400).json({ error: `Question ${n}: give at least 2 non-empty options` });
    }
    const ci = Number(q.correctIndex);
    if (!Number.isInteger(ci) || ci < 0 || ci >= options.length) {
      return res.status(400).json({ error: `Question ${n}: choose the correct option` });
    }
    questions.push({
      id: `${quizId}-q${n}`,
      question: String(q.question).trim(),
      options,
      correctIndex: ci,
      explanation: String(q.explanation || '').trim() || 'Correct answer selected by your teacher.',
      hint: q.hint ? String(q.hint).trim() : undefined,
    });
  }
  if (!questions.length) return res.status(400).json({ error: 'Add at least one question' });

  const quiz = await Quiz.create({
    quizId,
    teacherId: req.user._id,
    title,
    subject: String(b.subject || 'General').trim() || 'General',
    gradeBand: b.gradeBand === 'secondary' ? 'secondary' : 'primary',
    xpReward: clamp(Number(b.xpReward) || 30, 0, 200),
    durationMin: clamp(Number(b.durationMin) || 5, 1, 120),
    questions,
  });
  res.status(201).json({ id: quiz.quizId });
}));

router.delete('/teacher/quizzes/:quizId', ...TEACHER, ah(async (req, res) => {
  const gone = await Quiz.findOneAndDelete({ quizId: req.params.quizId, teacherId: req.user._id });
  if (!gone) return res.status(404).json({ error: 'Quiz not found (you can only delete your own)' });
  await QuizAttempt.deleteMany({ quizId: req.params.quizId });
  res.json({ ok: true });
}));

// scores of every student for one quiz (for evaluating)
router.get('/teacher/quizzes/:quizId/results', ...TEACHER, ah(async (req, res) => {
  const quiz = await Quiz.findOne({ quizId: req.params.quizId, ...visible(req.user._id) }).lean();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const students = await User.find({ role: 'student', teacherId: req.user._id }).lean();
  const byId = new Map(students.map((s) => [S(s._id), s]));
  const attempts = await QuizAttempt.find({
    quizId: quiz.quizId,
    userId: { $in: students.map((s) => s._id) },
  })
    .sort({ createdAt: -1 })
    .lean();

  const attempted = new Set(attempts.map((a) => S(a.userId)));
  res.json({
    quiz: {
      id: quiz.quizId,
      title: quiz.title,
      subject: quiz.subject,
      questions: (quiz.questions || []).map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    },
    rows: attempts.map((a) => {
      const s = byId.get(S(a.userId));
      return {
        attemptId: S(a._id),
        student: { id: S(a.userId), name: s?.name || 'Unknown', rollNo: s?.rollNo || '' },
        score: a.score,
        total: a.total,
        finalScore: finalScore(a),
        pct: pctOf(a),
        evaluated: !!a.evaluated,
        remarks: a.remarks || '',
        answers: a.answers || [],
        date: a.createdAt,
      };
    }),
    notAttempted: students.filter((s) => !attempted.has(S(s._id))).map((s) => s.name),
  });
}));

// teacher evaluates one attempt: final marks + remarks
router.patch('/teacher/attempts/:attemptId/evaluate', ...TEACHER, ah(async (req, res) => {
  const attempt = await QuizAttempt.findById(req.params.attemptId);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  const student = await User.findById(attempt.userId).lean();
  if (!student || S(student.teacherId) !== S(req.user._id)) {
    return res.status(403).json({ error: 'This student is not in your class' });
  }
  const marks = Number(req.body.teacherScore);
  if (!Number.isFinite(marks) || marks < 0 || marks > attempt.total) {
    return res.status(400).json({ error: `Marks must be between 0 and ${attempt.total}` });
  }
  attempt.teacherScore = marks;
  attempt.remarks = String(req.body.remarks || '').trim().slice(0, 500);
  attempt.evaluated = true;
  await attempt.save();
  res.json({ ok: true, finalScore: marks, pct: pctOf(attempt) });
}));

// ----- notices -----
router.post('/teacher/notices', ...TEACHER, ah(async (req, res) => {
  const title = String(req.body.title || '').trim();
  const text = String(req.body.text || '').trim();
  if (!title || !text) return res.status(400).json({ error: 'Title and message are required' });
  const n = await Announcement.create({ teacherId: req.user._id, title, text: text.slice(0, 2000) });
  res.status(201).json({ id: S(n._id) });
}));

router.delete('/teacher/notices/:id', ...TEACHER, ah(async (req, res) => {
  const gone = await Announcement.findOneAndDelete({ _id: req.params.id, teacherId: req.user._id });
  if (!gone) return res.status(404).json({ error: 'Notice not found' });
  res.json({ ok: true });
}));

// =====================================================
// PARENT
// =====================================================
const briefOf = (c) => ({ id: S(c._id), name: c.name, rollNo: c.rollNo, grade: c.grade, avatar: c.avatar });

async function childrenOf(parent) {
  const ids = parent.childIds || [];
  const kids = await User.find({ _id: { $in: ids } }).sort({ name: 1 }).lean();
  return kids.map(briefOf);
}

router.get('/parent/children', ...PARENT, ah(async (req, res) => {
  res.json(await childrenOf(req.user));
}));

router.post('/parent/link', ...PARENT, ah(async (req, res) => {
  const parentCode = req.body.parentCode || req.body.code;
  const rollNo = req.body.rollNo;
  const child = await findChild(rollNo, parentCode);
  if (!child) return res.status(404).json({ error: 'No student found with this Parent Code. Please verify the code.' });

  if (!Array.isArray(req.user.childIds)) req.user.childIds = [];
  if (!req.user.childIds.some((id) => S(id) === S(child._id))) {
    req.user.childIds.push(child._id);
    await req.user.save();
  }
  res.json(await childrenOf(req.user));
}));
    


// the full report of one child
router.get('/parent/children/:id/report', ...PARENT, ah(async (req, res) => {
  if (!req.user.childIds.some((id) => S(id) === req.params.id)) {
    return res.status(403).json({ error: 'This child is not linked to your account' });
  }
  const child = await User.findById(req.params.id).lean();
  if (!child) return res.status(404).json({ error: 'Child not found' });

  const teacher = child.teacherId
    ? await User.findById(child.teacherId).select('name schoolHub').lean()
    : null;
  const band = child.grade <= 5 ? 'primary' : 'secondary';
  const vis = visible(child.teacherId || null);

  const [lessons, quizzes, progress, attempts, notices] = await Promise.all([
    Lesson.find({ ...vis, gradeBand: band }).lean(),
    Quiz.find({ ...vis, gradeBand: band }).lean(),
    LessonProgress.find({ userId: child._id }).lean(),
    QuizAttempt.find({ userId: child._id }).sort({ createdAt: -1 }).lean(),
    child.teacherId
      ? Announcement.find({ teacherId: child.teacherId }).sort({ createdAt: -1 }).limit(10).lean()
      : [],
  ]);

  const quizById = new Map(quizzes.map((q) => [q.quizId, q]));
  // attempts may belong to quizzes from another band; look those up too
  const missing = [...new Set(attempts.map((a) => a.quizId))].filter((id) => !quizById.has(id));
  if (missing.length) {
    const extra = await Quiz.find({ quizId: { $in: missing } }).lean();
    extra.forEach((q) => quizById.set(q.quizId, q));
  }

  const lessonRows = lessons.map((l) => {
    const p = progress.find((x) => x.lessonId === l.lessonId);
    const status = p?.completed ? 'completed' : p && p.slidesDone > 0 ? 'in-progress' : 'not-started';
    return {
      id: l.lessonId,
      title: l.title,
      subject: l.subject,
      status,
      slidesDone: p?.slidesDone || 0,
      totalSlides: (l.slides || []).length,
      date: p?.updatedAt || null,
    };
  });

  const quizRows = attempts.map((a) => {
    const q = quizById.get(a.quizId);
    return {
      attemptId: S(a._id),
      quizTitle: q?.title || 'Quiz',
      subject: q?.subject || 'General',
      score: a.score,
      total: a.total,
      finalScore: finalScore(a),
      pct: pctOf(a),
      evaluated: !!a.evaluated,
      remarks: a.remarks || '',
      date: a.createdAt,
    };
  });

  const subjects = [...new Set([...lessonRows.map((l) => l.subject), ...quizRows.map((q) => q.subject)])].map(
    (subject) => {
      const ls = lessonRows.filter((l) => l.subject === subject);
      return {
        subject,
        lessonsCompleted: ls.filter((l) => l.status === 'completed').length,
        lessonsTotal: ls.length,
        avgPct: avg(quizRows.filter((q) => q.subject === subject).map((q) => q.pct)),
      };
    }
  );
  const performanceHistory = attempts
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((a) => {
      const q = quizById.get(a.quizId);
      return {
        label: q?.title || 'Test',
        date: new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        score: a.score,
        total: a.total,
        pct: pctOf(a),
        subject: q?.subject || 'General',
      };
    });

  const pcts = quizRows.map((q) => q.pct);

  res.json({
    child: {
      ...briefOf(child),
      schoolHub: child.schoolHub,
      stateBoard: child.stateBoard,
      xp: child.xp,
      stars: child.stars,
      streakDays: child.streakDays,
      lastActiveDate: child.lastActiveDate,
      teacherName: teacher?.name || null,
      classCode: teacher?.classCode || null,
    },
    summary: {
      lessonsCompleted: lessonRows.filter((l) => l.status === 'completed').length,
      lessonsTotal: lessonRows.length,
      quizzesTaken: new Set(attempts.map((a) => a.quizId)).size,
      quizzesAvailable: quizzes.length,
      attempts: attempts.length,
      avgPct: avg(pcts),
      bestPct: pcts.length ? Math.max(...pcts) : null,
    },
    subjects,
    lessons: lessonRows,
    quizzes: quizRows,
    performanceHistory,
    notices: notices.map((n) => ({
      id: S(n._id),
      title: n.title,
      text: n.text,
      teacher: teacher?.name || '',
      createdAt: n.createdAt,
    })),
    generatedAt: new Date().toISOString(),
  });
}));

export default router;