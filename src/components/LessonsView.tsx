import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  DownloadCloud, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Clock, 
  Award,
  Layers,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Lesson, ThemeMode, UserProfile } from '../types';
import { mockLessons } from '../data/mockData';
import { api, getToken } from '../api';
import { sounds, speakText, stopSpeaking } from '../utils/audio';

interface LessonsViewProps {
  themeMode: ThemeMode;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  themeMode,
  userProfile,
  setUserProfile,
  activeLessonId,
  setActiveLessonId,
}) => {
  const isPrimary = themeMode === 'primary';
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  useEffect(() => {
    if (!getToken()) return;
    api
      .getLessons()
      .then((list) => setLessons(list.map((l) => ({ ...l, isDownloaded: false }) as Lesson)))
      .catch(() => {});
  }, []);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Filter lessons relevant to current grade band
  const targetGradeBand = isPrimary ? 'primary' : 'secondary';
  const relevantLessons = lessons.filter(
    (les) => les.gradeBand === targetGradeBand
  );

  const subjects = ['all', ...Array.from(new Set(relevantLessons.map((l) => l.subject)))];

  const filteredLessons = relevantLessons.filter((les) => {
    if (selectedSubject === 'all') return true;
    return les.subject === selectedSubject;
  });

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || null;

  const handleDownloadToggle = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === lessonId) {
          return { ...l, isDownloaded: !l.isDownloaded };
        }
        return l;
      })
    );
  };

  const handleOpenReader = (lesson: Lesson) => {
    if (isPrimary) sounds.playPop();
    else sounds.playSubtleClick();
    setActiveLessonId(lesson.id);
    setActiveSlideIndex(0);
    setIsNarrating(false);
    stopSpeaking();
  };

  const handleCloseReader = () => {
    sounds.playPop();
    stopSpeaking();
    setIsNarrating(false);
    setActiveLessonId(null);
  };

  const handleToggleNarration = () => {
    if (!activeLesson) return;
    if (isNarrating) {
      stopSpeaking();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const currentSlide = activeLesson.slides[activeSlideIndex];
      const textToSpeak = `${currentSlide.title}. ${currentSlide.text} Key takeaway: ${currentSlide.keyPoint || ''}`;
      speakText(textToSpeak, () => setIsNarrating(false));
    }
  };

  const handleNextSlide = () => {
    if (!activeLesson) return;
    stopSpeaking();
    setIsNarrating(false);
    if (activeSlideIndex < activeLesson.slides.length - 1) {
      sounds.playSubtleClick();
      setActiveSlideIndex((prev) => prev + 1);
            if (getToken()) api.saveProgress(activeLesson.id, activeSlideIndex + 2, false).catch(() => {});
    }
  };

  const handlePrevSlide = () => {
    if (!activeLesson) return;
    stopSpeaking();
    setIsNarrating(false);
    if (activeSlideIndex > 0) {
      sounds.playSubtleClick();
      setActiveSlideIndex((prev) => prev - 1);
    }
  };

  const handleCompleteLesson = () => {
    if (!activeLesson) return;
    sounds.playSuccessChime();
    if (!completedLessonIds.includes(activeLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, activeLesson.id]);
      setUserProfile((prev) => ({
        ...prev,
        xp: prev.xp + activeLesson.xpReward,
        stars: prev.stars + (isPrimary ? 3 : 1),
      }));
    }
        if (getToken()) {
      api
        .saveProgress(activeLesson.id, activeLesson.slides.length, true)
        .then(({ profile }) => setUserProfile((prev) => ({ ...prev, xp: profile.xp, streakDays: profile.streakDays })))
        .catch(() => {});
    }
    handleCloseReader();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Subject Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
            }`}
          >
            {isPrimary ? '📚 State Board Textbook Units' : 'Curriculum Modules & Board Exam Syllabi'}
          </h1>
          <p
            className={`text-xs sm:text-sm font-medium ${
              isPrimary ? 'text-amber-800' : 'text-slate-400'
            }`}
          >
            {isPrimary
              ? 'Download State Board lessons for offline study when school internet is disconnected!'
              : 'Official State Board chapters and practical notes optimized for offline devices.'}
          </p>
        </div>

        {/* Subject Filter Pills (Styled as interactive functional tabs) */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-2xl overflow-x-auto max-w-full ${
            isPrimary ? 'bg-amber-100/80 border border-amber-200' : 'bg-slate-800/80 border border-slate-700'
          }`}
        >
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => {
                  sounds.playSubtleClick();
                  setSelectedSubject(sub);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all capitalize ${
                  isSelected
                    ? isPrimary
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-teal-600 text-white shadow-xs'
                    : isPrimary
                    ? 'text-amber-900 hover:bg-amber-200/50'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {sub === 'all' ? 'All Subjects' : sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          return (
            <div
              key={lesson.id}
              onClick={() => handleOpenReader(lesson)}
              className={`cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isPrimary
                  ? 'rounded-3xl border-3 border-amber-300 bg-white p-5 shadow-[0_5px_0_0_#d97706] hover:translate-y-[-3px] active:translate-y-0'
                  : 'rounded-xl border border-slate-800 bg-[#0F172A] p-5 hover:border-teal-500/50 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Header row with Icon, Subject and Download offline state */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      isPrimary
                        ? 'bg-amber-100 border-2 border-amber-300'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {lesson.thumbnailIcon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Offline Download Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDownloadToggle(lesson.id, e)}
                      title={lesson.isDownloaded ? 'Downloaded to offline storage' : 'Download for offline use'}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-colors ${
                        lesson.isDownloaded
                          ? isPrimary
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-teal-950 text-teal-300 border-teal-700'
                          : isPrimary
                          ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>{lesson.isDownloaded ? 'Cached' : 'Download'}</span>
                    </button>

                    {/* XP reward */}
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        isPrimary
                          ? 'bg-amber-100 text-amber-900 font-extrabold'
                          : 'bg-indigo-950 text-indigo-300 font-mono'
                      }`}
                    >
                      +{lesson.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Subject & Title */}
                <div>
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                      isPrimary ? 'text-amber-700' : 'text-teal-400'
                    }`}
                  >
                    {lesson.subject} · {lesson.readTimeMin} min read
                  </div>
                  <h3
                    className={`text-base font-bold leading-snug line-clamp-2 ${
                      isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
                    }`}
                  >
                    {lesson.title}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 line-clamp-2 ${
                      isPrimary ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {lesson.description}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div
                className={`pt-4 mt-4 border-t flex items-center justify-between text-xs font-semibold ${
                  isPrimary
                    ? 'border-amber-100 text-amber-900'
                    : 'border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span>{lesson.slides.length} Interactive Slides</span>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 font-bold ${
                    isPrimary ? 'text-amber-800' : 'text-teal-400'
                  }`}
                >
                  <span>{isCompleted ? 'Review' : 'Read'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Reader Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border-2 ${
              isPrimary
                ? 'bg-[#FFFDF5] border-amber-300 text-slate-900'
                : 'bg-[#0B1329] border-slate-700 text-slate-100'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-4 sm:p-5 flex items-center justify-between border-b ${
                isPrimary
                  ? 'bg-amber-100/90 border-amber-200 text-amber-950'
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{activeLesson.thumbnailIcon}</span>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider font-bold opacity-80 truncate">
                    {activeLesson.subject} · Slide {activeSlideIndex + 1} of {activeLesson.slides.length}
                  </div>
                  <h2 className="text-base sm:text-lg font-black truncate">{activeLesson.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Audio Narration Speech Button */}
                <button
                  onClick={handleToggleNarration}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isNarrating
                      ? 'bg-amber-500 text-white animate-pulse'
                      : isPrimary
                      ? 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-50'
                      : 'bg-slate-800 text-teal-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Read aloud using speech synthesis"
                >
                  {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isNarrating ? 'Stop' : 'Read Aloud'}</span>
                </button>

                <button
                  onClick={handleCloseReader}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Active Slide */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Progress Indicator */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Lesson Progress</span>
                  <span>
                    {Math.round(((activeSlideIndex + 1) / activeLesson.slides.length) * 100)}%
                  </span>
                </div>
                <div
                  className={`h-2 rounded-full overflow-hidden ${
                    isPrimary ? 'bg-amber-100' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isPrimary
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-teal-400 to-indigo-500'
                    }`}
                    style={{
                      width: `${((activeSlideIndex + 1) / activeLesson.slides.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Slide Content */}
              <div className="space-y-4">
                <h3
                  className={`text-xl sm:text-2xl font-black ${
                    isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
                  }`}
                >
                  {activeLesson.slides[activeSlideIndex]?.title}
                </h3>

                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isPrimary ? 'text-slate-800 font-medium' : 'text-slate-300'
                  }`}
                >
                  {activeLesson.slides[activeSlideIndex]?.text}
                </p>

                {/* Key Takeaway Callout */}
                {activeLesson.slides[activeSlideIndex]?.keyPoint && (
                  <div
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                      isPrimary
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-teal-950/40 border-teal-800 text-teal-200'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider mb-0.5">
                        Key Concept
                      </div>
                      <div className="text-sm font-semibold">
                        {activeLesson.slides[activeSlideIndex].keyPoint}
                      </div>
                    </div>
                  </div>
                )}

                {/* Practical Village Activity Spotlight (if on last slide) */}
                {activeSlideIndex === activeLesson.slides.length - 1 && activeLesson.practicalActivity && (
                  <div
                    className={`p-4 rounded-2xl border-2 space-y-2 ${
                      isPrimary
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-indigo-950/40 border-indigo-800 text-indigo-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Village Hands-On Activity: {activeLesson.practicalActivity.title}
                      </span>
                    </div>
                    <p className="text-xs font-medium">
                      {activeLesson.practicalActivity.villageContext}
                    </p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      {activeLesson.practicalActivity.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Navigation Footer */}
            <div
              className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 ${
                isPrimary
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <button
                onClick={handlePrevSlide}
                disabled={activeSlideIndex === 0}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1 transition-all ${
                  activeSlideIndex === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : isPrimary
                    ? 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {activeSlideIndex < activeLesson.slides.length - 1 ? (
                <button
                  onClick={handleNextSlide}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1 transition-all ${
                    isPrimary
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_3px_0_0_#b45309] active:translate-y-0.5'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  <span>Next Concept</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCompleteLesson}
                  className={`px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all ${
                    isPrimary
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_0_0_#047857] active:translate-y-0.5'
                      : 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete & Claim +{activeLesson.xpReward} XP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
