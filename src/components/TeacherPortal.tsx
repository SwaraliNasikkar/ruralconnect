import React, { useState } from 'react';
import {
  BookOpen, Award, Megaphone, Users, Plus, Trash2, Copy, Check,
  ChevronRight, ArrowLeft, FileText, CheckCircle2, Clock, Sparkles, X, Eye
} from 'lucide-react';
import { api, NewLecture, NewQuiz, QuizResults, TeacherClass, StudentRow, LectureRow, QuizRow } from '../api';
import { ThemeMode, UserProfile } from '../types';
import { ErrorBox, Empty, Loading, ProgressBar, Stat, Ui, fmtDate, getUi, pctColor, useLoad } from './portalUi';

interface Props {
  themeMode: ThemeMode;
  userProfile: UserProfile;
}

type ClassSubTab = 'students' | 'lectures' | 'quizzes' | 'notices';

export const TeacherPortal: React.FC<Props> = ({ themeMode, userProfile }) => {
  const ui = getUi(themeMode);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);

  // Fallback default assigned classes (if database not yet seeded)
  const defaultClasses: TeacherClass[] = [
    {
      id: 'cls-1',
      name: 'Class 4 - Environmental Studies & Science',
      grade: 4,
      subject: 'Science & EVS',
      classCode: userProfile.classCode || 'RC-4SCI',
      studentCount: 8,
      materialsCount: 4,
      quizzesCount: 3,
      description: 'Primary exploration of nature, plants, water cycle, and simple machines.'
    },
    {
      id: 'cls-2',
      name: 'Class 5 - Mathematics & Logic',
      grade: 5,
      subject: 'Mathematics',
      classCode: 'RC-5MTH',
      studentCount: 6,
      materialsCount: 3,
      quizzesCount: 2,
      description: 'Fractions, unit conversions, rural market maths, and geometry basics.'
    },
    {
      id: 'cls-3',
      name: 'Class 7 - Secondary STEM Lab',
      grade: 7,
      subject: 'STEM & Physics',
      classCode: 'RC-7STM',
      studentCount: 5,
      materialsCount: 2,
      quizzesCount: 2,
      description: 'Renewable solar energy, circuits, ecosystem dynamics, and experiments.'
    }
  ];

  // Try to load teacher's assigned classes from API, fallback to defaultClasses
  const { data: remoteClasses, loading } = useLoad(async () => {
    try {
      const res = await api.teacher.classes();
      return res && res.length > 0 ? res : defaultClasses;
    } catch {
      return defaultClasses;
    }
  });

  const classes = remoteClasses || defaultClasses;

  return (
    <div className={`space-y-6 ${ui.text}`}>
      {/* If a class is selected, show that classroom's workspace */}
      {selectedClass ? (
        <ClassroomView
          cls={selectedClass}
          ui={ui}
          themeMode={themeMode}
          userProfile={userProfile}
          onBack={() => setSelectedClass(null)}
        />
      ) : (
        /* Otherwise, show the Assigned Classes Dashboard */
        <AssignedClassesDashboard
          classes={classes}
          loading={loading}
          ui={ui}
          userProfile={userProfile}
          onSelectClass={(cls) => setSelectedClass(cls)}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 1. ASSIGNED CLASSES OVERVIEW                                       */
/* ------------------------------------------------------------------ */
interface AssignedClassesProps {
  classes: TeacherClass[];
  loading: boolean;
  ui: Ui;
  userProfile: UserProfile;
  onSelectClass: (cls: TeacherClass) => void;
}

const AssignedClassesDashboard: React.FC<AssignedClassesProps> = ({
  classes,
  loading,
  ui,
  userProfile,
  onSelectClass,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className={`p-5 sm:p-6 ${ui.card} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-700">
            Teacher Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">👩‍🏫 Welcome, {userProfile.name}</h1>
          <p className={`text-sm mt-0.5 ${ui.sub}`}>
            {userProfile.schoolHub || 'Zilla Parishad School'} · State Board Hub
          </p>
        </div>
        <div className={`p-3.5 ${ui.soft} text-sm flex items-center gap-3`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl font-bold">
            📚
          </div>
          <div>
            <div className={`text-[11px] font-bold uppercase ${ui.sub}`}>Assigned Classes</div>
            <div className="text-lg font-black">{classes.length} Active Classrooms</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black">My Assigned Classes</h2>
            <p className={`text-xs ${ui.sub}`}>
              Select any class below to view registered students, track completed activities, and upload material.
            </p>
          </div>
        </div>

        {loading ? (
          <Loading ui={ui} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectClass(c)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                  ui.p
                    ? 'bg-white border-amber-200 hover:border-amber-400 shadow-[0_4px_0_0_#fcd34d] hover:-translate-y-1'
                    : 'bg-[#0B1329] border-slate-800 hover:border-teal-500/50 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                      Grade {c.grade}
                    </span>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">Code:</span>
                      <span className="font-mono text-xs font-black text-amber-950 tracking-wider">
                        {c.classCode}
                      </span>
                      <button
                        onClick={(e) => copyCode(c.classCode, e)}
                        className="hover:scale-110 transition-transform p-0.5"
                        title="Copy Class Code"
                      >
                        {copiedCode === c.classCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-black group-hover:text-amber-600 transition-colors">
                    {c.name}
                  </h3>
                  <p className={`text-xs mt-1.5 line-clamp-2 ${ui.sub}`}>
                    {c.description || `${c.subject} curriculum & practical activities.`}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-dashed border-amber-200/80">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                    <div className="p-1.5 rounded-xl bg-amber-50/50">
                      <div className="font-black text-sm">{c.studentCount}</div>
                      <div className={`text-[10px] ${ui.sub}`}>Students</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-amber-50/50">
                      <div className="font-black text-sm">{c.materialsCount}</div>
                      <div className={`text-[10px] ${ui.sub}`}>Articles</div>
                    </div>
                    <div className="p-1.5 rounded-xl bg-amber-50/50">
                      <div className="font-black text-sm">{c.quizzesCount}</div>
                      <div className={`text-[10px] ${ui.sub}`}>Tests</div>
                    </div>
                  </div>

                  <button className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 ${ui.btn}`}>
                    <span>Enter Classroom</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 2. SPECIFIC CLASSROOM WORKSPACE                                    */
/* ------------------------------------------------------------------ */
interface ClassroomViewProps {
  cls: TeacherClass;
  ui: Ui;
  themeMode: ThemeMode;
  userProfile: UserProfile;
  onBack: () => void;
}

const ClassroomView: React.FC<ClassroomViewProps> = ({
  cls,
  ui,
  themeMode,
  userProfile,
  onBack,
}) => {
  const [tab, setTab] = useState<ClassSubTab>('students');
  const [copied, setCopied] = useState(false);

  const tabs: { id: ClassSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'students', label: 'Registered Students & Activity', icon: <Users className="w-4 h-4" /> },
    { id: 'lectures', label: 'Upload Study Material', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quizzes', label: 'Upload Tests & Quizzes', icon: <Award className="w-4 h-4" /> },
    { id: 'notices', label: 'Class Notices', icon: <Megaphone className="w-4 h-4" /> },
  ];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(cls.classCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-5">
      {/* Classroom Header Bar */}
      <div className={`p-5 ${ui.card}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold ${ui.btnGhost}`}
              title="Back to Assigned Classes"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Classes</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-800">
                  Grade {cls.grade}
                </span>
                <span className={`text-xs ${ui.sub}`}>· {cls.subject}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">{cls.name}</h2>
            </div>
          </div>

          {/* Class Code Box */}
          <div className={`px-4 py-2.5 ${ui.soft} text-sm flex items-center gap-3`}>
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${ui.sub}`}>Class Code</div>
              <div className="font-mono text-xl font-black tracking-widest text-amber-950">
                {cls.classCode}
              </div>
            </div>
            <button
              onClick={copyCode}
              className={`p-2 rounded-xl text-xs font-bold border transition-colors ${ui.btnGhost}`}
              title="Copy Class Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
              tab === t.id ? ui.tabOn : ui.tabOff
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tab === 'students' && <StudentsTab cls={cls} ui={ui} />}
      {tab === 'lectures' && <LecturesTab cls={cls} ui={ui} themeMode={themeMode} />}
      {tab === 'quizzes' && <QuizzesTab cls={cls} ui={ui} />}
      {tab === 'notices' && <NoticesTab cls={cls} ui={ui} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* STUDENTS TAB: Students + Activities & Tests Completed               */
/* ------------------------------------------------------------------ */
const StudentsTab: React.FC<{ cls: TeacherClass; ui: Ui }> = ({ cls, ui }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  // Fallback realistic demo students for this class if server is offline
  const fallbackStudents: StudentRow[] = [
    {
      id: 'st-1',
      name: 'Aarav Deshmukh',
      rollNo: '2024-STD-42',
      grade: cls.grade,
      avatar: '🦁',
      xp: 450,
      stars: 18,
      streakDays: 6,
      lastActiveDate: new Date().toISOString(),
      lessonsCompleted: 3,
      quizzesTaken: 2,
      avgPct: 88,
      completedActivities: [
        'States of Matter: Kitchen Ice Melt Experiment',
        'Fractions Made Simple: Paper Chapati Folding',
        'Plant Life & Germination: Seed Sprouting Activity'
      ],
      recentQuizScores: [
        { quizTitle: 'Matter & Materials Quiz', score: 9, total: 10, pct: 90, date: 'Yesterday' },
        { quizTitle: 'Fractions Discovery Test', score: 8, total: 10, pct: 80, date: '3 days ago' },
      ]
    },
    {
      id: 'st-2',
      name: 'Pooja Patil',
      rollNo: '2024-STD-19',
      grade: cls.grade,
      avatar: '🦋',
      xp: 520,
      stars: 22,
      streakDays: 9,
      lastActiveDate: new Date().toISOString(),
      lessonsCompleted: 4,
      quizzesTaken: 3,
      avgPct: 92,
      completedActivities: [
        'States of Matter: Kitchen Ice Melt Experiment',
        'Fractions Made Simple: Paper Chapati Folding',
        'Solar Shadow Clock Practical',
        'Water Filtration with Clay & Sand'
      ],
      recentQuizScores: [
        { quizTitle: 'Matter & Materials Quiz', score: 10, total: 10, pct: 100, date: 'Today' },
        { quizTitle: 'Solar Shadows Test', score: 9, total: 10, pct: 90, date: '2 days ago' },
      ]
    },
    {
      id: 'st-3',
      name: 'Karan Shinde',
      rollNo: '2024-STD-31',
      grade: cls.grade,
      avatar: '🐼',
      xp: 290,
      stars: 12,
      streakDays: 3,
      lastActiveDate: new Date(Date.now() - 86400000).toISOString(),
      lessonsCompleted: 2,
      quizzesTaken: 1,
      avgPct: 70,
      completedActivities: [
        'States of Matter: Kitchen Ice Melt Experiment'
      ],
      recentQuizScores: [
        { quizTitle: 'Matter & Materials Quiz', score: 7, total: 10, pct: 70, date: 'Yesterday' }
      ]
    }
  ];

  const { data: remoteData, error, loading } = useLoad(async () => {
    try {
      const res = await api.teacher.students(cls.classCode);
      return res && res.length > 0 ? res : fallbackStudents;
    } catch {
      return fallbackStudents;
    }
  });

  const students = remoteData || fallbackStudents;

  return (
    <div className={`p-4 sm:p-6 ${ui.card}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black">Enrolled Students in {cls.name} ({students.length})</h3>
          <p className={`text-xs ${ui.sub}`}>
            Click any student to view the full breakdown of activities and tests completed.
          </p>
        </div>
      </div>

      <ErrorBox msg={error} />
      {loading && <Loading ui={ui} />}

      {students.length === 0 && (
        <Empty ui={ui}>
          No students registered in this class yet. Share class code <b>{cls.classCode}</b> with them!
        </Empty>
      )}

      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className={`text-left text-[11px] uppercase tracking-wider ${ui.sub}`}>
                <th className="py-2.5 pr-3">Student Name</th>
                <th className="py-2.5 pr-3">Roll Number</th>
                <th className="py-2.5 pr-3">Completed Activities</th>
                <th className="py-2.5 pr-3">Tests Taken</th>
                <th className="py-2.5 pr-3">Avg Score</th>
                <th className="py-2.5 pr-3">Streak</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className={`border-t ${ui.line} hover:bg-amber-50/40 transition-colors`}>
                  <td className="py-3 pr-3 font-bold flex items-center gap-2">
                    <span className="text-xl">{s.avatar}</span>
                    <span>{s.name}</span>
                  </td>
                  <td className="pr-3 text-xs font-mono">{s.rollNo}</td>
                  <td className="pr-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 font-bold text-xs">
                      {s.lessonsCompleted} Completed
                    </span>
                  </td>
                  <td className="pr-3">
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-700 font-bold text-xs">
                      {s.quizzesTaken} Tests
                    </span>
                  </td>
                  <td className={`pr-3 font-black ${pctColor(s.avgPct)}`}>
                    {s.avgPct === null ? '—' : `${s.avgPct}%`}
                  </td>
                  <td className="pr-3 font-semibold text-xs">
                    {s.streakDays} days 🔥
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ml-auto ${ui.btnGhost}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Progress</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Activity Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-lg p-6 rounded-3xl ${ui.card} space-y-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between border-b pb-3 border-amber-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedStudent.avatar}</span>
                <div>
                  <h4 className="text-lg font-black">{selectedStudent.name}</h4>
                  <div className={`text-xs ${ui.sub}`}>Roll: {selectedStudent.rollNo} · Grade {selectedStudent.grade}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`p-2.5 rounded-xl ${ui.soft}`}>
                <div className="text-xs font-bold text-slate-500">Activities</div>
                <div className="text-base font-black text-emerald-600">{selectedStudent.lessonsCompleted} Done</div>
              </div>
              <div className={`p-2.5 rounded-xl ${ui.soft}`}>
                <div className="text-xs font-bold text-slate-500">Tests Taken</div>
                <div className="text-base font-black text-sky-600">{selectedStudent.quizzesTaken} Tests</div>
              </div>
              <div className={`p-2.5 rounded-xl ${ui.soft}`}>
                <div className="text-xs font-bold text-slate-500">Avg Score</div>
                <div className={`text-base font-black ${pctColor(selectedStudent.avgPct)}`}>
                  {selectedStudent.avgPct}%
                </div>
              </div>
            </div>

            {/* Completed Activities List */}
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Completed Practical Activities & Articles:
              </h5>
              <div className="space-y-1.5">
                {(selectedStudent.completedActivities || [
                  'States of Matter: Kitchen Ice Melt Experiment',
                  'Fractions Made Simple: Paper Chapati Folding'
                ]).map((act, i) => (
                  <div key={i} className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tests & Marks List */}
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Test Attempts & Marks:
              </h5>
              <div className="space-y-1.5">
                {(selectedStudent.recentQuizScores || [
                  { quizTitle: 'Matter & Materials Quiz', score: 9, total: 10, pct: 90, date: 'Yesterday' }
                ]).map((qz, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{qz.quizTitle}</div>
                      <div className="text-[10px] text-slate-500">{qz.date}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-amber-700">{qz.score}/{qz.total}</span>
                      <span className={`ml-2 font-bold ${pctColor(qz.pct)}`}>({qz.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold ${ui.btn}`}
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* STUDY MATERIALS UPLOAD TAB (Articles & Practical Experiments)       */
/* ------------------------------------------------------------------ */
const emptySlide = () => ({ title: '', text: '', keyPoint: '' });

const LecturesTab: React.FC<{ cls: TeacherClass; ui: Ui; themeMode: ThemeMode }> = ({ cls, ui }) => {
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(cls.subject);
  const [description, setDescription] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [xp, setXp] = useState(30);
  const [slides, setSlides] = useState([emptySlide()]);
  const [actTitle, setActTitle] = useState('');
  const [actSteps, setActSteps] = useState('');
  const [actContext, setActContext] = useState('');

  // Fallback demo lectures for this class
  const fallbackLectures: LectureRow[] = [
    {
      id: 'lec-1',
      title: 'Water Cycle in Our Village',
      subject: cls.subject,
      gradeBand: cls.grade <= 5 ? 'primary' : 'secondary',
      description: 'Understanding evaporation from village wells, condensation into clouds, and rainfall.',
      xpReward: 35,
      slidesCount: 3,
      own: true,
      completedCount: 6,
      totalStudents: cls.studentCount,
      completedBy: ['Aarav Deshmukh', 'Pooja Patil'],
      pendingBy: ['Karan Shinde'],
    },
    {
      id: 'lec-2',
      title: 'Seeds, Soil and Germination',
      subject: cls.subject,
      gradeBand: cls.grade <= 5 ? 'primary' : 'secondary',
      description: 'How a tiny gram seed sprouts roots and shoots using soil nutrients and sunlight.',
      xpReward: 30,
      slidesCount: 3,
      own: true,
      completedCount: 4,
      totalStudents: cls.studentCount,
      completedBy: ['Pooja Patil'],
      pendingBy: ['Aarav Deshmukh', 'Karan Shinde'],
    }
  ];

  const { data: remoteData, reload } = useLoad(async () => {
    try {
      const res = await api.teacher.lectures(cls.classCode);
      return res && res.length > 0 ? res : fallbackLectures;
    } catch {
      return fallbackLectures;
    }
  });

  const lectures = remoteData || fallbackLectures;

  const updateSlide = (i: number, patch: Partial<ReturnType<typeof emptySlide>>) =>
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const submitLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);

    try {
      await api.teacher.createLecture({
        title: title.trim(),
        subject: subject.trim(),
        gradeBand: cls.grade <= 5 ? 'primary' : 'secondary',
        description: description.trim(),
        readTimeMin: readTime,
        xpReward: xp,
        classCode: cls.classCode,
        slides: slides.map((s) => ({ title: s.title.trim(), text: s.text.trim(), keyPoint: s.keyPoint?.trim() })),
        activity: actTitle.trim()
          ? {
              title: actTitle.trim(),
              instructions: actSteps.split('\n').map((s) => s.trim()).filter(Boolean),
              villageContext: actContext.trim(),
            }
          : undefined,
      });

      // Reset
      setTitle('');
      setDescription('');
      setSlides([emptySlide()]);
      setActTitle('');
      setActSteps('');
      setActContext('');
      setShowForm(false);
      reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 sm:p-6 ${ui.card}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-black">Study Materials & Articles ({lectures.length})</h3>
            <p className={`text-xs ${ui.sub}`}>Upload reading articles, slides, and village practical activities.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className={`flex items-center gap-1.5 ${ui.btn}`}
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Cancel' : 'Upload New Material'}</span>
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <form onSubmit={submitLecture} className={`p-4 sm:p-5 rounded-2xl ${ui.soft} space-y-4 mb-6 border-2 border-amber-300`}>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Create New Article / Study Material</span>
              </h4>
              <span className="text-xs font-bold text-amber-800">Class: {cls.name}</span>
            </div>

            <ErrorBox msg={formError} />

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Article / Lecture Title *</label>
                <input
                  className={ui.input}
                  placeholder="e.g. How Plants Prepare Food (Photosynthesis)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Subject</label>
                <input
                  className={ui.input}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Brief Description</label>
              <textarea
                className={`${ui.input} h-18 resize-none`}
                placeholder="Short summary for the students..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Slides Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider">Lesson Slides ({slides.length})</span>
                <button
                  type="button"
                  onClick={() => setSlides((p) => [...p, emptySlide()])}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${ui.btnGhost}`}
                >
                  + Add Slide
                </button>
              </div>

              {slides.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">Slide {idx + 1}</span>
                    {slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSlides((p) => p.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    className={ui.input}
                    placeholder="Slide Heading"
                    value={s.title}
                    onChange={(e) => updateSlide(idx, { title: e.target.value })}
                    required
                  />
                  <textarea
                    className={`${ui.input} h-16 resize-none`}
                    placeholder="Explanation content for students..."
                    value={s.text}
                    onChange={(e) => updateSlide(idx, { text: e.target.value })}
                    required
                  />
                  <input
                    className={ui.input}
                    placeholder="Key takeaway (optional)"
                    value={s.keyPoint || ''}
                    onChange={(e) => updateSlide(idx, { keyPoint: e.target.value })}
                  />
                </div>
              ))}
            </div>

            {/* Village Practical Activity */}
            <div className="p-3.5 rounded-xl bg-amber-100/60 border border-amber-300 space-y-2">
              <span className="text-xs font-black uppercase text-amber-950">
                🌱 Village Hands-on Practical Activity (Optional)
              </span>
              <input
                className={ui.input}
                placeholder="Experiment Title (e.g. Clay pot evaporation test)"
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
              />
              <input
                className={ui.input}
                placeholder="Village / local context materials (e.g. take a tulsi leaf, clean stone, clay cup)"
                value={actContext}
                onChange={(e) => setActContext(e.target.value)}
              />
              <textarea
                className={`${ui.input} h-16 resize-none`}
                placeholder="Step-by-step instructions (one per line)"
                value={actSteps}
                onChange={(e) => setActSteps(e.target.value)}
              />
            </div>

            <button type="submit" disabled={busy} className={`w-full py-3 rounded-xl font-black ${ui.btn}`}>
              {busy ? 'Publishing Material...' : 'Publish Study Material to Classroom'}
            </button>
          </form>
        )}

        {/* Existing Materials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectures.map((l) => (
            <div key={l.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-950">
                    {l.subject}
                  </span>
                  <span className={`text-xs ${ui.sub}`}>{l.slidesCount} Slides</span>
                </div>
                <h4 className="text-base font-black">{l.title}</h4>
                <p className={`text-xs mt-1 ${ui.sub} line-clamp-2`}>{l.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-700">{l.completedCount}</span>
                  <span className={ui.sub}> of {l.totalStudents} students completed</span>
                </div>
                <span className="font-bold text-amber-800">+{l.xpReward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* TESTS & QUIZZES UPLOAD TAB                                         */
/* ------------------------------------------------------------------ */
const QuizzesTab: React.FC<{ cls: TeacherClass; ui: Ui }> = ({ cls, ui }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(10);
  const [xp, setXp] = useState(40);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      hint: '',
    }
  ]);

  const fallbackQuizzes: QuizRow[] = [
    {
      id: 'qz-1',
      title: 'States of Matter & Kitchen Science Test',
      subject: cls.subject,
      gradeBand: 'primary',
      questionCount: 5,
      xpReward: 40,
      own: true,
      attempts: 8,
      studentsAttempted: 6,
      totalStudents: cls.studentCount,
      avgPct: 84,
    },
    {
      id: 'qz-2',
      title: 'Water Cycle & Rain Formation Assessment',
      subject: cls.subject,
      gradeBand: 'primary',
      questionCount: 4,
      xpReward: 35,
      own: true,
      attempts: 5,
      studentsAttempted: 5,
      totalStudents: cls.studentCount,
      avgPct: 78,
    }
  ];

  const { data: remoteData, reload } = useLoad(async () => {
    try {
      const res = await api.teacher.quizzes(cls.classCode);
      return res && res.length > 0 ? res : fallbackQuizzes;
    } catch {
      return fallbackQuizzes;
    }
  });

  const quizzes = remoteData || fallbackQuizzes;

  const submitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);

    try {
      await api.teacher.createQuiz({
        title: title.trim(),
        subject: cls.subject,
        gradeBand: cls.grade <= 5 ? 'primary' : 'secondary',
        durationMin: duration,
        xpReward: xp,
        classCode: cls.classCode,
        questions: questions.map((q) => ({
          question: q.question.trim(),
          options: q.options.map((o) => o.trim()),
          correctIndex: q.correctIndex,
          explanation: q.explanation.trim() || 'Correct answer selected by teacher.',
          hint: q.hint?.trim(),
        }))
      });

      setTitle('');
      setShowForm(false);
      reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 ${ui.card} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">Class Tests & Quizzes ({quizzes.length})</h3>
          <p className={`text-xs ${ui.sub}`}>Create objective tests, set questions, and evaluate results.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`flex items-center gap-1.5 ${ui.btn}`}
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Create New Test'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitQuiz} className={`p-4 sm:p-5 rounded-2xl ${ui.soft} space-y-4 border-2 border-amber-300`}>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Create New Test</span>
            </h4>
            <span className="text-xs font-bold text-amber-800">Class: {cls.name}</span>
          </div>

          <ErrorBox msg={formError} />

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1">Test Title *</label>
              <input
                className={ui.input}
                placeholder="e.g. Chapter 1: Living Beings & Soil Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Time Limit (Minutes)</label>
              <input
                type="number"
                min={2}
                max={60}
                className={ui.input}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase">Questions ({questions.length})</span>
              <button
                type="button"
                onClick={() =>
                  setQuestions((p) => [
                    ...p,
                    { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', hint: '' }
                  ])
                }
                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${ui.btnGhost}`}
              >
                + Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">Question {qIdx + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setQuestions((p) => p.filter((_, i) => i !== qIdx))}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  className={ui.input}
                  placeholder="Enter the question text..."
                  value={q.question}
                  onChange={(e) => {
                    const text = e.target.value;
                    setQuestions((prev) => prev.map((item, i) => i === qIdx ? { ...item, question: text } : item));
                  }}
                  required
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctIndex === oIdx}
                        onChange={() => {
                          setQuestions((prev) => prev.map((item, i) => i === qIdx ? { ...item, correctIndex: oIdx } : item));
                        }}
                      />
                      <input
                        className={`${ui.input} text-xs py-1.5`}
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuestions((prev) => prev.map((item, i) => {
                            if (i !== qIdx) return item;
                            const newOpts = [...item.options];
                            newOpts[oIdx] = val;
                            return { ...item, options: newOpts };
                          }));
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={busy} className={`w-full py-3 rounded-xl font-black ${ui.btn}`}>
            {busy ? 'Publishing Test...' : 'Publish Test to Classroom'}
          </button>
        </form>
      )}

      {/* Quizzes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((q) => (
          <div key={q.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-950">
                  {q.subject}
                </span>
                <span className={`text-xs ${ui.sub}`}>{q.questionCount} Questions</span>
              </div>
              <h4 className="text-base font-black">{q.title}</h4>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-amber-900">{q.studentsAttempted} students</span>
                <span className={ui.sub}> attempted (Avg: </span>
                <span className={`font-black ${pctColor(q.avgPct)}`}>{q.avgPct || 0}%</span>
                <span className={ui.sub}>)</span>
              </div>
              <span className="font-bold text-emerald-700">+{q.xpReward} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* NOTICES TAB                                                        */
/* ------------------------------------------------------------------ */
const NoticesTab: React.FC<{ cls: TeacherClass; ui: Ui }> = ({ cls, ui }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const fallbackNotices = [
    {
      id: 'nt-1',
      title: 'Bring a leaf and plastic bottle tomorrow',
      text: 'For our practical science experiment on plant transpiration, each student please bring one fresh leaf from your courtyard and a clean transparent bottle.',
      createdAt: new Date().toISOString(),
      teacher: 'Class Teacher'
    }
  ];

  const { data: remoteData, reload } = useLoad(async () => {
    try {
      const res = await api.notices();
      return res && res.length > 0 ? res : fallbackNotices;
    } catch {
      return fallbackNotices;
    }
  });

  const notices = remoteData || fallbackNotices;

  const postNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !text) return;
    setBusy(true);
    try {
      await api.teacher.createNotice(title, text, cls.classCode);
      setTitle('');
      setText('');
      reload();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 ${ui.card} space-y-5`}>
      <h3 className="text-lg font-black">Class Notices & Announcements</h3>

      <form onSubmit={postNotice} className={`p-4 rounded-2xl ${ui.soft} space-y-3`}>
        <span className="text-xs font-black uppercase text-amber-950">Post Announcement for {cls.name}</span>
        <input
          className={ui.input}
          placeholder="Notice Subject (e.g. Science Test Date)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className={`${ui.input} h-18 resize-none`}
          placeholder="Write your message to students and parents..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" disabled={busy} className={ui.btn}>
          {busy ? 'Posting...' : 'Send Notice'}
        </button>
      </form>

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200">
            <h4 className="font-bold text-sm">{n.title}</h4>
            <p className="text-xs text-slate-700 mt-1 whitespace-pre-wrap">{n.text}</p>
            <div className={`text-[10px] mt-2 ${ui.sub}`}>{fmtDate(n.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};