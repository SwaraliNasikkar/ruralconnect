import React, { useState } from 'react';
import { api, setToken } from '../api';
import { UserProfile } from '../types';

interface RealAuthProps {
  onAuth: (profile: UserProfile) => void;
}

type Role = 'student' | 'teacher' | 'parent';

const ROLE_INFO: Record<Role, { icon: string; label: string; idLabel: string; idHint: string }> = {
  student: { icon: '🎒', label: 'Student', idLabel: 'Roll Number (Login ID)', idHint: 'e.g. 2024-STD-42' },
  teacher: { icon: '👩‍🏫', label: 'Teacher', idLabel: 'Teacher ID / Email', idHint: 'e.g. patil.teacher' },
  parent: { icon: '👨‍👩‍👧', label: 'Parent', idLabel: 'Phone Number / Login ID', idHint: 'e.g. 9876543210' },
};

const AVATARS = ['🦁', '🐯', '🐼', '🦊', '🐘', '🦉', '🚀', '🌟'];

const field =
  'w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-amber-500';
const label = 'block text-xs font-bold text-amber-900 mb-1';

export const RealAuth: React.FC<RealAuthProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  // Student-only fields
  const [grade, setGrade] = useState(4);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [classCode, setClassCode] = useState('');

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const info = ROLE_INFO[role];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const result =
        mode === 'login'
          ? await api.login(loginId.trim(), password)
          : await api.register({
              role,
              name: name.trim(),
              rollNo: loginId.trim(),
              password,
              grade: role === 'student' ? grade : undefined,
              avatar: role === 'student' ? avatar : role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧',
              classCode: role === 'student' ? classCode.trim() || undefined : undefined,
            });

      setToken(result.token);
      onAuth(result.profile);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-[0_5px_0_0_#d97706]">
        {/* Mode switch */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-amber-100 mb-5">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              className={`py-2 rounded-xl text-sm font-black transition-colors ${
                mode === m ? 'bg-amber-500 text-white shadow' : 'text-amber-900 hover:bg-amber-50'
              }`}
            >
              {m === 'login' ? 'Log in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* Role picker (registration only) */}
        {mode === 'register' && (
          <div className="grid grid-cols-3 gap-2 mb-5">
            {(Object.keys(ROLE_INFO) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(''); }}
                className={`py-3 rounded-2xl border-2 text-center transition-all ${
                  role === r
                    ? 'border-amber-500 bg-amber-50 shadow-[0_2px_0_0_#d97706]'
                    : 'border-amber-100 bg-white hover:border-amber-300'
                }`}
              >
                <div className="text-2xl">{ROLE_INFO[r].icon}</div>
                <div className="text-xs font-black text-amber-950 mt-0.5">{ROLE_INFO[r].label}</div>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className={label}>Full Name</label>
              <input
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={role === 'teacher' ? 'e.g. Anjali Patil' : role === 'parent' ? 'e.g. Ramesh Deshmukh' : 'Your name'}
              />
            </div>
          )}

          <div>
            <label className={label}>
              {mode === 'login' ? 'Login ID / Roll Number / Phone' : info.idLabel}
            </label>
            <input
              className={field}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              placeholder={mode === 'login' ? 'Your login ID' : info.idHint}
              autoComplete="username"
            />
          </div>

          <div>
            <label className={label}>Password {mode === 'register' && '(min 6 characters)'}</label>
            <input
              className={field}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === 'register' ? 6 : undefined}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Student-only options (Grade & Avatar) */}
          {mode === 'register' && role === 'student' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Class / Standard</label>
                  <select
                    className={field}
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Class Code (Optional)</label>
                  <input
                    className={`${field} uppercase`}
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="From teacher"
                    maxLength={8}
                  />
                </div>
              </div>

              <div>
                <label className={label}>Pick your buddy</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`w-10 h-10 text-xl rounded-xl border-2 ${
                        avatar === a ? 'border-amber-500 bg-amber-100' : 'border-amber-100 bg-white'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 rounded-xl text-sm font-semibold bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black text-base shadow-[0_4px_0_0_#b45309] active:translate-y-0.5 active:shadow-none transition-all mt-2"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : `Create ${info.label} Account`}
          </button>
        </form>
      </div>
    </div>
  );
};