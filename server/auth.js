import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from './models.js';

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Shape sent to the frontend (matches your UserProfile type, no password)
export function toProfile(u) {
  return {
    id: String(u._id),
    name: u.name,
    rollNo: u.rollNo,
    grade: u.grade,
    role: u.role,
    schoolHub: u.schoolHub,
    stateBoard: u.stateBoard,
    avatar: u.avatar,
    language: u.language,
    xp: u.xp,
    streakDays: u.streakDays,
    stars: u.stars,
    classCode: u.classCode || undefined, // teacher
    parentCode: u.parentCode || undefined, // student
    hasTeacher: !!u.teacherId, // student
  };
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Not logged in' });
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : res.status(403).json({ error: 'This is not allowed for your account type' });
}

// Study streak: +1 if last active yesterday, keep if today, else reset to 1
export function touchStreak(user) {
  const today = new Date().toISOString().slice(0, 10);
  if (user.lastActiveDate === today) return;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  user.streakDays = user.lastActiveDate === y ? user.streakDays + 1 : 1;
  user.lastActiveDate = today;
}

// 6-character codes without confusing letters (no 0/O, 1/I)
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export async function uniqueCode(field) {
  for (let i = 0; i < 20; i++) {
    let code = '';
    for (let j = 0; j < 6; j++) code += ALPHABET[crypto.randomInt(ALPHABET.length)];
    if (!(await User.exists({ [field]: code }))) return code;
  }
  throw new Error('Could not generate a unique code');
}

// Parent links to a child using the child's roll number + the child's parent code
// Parent links to a child using unique parent code (or roll number + parent code)
export function findChild(rollNo, parentCode) {
  const query = { role: 'student' };
  if (parentCode) query.parentCode = String(parentCode).toUpperCase().trim();
  if (rollNo) query.rollNo = String(rollNo).toLowerCase().trim();
  return User.findOne(query);
}