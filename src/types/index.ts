export type GradeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type ThemeMode = 'primary' | 'secondary';

export interface UserProfile {
  id: string;
  name: string;
  grade: GradeNumber;
  role: 'student' | 'teacher' | 'parent';
  schoolHub: string;
  avatar: string;
  language: 'en' | 'hi' | 'mr';
  xp: number;
  streakDays: number;
  stars: number;
  rollNo?: string;
  classCode?: string;
  parentCode?: string;
  hasTeacher?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  gradeBand: 'primary' | 'secondary';
  minGrade: number;
  maxGrade: number;
  description: string;
  readTimeMin: number;
  isDownloaded: boolean;
  sizeKb: number;
  xpReward: number;
  thumbnailIcon: string;
  slides: {
    title: string;
    text: string;
    keyPoint?: string;
    illustrationConcept?: string;
  }[];
  practicalActivity?: {
    title: string;
    instructions: string[];
    villageContext: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  gradeBand: 'primary' | 'secondary';
  xpReward: number;
  durationMin: number;
  questions: QuizQuestion[];
}

export interface SyncQueueItem {
  id: string;
  type: 'quiz_submission' | 'lesson_progress' | 'assignment_draft';
  title: string;
  timestamp: string;
  sizeKb: number;
  status: 'pending' | 'syncing' | 'synced';
}

export interface HubStatus {
  hubName: string;
  isOnline: boolean;
  lastSyncTime: string;
  signalStrength: 'strong' | 'moderate' | 'weak' | 'offline';
  pendingQueueCount: number;
  cachedContentCount: number;
}
