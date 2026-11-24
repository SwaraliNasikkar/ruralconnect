/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ThemeMode, UserProfile, SyncQueueItem } from './types';
import { initialProfile, initialSyncQueue } from './data/mockData';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { DashboardView } from './components/DashboardView';
import { LessonsView } from './components/LessonsView';
import { QuizView } from './components/QuizView';
import { InteractiveLabView } from './components/InteractiveLabView';
import { OfflineSyncCenter } from './components/OfflineSyncCenter';
import { RealAuth } from './components/RealAuth';
import { TeacherPortal } from './components/TeacherPortal';
import { ParentPortal } from './components/ParentPortal';
import { StudentInfoBar } from './components/StudentInfoBar';
import { api, getToken, clearToken } from './api';
import { sounds } from './utils/audio';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    initialProfile.grade <= 5 ? 'primary' : 'secondary'
  );
  
  // Set hasRegistered to true so it opens directly with the RealAuth login/signup screen
  const [hasRegistered, setHasRegistered] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'real' | 'demo'>('real');
  const [restoring, setRestoring] = useState<boolean>(!!getToken());
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(initialSyncQueue);
  // Deep linking between views
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentTab('lessons');
  };

  const handleOpenQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setCurrentTab('quizzes');
  };

  const handleAddToSyncQueue = (item: SyncQueueItem) => {
    setSyncQueue((prev) => [item, ...prev]);
  };

  const handleSaveProfile = (newProfile: UserProfile, chosenMode: ThemeMode) => {
    setUserProfile(newProfile);
    setThemeMode(chosenMode);
    setHasRegistered(true);
  };
    // Called after a real login / sign-up (student, teacher or parent)
  const handleRealAuth = (profile: UserProfile) => {
    const mode: ThemeMode = profile.role === 'student' && profile.grade > 5 ? 'secondary' : 'primary';
    setUserProfile(profile);
    setThemeMode(mode);
    setCurrentTab(profile.role === 'student' ? 'dashboard' : 'portal');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sounds.playPop();
    clearToken();
    setIsAuthenticated(false);
    setUserProfile(initialProfile);
    setThemeMode(initialProfile.grade <= 5 ? 'primary' : 'secondary');
    setCurrentTab('dashboard');
  };

  // Stay logged in after a page refresh
  useEffect(() => {
    if (!getToken()) return;
    api
      .me()
      .then(({ profile }) => handleRealAuth(profile))
      .catch(() => clearToken())
      .finally(() => setRestoring(false));
  }, []);

  // real accounts come from the server; demo accounts have no roll number
  const isRealUser = !!userProfile.rollNo;

  const isPrimary = themeMode === 'primary';

  if (restoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5] text-amber-900 font-bold">
        Loading…
      </div>
    );
  }

  // Beautiful Landing Page with Primary/Secondary Theme, Mascot, & Role Switcher
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen py-6 sm:py-10 px-4 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
          isPrimary
            ? 'bg-gradient-to-b from-sky-200 via-[#FFFBEB] to-emerald-100 text-slate-900'
            : 'bg-[#060B18] text-slate-100'
        }`}
      >
        <div className="relative z-10 w-full max-w-4xl">
          <AuthPage
            currentProfile={userProfile}
            themeMode={themeMode}
            onLoginSuccess={(newProfile) => {
              handleRealAuth(newProfile);
            }}
            isModal={false}
          />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN PORTAL VIEW (After Registration)
  // -------------------------------------------------------------------------
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isPrimary
          ? 'bg-[#FFFDF5] text-slate-900 selection:bg-amber-300 selection:text-amber-950'
          : 'bg-[#060B18] text-slate-100 selection:bg-teal-500 selection:text-slate-900'
      }`}
    >
      {/* Top Bar Contract Compliant Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenRegister={() => { if (!isRealUser && userProfile.role === 'student') setIsRegisterOpen(true); }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-200/60">
          <span className="text-xs font-bold text-slate-600">
            Logged in as <b className="capitalize text-amber-900">{userProfile.role}</b>: {userProfile.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-amber-900 hover:bg-amber-100 shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>🚪 Log out / Switch User</span>
          </button>
        </div>
        {userProfile.role === 'student' && (
          <StudentInfoBar userProfile={userProfile} setUserProfile={setUserProfile} />
        )}
        {currentTab === 'portal' && userProfile.role === 'teacher' && (
          <TeacherPortal themeMode={themeMode} userProfile={userProfile} />
        )}
        {currentTab === 'portal' && userProfile.role === 'parent' && (
          <ParentPortal themeMode={themeMode} userProfile={userProfile} />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            themeMode={themeMode}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onNavigateTab={setCurrentTab}
            onOpenLesson={handleOpenLesson}
            onOpenQuiz={handleOpenQuiz}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsView
            themeMode={themeMode}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            activeLessonId={activeLessonId}
            setActiveLessonId={setActiveLessonId}
          />
        )}

        {currentTab === 'quizzes' && (
          <QuizView
            themeMode={themeMode}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onAddToSyncQueue={handleAddToSyncQueue}
            activeQuizId={activeQuizId}
            setActiveQuizId={setActiveQuizId}
          />
        )}

        {currentTab === 'lab' && (
          <InteractiveLabView
            themeMode={themeMode}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        )}

        {currentTab === 'sync' && (
          <OfflineSyncCenter
            themeMode={themeMode}
            userProfile={userProfile}
            isOffline={isOffline}
            setIsOffline={setIsOffline}
            syncQueue={syncQueue}
            setSyncQueue={setSyncQueue}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`mt-16 border-t py-8 transition-colors ${
          isPrimary
            ? 'border-amber-200/80 bg-amber-50/50 text-amber-900/70'
            : 'border-slate-800/80 bg-[#090F20] text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-200">
              RuralConnect Platform
            </span>
            <span>•</span>
            <span>Offline-First Adaptive Learning for Rural Children</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sounds.playPop();
                setIsRegisterOpen(true);
              }}
              className="hover:underline font-bold"
            >
              Switch Explorer Profile ({userProfile.grade}th Standard)
            </button>
          </div>
        </div>
      </footer>

      {/* Switch Profile Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute right-4 top-4 z-50 px-3 py-1.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-950 bg-white/90 shadow-md"
              title="Close Dialog"
            >
              ✕ Close
            </button>
            <AuthPage
              currentProfile={userProfile}
              themeMode={themeMode}
              onLoginSuccess={(newProfile, chosenMode) => {
                handleSaveProfile(newProfile, chosenMode);
                setIsRegisterOpen(false);
              }}
              onClose={() => setIsRegisterOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}