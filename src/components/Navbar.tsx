import React from 'react';
import { 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Award, 
  Cpu, 
  RefreshCw, 
  Layers, 
  LayoutDashboard,
  UserCheck
} from 'lucide-react';
import { GradeNumber, ThemeMode, UserProfile } from '../types';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenRegister: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  themeMode,
  setThemeMode,
  userProfile,
  setUserProfile,
  isOffline,
  setIsOffline,
  soundEnabled,
  setSoundEnabled,
  onOpenRegister,
  onLogout,
}) => {
  const isPrimary = themeMode === 'primary';

  const handleGradeChange = (newGrade: GradeNumber) => {
    sounds.playPop();
    setUserProfile((prev) => ({
      ...prev,
      grade: newGrade,
    }));
    // Automatically switch theme if grade crosses boundary
    if (newGrade <= 5 && themeMode !== 'primary') {
      setThemeMode('primary');
    } else if (newGrade > 5 && themeMode !== 'secondary') {
      setThemeMode('secondary');
    }
  };

  const handleToggleTheme = () => {
    if (isPrimary) {
      sounds.playSubtleClick();
      setThemeMode('secondary');
      if (userProfile.grade <= 5) {
        setUserProfile((prev) => ({ ...prev, grade: 8 }));
      }
    } else {
      sounds.playPop();
      setThemeMode('primary');
      if (userProfile.grade > 5) {
        setUserProfile((prev) => ({ ...prev, grade: 4 }));
      }
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.soundEnabled = next;
    if (next) sounds.playPop();
  };

  // System UML ('architecture') completely removed from both UIs
  const navItems =
    userProfile.role !== 'student'
      ? [{ id: 'portal', label: userProfile.role === 'teacher' ? 'Teacher Console' : 'My Child', icon: LayoutDashboard }]
      : [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'lessons', label: 'Lessons', icon: BookOpen },
          { id: 'quizzes', label: 'Quizzes', icon: Award },
          { id: 'lab', label: isPrimary ? 'Sun & Eco Lab' : 'STEM Lab', icon: Cpu },
          { id: 'sync', label: 'Offline Hub', icon: RefreshCw },
          
        ];
  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        isPrimary
          ? 'bg-[#FFFBEB] border-amber-200/80 shadow-sm'
          : 'bg-[#0B1329] border-slate-800 text-slate-100 shadow-sm'
      }`}
    >
      {/* Top Banner Alert when in Offline Mode */}
      {isOffline && (
        <div
          className={`py-1 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 transition-all ${
            isPrimary
              ? 'bg-amber-500 text-amber-950'
              : 'bg-teal-900/80 text-teal-200 border-b border-teal-700/50'
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          <span>Rural Offline Mode Active: Content serving from local device cache. Submissions queued for school hub sync.</span>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sounds.playPop();
                setCurrentTab('dashboard');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-105 ${
                  isPrimary
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-md border-2 border-amber-300'
                    : 'bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow border border-indigo-400/30'
                }`}
              >
                {isPrimary ? '🌱' : 'RC'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xl font-extrabold tracking-tight whitespace-nowrap ${
                      isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
                    }`}
                  >
                    RuralConnect
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      isPrimary
                        ? 'bg-amber-200 text-amber-900 border border-amber-300'
                        : 'bg-teal-950 text-teal-400 border border-teal-800/80'
                    }`}
                  >
                    State Board • {isPrimary ? 'Class 1-5' : 'Class 6-10'}
                  </span>
                </div>
                <p
                  className={`text-[11px] leading-none ${
                    isPrimary ? 'text-amber-800/70' : 'text-slate-400'
                  }`}
                >
                  Offline-First School Portal
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isPrimary) sounds.playPop();
                    else sounds.playSubtleClick();
                    setCurrentTab(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? isPrimary
                        ? 'bg-amber-400/30 text-amber-950 border border-amber-300/80 shadow-xs'
                        : 'bg-indigo-950/80 text-teal-300 border border-teal-500/30 shadow-xs'
                      : isPrimary
                      ? 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-200/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Theme Switcher Button */}
            <button
              onClick={handleToggleTheme}
              title={`Switch to ${isPrimary ? 'Secondary (Grades 6-10)' : 'Primary (Grades 1-5)'} theme`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs border ${
                isPrimary
                  ? 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 shadow-[0_2px_0_0_#d97706]'
                  : 'bg-slate-800/90 hover:bg-slate-750 text-teal-300 border-teal-700/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">
                Theme: <span className="font-extrabold">{isPrimary ? 'Primary 🌈' : 'Secondary ⚡'}</span>
              </span>
              <span className="sm:hidden font-extrabold">{isPrimary ? '🌈' : '⚡'}</span>
            </button>

            {/* Grade Quick Select */}
            {!userProfile.rollNo && (
            <div className="relative">
              <select
                aria-label="Select Grade Level"
                value={userProfile.grade}
                onChange={(e) => handleGradeChange(Number(e.target.value) as GradeNumber)}
                className={`text-xs font-bold py-1.5 pl-2 pr-6 rounded-xl cursor-pointer border appearance-none transition-colors ${
                  isPrimary
                    ? 'bg-white text-amber-950 border-amber-300 focus:ring-2 focus:ring-amber-400'
                    : 'bg-slate-800 text-teal-200 border-slate-700 focus:ring-2 focus:ring-teal-500'
                }`}
              >
                <optgroup label="Primary (1st-5th)">
                  <option value={1}>Grade 1</option>
                  <option value={2}>Grade 2</option>
                  <option value={3}>Grade 3</option>
                  <option value={4}>Grade 4</option>
                  <option value={5}>Grade 5</option>
                </optgroup>
                <optgroup label="Secondary (6th-10th)">
                  <option value={6}>Grade 6</option>
                  <option value={7}>Grade 7</option>
                  <option value={8}>Grade 8</option>
                  <option value={9}>Grade 9</option>
                  <option value={10}>Grade 10</option>
                </optgroup>
              </select>
              <span className="absolute right-2 top-2 pointer-events-none text-[10px] opacity-70">▼</span>
            </div>
          )}

            {/* Offline Simulation Toggle */}
            <button
              onClick={() => {
                if (isPrimary) sounds.playPop();
                else sounds.playSubtleClick();
                setIsOffline((prev) => !prev);
              }}
              title={isOffline ? 'Switch to Online Hub' : 'Simulate Offline Disconnection'}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center ${
                isOffline
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : isPrimary
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-800 text-teal-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-500" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Audio Chimes & Speech'}
              className={`p-2 rounded-xl text-xs border transition-colors ${
                isPrimary
                  ? 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* User / Register Profile Trigger */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenRegister();
              }}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                isPrimary
                  ? 'bg-amber-500 text-white shadow-[0_3px_0_0_#b45309] hover:bg-amber-600 active:translate-y-0.5'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
              }`}
            >
              <span className="text-base leading-none">{userProfile.avatar}</span>
              <span className="max-w-[70px] sm:max-w-[100px] truncate">{userProfile.name}</span>
              <UserCheck className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Quick Log out */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Log out / Switch User"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                  isPrimary
                    ? 'bg-white hover:bg-red-50 text-red-700 border-amber-300'
                    : 'bg-slate-800 hover:bg-red-950 text-red-300 border-slate-700'
                }`}
              >
                <span>Log out</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-amber-200/40 dark:border-slate-800 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isPrimary) sounds.playPop();
                  else sounds.playSubtleClick();
                  setCurrentTab(item.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                  isActive
                    ? isPrimary
                      ? 'bg-amber-400/40 text-amber-950 font-bold'
                      : 'bg-teal-900/80 text-teal-200'
                    : isPrimary
                    ? 'text-amber-900/80'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};