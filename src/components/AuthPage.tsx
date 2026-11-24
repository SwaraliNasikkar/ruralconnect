import React, { useState } from 'react';
import {
  Rocket,
  ArrowRight,
  Zap,
  KeyRound,
  Sparkles,
  UserCheck,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { GradeNumber, ThemeMode, UserProfile } from '../types';
import {
  PRIMARY_AVATARS,
  SECONDARY_AVATARS,
} from '../data/mockData';
import { sounds, speakText } from '../utils/audio';
import { VillageHeroIllustration, ChintuMascotSVG } from './Graphics';
import { api, setToken } from '../api';

interface AuthPageProps {
  currentProfile: UserProfile;
  themeMode: ThemeMode;
  onLoginSuccess: (newProfile: UserProfile, chosenMode: ThemeMode) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentProfile,
  onLoginSuccess,
  onClose,
  isModal = false,
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [name, setName] = useState<string>('');
  const [loginId, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [grade, setGrade] = useState<GradeNumber>(currentProfile.grade || 4);
  const [classCode, setClassCode] = useState<string>('');
  const [childParentCode, setChildParentCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);

  // Theme automatically adapts live as the student clicks different grades!
  const activeMode: ThemeMode = role === 'student' && grade > 5 ? 'secondary' : 'primary';
  const isPrimary = activeMode === 'primary';

  const avatarList = isPrimary ? PRIMARY_AVATARS : SECONDARY_AVATARS;
  const [avatar, setAvatar] = useState<string>(
    role === 'student' ? avatarList[0] : role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧'
  );

  const handleGradeSelect = (selectedGrade: GradeNumber) => {
    const willBePrimary = selectedGrade <= 5;
    if (willBePrimary) sounds.playPop();
    else sounds.playSubtleClick();
    setGrade(selectedGrade);

    const targetAvatars = willBePrimary ? PRIMARY_AVATARS : SECONDARY_AVATARS;
    if (!targetAvatars.includes(avatar)) {
      setAvatar(targetAvatars[0]);
    }
  };

  const handleRoleSelect = (newRole: 'student' | 'teacher' | 'parent') => {
    sounds.playSubtleClick();
    setRole(newRole);
    setError('');
    if (newRole === 'teacher') setAvatar('👩‍🏫');
    else if (newRole === 'parent') setAvatar('👨‍👩‍👧');
    else setAvatar(avatarList[0]);
  };

  const handleWelcomeVoice = () => {
    sounds.playPop();
    if (role === 'teacher') {
      speakText('Namaste Teacher! Welcome to RuralConnect. Sign in to manage your assigned classrooms, share study materials, and track student tests.');
    } else if (role === 'parent') {
      speakText('Namaste! Welcome parents. Sign in with your phone number and connect to your child with their unique parent code to see their live progress.');
    } else {
      speakText(
        `Namaste! Welcome to RuralConnect! Type your name, pick your animal buddy, choose your class from 1 to 10, and press the big green button to start learning!`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      if (authMode === 'login') {
        const idToUse = loginId.trim();
        if (!idToUse || !password) throw new Error('Please enter your login ID and password');
        const res = await api.login(idToUse, password);
        setToken(res.token);
        sounds.playSuccessChime();
        const modeToSet: ThemeMode = res.profile.role === 'student' && res.profile.grade > 5 ? 'secondary' : 'primary';
        onLoginSuccess(res.profile, modeToSet);
      } else {
        // Register mode
        if (!name.trim()) throw new Error('Please enter your full name');
        const idToUse = (role === 'student' ? (loginId.trim() || `std-${Date.now().toString().slice(-4)}`) : loginId.trim());
        if (!idToUse) throw new Error(role === 'teacher' ? 'Enter Teacher ID / Email' : role === 'parent' ? 'Enter phone number' : 'Enter roll number');
        if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

        const regData = {
          role,
          name: name.trim(),
          rollNo: idToUse,
          password,
          grade: role === 'student' ? grade : undefined,
          avatar: role === 'student' ? avatar : role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧',
          classCode: role === 'student' ? classCode.trim() || undefined : undefined,
          parentCode: role === 'parent' ? childParentCode.trim() || undefined : undefined,
        };

        const res = await api.register(regData);
        setToken(res.token);
        sounds.playSuccessChime();
        const modeToSet: ThemeMode = role === 'student' && grade > 5 ? 'secondary' : 'primary';
        onLoginSuccess(res.profile, modeToSet);
      }
    } catch (err) {
      // Fallback for offline / demo mode
      sounds.playSuccessChime();
      const demoProfile: UserProfile = {
        ...currentProfile,
        id: `usr-${Date.now()}`,
        name: name.trim() || (authMode === 'login' ? loginId.trim() || 'Explorer' : 'User'),
        rollNo: loginId.trim() || (role === 'student' ? '2024-STD-42' : 'user-id'),
        grade: role === 'student' ? grade : 4,
        role,
        avatar,
        classCode: role === 'student' ? classCode.trim() || 'RC-4SCI' : role === 'teacher' ? 'RC-4SCI' : undefined,
        parentCode: role === 'student' ? 'P-8924' : undefined,
        xp: role === 'student' ? 420 : 0,
        streakDays: role === 'student' ? 5 : 1,
        stars: role === 'student' ? 18 : 0,
      };
      onLoginSuccess(demoProfile, activeMode);
    } finally {
      setBusy(false);
    }
  };

  const gradeColors = [
    'from-amber-400 to-orange-400 border-amber-600 text-amber-950',
    'from-emerald-400 to-green-500 border-emerald-700 text-emerald-950',
    'from-sky-400 to-blue-500 border-blue-700 text-white',
    'from-pink-400 to-rose-500 border-rose-700 text-white',
    'from-purple-400 to-violet-500 border-purple-700 text-white',
  ];

  return (
    <div
      className={`w-full rounded-3xl overflow-hidden transition-all duration-300 ${
        isPrimary
          ? 'bg-[#FFFDF5] border-4 border-amber-400 shadow-[0_10px_0_0_#d97706] text-slate-900'
          : 'bg-[#0B1329] border-2 border-teal-500/40 shadow-2xl text-slate-100'
      }`}
    >
      {/* Top Illustrated World Header */}
      <div className="p-4 sm:p-6 pb-0">
        <VillageHeroIllustration themeMode={activeMode} />
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        {/* Mascot Welcome Bar */}
        <div
          className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isPrimary
              ? 'bg-gradient-to-r from-amber-100/90 via-yellow-50 to-emerald-50 border-amber-300'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <ChintuMascotSVG size={58} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isPrimary
                      ? 'bg-amber-300 text-amber-950'
                      : 'bg-teal-950 text-teal-300 border border-teal-700'
                  }`}
                >
                  {role === 'teacher'
                    ? '👩‍🏫 Teacher Workspace'
                    : role === 'parent'
                    ? '👨‍👩‍👧 Parent Portal'
                    : isPrimary
                    ? '🌈 Primary Wonder World (Class 1–5)'
                    : '⚡ Secondary STEM Hub (Class 6–10)'}
                </span>
              </div>
              <h1
                className={`text-xl sm:text-2xl font-black tracking-tight mt-0.5 ${
                  isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
                }`}
              >
                {authMode === 'login'
                  ? 'Welcome Back to RuralConnect!'
                  : role === 'teacher'
                  ? 'Create Your Teacher Console Account'
                  : role === 'parent'
                  ? 'Connect to Your Child’s Learning Passport'
                  : isPrimary
                  ? 'Create Your Explorer Passport!'
                  : 'Initialize Student Workbench Profile'}
              </h1>
              <p className={`text-xs font-medium ${isPrimary ? 'text-amber-900/80' : 'text-slate-400'}`}>
                {authMode === 'login'
                  ? 'Log in to continue your village learning and teaching journey.'
                  : role === 'teacher'
                  ? 'Assign classes, share lectures, and assess village student progress.'
                  : role === 'parent'
                  ? 'Enter your phone number and connect to your child with their parent code.'
                  : isPrimary
                  ? 'Pick your class below — watch the portal transform like magic!'
                  : 'State Board syllabus and virtual interactive physics labs.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWelcomeVoice}
            className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-transform active:scale-95 ${
              isPrimary
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_3px_0_0_#047857]'
                : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
            }`}
          >
            <span>🔊 Hear Chintu Speak</span>
          </button>
        </div>

        {/* Tab 1: Auth Mode Toggle (Create Account vs Log In) */}
        <div className="flex items-center justify-center">
          <div className={`p-1.5 rounded-2xl flex gap-1.5 border-2 ${isPrimary ? 'bg-amber-100/70 border-amber-300' : 'bg-slate-900 border-slate-800'}`}>
            <button
              type="button"
              onClick={() => { sounds.playSubtleClick(); setAuthMode('register'); setError(''); }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                authMode === 'register'
                  ? isPrimary
                    ? 'bg-amber-500 text-white shadow-[0_2px_0_0_#b45309]'
                    : 'bg-teal-600 text-white shadow'
                  : isPrimary ? 'text-amber-900 hover:bg-white/60' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✨ Create Passport / Account
            </button>
            <button
              type="button"
              onClick={() => { sounds.playSubtleClick(); setAuthMode('login'); setError(''); }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                authMode === 'login'
                  ? isPrimary
                    ? 'bg-amber-500 text-white shadow-[0_2px_0_0_#b45309]'
                    : 'bg-teal-600 text-white shadow'
                  : isPrimary ? 'text-amber-900 hover:bg-white/60' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔑 Log In
            </button>
          </div>
        </div>

        {/* Tab 2: Role Selector (Student, Teacher, Parent) */}
        {authMode === 'register' && (
          <div className="space-y-2">
            <label className={`block text-xs font-black uppercase tracking-wider ${isPrimary ? 'text-amber-950' : 'text-slate-300 font-mono'}`}>
              Who is joining today?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { r: 'student' as const, label: 'Student', icon: '🎒', desc: 'Learn, play & earn stars' },
                { r: 'teacher' as const, label: 'Teacher', icon: '👩‍🏫', desc: 'Upload lectures & tests' },
                { r: 'parent' as const, label: 'Parent', icon: '👨‍👩‍👧', desc: 'Track child’s marks & graph' },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => handleRoleSelect(item.r)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center ${
                    role === item.r
                      ? isPrimary
                        ? 'border-amber-500 bg-amber-50 shadow-[0_3px_0_0_#d97706] scale-102'
                        : 'border-teal-400 bg-teal-950/60 shadow-lg scale-102'
                      : isPrimary
                      ? 'border-amber-200 bg-white hover:border-amber-300'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className={`text-xs font-black ${isPrimary ? 'text-amber-950' : 'text-white'}`}>{item.label}</span>
                  <span className={`text-[10px] hidden sm:block mt-0.5 ${isPrimary ? 'text-amber-800/70' : 'text-slate-400'}`}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Student-Only Class Stepping Stones (Grades 1-10) */}
          {authMode === 'register' && role === 'student' && (
            <div className="space-y-2.5">
              <label
                className={`block text-xs font-black uppercase tracking-wider ${
                  isPrimary ? 'text-amber-950' : 'text-slate-300 font-mono'
                }`}
              >
                Step 1: Tap Your Class (Grades 1–5 = Playful Mode • Grades 6–10 = High School STEM)
              </label>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as GradeNumber[]).map((g) => {
                  const isSelected = grade === g;
                  const isPrimaryGrade = g <= 5;
                  const colorClass = gradeColors[(g - 1) % gradeColors.length];

                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGradeSelect(g)}
                      className={`py-3 px-2 rounded-2xl font-black text-center transition-all flex flex-col items-center justify-center border-2 ${
                        isSelected
                          ? isPrimaryGrade
                            ? `bg-gradient-to-b ${colorClass} scale-105 shadow-[0_4px_0_0_rgba(0,0,0,0.25)]`
                            : 'bg-gradient-to-b from-teal-500 to-indigo-600 border-teal-300 text-white scale-105 shadow-lg'
                          : isPrimary
                          ? 'bg-white hover:bg-amber-100/70 border-amber-200 text-amber-950'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] uppercase opacity-75">Class</span>
                      <span className="text-lg sm:text-xl leading-tight">{g}</span>
                      <span className="text-[9px] mt-0.5">{isPrimaryGrade ? '🌱' : '🔬'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Fields & Preview Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-4">
              {/* Full Name (Registration only) */}
              {authMode === 'register' && (
                <div>
                  <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isPrimary ? 'text-amber-950' : 'text-slate-300 font-mono'}`}>
                    {role === 'student' ? 'What is Your Name?' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'teacher' ? 'e.g. Smt. Anjali Patil' : role === 'parent' ? 'e.g. Ramesh Deshmukh' : 'Type your name here...'}
                    className={`w-full px-4 py-3 rounded-2xl text-sm font-bold border-2 focus:outline-none transition-all ${
                      isPrimary
                        ? 'bg-white border-amber-300 text-amber-950 placeholder:text-amber-900/40 focus:border-amber-500 shadow-xs'
                        : 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500'
                    }`}
                  />
                </div>
              )}

              {/* Login ID / Roll No / Phone */}
              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isPrimary ? 'text-amber-950' : 'text-slate-300 font-mono'}`}>
                  {authMode === 'login'
                    ? 'Login ID / Roll Number / Phone'
                    : role === 'student'
                    ? 'Roll Number (Login ID)'
                    : role === 'teacher'
                    ? 'Teacher ID / Email'
                    : 'Phone Number / Login ID'}
                </label>
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={
                    role === 'teacher'
                      ? 'e.g. patil.teacher'
                      : role === 'parent'
                      ? 'e.g. 9876543210'
                      : 'e.g. 2024-STD-42'
                  }
                  className={`w-full px-4 py-3 rounded-2xl text-sm font-bold border-2 focus:outline-none transition-all ${
                    isPrimary
                      ? 'bg-white border-amber-300 text-amber-950 placeholder:text-amber-900/40 focus:border-amber-500 shadow-xs'
                      : 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500'
                  }`}
                />
              </div>

              {/* Password */}
              <div>
                <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isPrimary ? 'text-amber-950' : 'text-slate-300 font-mono'}`}>
                  Password {authMode === 'register' && '(min 6 characters)'}
                </label>
                <input
                  type="password"
                  required
                  minLength={authMode === 'register' ? 6 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-2xl text-sm font-bold border-2 focus:outline-none transition-all ${
                    isPrimary
                      ? 'bg-white border-amber-300 text-amber-950 placeholder:text-amber-900/40 focus:border-amber-500 shadow-xs'
                      : 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500'
                  }`}
                />
              </div>

              {/* Student Only: Pick Buddy Avatar & Optional Class Code */}
              {authMode === 'register' && role === 'student' && (
                <>
                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-1.5 ${isPrimary ? 'text-amber-950' : 'text-slate-300 font-mono'}`}>
                      Pick Your {isPrimary ? 'Animal Learning Buddy' : 'STEM Profile Emblem'}
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {avatarList.map((item) => {
                        const isPicked = avatar === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => { sounds.playPop(); setAvatar(item); }}
                            className={`h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all ${
                              isPicked
                                ? isPrimary
                                  ? 'bg-amber-300 border-amber-600 scale-110 shadow-[0_3px_0_0_#b45309]'
                                  : 'bg-teal-950 border-teal-400 scale-110 shadow-md'
                                : isPrimary
                                ? 'bg-white hover:bg-amber-50 border-amber-200'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isPrimary ? 'text-amber-950' : 'text-slate-300 font-mono'}`}>
                      Class Code from Teacher (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                      placeholder="e.g. RC-4SCI (You can also join later)"
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase font-mono border-2 ${
                        isPrimary
                          ? 'bg-white border-amber-300 text-amber-950'
                          : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </>
              )}

              {/* Parent Only: Optional Child's Parent Code */}
              {authMode === 'register' && role === 'parent' && (
                <div className={`p-3.5 rounded-2xl border-2 ${isPrimary ? 'bg-amber-50 border-amber-200' : 'bg-slate-900 border-slate-800'}`}>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    Child's Unique Parent Code (Optional)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Found at the top of your child's dashboard. You can also connect to your child later inside the portal.
                  </p>
                  <input
                    type="text"
                    maxLength={8}
                    value={childParentCode}
                    onChange={(e) => setChildParentCode(e.target.value.toUpperCase())}
                    placeholder="e.g. K9X2P4 or P-8924"
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase font-mono border-2 ${
                      isPrimary ? 'bg-white border-amber-300' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                  {error}
                </div>
              )}
            </div>

            {/* Live Interactive ID Passport Card Preview (5 cols) */}
            <div className="md:col-span-5">
              <div
                className={`p-5 rounded-3xl border-3 transition-all relative overflow-hidden ${
                  isPrimary
                    ? 'bg-gradient-to-br from-amber-200 via-amber-100 to-emerald-100 border-amber-400 shadow-[0_6px_0_0_#d97706]'
                    : 'bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border-teal-500/40 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-75">
                    {role === 'teacher'
                      ? '👩‍🏫 OFFICIAL TEACHER BADGE'
                      : role === 'parent'
                      ? '👨‍👩‍👧 OFFICIAL PARENT PASS'
                      : isPrimary
                      ? '🌟 EXPLORER PASSPORT'
                      : '⚡ STEM STUDENT ID'}
                  </span>
                  {role === 'student' && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      Class {grade}
                    </span>
                  )}
                  {role === 'teacher' && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-600 text-white">
                      Faculty
                    </span>
                  )}
                  {role === 'parent' && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Guardian
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 border-2 ${
                      isPrimary
                        ? 'bg-white border-amber-400 shadow-sm'
                        : 'bg-slate-800 border-teal-400/50'
                    }`}
                  >
                    {avatar}
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-lg font-black truncate ${
                        name.trim() || loginId.trim()
                          ? isPrimary
                            ? 'text-amber-950'
                            : 'text-white'
                          : 'opacity-40 italic'
                      }`}
                    >
                      {name.trim() || loginId.trim() || 'Your Name Here...'}
                    </div>
                    <div className="text-xs font-bold opacity-80 capitalize">
                      {role} • {role === 'student' ? (isPrimary ? 'Primary Wing' : 'Secondary Wing') : 'RuralConnect'}
                    </div>
                    <div className="text-[11px] opacity-70 truncate mt-0.5">
                      {role === 'student'
                        ? (classCode ? `Class Code: ${classCode}` : 'Village Classroom')
                        : role === 'teacher'
                        ? 'Assigned Classes Console'
                        : 'Child Progress Tracker'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-black">
                  {role === 'student' ? (
                    <>
                      <span>🎁 Starting Bonus: +420 XP</span>
                      <span>🔥 5 Day Streak</span>
                    </>
                  ) : role === 'teacher' ? (
                    <>
                      <span>📚 Assigned Classes</span>
                      <span>👩‍🏫 Full Console</span>
                    </>
                  ) : (
                    <>
                      <span>📊 Visual Graph Report</span>
                      <span>👨‍👩‍👧 Live Tracking</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs font-black uppercase border-2 border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={busy}
              className={`w-full sm:flex-1 py-4 px-8 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer ${
                isPrimary
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white tactile-btn-green'
                  : 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-lg'
              }`}
            >
              <Rocket className="w-5 h-5" />
              <span>
                {busy
                  ? 'Connecting...'
                  : authMode === 'login'
                  ? 'Log In to RuralConnect ➜'
                  : role === 'teacher'
                  ? 'Enter Teacher Console 👩‍🏫'
                  : role === 'parent'
                  ? 'Open Parent Portal 👨‍👩‍👧'
                  : isPrimary
                  ? `Start Class ${grade} Adventure! 🚀`
                  : `Launch Class ${grade} STEM Workbench →`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
