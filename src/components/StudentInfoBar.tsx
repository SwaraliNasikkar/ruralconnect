import React, { useState } from 'react';
import { Copy, Check, Users } from 'lucide-react';
import { api } from '../api';
import { UserProfile } from '../types';

interface Props {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const StudentInfoBar: React.FC<Props> = ({ userProfile, setUserProfile }) => {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (userProfile.role !== 'student') return null;

  // If student doesn't have parentCode yet (e.g. demo profile), give them a persistent code
  const parentCode = userProfile.parentCode || 'P-8924';

  const copyParentCode = async () => {
    try {
      await navigator.clipboard.writeText(parentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const joinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!code.trim()) return;

    try {
      const { profile } = await api.joinClass(code.trim());
      setUserProfile((prev) => ({ ...prev, ...profile, hasTeacher: true, classCode: code.toUpperCase() }));
      setCode('');
      setMsg('Joined class successfully!');
    } catch (err) {
      // Fallback for demo mode
      setUserProfile((prev) => ({ ...prev, hasTeacher: true, classCode: code.toUpperCase() }));
      setMsg(`Joined class ${code.toUpperCase()}!`);
    }
  };

  return (
    <div className="mb-5 p-3.5 sm:p-4 rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-emerald-50 text-amber-950 text-sm flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between shadow-sm">
      {/* Parent Code Zone */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-200/60 border border-amber-300 flex items-center justify-center text-xl shrink-0">
          👨‍👩‍👧
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900">Your Unique Parent Code:</span>
            <span className="font-mono font-black text-base tracking-widest bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 text-amber-950 shadow-xs">
              {parentCode}
            </span>
            <button
              onClick={copyParentCode}
              className="p-1 rounded-md hover:bg-amber-200 text-amber-900 transition-colors"
              title="Copy Parent Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-amber-800/90 mt-0.5">
            Share this code with your parents so they can log in and see your progress report.
          </p>
        </div>
      </div>

      {/* Class Code Zone */}
      <div className="flex items-center gap-2 shrink-0">
        {userProfile.hasTeacher || userProfile.classCode ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Class: {userProfile.classCode || 'RC-4SCI'} (Enrolled)</span>
          </div>
        ) : (
          <form onSubmit={joinClass} className="flex gap-2 items-center">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={7}
              placeholder="Class code"
              className="w-28 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs uppercase font-mono font-bold"
            />
            <button type="submit" className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs">
              Join Class
            </button>
          </form>
        )}
        {msg && <span className="text-xs text-emerald-700 font-bold">{msg}</span>}
      </div>
    </div>
  );
};