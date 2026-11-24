import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle, 
  Play, 
  ArrowRight, 
  Trophy, 
  Volume2, 
  Clock, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Compass,
  Gift,
  BookOpen
} from 'lucide-react';
import { ThemeMode, UserProfile } from '../types';
import { sounds, speakText, stopSpeaking } from '../utils/audio';

interface DashboardViewProps {
  themeMode: ThemeMode;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onNavigateTab: (tab: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenQuiz: (quizId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  themeMode,
  userProfile,
  setUserProfile,
  onNavigateTab,
  onOpenLesson,
  onOpenQuiz,
}) => {
  const isPrimary = themeMode === 'primary';

  // Primary mode: Treasure Chest state
  const [chestOpened, setChestOpened] = useState(false);
  const [isSpeakingMascot, setIsSpeakingMascot] = useState(false);

  // Secondary mode: Pomodoro Focus Timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sounds.playSuccessChime();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenChest = () => {
    if (chestOpened) return;
    sounds.playSuccessChime();
    setChestOpened(true);
    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + 50,
      stars: prev.stars + 5,
    }));
  };

  const handleMascotSpeak = () => {
    if (isSpeakingMascot) {
      stopSpeaking();
      setIsSpeakingMascot(false);
      return;
    }
    sounds.playPop();
    setIsSpeakingMascot(true);
    const text = isPrimary
      ? `Namaste ${userProfile.name}! Welcome to Class ${userProfile.grade} State Board learning. Today we will explore how molecules dance inside ice and steam, and learn simple fractions like halves and quarters!`
      : `Welcome ${userProfile.name}. Standard ${userProfile.grade} State Board curriculum loaded. Review Ohm's law V equals I times R and simultaneous linear equations for the upcoming unit test.`;
    speakText(text, () => setIsSpeakingMascot(false));
  };

  // -------------------------------------------------------------
  // PRIMARY VIEW (Grades 1-5): State Board Curriculum
  // -------------------------------------------------------------
  if (isPrimary) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Playful Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border-3 border-amber-300 bg-gradient-to-br from-amber-100 via-[#FEF3C7] to-emerald-50 p-6 sm:p-8 shadow-[0_6px_0_0_#d97706]">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>State Board Primary Wing · Class {userProfile.grade}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight leading-tight">
                Namaste, {userProfile.name}! {userProfile.avatar}
              </h1>
              <p className="text-base text-amber-900/90 font-medium">
                Today's State Board curriculum is ready! Solve math puzzles, heat the science beaker, and level up your study streak!
              </p>

              {/* Parakeet Mascot Speech Box */}
              <div className="pt-2">
                <div className="flex items-center gap-3 p-3 bg-white/90 rounded-2xl border-2 border-emerald-300 shadow-sm max-w-lg">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0 border border-emerald-300">
                    🦉
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-emerald-950">Curriculum Guide (Chintu)</div>
                    <div className="text-xs text-emerald-800 truncate">
                      "Class {userProfile.grade} Science: Let's see how ice melts into steam!"
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleMascotSpeak}
                    className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_3px_0_0_#047857] active:translate-y-0.5 shrink-0 flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingMascot ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Pill Island */}
            <div className="flex flex-wrap md:flex-col gap-3 w-full md:w-auto shrink-0">
              {/* Daily Streak */}
              <div className="flex-1 md:flex-initial flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-orange-300 shadow-[0_4px_0_0_#ea580c]">
                <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">Study Streak</div>
                  <div className="text-2xl font-black text-orange-950">{userProfile.streakDays} Days 🔥</div>
                </div>
              </div>

              {/* XP Coins */}
              <div className="flex-1 md:flex-initial flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-amber-300 shadow-[0_4px_0_0_#d97706]">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-xl shrink-0">
                  🪙
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Learning XP</div>
                  <div className="text-2xl font-black text-amber-950">{userProfile.xp} XP</div>
                </div>
              </div>

              {/* Gold Stars */}
              <div className="flex-1 md:flex-initial flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-emerald-300 shadow-[0_4px_0_0_#059669]">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl shrink-0">
                  ⭐
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Exam Stars</div>
                  <div className="text-2xl font-black text-emerald-950">{userProfile.stars} Stars</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* State Board Today's Lessons & Quests */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-amber-950 flex items-center gap-2">
                <span>📚 State Board Daily Curriculum</span>
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                Aligned with official textbooks: General Science, Mathematics & English.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('lessons')}
              className="px-4 py-2 text-xs font-black rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 shadow-xs flex items-center gap-1"
            >
              <span>View All Lessons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Quest 1: States of Matter */}
            <div className="rounded-3xl border-3 border-amber-300 bg-white p-5 shadow-[0_5px_0_0_#d97706] hover:translate-y-[-2px] transition-transform space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🧊</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  General Science · +50 XP
                </span>
              </div>
              <h3 className="text-lg font-black text-amber-950 leading-snug">
                States of Matter: Solids, Liquids & Gases
              </h3>
              <p className="text-xs text-slate-600 font-medium line-clamp-2">
                Learn how molecules are packed tightly in ice and zoom freely in boiling steam!
              </p>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onOpenLesson('pri-sb-1');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#b45309] active:translate-y-1 active:shadow-[0_1px_0_0_#b45309] flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Study Lesson</span>
              </button>
            </div>

            {/* Quest 2: Fractions */}
            <div className="rounded-3xl border-3 border-emerald-300 bg-white p-5 shadow-[0_5px_0_0_#059669] hover:translate-y-[-2px] transition-transform space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🍕</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Mathematics · +45 XP
                </span>
              </div>
              <h3 className="text-lg font-black text-emerald-950 leading-snug">
                Fractions Made Simple: Halves & Quarters
              </h3>
              <p className="text-xs text-slate-600 font-medium line-clamp-2">
                Master 1/2, 1/4, and 3/4 with shape cutting and equal sharing exercises!
              </p>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onOpenLesson('pri-sb-2');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#047857] active:translate-y-1 active:shadow-[0_1px_0_0_#047857] flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Math Unit</span>
              </button>
            </div>

            {/* Quest 3: Virtual Beaker Lab */}
            <div className="rounded-3xl border-3 border-orange-300 bg-white p-5 shadow-[0_5px_0_0_#ea580c] hover:translate-y-[-2px] transition-transform space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔬</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300">
                  Science Lab
                </span>
              </div>
              <h3 className="text-lg font-black text-orange-950 leading-snug">
                Molecular Motion & Beaker Lab
              </h3>
              <p className="text-xs text-slate-600 font-medium line-clamp-2">
                Turn on the burner flame and watch water molecules heat past 100°C!
              </p>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onNavigateTab('lab');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-[0_1px_0_0_#c2410c] flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Beaker Lab</span>
              </button>
            </div>
          </div>
        </section>

        {/* Daily Mystery Treasure Box & State Board Quiz Strip */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Mystery Box Card */}
          <div className="rounded-3xl border-3 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-[0_5px_0_0_#d97706] flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-700" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800">
                  Daily Attendance Reward
                </span>
              </div>
              <h3 className="text-xl font-black text-amber-950">
                {chestOpened ? 'Unlocked! +50 XP Added 🎉' : 'Claim Daily Reward'}
              </h3>
              <p className="text-xs text-amber-900/80 font-medium">
                {chestOpened
                  ? 'Attendance bonus collected! Practice your fraction tables next.'
                  : 'Tap the magical study box to collect your daily learning coins!'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenChest}
              disabled={chestOpened}
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-3xl font-black transition-all shrink-0 border-2 ${
                chestOpened
                  ? 'bg-amber-200 border-amber-400 opacity-80 cursor-default'
                  : 'bg-gradient-to-tr from-amber-400 to-amber-300 border-amber-500 shadow-[0_5px_0_0_#b45309] hover:scale-105 active:translate-y-1'
              }`}
            >
              <span>{chestOpened ? '🌟' : '🎁'}</span>
              <span className="text-[10px] font-black uppercase text-amber-950 mt-1">
                {chestOpened ? 'Opened' : 'Open!'}
              </span>
            </button>
          </div>

          {/* Quick Quiz Challenge */}
          <div className="rounded-3xl border-3 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-[0_5px_0_0_#059669] flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-700" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800">
                  Weekly Unit Test
                </span>
              </div>
              <h3 className="text-xl font-black text-emerald-950">
                Class 4 & 5 Science & Math Test
              </h3>
              <p className="text-xs text-emerald-900/80 font-medium">
                3 multiple-choice textbook questions with instant victory chimes. Can you score 3/3?
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onOpenQuiz('pri-quiz-1');
              }}
              className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#047857] active:translate-y-1 shrink-0 flex items-center gap-1.5"
            >
              <span>Start Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SECONDARY VIEW (Grades 6-10): State Board High School Curriculum
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-slate-100">
      {/* Sleek Academic Workbench Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1329] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <Compass className="w-4 h-4" />
              <span>State Board High School Workbench · Class {userProfile.grade}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{userProfile.schoolHub}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Academic Dashboard: {userProfile.name}
            </h1>
            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Curriculum progression aligned with State Board Syllabus. Physics, Chemistry, Biology, and Mathematics units cached offline on this device.
            </p>
          </div>

          {/* Productivity KPI Bar */}
          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Syllabus Target</div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">78.5%</div>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Board Mock Rank</div>
              <div className="text-xl font-bold text-teal-400 font-mono tabular-nums">Top 5%</div>
              <div className="text-[10px] text-slate-400">District percentile</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Study Streak</div>
              <div className="text-xl font-bold text-indigo-400 font-mono tabular-nums">{userProfile.streakDays}d</div>
              <div className="text-[10px] text-slate-400">Regular attendance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: State Board Modules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Standard {userProfile.grade} Textbook Syllabus</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('lessons')}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>Full Textbook Units</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 1: Physics / Ohm's Law */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0F172A] hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-teal-400 font-medium mb-1">
                  <span>Physics (Class 9 & 10)</span>
                  <span>·</span>
                  <span>Chapter 12</span>
                  <span>·</span>
                  <span className="text-emerald-400">Downloaded (Offline Ready)</span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  Electricity & Ohm’s Law: V = I × R
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Potential difference, resistance, V-I characteristics, and resistors in series and parallel combinations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playSubtleClick();
                  onOpenLesson('sec-sb-1');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shrink-0 flex items-center gap-1"
              >
                <span>Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Progress: 3 of 3 concepts reviewed</span>
                <span>100%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          {/* Module 2: Mathematics / Linear Equations */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0F172A] hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
                  <span>Mathematics Part 1 (Algebra)</span>
                  <span>·</span>
                  <span>Chapter 1</span>
                  <span>·</span>
                  <span className="text-emerald-400">Downloaded</span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  Linear Equations in Two Variables: ax + by + c = 0
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Simultaneous equations by elimination, substitution, and determinant Cramer's rule for Board exams.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playSubtleClick();
                  onOpenLesson('sec-sb-2');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 flex items-center gap-1"
              >
                <span>Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Progress: Ready to solve exercise</span>
                <span>40%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>

          {/* Module 3: Biology / Cell Structure */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0F172A] hover:border-slate-700 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
                  <span>Science Part 2 (Biology)</span>
                  <span>·</span>
                  <span>Chapter 6</span>
                  <span>·</span>
                  <span className="text-slate-400">Available on Hub</span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  Cell Structure, Mitosis & Life Processes
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Prophase to Telophase mitotic stages, mitochondrial ATP generation, and plant vs animal cell organelles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playSubtleClick();
                  onOpenLesson('sec-sb-3');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 flex items-center gap-1"
              >
                <span>Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Study Timer & Board Test */}
        <div className="space-y-6">
          {/* State Board Study Focus Timer */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0F172A] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Board Exam Study Block</span>
              </div>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                25 Min Focus
              </span>
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-mono font-bold tracking-tight text-white tabular-nums">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Offline concentration without distraction
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playSubtleClick();
                  setIsTimerRunning(!isTimerRunning);
                }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playSubtleClick();
                  setIsTimerRunning(false);
                  setTimerSeconds(25 * 60);
                }}
                className="p-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Secondary Board Mock Test */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0F172A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Trophy className="w-4 h-4 text-indigo-400" />
                <span>Board Exam Mock Test</span>
              </div>
              <span className="text-xs font-mono text-indigo-400">+100 XP</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Class 10 State Board Benchmark Test
            </h4>
            <p className="text-xs text-slate-400">
              Board-style objective questions covering Ohm's law, linear elimination, and cell organelles.
            </p>
            <button
              type="button"
              onClick={() => {
                sounds.playSubtleClick();
                onOpenQuiz('sec-quiz-1');
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Take Mock Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Science Lab Shortcut */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1329] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <span>Virtual Practical Lab</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              Ohm's Law Verification Virtual Apparatus
            </h4>
            <p className="text-xs text-slate-400">
              Vary voltage & rheostat resistance to record observations and plot the straight-line graph.
            </p>
            <button
              type="button"
              onClick={() => {
                sounds.playSubtleClick();
                onNavigateTab('lab');
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Physics Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
