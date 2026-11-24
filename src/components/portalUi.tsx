import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeMode } from '../types';

// Theme-aware class strings shared by the teacher / parent screens
export function getUi(themeMode: ThemeMode) {
  const p = themeMode === 'primary';
  return {
    p,
    card: p
      ? 'bg-white border-2 border-amber-200 rounded-3xl shadow-[0_3px_0_0_#fcd34d]'
      : 'bg-[#0B1329] border border-slate-800 rounded-3xl',
    soft: p ? 'bg-amber-50 border border-amber-200 rounded-2xl' : 'bg-slate-900 border border-slate-800 rounded-2xl',
    text: p ? 'text-amber-950' : 'text-slate-100',
    sub: p ? 'text-slate-600' : 'text-slate-400',
    line: p ? 'border-amber-100' : 'border-slate-800',
    input: `w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 ${
      p ? 'bg-white border-amber-300 text-slate-900 focus:ring-amber-400' : 'bg-slate-800 border-slate-700 text-white focus:ring-teal-500'
    }`,
    btn: `px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${
      p ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_2px_0_0_#b45309]' : 'bg-teal-600 hover:bg-teal-500 text-white'
    }`,
    btnGhost: `px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
      p ? 'bg-white border-amber-300 text-amber-900 hover:bg-amber-50' : 'bg-slate-800 border-slate-700 text-teal-300 hover:bg-slate-700'
    }`,
    btnDanger: 'px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-300/40',
    tabOn: p ? 'bg-amber-500 text-white shadow-[0_2px_0_0_#b45309]' : 'bg-teal-600 text-white',
    tabOff: p ? 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800',
    bar: p ? 'bg-amber-100' : 'bg-slate-800',
    barFill: p ? 'bg-emerald-500' : 'bg-teal-500',
  };
}
export type Ui = ReturnType<typeof getUi>;

// load data from the API and allow reload
export function useLoad<T>(loader: () => Promise<T>) {
  const ref = useRef(loader);
  ref.current = loader;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await ref.current());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload };
}

export const ErrorBox: React.FC<{ msg: string }> = ({ msg }) =>
  msg ? <div className="p-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-600 border border-red-300/40">{msg}</div> : null;

export const Loading: React.FC<{ ui: Ui }> = ({ ui }) => (
  <div className={`py-8 text-center text-sm font-semibold ${ui.sub}`}>Loading…</div>
);

export const Empty: React.FC<{ ui: Ui; children: React.ReactNode }> = ({ ui, children }) => (
  <div className={`py-8 px-4 text-center text-sm rounded-2xl border border-dashed ${ui.line} ${ui.sub}`}>{children}</div>
);

export const ProgressBar: React.FC<{ ui: Ui; value: number; max: number }> = ({ ui, value, max }) => (
  <div className={`h-2.5 rounded-full overflow-hidden ${ui.bar}`}>
    <div className={`h-full rounded-full ${ui.barFill}`} style={{ width: `${max ? Math.round((value / max) * 100) : 0}%` }} />
  </div>
);

export const Stat: React.FC<{ ui: Ui; label: string; value: React.ReactNode; hint?: string }> = ({ ui, label, value, hint }) => (
  <div className={`p-3 sm:p-4 ${ui.soft}`}>
    <div className={`text-[11px] font-bold uppercase tracking-wide ${ui.sub}`}>{label}</div>
    <div className="text-xl sm:text-2xl font-black mt-0.5">{value}</div>
    {hint && <div className={`text-[11px] mt-0.5 ${ui.sub}`}>{hint}</div>}
  </div>
);

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const pctColor = (pct: number | null) =>
  pct === null ? '' : pct >= 75 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600';