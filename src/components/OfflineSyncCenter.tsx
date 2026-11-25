import React, { useState } from 'react';
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  UploadCloud, 
  HardDrive, 
  Clock, 
  AlertTriangle, 
  Radio, 
  ArrowUpRight, 
  FileCheck,
  Server,
  Zap,
  Check
} from 'lucide-react';
import { SyncQueueItem, ThemeMode, UserProfile } from '../types';
import { sounds } from '../utils/audio';

interface OfflineSyncCenterProps {
  themeMode: ThemeMode;
  userProfile: UserProfile;
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  syncQueue: SyncQueueItem[];
  setSyncQueue: React.Dispatch<React.SetStateAction<SyncQueueItem[]>>;
}

export const OfflineSyncCenter: React.FC<OfflineSyncCenterProps> = ({
  themeMode,
  userProfile,
  isOffline,
  setIsOffline,
  syncQueue,
  setSyncQueue,
}) => {
  const isPrimary = themeMode === 'primary';
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStep, setSyncStep] = useState<string>('');
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>('Today at 01:20 PM');

  const handleStartSync = () => {
    if (isSyncing || syncQueue.length === 0) return;
    if (isOffline) {
      // Prompt user or switch online first
      setIsOffline(false);
    }
    sounds.playPop();
    setIsSyncing(true);
    setSyncProgress(15);
    setSyncStep('Connecting to Rural School Hub Local Wi-Fi (192.168.4.1)...');

    setTimeout(() => {
      setSyncProgress(40);
      setSyncStep('Authenticating Student Token with API Gateway & Data Service...');
      sounds.playSubtleClick();

      setTimeout(() => {
        setSyncProgress(75);
        setSyncStep(`Uploading ${syncQueue.length} offline assessment and activity records...`);
        sounds.playSubtleClick();

        setTimeout(() => {
          setSyncProgress(100);
          setSyncStep('Reconciling conflicts and caching latest teacher curriculum units...');
          sounds.playSyncChime();

          setTimeout(() => {
            setIsSyncing(false);
            setSyncStep('');
            setLastSyncTimestamp('Just now');
            // Mark all items as synced or clear queue
            setSyncQueue([]);
          }, 800);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
            }`}
          >
            {isPrimary ? '📡 School Hub & Offline Sync' : 'Offline Persistence & Hub Synchronization Service'}
          </h1>
          <p
            className={`text-xs sm:text-sm font-medium ${
              isPrimary ? 'text-amber-800' : 'text-slate-400'
            }`}
          >
            {isPrimary
              ? 'Save your quizzes when there is no internet, then upload them when you reach school!'
              : 'Architecture Layer 4: Offline-First Queue Manager & Local Hub Reconciliation.'}
          </p>
        </div>

        {/* Connectivity Toggle Simulator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isPrimary) sounds.playPop();
              else sounds.playSubtleClick();
              setIsOffline(!isOffline);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : isPrimary
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-teal-600 text-white border-teal-500'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-700" /> : <Wifi className="w-4 h-4" />}
            <span>{isOffline ? 'Simulating: Disconnected (Offline)' : 'Simulating: Connected (School Hub)'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hub Connection Node */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isPrimary
              ? 'border-2 border-amber-300 bg-white shadow-[0_4px_0_0_#d97706]'
              : 'border border-slate-800 bg-[#0F172A] text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="opacity-75">Target Rural Hub</span>
            <Server className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-sm font-black truncate">{userProfile.schoolHub}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isOffline ? '⚠️ Unreachable (Offline)' : '🟢 Active Signal (192.168.4.1)'}
          </div>
        </div>

        {/* Pending Queue Count */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isPrimary
              ? 'border-2 border-orange-300 bg-white shadow-[0_4px_0_0_#ea580c]'
              : 'border border-slate-800 bg-[#0F172A] text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="opacity-75">Pending Offline Queue</span>
            <UploadCloud className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black font-mono">
            {syncQueue.length} Items
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Waiting for hub upload
          </div>
        </div>

        {/* Local Storage Footprint */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isPrimary
              ? 'border-2 border-emerald-300 bg-white shadow-[0_4px_0_0_#059669]'
              : 'border border-slate-800 bg-[#0F172A] text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="opacity-75">Local Device Storage</span>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono">
            42.8 MB
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Cached for 100% offline access
          </div>
        </div>

        {/* Last Sync */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isPrimary
              ? 'border-2 border-amber-300 bg-white shadow-[0_4px_0_0_#d97706]'
              : 'border border-slate-800 bg-[#0F172A] text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="opacity-75">Last Synchronized</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-black truncate">{lastSyncTimestamp}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Zero data loss guaranteed
          </div>
        </div>
      </div>

      {/* Main Sync Action Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all ${
          isPrimary
            ? 'border-3 border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/60 to-emerald-50 shadow-[0_6px_0_0_#d97706]'
            : 'border border-slate-800 bg-[#0F172A] shadow-md text-slate-100'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2
              className={`text-xl sm:text-2xl font-black ${
                isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
              }`}
            >
              {syncQueue.length > 0
                ? `Ready to Sync ${syncQueue.length} Local Submissions`
                : 'All Local Records are Fully Synchronized!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              When connected to the Rural School Hub Wi-Fi, RuralConnect uses an automated background sync protocol to deliver student submissions to the teacher portal and download new lessons.
            </p>

            {/* Sync Progress Bar if Active */}
            {isSyncing && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono font-bold text-teal-400">
                  <span>{syncStep}</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-300 rounded-full"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <button
              onClick={handleStartSync}
              disabled={isSyncing || syncQueue.length === 0}
              className={`py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                syncQueue.length === 0
                  ? 'bg-emerald-600 text-white opacity-90 cursor-default'
                  : isPrimary
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_5px_0_0_#b45309] active:translate-y-1 active:shadow-[0_1px_0_0_#b45309]'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg'
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing
                  ? 'Syncing with Hub...'
                  : syncQueue.length === 0
                  ? 'Sync Complete'
                  : 'Sync with School Hub'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Local Sync Queue Table */}
      <div
        className={`rounded-3xl overflow-hidden border-2 ${
          isPrimary
            ? 'border-amber-300 bg-white shadow-[0_4px_0_0_#d97706]'
            : 'border-slate-800 bg-[#0F172A] text-slate-200'
        }`}
      >
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isPrimary ? 'bg-amber-100/80 border-amber-200 text-amber-950' : 'bg-slate-900 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-teal-500" />
            <h3 className="text-base font-black">
              Local Submissions Queue (Stored on Device)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold opacity-75">
            {syncQueue.length} pending items
          </span>
        </div>

        {syncQueue.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-sm font-semibold">
              The local queue is currently empty.
            </p>
            <p className="text-xs">
              Complete quizzes or lessons while offline to see pending submissions queued here!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-amber-100 dark:divide-slate-800">
            {syncQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    <span>{item.title}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        item.type === 'quiz_submission'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{item.timestamp}</span>
                    <span>·</span>
                    <span>Payload: {item.sizeKb} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Hub Connect</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
