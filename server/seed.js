import './env.js';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { Lesson, Quiz } from './models.js';
import { mockLessons, mockQuizzes } from '../src/data/mockData.ts';

await connectDB();

await Lesson.deleteMany({});
await Quiz.deleteMany({});

// isDownloaded is a per-device flag, so it is not stored on the server
await Lesson.insertMany(
  mockLessons.map(({ id, isDownloaded, ...rest }) => ({ lessonId: id, ...rest }))
);
await Quiz.insertMany(mockQuizzes.map(({ id, ...rest }) => ({ quizId: id, ...rest })));

console.log(`🌱 Seeded ${mockLessons.length} lessons and ${mockQuizzes.length} quizzes`);
await mongoose.disconnect();
