import type { UserProfile } from './types';

// ---------- token storage ----------
const TOKEN_KEY = 'rc_token';
export const getToken = (): string | null => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t: string) => {
  try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
};
export const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Is "npm run server" running?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

// ---------- types ----------
export interface AuthResult { token: string; profile: UserProfile }

export interface TeacherClass {
  id: string;
  name: string;
  grade: number;
  subject: string;
  classCode: string;
  studentCount: number;
  materialsCount: number;
  quizzesCount: number;
  description?: string;
}

export interface StudentRow {
  id: string;
  name: string;
  rollNo: string;
  grade: number;
  avatar: string;
  xp: number;
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  lessonsCompleted: number;
  quizzesTaken: number;
  avgPct: number | null;
  classCode?: string;
  completedActivities?: string[];
  recentQuizScores?: { quizTitle: string; score: number; total: number; pct: number; date: string }[];
}

export interface LectureRow {
  id: string;
  title: string;
  subject: string;
  gradeBand: string;
  description: string;
  xpReward: number;
  slidesCount: number;
  own: boolean;
  completedCount: number;
  totalStudents: number;
  completedBy: string[];
  pendingBy: string[];
  classCode?: string;
}

export interface QuizRow {
  id: string;
  title: string;
  subject: string;
  gradeBand: string;
  questionCount: number;
  xpReward: number;
  own: boolean;
  attempts: number;
  studentsAttempted: number;
  totalStudents: number;
  avgPct: number | null;
  classCode?: string;
}

export interface QuizResultRow {
  attemptId: string;
  student: { id: string; name: string; rollNo: string };
  score: number;
  total: number;
  finalScore: number;
  pct: number;
  evaluated: boolean;
  remarks: string;
  answers: number[];
  date: string;
}

export interface QuizResults {
  quiz: {
    id: string;
    title: string;
    subject: string;
    questions: { id: string; question: string; options: string[]; correctIndex: number }[];
  };
  rows: QuizResultRow[];
  notAttempted: string[];
}

export interface NoticeRow {
  id: string;
  title: string;
  text: string;
  teacher: string;
  createdAt: string;
  classCode?: string;
}

export interface ChildBrief {
  id: string;
  name: string;
  rollNo: string;
  grade: number;
  avatar: string;
  parentCode?: string;
}

export interface ChildReport {
  child: ChildBrief & {
    schoolHub: string;
    stateBoard: string;
    xp: number;
    stars: number;
    streakDays: number;
    lastActiveDate: string;
    teacherName: string | null;
    classCode?: string;
  };
  summary: {
    lessonsCompleted: number;
    lessonsTotal: number;
    quizzesTaken: number;
    quizzesAvailable: number;
    attempts: number;
    avgPct: number | null;
    bestPct: number | null;
  };
  subjects: { subject: string; lessonsCompleted: number; lessonsTotal: number; avgPct: number | null }[];
  lessons: {
    id: string;
    title: string;
    subject: string;
    status: 'completed' | 'in-progress' | 'not-started';
    slidesDone: number;
    totalSlides: number;
    date: string | null;
    practicalActivityTitle?: string;
  }[];
  quizzes: {
    attemptId: string;
    quizTitle: string;
    subject: string;
    score: number;
    total: number;
    finalScore: number;
    pct: number;
    evaluated: boolean;
    remarks: string;
    date: string;
  }[];
  performanceHistory: { label: string; date: string; score: number; total: number; pct: number; subject: string }[];
  notices: NoticeRow[];
  generatedAt: string;
}

export interface NewLecture {
  title: string;
  subject: string;
  gradeBand: 'primary' | 'secondary';
  description: string;
  readTimeMin: number;
  xpReward: number;
  classCode?: string;
  slides: { title: string; text: string; keyPoint?: string }[];
  activity?: { title: string; instructions: string[]; villageContext: string };
}

export interface NewQuiz {
  title: string;
  subject: string;
  gradeBand: 'primary' | 'secondary';
  xpReward: number;
  durationMin: number;
  classCode?: string;
  questions: { question: string; options: string[]; correctIndex: number; explanation: string; hint?: string }[];
}

export interface RegisterInput {
  role: 'student' | 'teacher' | 'parent';
  name: string;
  rollNo: string;
  password: string;
  grade?: number;
  stateBoard?: string;
  schoolHub?: string;
  avatar?: string;
  language?: string;
  classCode?: string;
  childRollNo?: string;
  parentCode?: string;
}

// ---------- calls ----------
export const api = {
  register: (b: RegisterInput) => request<AuthResult>('/auth/register', 'POST', b),
  login: (rollNo: string, password: string) => request<AuthResult>('/auth/login', 'POST', { rollNo, password }),
  me: () => request<{ profile: UserProfile }>('/auth/me'),

  // student side
  getLessons: () => request<any[]>('/lessons'),
  getQuizzes: () => request<any[]>('/quizzes'),
  saveProgress: (lessonId: string, slidesDone: number, completed: boolean) =>
    request<{ profile: UserProfile }>('/progress', 'POST', { lessonId, slidesDone, completed }),
  saveQuizAttempt: (quizId: string, score: number, total: number, answers: number[]) =>
    request<{ profile: UserProfile }>(`/quizzes/${quizId}/attempt`, 'POST', { score, total, answers }),
  joinClass: (classCode: string) => request<{ profile: UserProfile }>('/student/join', 'POST', { classCode }),
  notices: () => request<NoticeRow[]>('/notices'),

  teacher: {
    classes: () => request<TeacherClass[]>('/teacher/classes'),
    students: (classCode?: string) =>
      request<StudentRow[]>(`/teacher/students${classCode ? `?classCode=${classCode}` : ''}`),
    lectures: (classCode?: string) =>
      request<LectureRow[]>(`/teacher/lessons${classCode ? `?classCode=${classCode}` : ''}`),
    createLecture: (b: NewLecture) => request<{ id: string }>('/teacher/lessons', 'POST', b),
    deleteLecture: (id: string) => request<{ ok: true }>(`/teacher/lessons/${id}`, 'DELETE'),
    quizzes: (classCode?: string) =>
      request<QuizRow[]>(`/teacher/quizzes${classCode ? `?classCode=${classCode}` : ''}`),
    createQuiz: (b: NewQuiz) => request<{ id: string }>('/teacher/quizzes', 'POST', b),
    deleteQuiz: (id: string) => request<{ ok: true }>(`/teacher/quizzes/${id}`, 'DELETE'),
    quizResults: (id: string) => request<QuizResults>(`/teacher/quizzes/${id}/results`),
    evaluate: (attemptId: string, teacherScore: number, remarks: string) =>
      request<{ ok: true }>(`/teacher/attempts/${attemptId}/evaluate`, 'PATCH', { teacherScore, remarks }),
    createNotice: (title: string, text: string, classCode?: string) =>
      request<{ id: string }>('/teacher/notices', 'POST', { title, text, classCode }),
    deleteNotice: (id: string) => request<{ ok: true }>(`/teacher/notices/${id}`, 'DELETE'),
  },

  parent: {
    children: () => request<ChildBrief[]>('/parent/children'),
    link: (rollNo: string, parentCode: string) =>
      request<ChildBrief[]>('/parent/link', 'POST', { rollNo, parentCode }),
    linkByCode: (parentCode: string) =>
      request<ChildBrief[]>('/parent/link-by-code', 'POST', { parentCode }),
    report: (childId: string) => request<ChildReport>(`/parent/children/${childId}/report`),
  },
};