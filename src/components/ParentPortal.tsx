import React, { useEffect, useState } from 'react';
import {
  Volume2, Printer, UserPlus, TrendingUp, CheckCircle2, Award,
  BookOpen, ShieldCheck, X
} from 'lucide-react';
import { api, ChildReport, ChildBrief } from '../api';
import { ThemeMode, UserProfile } from '../types';
import { speakText, stopSpeaking } from '../utils/audio';
import { ErrorBox, Empty, Loading, ProgressBar, Stat, Ui, fmtDate, getUi, pctColor, useLoad } from './portalUi';

interface Props {
  themeMode: ThemeMode;
  userProfile: UserProfile;
}

export const ParentPortal: React.FC<Props> = ({ themeMode, userProfile }) => {
  const ui = getUi(themeMode);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showConnectForm, setShowConnectForm] = useState(false);

  // Load real connected children from backend
  const { data: children, loading, error, reload } = useLoad(() => api.parent.children());

  useEffect(() => {
    if (children && children.length > 0 && (!selectedChildId || !children.some((c) => c.id === selectedChildId))) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  return (
    <div className={`space-y-6 ${ui.text}`}>
      {/* Top Banner */}
      <div className={`p-5 sm:p-6 ${ui.card} flex items-center justify-between gap-4 flex-wrap`}>
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800">
            Parent Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">👨‍👩‍👧 Parent Dashboard</h1>
          <p className={`text-sm mt-0.5 ${ui.sub}`}>
            Welcome, {userProfile.name}. Follow your child's learning journey and test performance.
          </p>
        </div>

        <button
          className={`${ui.btnGhost} flex items-center gap-1.5`}
          onClick={() => setShowConnectForm((v) => !v)}
        >
          <UserPlus className="w-4 h-4" />
          <span>{showConnectForm ? 'Close' : 'Connect Child with Code'}</span>
        </button>
      </div>

      <ErrorBox msg={error} />
      {loading && !children && <Loading ui={ui} />}

      {/* Connect Child with Unique Parent Code Form */}
      {(showConnectForm || (children && children.length === 0)) && (
        <ConnectChildWithCode
          ui={ui}
          onConnected={(newId) => {
            setShowConnectForm(false);
            setSelectedChildId(newId);
            reload();
          }}
        />
      )}

      {/* Switch between children if parent has multiple kids */}
      {children && children.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {children.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChildId(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                selectedChildId === c.id ? ui.tabOn : ui.tabOff
              }`}
            >
              <span>{c.avatar}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Real Child Report */}
      {selectedChildId && (
        <RealChildReport
          ui={ui}
          childId={selectedChildId}
          key={selectedChildId}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 1. CONNECT CHILD USING UNIQUE PARENT CODE ONLY                      */
/* ------------------------------------------------------------------ */
interface ConnectProps {
  ui: Ui;
  onConnected: (childId: string) => void;
}

const ConnectChildWithCode: React.FC<ConnectProps> = ({ ui, onConnected }) => {
  const [parentCode, setParentCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = parentCode.trim().toUpperCase();
    if (!code) return;

    setBusy(true);
    try {
      // Connects via unique parentCode
      const list = await api.parent.link('', code);
      if (!list || list.length === 0) {
        throw new Error('No child found with this Parent Code.');
      }
      const linked = list[list.length - 1];
      setParentCode('');
      onConnected(linked.id);
    } catch (err) {
      setError((err as Error).message || 'Invalid Parent Code. Please verify with your child.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleConnect} className={`p-5 sm:p-6 ${ui.card} space-y-4 border-2 border-emerald-400`}>
      <div>
        <h3 className="text-lg font-black flex items-center gap-2 text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Connect to Your Child</span>
        </h3>
        <p className={`text-xs mt-1 ${ui.sub}`}>
          Enter the unique 6-character <b>Parent Code</b> displayed on your child's student dashboard.
        </p>
      </div>

      <ErrorBox msg={error} />

      <div className="max-w-md">
        <label className="block text-xs font-bold mb-1">Child's Parent Code *</label>
        <div className="flex gap-2">
          <input
            className={`${ui.input} uppercase font-mono tracking-widest text-base font-bold`}
            placeholder="e.g. K9X2P4"
            maxLength={8}
            value={parentCode}
            onChange={(e) => setParentCode(e.target.value.toUpperCase())}
            required
          />
          <button type="submit" disabled={busy} className={`px-5 py-2.5 rounded-xl font-black shrink-0 ${ui.btn}`}>
            {busy ? 'Connecting...' : 'Connect Child ➜'}
          </button>
        </div>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* 2. REAL CHILD PROGRESS REPORT & GRAPH                              */
/* ------------------------------------------------------------------ */
interface ReportProps {
  ui: Ui;
  childId: string;
}

const RealChildReport: React.FC<ReportProps> = ({ ui, childId }) => {
  const { data: report, loading, error } = useLoad(() => api.parent.report(childId));
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => stopSpeaking(), []);

  if (loading) return <Loading ui={ui} />;
  if (error) return <ErrorBox msg={error} />;
  if (!report) return null;

  const { child, summary, performanceHistory = [], lessons = [], quizzes = [], notices = [] } = report;

  const handleVoiceListen = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const speech =
      `Namaste! Progress report for ${child.name}. ` +
      `Your child has completed ${summary.lessonsCompleted} learning activities ` +
      `and attempted ${summary.quizzesTaken} tests with an average score of ${summary.avgPct ?? 0} percent. ` +
      `Current study streak is ${child.streakDays} days.`;
    speakText(speech, () => setSpeaking(false));
  };

  // Build performance points from actual quiz attempts
  const chartData = (performanceHistory.length > 0
    ? performanceHistory
    : quizzes.map((q) => ({
        label: q.quizTitle,
        date: fmtDate(q.date),
        score: q.finalScore,
        total: q.total,
        pct: q.pct,
        subject: q.subject,
      }))
  ).slice(-8); // latest 8 attempts

  return (
    <div className="space-y-6">
      {/* 1. GREETING: "Welcome, Parent of [Student Name]! 🎉" */}
      <div className={`p-6 ${ui.card} border-2 border-amber-300 relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-sm shrink-0">
              {child.avatar || '🦁'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Student Connected
                </span>
                <span className={`text-xs ${ui.sub}`}>Roll: {child.rollNo}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 text-amber-950">
                Welcome, Parent of {child.name}! 🎉
              </h2>
              <p className={`text-xs sm:text-sm mt-0.5 ${ui.sub}`}>
                Class: Grade {child.grade}
                {child.schoolHub ? ` · ${child.schoolHub}` : ''}
              </p>
              {child.teacherName && (
                <div className="text-xs text-amber-900 font-semibold mt-1">
                  Class Teacher: <b>{child.teacherName}</b>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleVoiceListen}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${ui.btnGhost} ${
                speaking ? 'bg-amber-100 text-amber-900 animate-pulse' : ''
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>{speaking ? 'Stop Voice' : 'Listen in Voice'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${ui.btnGhost}`}
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL SUMMARY STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat
          ui={ui}
          label="Activities Completed"
          value={summary.lessonsCompleted}
          hint="Completed lessons & practicals"
        />
        <Stat
          ui={ui}
          label="Average Test Score"
          value={
            summary.avgPct !== null ? (
              <span className={pctColor(summary.avgPct)}>{summary.avgPct}%</span>
            ) : (
              <span className="text-slate-400 text-base">No tests yet</span>
            )
          }
          hint={summary.bestPct !== null ? `Best: ${summary.bestPct}%` : 'Tests taken'}
        />
        <Stat
          ui={ui}
          label="Study Streak"
          value={`${child.streakDays || 0} Days 🔥`}
          hint="Daily learning streak"
        />
        <Stat
          ui={ui}
          label="Learning Stars"
          value={`${child.stars || 0} ⭐`}
          hint={`${child.xp || 0} Total XP earned`}
        />
      </div>

      {/* 3. GRAPH FORMAT PROGRESS REPORT */}
      <div className={`p-5 sm:p-6 ${ui.card} space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Performance Graph
            </span>
            <h3 className="text-lg font-black mt-0.5">Test Marks Over Time</h3>
          </div>
          {chartData.length > 0 && (
            <span className="text-xs text-slate-500 font-bold">
              Target Benchmark: <span className="text-emerald-600 font-black">75%</span>
            </span>
          )}
        </div>

        {chartData.length > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
            <RealScoreTrendChart data={chartData} />
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/30 text-xs text-amber-900">
            📊 <b>No test scores recorded yet.</b>
            <p className="text-slate-500 mt-1">
              As soon as {child.name} completes a quiz or test in their classroom, their real score graph will appear here.
            </p>
          </div>
        )}
      </div>

      {/* 4. COMPLETED ACTIVITIES */}
      <div className={`p-5 sm:p-6 ${ui.card}`}>
        <h3 className="text-lg font-black mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <span>Completed Activities</span>
        </h3>
        {lessons.filter((l) => l.status === 'completed').length === 0 ? (
          <Empty ui={ui}>{child.name} has not completed any learning activities yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className={`text-left text-[11px] uppercase tracking-wider ${ui.sub}`}>
                  <th className="py-2.5 pr-3">Activity / Lesson</th>
                  <th className="py-2.5 pr-3">Subject</th>
                  <th className="py-2.5 pr-3">Status</th>
                  <th className="py-2.5">Completed Date</th>
                </tr>
              </thead>
              <tbody>
                {lessons
                  .filter((l) => l.status === 'completed')
                  .map((l) => (
                    <tr key={l.id} className={`border-t ${ui.line}`}>
                      <td className="py-3 pr-3 font-bold">{l.title}</td>
                      <td className="pr-3 text-xs">{l.subject}</td>
                      <td className="pr-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      </td>
                      <td className="text-xs text-slate-500">{fmtDate(l.date)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. TESTS, MARKS & TEACHER REMARKS */}
      <div className={`p-5 sm:p-6 ${ui.card}`}>
        <h3 className="text-lg font-black mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Test Results & Marks</span>
        </h3>
        {quizzes.length === 0 ? (
          <Empty ui={ui}>{child.name} has not attempted any tests yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className={`text-left text-[11px] uppercase tracking-wider ${ui.sub}`}>
                  <th className="py-2.5 pr-3">Test Title</th>
                  <th className="py-2.5 pr-3">Subject</th>
                  <th className="py-2.5 pr-3">Marks Obtained</th>
                  <th className="py-2.5 pr-3">Teacher Remarks</th>
                  <th className="py-2.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q) => (
                  <tr key={q.attemptId} className={`border-t ${ui.line}`}>
                    <td className="py-3 pr-3 font-bold">{q.quizTitle}</td>
                    <td className="pr-3 text-xs">{q.subject}</td>
                    <td className="pr-3">
                      <span className="font-black text-sm text-slate-900">
                        {q.finalScore} / {q.total}
                      </span>
                      <span className={`ml-2 text-xs font-black ${pctColor(q.pct)}`}>
                        ({q.pct}%)
                      </span>
                    </td>
                    <td className="pr-3 text-xs text-slate-700 italic">
                      {q.remarks ? `"${q.remarks}"` : <span className={ui.sub}>—</span>}
                    </td>
                    <td className="text-xs text-slate-500">{fmtDate(q.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. TEACHER NOTICES */}
      {notices.length > 0 && (
        <div className={`p-5 sm:p-6 ${ui.card}`}>
          <h3 className="text-lg font-black mb-3">Notice from Teacher</h3>
          <div className="space-y-2">
            {notices.map((n) => (
              <div key={n.id} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-sm text-amber-950">{n.title}</h4>
                <p className="text-xs text-amber-900 mt-1 whitespace-pre-wrap">{n.text}</p>
                <div className="text-[10px] text-slate-500 mt-2">
                  From: {n.teacher} · {fmtDate(n.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* DYNAMIC SVG SCORE TREND GRAPH (Plotted from real quiz marks)        */
/* ------------------------------------------------------------------ */
const RealScoreTrendChart: React.FC<{
  data: { label: string; date: string; score: number; total: number; pct: number }[];
}> = ({ data }) => {
  const width = 640;
  const height = 180;
  const padding = 35;

  const points = data.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(1, data.length - 1);
    const y = height - padding - ((Math.min(100, Math.max(0, d.pct)) / 100) * (height - padding * 2));
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const targetY = height - padding - (0.75 * (height - padding * 2));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 select-none">
        <defs>
          <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* 75% Target Line */}
        <line
          x1={padding}
          y1={targetY}
          x2={width - padding}
          y2={targetY}
          stroke="#cbd5e1"
          strokeDasharray="4 4"
          strokeWidth="1.5"
        />
        <text x={width - padding + 4} y={targetY + 3} fontSize="9" fill="#94a3b8" fontWeight="bold">
          75%
        </text>

        {/* Area fill */}
        <path d={areaD} fill="url(#scoreAreaGrad)" />

        {/* Trend line */}
        <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points & labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill="#065f46"
            >
              {p.pct}%
            </text>
            <text
              x={p.x}
              y={height - 12}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#64748b"
            >
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};