import React, { useState } from 'react';
import { 
  Users, 
  Send, 
  Volume2, 
  CheckCircle, 
  MessageSquare, 
  Calendar, 
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ThemeMode, UserProfile } from '../types';
import { sounds, speakText, stopSpeaking } from '../utils/audio';

interface TeacherParentPortalProps {
  themeMode: ThemeMode;
  userProfile: UserProfile;
}

export const TeacherParentPortal: React.FC<TeacherParentPortalProps> = ({
  themeMode,
  userProfile,
}) => {
  const isPrimary = themeMode === 'primary';
  const isTeacher = userProfile.role === 'teacher';
  const isParent = userProfile.role === 'parent';

  const [broadcastText, setBroadcastText] = useState(
    'Reminder: State Board Mathematics and Science Unit Test starts tomorrow. Bring your geometry instruments!'
  );
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [isSpeakingReport, setIsSpeakingReport] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccessChime();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleListenReport = () => {
    if (isSpeakingReport) {
      stopSpeaking();
      setIsSpeakingReport(false);
      return;
    }
    sounds.playPop();
    setIsSpeakingReport(true);
    const text = `Namaste! Weekly State Board academic report for ${userProfile.name}. Student has maintained a 5-day active study streak, completed the States of Matter and Fractions units, and scored 100% in the Science benchmark test. Teacher remarks: Excellent classroom participation and regular offline homework submission.`;
    speakText(text, () => setIsSpeakingReport(false));
  };

  if (!isTeacher && !isParent) {
    return null;
  }

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border-2 mb-6 animate-in fade-in duration-300 ${
        isPrimary
          ? 'border-amber-300 bg-amber-50/90 shadow-[0_4px_0_0_#d97706]'
          : 'border-slate-800 bg-[#0B1329] text-slate-100 shadow-md'
      }`}
    >
      {isTeacher ? (
        /* Teacher Portal Perspective */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600 dark:text-teal-400" />
              <h2 className="text-lg font-black">
                Teacher Management Console ({userProfile.schoolHub})
              </h2>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
              ● 24 Students Active on Hub
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Publish lesson broadcasts to student tablets and review queued offline submissions during school morning roll-call.
          </p>

          {/* Broadcast Form */}
          <form onSubmit={handleSendBroadcast} className="flex gap-2">
            <input
              type="text"
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Post an announcement or homework prompt to all village tablets..."
              className={`flex-1 px-4 py-2 text-xs rounded-xl border focus:outline-hidden ${
                isPrimary
                  ? 'bg-white border-amber-300 text-slate-900'
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPrimary
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_2px_0_0_#b45309]'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{broadcastSent ? 'Broadcast Sent!' : 'Push to Hub'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* Parent Progress Perspective */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-teal-400" />
              <h2 className="text-lg font-black">
                Parent Progress Brief (SMS & Audio Summary)
              </h2>
            </div>
            <button
              onClick={handleListenReport}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                isSpeakingReport
                  ? 'bg-amber-500 text-white animate-pulse'
                  : isPrimary
                  ? 'bg-white text-amber-950 border-amber-300 hover:bg-amber-50'
                  : 'bg-slate-800 text-teal-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeakingReport ? 'Stop Audio' : 'Listen to Voice Brief'}</span>
            </button>
          </div>

          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed ${
              isPrimary
                ? 'bg-white border-amber-200 text-amber-950'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <div className="font-bold mb-1 text-slate-500">
              Weekly SMS Dispatch (Regional Hub):
            </div>
            "RuralConnect Update for {userProfile.name}: Completed 3 lessons and 1 quiz with 100% score! Active 5-day study streak. Next village hub sync scheduled for Wednesday."
          </div>
        </div>
      )}
    </div>
  );
};
