import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true, lowercase: true }, // login ID
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'parent'], default: 'student' },
    grade: { type: Number, min: 1, max: 10, default: 4 },
    stateBoard: { type: String, default: '' },
    schoolHub: { type: String, default: '' },
    avatar: { type: String, default: '🦁' },
    language: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
    xp: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: '' }, // YYYY-MM-DD

    // teacher only: students use this code to join the class
    classCode: { type: String, unique: true, sparse: true, uppercase: true },
    // student only: which teacher's class they belong to
    teacherId: { type: ObjectId, ref: 'User', default: null },
    // student only: parent uses (rollNo + parentCode) to link to this child
    parentCode: { type: String, unique: true, sparse: true, uppercase: true },
    // parent only: linked children
    childIds: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// strict:false so every field from mockData (slides, practicalActivity...) is kept
// teacherId = null  -> built-in content for everyone
// teacherId = <id>  -> created by that teacher, visible to that teacher's students
const lessonSchema = new Schema(
  {
    lessonId: { type: String, required: true, unique: true },
    teacherId: { type: ObjectId, ref: 'User', default: null, index: true },
  },
  { strict: false, timestamps: true }
);

const quizSchema = new Schema(
  {
    quizId: { type: String, required: true, unique: true },
    teacherId: { type: ObjectId, ref: 'User', default: null, index: true },
  },
  { strict: false, timestamps: true }
);

const quizAttemptSchema = new Schema(
  {
    userId: { type: ObjectId, ref: 'User', required: true, index: true },
    quizId: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    answers: [Number],
    timeTakenSec: Number,
    clientId: { type: String, index: true }, // for offline sync (no duplicates)
    // teacher evaluation
    teacherScore: Number,
    remarks: { type: String, default: '' },
    evaluated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const lessonProgressSchema = new Schema(
  {
    userId: { type: ObjectId, ref: 'User', required: true },
    lessonId: { type: String, required: true },
    slidesDone: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const announcementSchema = new Schema(
  {
    teacherId: { type: ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const User = model('User', userSchema);
export const Lesson = model('Lesson', lessonSchema);
export const Quiz = model('Quiz', quizSchema);
export const QuizAttempt = model('QuizAttempt', quizAttemptSchema);
export const LessonProgress = model('LessonProgress', lessonProgressSchema);
export const Announcement = model('Announcement', announcementSchema);