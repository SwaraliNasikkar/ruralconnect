import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  RotateCcw, 
  Play, 
  Pause, 
  Sliders, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Thermometer, 
  PlusCircle, 
  Layers,
  Activity
} from 'lucide-react';
import { ThemeMode, UserProfile } from '../types';
import { sounds } from '../utils/audio';

interface InteractiveLabViewProps {
  themeMode: ThemeMode;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const InteractiveLabView: React.FC<InteractiveLabViewProps> = ({
  themeMode,
  userProfile,
  setUserProfile,
}) => {
  const isPrimary = themeMode === 'primary';

  // -------------------------------------------------------------
  // PRIMARY LAB: States of Matter & Molecular Motion (Class 3-5 Science)
  // -------------------------------------------------------------
  const [temperatureC, setTemperatureC] = useState<number>(25); // -15 to 130 C
  const [heatRate, setHeatRate] = useState<number>(0); // -2 (cool), 0 (hold), +2 (heat)
  const [labChallengeComplete, setLabChallengeComplete] = useState<boolean>(false);

  // Determine State
  const matterState =
    temperatureC < 0
      ? 'SOLID (Ice)'
      : temperatureC >= 100
      ? 'GAS (Steam Vapor)'
      : 'LIQUID (Water)';

  // Molecular speed factor
  const speedFactor = Math.max(0.2, (temperatureC + 20) / 40);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (heatRate !== 0) {
      interval = setInterval(() => {
        setTemperatureC((prev) => {
          const next = Math.min(130, Math.max(-15, prev + heatRate));
          if (next >= 100 && !labChallengeComplete) {
            setLabChallengeComplete(true);
            sounds.playSuccessChime();
            setUserProfile((u) => ({ ...u, xp: u.xp + 60, stars: u.stars + 3 }));
          }
          return next;
        });
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [heatRate, labChallengeComplete]);

  // -------------------------------------------------------------
  // SECONDARY LAB: Ohm's Law & Circuit Lab Practical (Class 9-10 Physics)
  // -------------------------------------------------------------
  const [voltage, setVoltage] = useState<number>(12); // 1 to 24 V
  const [resistance, setResistance] = useState<number>(4); // 1 to 20 Ohms
  const [recordedReadings, setRecordedReadings] = useState<Array<{ v: number; i: number; r: number }>>([
    { v: 4, i: 1.0, r: 4.0 },
    { v: 8, i: 2.0, r: 4.0 },
    { v: 12, i: 3.0, r: 4.0 },
  ]);

  const currentI = Number((voltage / resistance).toFixed(2));
  const powerWatts = Number((voltage * currentI).toFixed(2));
  const bulbBrightness = Math.min(100, Math.round((powerWatts / 60) * 100));

  const handleRecordReading = () => {
    sounds.playSuccessChime();
    setRecordedReadings((prev) => [
      ...prev,
      { v: voltage, i: currentI, r: resistance },
    ]);
  };

  const handleClearReadings = () => {
    sounds.playSubtleClick();
    setRecordedReadings([]);
  };

  // -------------------------------------------------------------
  // PRIMARY VIEW (Grades 1-5): States of Matter Beaker
  // -------------------------------------------------------------
  if (isPrimary) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-950 font-outfit tracking-tight">
              🧊 States of Matter: Molecular Motion Lab
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-amber-800">
              State Board General Science (Class 4 & 5) · Heat the beaker to watch solid ice melt into water and evaporate into steam!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playPop();
                setTemperatureC(25);
                setHeatRate(0);
                setLabChallengeComplete(false);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-white text-amber-950 border border-amber-300 shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Beaker</span>
            </button>
          </div>
        </div>

        {/* Challenge Banner */}
        <div
          className={`p-4 rounded-3xl border-3 flex items-center justify-between gap-4 transition-all ${
            labChallengeComplete
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-[0_4px_0_0_#059669]'
              : 'bg-amber-100 border-amber-300 text-amber-950 shadow-[0_4px_0_0_#d97706]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shrink-0 shadow-xs">
              {labChallengeComplete ? '🏆' : '🎯'}
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                {labChallengeComplete ? 'Experiment Success: Boiling Point Reached!' : 'State Board Science Mission'}
              </div>
              <div className="text-xs sm:text-sm font-semibold">
                {labChallengeComplete
                  ? 'Water evaporated into steam gas! +60 XP and 3 Gold Stars earned!'
                  : 'Turn on the Bunsen burner flame and heat the beaker past 100°C to boil water into steam!'}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-black font-mono">{temperatureC}°C</span>
          </div>
        </div>

        {/* Two-Zone Sandbox Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Visual Stage: The Science Beaker with Animated Molecules */}
          <div className="lg:col-span-7 rounded-3xl border-3 border-amber-300 bg-gradient-to-b from-sky-50 to-amber-50/40 p-6 shadow-[0_6px_0_0_#d97706] flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            {/* Top State Badge & Thermometer */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-3xl">
                  {temperatureC < 0 ? '🧊' : temperatureC >= 100 ? '💨' : '💧'}
                </span>
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-800">Current Phase</div>
                  <div className="text-base font-black text-amber-950">{matterState}</div>
                </div>
              </div>

              {/* Digital Thermometer */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border-2 border-amber-300 shadow-xs">
                <Thermometer className={`w-5 h-5 ${temperatureC > 70 ? 'text-red-500' : 'text-blue-500'}`} />
                <span className="text-lg font-black font-mono text-amber-950">{temperatureC}°C</span>
              </div>
            </div>

            {/* Central Visual: Beaker with Molecules */}
            <div className="my-auto py-6 flex items-center justify-center relative z-10">
              <div className="w-56 h-56 rounded-b-3xl border-4 border-t-0 border-slate-700 bg-white/70 backdrop-blur-xs relative overflow-hidden shadow-inner flex flex-col justify-end p-3">
                {/* Measuring marks on glass */}
                <div className="absolute left-1 top-6 text-[9px] font-mono text-slate-400">200ml —</div>
                <div className="absolute left-1 top-20 text-[9px] font-mono text-slate-400">100ml —</div>
                <div className="absolute left-1 top-36 text-[9px] font-mono text-slate-400">50ml —</div>

                {/* Liquid Level or Ice block */}
                <div
                  className={`w-full rounded-b-2xl transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                    temperatureC < 0
                      ? 'h-36 bg-cyan-100 border-2 border-cyan-300 shadow-md'
                      : temperatureC >= 100
                      ? 'h-16 bg-blue-200/50'
                      : 'h-32 bg-blue-300/60'
                  }`}
                >
                  {/* Molecule Particles Grid */}
                  <div className="grid grid-cols-4 gap-2.5 p-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                      const animSpeed = Math.max(0.15, 1.2 / speedFactor);
                      return (
                        <div
                          key={num}
                          className={`w-4 h-4 rounded-full transition-all flex items-center justify-center text-[8px] font-bold text-white shadow-xs ${
                            temperatureC < 0
                              ? 'bg-cyan-500'
                              : temperatureC >= 100
                              ? 'bg-orange-500 animate-ping'
                              : 'bg-blue-600 animate-bounce'
                          }`}
                          style={{
                            animationDuration: `${animSpeed}s`,
                            animationDelay: `${(num % 4) * 0.1}s`,
                          }}
                        >
                          H2O
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Steam Rising out of beaker */}
                {temperatureC >= 100 && (
                  <div className="absolute top-2 left-0 right-0 flex justify-center gap-3 text-lg animate-bounce">
                    <span>💨</span>
                    <span>💨</span>
                    <span>💨</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bunsen Burner Flame */}
            <div className="relative z-10 pt-2 border-t border-amber-200 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-300 text-xs font-black text-amber-950">
                <Flame className={`w-4 h-4 ${heatRate > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`} />
                <span>
                  Bunsen Burner: {heatRate > 0 ? '🔥 ACTIVE FLAME (Heating)' : heatRate < 0 ? '❄️ COOLING PACK' : 'OFF (Holding Temp)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Concept & Control Deck */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border-3 border-amber-300 bg-white p-5 sm:p-6 shadow-[0_5px_0_0_#d97706] space-y-5">
              <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
                <Sliders className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-amber-950">
                  Bunsen Burner Controls
                </h3>
              </div>

              {/* Quick Heat / Cool Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setHeatRate(-2);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-black uppercase transition-all ${
                    heatRate === -2
                      ? 'bg-blue-500 text-white shadow-[0_3px_0_0_#1d4ed8]'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
                  }`}
                >
                  ❄️ Cool Down
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setHeatRate(0);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-black uppercase transition-all ${
                    heatRate === 0
                      ? 'bg-amber-400 text-amber-950 shadow-[0_3px_0_0_#b45309]'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200'
                  }`}
                >
                  ⏸️ Hold Temp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setHeatRate(2);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-black uppercase transition-all ${
                    heatRate === 2
                      ? 'bg-orange-500 text-white shadow-[0_3px_0_0_#c2410c]'
                      : 'bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200'
                  }`}
                >
                  🔥 Burner ON
                </button>
              </div>

              {/* Direct Temperature Slider */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-black text-amber-950">
                  <span>Manual Temperature Knob</span>
                  <span className="font-mono text-sm">{temperatureC}°C</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="130"
                  value={temperatureC}
                  onChange={(e) => {
                    sounds.playPop();
                    setTemperatureC(Number(e.target.value));
                    setHeatRate(0);
                  }}
                  className="w-full h-3 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Freezing (-15°C)</span>
                  <span>Room Temp (25°C)</span>
                  <span>Boiling (100°C)</span>
                </div>
              </div>
            </div>

            {/* State Board Textbook Concept Card */}
            <div className="rounded-3xl border-3 border-emerald-300 bg-emerald-50/80 p-5 shadow-[0_4px_0_0_#059669] space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>State Board Science Rules</span>
              </div>
              <ul className="text-xs text-emerald-900 space-y-1 font-medium list-disc list-inside">
                <li><strong>Melting Point of Ice:</strong> Exactly 0°C (32°F) under normal atmospheric pressure.</li>
                <li><strong>Boiling Point of Pure Water:</strong> Exactly 100°C (212°F) where vaporization occurs.</li>
                <li>Molecules speed up as heat energy increases kinetic motion!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SECONDARY VIEW (Grades 6-10): Ohm's Law V-I Practical Lab
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
            <Activity className="w-4 h-4" />
            <span>Class 9 & 10 State Board Physics Practical Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Verification of Ohm’s Law: V = I × R
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Adjust potential difference (V) and resistance (R) to calculate current (I), observe bulb filament brightness, and record the V-I observation table.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecordReading}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record (V, I) Reading</span>
          </button>
        </div>
      </div>

      {/* Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Circuit Virtual Bench & Visual V-I Graph */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl border border-slate-800 bg-[#0F172A] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Circuit Apparatus Diagram
              </span>
              <span className="text-xs font-mono text-slate-400">
                Formula: I = V / R · P = V × I
              </span>
            </div>

            {/* Gauges Strip */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Voltmeter */}
              <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-mono">Voltmeter (V)</div>
                <div className="text-xl font-bold text-teal-400 font-mono tabular-nums">
                  {voltage} V
                </div>
                <div className="text-[10px] text-slate-500">Parallel connection</div>
              </div>

              {/* Ammeter */}
              <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-mono">Ammeter (I)</div>
                <div className="text-xl font-bold text-indigo-400 font-mono tabular-nums">
                  {currentI} A
                </div>
                <div className="text-[10px] text-slate-500">Series connection</div>
              </div>

              {/* Rheostat / Resistor */}
              <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/80 space-y-1">
                <div className="text-[11px] text-slate-400 font-mono">Resistance (R)</div>
                <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                  {resistance} Ω
                </div>
                <div className="text-[10px] text-slate-500">Nichrome Coil</div>
              </div>
            </div>

            {/* Virtual Bulb & Filament Glow */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1329] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-2xl transition-all duration-300"
                  style={{
                    backgroundColor: `rgba(251, 191, 36, ${Math.max(0.1, bulbBrightness / 100)})`,
                    boxShadow: `0 0 ${bulbBrightness / 3}px rgba(251, 191, 36, 0.8)`,
                  }}
                >
                  💡
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Load Lamp Glow</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Luminosity: {bulbBrightness}% · Dissipated Power: {powerWatts} W
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-slate-400">
                <div>Heat: {(powerWatts * 0.24).toFixed(1)} cal/sec</div>
                <div className="text-[10px] text-slate-500">Joule's Law (H = I²Rt)</div>
              </div>
            </div>

            {/* Dynamic V-I Straight Line Graph */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1329] space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>V-I Characteristic Graph (Straight Line passing through origin)</span>
                <span className="text-teal-400 font-bold">Slope = R = {resistance} Ω</span>
              </div>
              <svg viewBox="0 0 400 120" className="w-full h-28 text-teal-400 stroke-current">
                {/* Axes */}
                <line x1="30" y1="10" x2="30" y2="100" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="100" x2="380" y2="100" stroke="#334155" strokeWidth="1" />
                {/* Grid */}
                <line x1="30" y1="40" x2="380" y2="40" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="30" y1="70" x2="380" y2="70" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
                {/* Straight line through origin for Ohm's law */}
                <line
                  x1="30"
                  y1="100"
                  x2={30 + Math.min(340, currentI * 45)}
                  y2={100 - (voltage / 24) * 85}
                  stroke="#2DD4BF"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
                {/* Current Operating Point */}
                <circle
                  cx={30 + Math.min(340, currentI * 45)}
                  cy={100 - (voltage / 24) * 85}
                  r="5"
                  className="fill-teal-400 animate-pulse"
                />
                <text x="35" y="20" fill="#64748B" fontSize="9" fontFamily="monospace">
                  Y-axis: Potential Difference V (Volts)
                </text>
                <text x="260" y="114" fill="#64748B" fontSize="9" fontFamily="monospace">
                  X-axis: Current I (Amperes)
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Sliders & State Board Practical Observation Table */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-xl border border-slate-800 bg-[#0F172A] space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Circuit Controls</span>
            </h3>

            {/* Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Battery Potential Difference (V)</span>
                <span className="text-teal-400 font-bold">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={voltage}
                onChange={(e) => {
                  sounds.playSubtleClick();
                  setVoltage(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 V</span>
                <span>12 V (Standard Battery)</span>
                <span>24 V</span>
              </div>
            </div>

            {/* Resistance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Rheostat Resistance (R)</span>
                <span className="text-amber-400 font-bold">{resistance} Ohms (Ω)</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={resistance}
                onChange={(e) => {
                  sounds.playSubtleClick();
                  setResistance(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Ω (Low resistance)</span>
                <span>20 Ω (High resistance)</span>
              </div>
            </div>
          </div>

          {/* Observation Table */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0F172A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Practical Observation Table
              </span>
              <button
                onClick={handleClearReadings}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline"
              >
                Clear Readings
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-1">Obs #</th>
                    <th className="py-1">V (Volts)</th>
                    <th className="py-1">I (Amps)</th>
                    <th className="py-1">R = V/I (Ω)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recordedReadings.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-1 text-slate-400">{idx + 1}</td>
                      <td className="py-1 text-teal-400">{row.v}</td>
                      <td className="py-1 text-indigo-400">{row.i}</td>
                      <td className="py-1 text-white font-bold">{row.r.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
