import React, { useEffect, useRef, useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Check, 
  Clock,
  Flame
} from 'lucide-react';
import { Quiz, ThemeMode, UserProfile, SyncQueueItem } from '../types';
import { mockQuizzes } from '../data/mockData';
import { api, getToken } from '../api';
import { sounds } from '../utils/audio';

interface QuizViewProps {
  themeMode: ThemeMode;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onAddToSyncQueue: (item: SyncQueueItem) => void;
  activeQuizId: string | null;
  setActiveQuizId: (id: string | null) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  themeMode,
  userProfile,
  setUserProfile,
  onAddToSyncQueue,
  activeQuizId,
  setActiveQuizId,
}) => {
  const isPrimary = themeMode === 'primary';
  const targetGradeBand = isPrimary ? 'primary' : 'secondary';
    const [allQuizzes, setAllQuizzes] = useState<Quiz[]>(mockQuizzes);
  useEffect(() => {
    if (!getToken()) return;
    api.getQuizzes().then((list) => setAllQuizzes(list as Quiz[])).catch(() => {});
  }, []);
  const availableQuizzes = allQuizzes.filter((q) => q.gradeBand === targetGradeBand);
  const answersRef = useRef<number[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(
    availableQuizzes.find((q) => q.id === activeQuizId) || availableQuizzes[0]
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [isQueuedForSync, setIsQueuedForSync] = useState<boolean>(false);

  const question = currentQuiz.questions[currentQuestionIdx];

  const handleSelectQuiz = (quiz: Quiz) => {
    sounds.playPop();
    setCurrentQuiz(quiz);
    setActiveQuizId(quiz.id);
    resetQuizState();
  };

  const resetQuizState = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setShowHint(false);
    setIsQuizCompleted(false);
    setIsQueuedForSync(false);
    answersRef.current = [];
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswerSubmitted) return;
    if (isPrimary) sounds.playPop();
    else sounds.playSubtleClick();
    setSelectedOptionIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    answersRef.current[currentQuestionIdx] = selectedOptionIdx;
    const isCorrect = selectedOptionIdx === question.correctIndex;
    if (isCorrect) {
      sounds.playSuccessChime();
      setScore((prev) => prev + 1);
    } else {
      sounds.playSubtleClick();
    }
  };

  const handleNextQuestion = () => {
    sounds.playSubtleClick();
    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Quiz Finished!
      setIsQuizCompleted(true);
      sounds.playSuccessChime();
      const earnedXp = Math.round((score / currentQuiz.questions.length) * currentQuiz.xpReward);
      setUserProfile((prev) => ({
        ...prev,
        xp: prev.xp + earnedXp,
        stars: prev.stars + (score === currentQuiz.questions.length ? 5 : 2),
      }));
            if (getToken()) {
        api
          .saveQuizAttempt(currentQuiz.id, score, currentQuiz.questions.length, answersRef.current)
          .then(({ profile }) => setUserProfile((prev) => ({ ...prev, xp: profile.xp, streakDays: profile.streakDays })))
          .catch(() => {});
      }
    }
  };

  const handleQueueSync = () => {
    sounds.playSyncChime();
    setIsQueuedForSync(true);
    const newSyncItem: SyncQueueItem = {
      id: `sync-quiz-${Date.now()}`,
      type: 'quiz_submission',
      title: `${currentQuiz.title} (Score: ${score}/${currentQuiz.questions.length})`,
      timestamp: 'Just now (Offline Queue)',
      sizeKb: 12,
      status: 'pending',
    };
    onAddToSyncQueue(newSyncItem);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Quiz Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
            }`}
          >
            {isPrimary ? '🎯 State Board Unit Quiz & Tests' : 'State Board Academic Assessments & Unit Tests'}
          </h1>
          <p
            className={`text-xs sm:text-sm font-medium ${
              isPrimary ? 'text-amber-800' : 'text-slate-400'
            }`}
          >
            {isPrimary
              ? 'Classroom curriculum questions with instant chimes! Practice for your school term exams.'
              : 'Rigorous objective evaluations aligned with State Board blueprints and marking schemes.'}
          </p>
        </div>

        {/* Quiz Selector */}
        <div className="flex items-center gap-2">
          {availableQuizzes.map((q) => (
            <button
              key={q.id}
              onClick={() => handleSelectQuiz(q)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                currentQuiz.id === q.id
                  ? isPrimary
                    ? 'bg-amber-500 text-white border-amber-600 shadow-[0_2px_0_0_#b45309]'
                    : 'bg-teal-600 text-white border-teal-500'
                  : isPrimary
                  ? 'bg-white text-amber-950 border-amber-300'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {q.title}
            </button>
          ))}
        </div>
      </div>

      {!isQuizCompleted ? (
        <div
          className={`rounded-3xl p-6 sm:p-8 transition-all ${
            isPrimary
              ? 'border-3 border-amber-300 bg-white shadow-[0_6px_0_0_#d97706]'
              : 'border border-slate-800 bg-[#0F172A] shadow-md text-slate-100'
          }`}
        >
          {/* Question Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-amber-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-xl ${
                  isPrimary
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-teal-950 text-teal-300 border border-teal-800'
                }`}
              >
                Question {currentQuestionIdx + 1} of {currentQuiz.questions.length}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Score: {score} Correct
              </span>
            </div>

            {/* Hint Button */}
            {question.hint && (
              <button
                onClick={() => {
                  sounds.playSubtleClick();
                  setShowHint(!showHint);
                }}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  isPrimary
                    ? 'text-amber-800 hover:bg-amber-100'
                    : 'text-teal-400 hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            )}
          </div>

          {/* Hint Drawer */}
          {showHint && question.hint && (
            <div
              className={`mt-4 p-3 rounded-2xl text-xs font-semibold border ${
                isPrimary
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-teal-950/60 border-teal-800 text-teal-200'
              }`}
            >
              💡 Hint: {question.hint}
            </div>
          )}

          {/* Question Statement */}
          <div className="py-6 space-y-4">
            <h2
              className={`text-lg sm:text-xl font-black leading-snug ${
                isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
              }`}
            >
              {question.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const isCorrect = idx === question.correctIndex;
                let optionStyle = '';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = isPrimary
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                      : 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = isPrimary
                      ? 'bg-red-100 border-red-400 text-red-950'
                      : 'bg-red-950/80 border-red-600 text-red-200';
                  } else {
                    optionStyle = 'opacity-50 border-transparent';
                  }
                } else {
                  if (isSelected) {
                    optionStyle = isPrimary
                      ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-xs scale-101'
                      : 'bg-teal-900/60 border-teal-400 text-teal-100 font-medium';
                  } else {
                    optionStyle = isPrimary
                      ? 'bg-amber-50/50 hover:bg-amber-100/80 border-amber-200 text-slate-800'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all border-2 flex items-center justify-between gap-3 ${
                      isPrimary ? 'min-h-[56px]' : 'min-h-[48px]'
                    } ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isSelected
                            ? isPrimary
                              ? 'bg-amber-500 text-white'
                              : 'bg-teal-500 text-slate-900'
                            : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Callout after Submit */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold border-2 animate-in fade-in duration-200 ${
                  selectedOptionIdx === question.correctIndex
                    ? isPrimary
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                    : isPrimary
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="font-black mb-1">
                  {selectedOptionIdx === question.correctIndex ? '🌟 Correct!' : 'ℹ️ Explanation:'}
                </div>
                <div>{question.explanation}</div>
              </div>
            )}
          </div>

          {/* Action Button Row */}
          <div className="pt-4 border-t border-amber-200 dark:border-slate-800 flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={selectedOptionIdx === null}
                className={`py-3.5 px-8 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                  selectedOptionIdx === null
                    ? 'opacity-40 cursor-not-allowed bg-slate-300 text-slate-600'
                    : isPrimary
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_0_0_#b45309] active:translate-y-1'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-md'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className={`py-3.5 px-8 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                  isPrimary
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_0_0_#047857] active:translate-y-1'
                    : 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md'
                }`}
              >
                <span>
                  {currentQuestionIdx < currentQuiz.questions.length - 1
                    ? 'Next Question'
                    : 'View Final Score'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Screen */
        <div
          className={`rounded-3xl p-8 text-center space-y-6 ${
            isPrimary
              ? 'border-3 border-amber-300 bg-gradient-to-b from-amber-50 to-white shadow-[0_6px_0_0_#d97706]'
              : 'border border-slate-800 bg-[#0F172A] text-slate-100 shadow-md'
          }`}
        >
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-md border-2 bg-amber-100 border-amber-300">
            {score === currentQuiz.questions.length ? '🏆' : '⭐'}
          </div>

          <div className="space-y-2">
            <h2
              className={`text-2xl sm:text-3xl font-black ${
                isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
              }`}
            >
              {score === currentQuiz.questions.length
                ? 'Superstar! Perfect Score!'
                : 'Great Effort on the Quiz!'}
            </h2>
            <p className="text-sm text-slate-500">
              You scored {score} out of {currentQuiz.questions.length} questions correctly.
            </p>
          </div>

          {/* Rewards Token Pill */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-950 text-sm font-extrabold">
            <span>+{Math.round((score / currentQuiz.questions.length) * currentQuiz.xpReward)} XP</span>
            <span>·</span>
            <span>+{score === currentQuiz.questions.length ? 5 : 2} Stars ⭐</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-orange-600">
              <Flame className="w-4 h-4" /> Streak Extended!
            </span>
          </div>

          {/* Offline Sync integration from PDF */}
          <div
            className={`p-5 rounded-2xl max-w-md mx-auto text-left space-y-3 border ${
              isPrimary
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <UploadCloud className="w-4 h-4 text-teal-500" />
              <span>Offline First Queue (RuralConnect Feature)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your test response is stored in the local device database. Queue it now so it will automatically sync to your teacher's portal at the Rural School Hub!
            </p>
            <button
              onClick={handleQueueSync}
              disabled={isQueuedForSync}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isQueuedForSync
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isPrimary
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_3px_0_0_#b45309] active:translate-y-0.5'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              {isQueuedForSync ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Local Sync Queue!</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Queue Submission for Hub Sync</span>
                </>
              )}
            </button>
          </div>

          {/* Restart Button */}
          <div className="pt-2">
            <button
              onClick={resetQuizState}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mx-auto border transition-colors ${
                isPrimary
                  ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
