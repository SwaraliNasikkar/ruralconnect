import React from 'react';
import { ThemeMode } from '../types';

/**
 * 1. Animated Hero Banner Graphic for the Registration / Portal Landing Page
 */
export const VillageHeroIllustration: React.FC<{ themeMode: ThemeMode }> = ({ themeMode }) => {
  const isPrimary = themeMode === 'primary';

  if (isPrimary) {
    return (
      <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-3xl border-3 border-amber-300 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-100 shadow-inner">
        <svg
          viewBox="0 0 800 260"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Smiling Sun with Rotating Rays */}
          <g transform="translate(110, 65)">
            <g className="animate-spin-slow">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <rect
                  key={angle}
                  x="-3"
                  y="-52"
                  width="6"
                  height="14"
                  rx="3"
                  fill="#FBBF24"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>
            <circle cx="0" cy="0" r="34" fill="url(#sunGrad)" stroke="#FFF" strokeWidth="3" />
            {/* Cute Sun Face */}
            <circle cx="-10" cy="-4" r="3.5" fill="#78350F" />
            <circle cx="10" cy="-4" r="3.5" fill="#78350F" />
            <path d="M -10 8 Q 0 18 10 8" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Floating Clouds */}
          <g className="animate-float-cloud" transform="translate(240, 35)">
            <path
              d="M20,30 Q20,15 35,15 Q42,5 58,8 Q72,2 82,15 Q98,15 98,30 Z"
              fill="#FFFFFF"
              opacity="0.92"
            />
          </g>
          <g className="animate-float-cloud" style={{ animationDelay: '2.5s' }} transform="translate(560, 25) scale(1.15)">
            <path
              d="M20,30 Q20,15 35,15 Q42,5 58,8 Q72,2 82,15 Q98,15 98,30 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>

          {/* Flying Birds */}
          <path d="M 390 55 Q 396 47 402 55 Q 408 47 414 55" fill="none" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 425 42 Q 430 36 435 42 Q 440 36 445 42" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />

          {/* Rolling Green Village Hills */}
          <path d="M0,190 Q180,115 410,180 T800,155 L800,260 L0,260 Z" fill="url(#hillFar)" />
          <path d="M0,210 Q260,150 520,200 T800,195 L800,260 L0,260 Z" fill="url(#hillNear)" />

          {/* Winding Dirt Path to School */}
          <path
            d="M 400 195 Q 360 225 430 260 L 495 260 Q 415 225 435 195 Z"
            fill="#FDE68A"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />

          {/* Eco Windmill on Left Hill */}
          <g transform="translate(215, 110)">
            <polygon points="-6,75 6,75 3,0 -3,0" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" />
            <g className="animate-spin-slow">
              <rect x="-2.5" y="-34" width="5" height="68" rx="2" fill="#F59E0B" />
              <rect x="-34" y="-2.5" width="68" height="5" rx="2" fill="#F59E0B" />
              <circle cx="0" cy="0" r="6" fill="#B45309" />
            </g>
          </g>

          {/* Village Schoolhouse (Zilla Parishad Shala) */}
          <g transform="translate(355, 112)">
            {/* Main Building */}
            <rect x="15" y="38" width="120" height="56" rx="6" fill="#FFFBEB" stroke="#B45309" strokeWidth="3" />
            {/* Terracotta Roof */}
            <polygon points="4,40 75,6 146,40" fill="#EA580C" stroke="#9A3412" strokeWidth="3" strokeLinejoin="round" />
            {/* School Bell Tower & Flag */}
            <line x1="75" y1="6" x2="75" y2="-22" stroke="#78350F" strokeWidth="3" />
            <polygon points="75,-22 104,-14 75,-6" fill="#10B981" />
            {/* School Door & Windows */}
            <rect x="61" y="56" width="28" height="38" rx="14" fill="#F59E0B" stroke="#78350F" strokeWidth="2.5" />
            <rect x="28" y="52" width="20" height="20" rx="4" fill="#38BDF8" stroke="#78350F" strokeWidth="2.5" />
            <rect x="102" y="52" width="20" height="20" rx="4" fill="#38BDF8" stroke="#78350F" strokeWidth="2.5" />
            {/* Signboard */}
            <rect x="45" y="26" width="60" height="14" rx="4" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
            <text x="75" y="36" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">
              SCHOOL HUB
            </text>
          </g>

          {/* Lush Banyan Tree on Right */}
          <g transform="translate(620, 105)">
            <rect x="22" y="48" width="16" height="45" rx="4" fill="#78350F" />
            <circle cx="30" cy="35" r="30" fill="#15803D" />
            <circle cx="10" cy="45" r="22" fill="#16A34A" />
            <circle cx="50" cy="45" r="22" fill="#16A34A" />
            <circle cx="30" cy="18" r="22" fill="#22C55E" />
            {/* Fruits on tree */}
            <circle cx="18" cy="35" r="4" fill="#F97316" />
            <circle cx="44" cy="28" r="4" fill="#F97316" />
            <circle cx="32" cy="48" r="4" fill="#F97316" />
          </g>
        </svg>

        {/* Floating Tag */}
        <div className="absolute bottom-2.5 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border-2 border-amber-400 text-[11px] font-black text-amber-950 flex items-center gap-1.5 shadow-xs">
          <span className="text-sm">🏡</span>
          <span>Interactive Village School Portal • Works 100% Offline!</span>
        </div>
      </div>
    );
  }

  // Secondary Mode: Night Starry STEM & Rural Satellite Hub
  return (
    <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-b from-[#050B16] via-[#0F172A] to-[#0F2942] shadow-inner">
      <svg
        viewBox="0 0 800 260"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Glowing Constellation Grid */}
        <g stroke="#1E293B" strokeWidth="1">
          <line x1="0" y1="60" x2="800" y2="60" />
          <line x1="0" y1="120" x2="800" y2="120" />
          <line x1="0" y1="180" x2="800" y2="180" />
          <line x1="200" y1="0" x2="200" y2="260" />
          <line x1="400" y1="0" x2="400" y2="260" />
          <line x1="600" y1="0" x2="600" y2="260" />
        </g>

        {/* Constellation Lines */}
        <g stroke="#2DD4BF" strokeWidth="1.2" opacity="0.45">
          <line x1="120" y1="50" x2="180" y2="80" />
          <line x1="180" y1="80" x2="250" y2="45" />
          <line x1="250" y1="45" x2="310" y2="90" />
          <line x1="550" y1="40" x2="620" y2="75" />
          <line x1="620" y1="75" x2="690" y2="50" />
        </g>

        {/* Twinkling Stars */}
        {[
          [120, 50], [180, 80], [250, 45], [310, 90],
          [550, 40], [620, 75], [690, 50], [90, 110], [460, 35], [730, 105],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="#5EEAD4"
            className="animate-pulse-glow"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        {/* Orbiting Planet / Atom Graphic */}
        <g transform="translate(650, 85)" className="animate-float-slow">
          <circle cx="0" cy="0" r="24" fill="#6366F1" />
          <ellipse cx="0" cy="0" rx="46" ry="12" fill="none" stroke="#2DD4BF" strokeWidth="2.5" transform="rotate(-20)" />
        </g>

        {/* Mountain Silhouette */}
        <polygon points="0,260 0,185 160,130 320,195 510,125 690,185 800,150 800,260" fill="#0B1528" stroke="#1E293B" strokeWidth="2" />

        {/* Rural Hub Wi-Fi Signal Tower */}
        <g transform="translate(400, 115)">
          <circle cx="0" cy="0" r="38" fill="none" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.25" className="animate-ping" />
          <circle cx="0" cy="0" r="22" fill="none" stroke="#2DD4BF" strokeWidth="2" opacity="0.5" />
          <polygon points="-14,95 14,95 4,0 -4,0" fill="#1E293B" stroke="#2DD4BF" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#2DD4BF" />
        </g>
      </svg>

      <div className="absolute bottom-2.5 left-3 bg-slate-900/90 backdrop-blur-xs px-3 py-1 rounded-lg border border-teal-500/40 text-[11px] font-mono text-teal-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
        <span>STATE BOARD STEM WORKBENCH • OFFLINE HUB ACTIVE</span>
      </div>
    </div>
  );
};

/**
 * 2. Animated Chintu The Parakeet Mascot SVG
 */
export const ChintuMascotSVG: React.FC<{ size?: number; isSpeaking?: boolean }> = ({
  size = 64,
  isSpeaking = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`overflow-visible ${isSpeaking ? 'animate-bounce' : 'animate-float-slow'}`}
  >
    {/* Glow Aura */}
    <circle cx="50" cy="52" r="42" fill="#FEF08A" opacity="0.6" />
    {/* Body */}
    <ellipse cx="50" cy="56" rx="28" ry="30" fill="#22C55E" stroke="#15803D" strokeWidth="3.5" />
    {/* Belly Patch */}
    <ellipse cx="50" cy="63" rx="18" ry="20" fill="#86EFAC" />
    {/* Head Tuft Feathers */}
    <path d="M 45 26 Q 40 12 48 16 Q 53 10 56 26" fill="#16A34A" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
    {/* Red Collar Band (Indian Ringneck Parakeet) */}
    <path d="M 25 46 Q 50 54 75 46" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
    {/* Left & Right Wings */}
    <ellipse
      cx="21"
      cy="56"
      rx="8"
      ry="16"
      fill="#16A34A"
      stroke="#15803D"
      strokeWidth="3"
      transform={isSpeaking ? 'rotate(25 21 56)' : 'rotate(8 21 56)'}
    />
    <ellipse
      cx="79"
      cy="56"
      rx="8"
      ry="16"
      fill="#16A34A"
      stroke="#15803D"
      strokeWidth="3"
      transform={isSpeaking ? 'rotate(-25 79 56)' : 'rotate(-8 79 56)'}
    />
    {/* Eyes */}
    <circle cx="39" cy="40" r="6" fill="#FFFFFF" stroke="#14532D" strokeWidth="2.5" />
    <circle cx="40" cy="40" r="3" fill="#0F172A" />
    <circle cx="61" cy="40" r="6" fill="#FFFFFF" stroke="#14532D" strokeWidth="2.5" />
    <circle cx="60" cy="40" r="3" fill="#0F172A" />
    {/* Curved Red/Orange Parakeet Beak */}
    <path
      d="M 44 43 Q 50 39 56 43 L 50 55 Z"
      fill="#F97316"
      stroke="#9A3412"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Little Scholar Graduation Cap */}
    <polygon points="50,15 24,25 50,33 76,25" fill="#1E293B" stroke="#FBBF24" strokeWidth="2" />
    <line x1="72" y1="26" x2="76" y2="38" stroke="#FBBF24" strokeWidth="2.5" />
    <circle cx="76" cy="39" r="3" fill="#FBBF24" />
  </svg>
);

/**
 * 3. Visual Concept Diagrams for Interactive Lesson Slides
 */
export const LessonConceptIllustration: React.FC<{ concept?: string; isPrimary: boolean }> = ({
  concept,
  isPrimary,
}) => {
  if (!concept) return null;

  return (
    <div
      className={`w-full rounded-2xl p-4 flex flex-col items-center justify-center border-2 overflow-hidden ${
        isPrimary
          ? 'bg-gradient-to-br from-amber-50 via-white to-sky-50 border-amber-300 shadow-inner'
          : 'bg-[#070D1D] border-slate-800 shadow-inner'
      }`}
    >
      {/* Matter States Graphic */}
      {(concept === 'three_states_matter' ||
        concept === 'solid_molecules_packed' ||
        concept === 'gas_liquid_molecules') && (
        <svg viewBox="0 0 500 135" className="w-full max-w-lg h-32">
          {/* Solid Box */}
          <g transform="translate(20, 15)">
            <rect width="120" height="90" rx="14" fill="#ECFEFF" stroke="#06B6D4" strokeWidth="3" />
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <circle key={`s-${r}-${c}`} cx={30 + c * 20} cy={25 + r * 20} r="8" fill="#0891B2" />
              ))
            )}
            <text x="60" y="108" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0E7490">
              🧊 SOLID (Packed)
            </text>
          </g>

          {/* Liquid Box */}
          <g transform="translate(190, 15)">
            <rect width="120" height="90" rx="14" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="3" />
            <path d="M 4 50 Q 35 42 60 50 T 116 50 L 116 86 L 4 86 Z" fill="#93C5FD" opacity="0.5" />
            {[
              [28, 55], [52, 62], [78, 54], [95, 68], [38, 76], [65, 75], [88, 78],
            ].map(([cx, cy], i) => (
              <circle key={`l-${i}`} cx={cx} cy={cy} r="8" fill="#2563EB" />
            ))}
            <text x="60" y="108" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1D4ED8">
              💧 LIQUID (Flows)
            </text>
          </g>

          {/* Gas Box */}
          <g transform="translate(360, 15)">
            <rect width="120" height="90" rx="14" fill="#FFF7ED" stroke="#F97316" strokeWidth="3" />
            {[
              [28, 25], [88, 28], [55, 48], [25, 70], [92, 68],
            ].map(([cx, cy], i) => (
              <g key={`g-${i}`}>
                <circle cx={cx} cy={cy} r="8" fill="#EA580C" />
                <line x1={cx - 12} y1={cy - 8} x2={cx - 6} y2={cy - 4} stroke="#FB923C" strokeWidth="2" />
              </g>
            ))}
            <text x="60" y="108" textAnchor="middle" fontSize="12" fontWeight="900" fill="#C2410C">
              🎈 GAS (Zooms Free)
            </text>
          </g>
        </svg>
      )}

      {/* Fractions Graphic */}
      {(concept === 'half_chapati_fraction' ||
        concept === 'quarter_fractions_grid' ||
        concept === 'fraction_addition_bar') && (
        <svg viewBox="0 0 500 135" className="w-full max-w-lg h-32">
          {/* 1/2 Circle */}
          <g transform="translate(85, 60)">
            <circle r="44" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
            <path d="M 0 -44 A 44 44 0 0 1 0 44 Z" fill="#F59E0B" />
            <line x1="0" y1="-44" x2="0" y2="44" stroke="#78350F" strokeWidth="3" strokeDasharray="4 3" />
            <text x="0" y="62" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350F">
              1/2 (Half Chapati)
            </text>
          </g>

          {/* 1/4 Circle */}
          <g transform="translate(250, 60)">
            <circle r="44" fill="#DCFCE7" stroke="#059669" strokeWidth="3" />
            <path d="M 0 0 L 0 -44 A 44 44 0 0 1 44 0 Z" fill="#10B981" />
            <line x1="0" y1="-44" x2="0" y2="44" stroke="#065F46" strokeWidth="2.5" />
            <line x1="-44" y1="0" x2="44" y2="0" stroke="#065F46" strokeWidth="2.5" />
            <text x="0" y="62" textAnchor="middle" fontSize="13" fontWeight="900" fill="#065F46">
              1/4 (One Quarter)
            </text>
          </g>

          {/* 3/4 Circle */}
          <g transform="translate(415, 60)">
            <circle r="44" fill="#FCE7F3" stroke="#DB2777" strokeWidth="3" />
            <path d="M 0 0 L 0 -44 A 44 44 0 1 1 -44 0 Z" fill="#EC4899" />
            <line x1="0" y1="-44" x2="0" y2="44" stroke="#831843" strokeWidth="2.5" />
            <line x1="-44" y1="0" x2="44" y2="0" stroke="#831843" strokeWidth="2.5" />
            <text x="0" y="62" textAnchor="middle" fontSize="13" fontWeight="900" fill="#831843">
              3/4 (Three Quarters)
            </text>
          </g>
        </svg>
      )}

      {/* Simple Machines: Lever & Pulley */}
      {(concept === 'simple_machines_overview' ||
        concept === 'lever_fulcrum_diagram' ||
        concept === 'pulley_and_ramp') && (
        <svg viewBox="0 0 500 130" className="w-full max-w-lg h-32">
          {/* Seesaw Lever */}
          <g transform="translate(250, 80)">
            {/* Fulcrum Triangle */}
            <polygon points="0,0 -24,32 24,32" fill="#F59E0B" stroke="#78350F" strokeWidth="3" />
            <text x="0" y="45" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350F">
              FULCRUM (Pivot)
            </text>
            {/* Plank */}
            <g className="animate-wiggle">
              <rect x="-150" y="-8" width="300" height="10" rx="5" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
              {/* Load Box */}
              <rect x="-135" y="-42" width="42" height="34" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
              <text x="-114" y="-21" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFF">
                LOAD
              </text>
              {/* Effort Push */}
              <circle cx="115" cy="-26" r="16" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
              <text x="115" y="-22" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FFF">
                EFFORT
              </text>
            </g>
          </g>
        </svg>
      )}

      {/* Grammar Tenses Timeline */}
      {(concept === 'action_verbs_illustration' || concept === 'timeline_tenses') && (
        <svg viewBox="0 0 500 115" className="w-full max-w-lg h-28">
          <line x1="50" y1="55" x2="450" y2="55" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          {[
            { x: 95, label: 'PAST Tense', sub: 'Yesterday I played', color: '#3B82F6' },
            { x: 250, label: 'PRESENT Tense', sub: 'Today I play', color: '#10B981' },
            { x: 405, label: 'FUTURE Tense', sub: 'Tomorrow I will play', color: '#F97316' },
          ].map((item, idx) => (
            <g key={idx} transform={`translate(${item.x}, 55)`}>
              <circle r="14" fill={item.color} stroke="#FFF" strokeWidth="3" />
              <text y="-22" textAnchor="middle" fontSize="12" fontWeight="900" fill={item.color}>
                {item.label}
              </text>
              <text y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                "{item.sub}"
              </text>
            </g>
          ))}
        </svg>
      )}

      {/* Secondary: Ohm's Law & Circuits */}
      {(concept === 'ohms_law_circuit_diagram' ||
        concept === 'conductor_resistance_geometry' ||
        concept === 'series_parallel_schematic') && (
        <svg viewBox="0 0 500 135" className="w-full max-w-lg h-32">
          <rect x="70" y="20" width="360" height="90" rx="12" fill="none" stroke="#334155" strokeWidth="3" />
          <rect
            x="70"
            y="20"
            width="360"
            height="90"
            rx="12"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="3"
            className="animate-current-flow"
          />
          {/* Resistor ZigZag Top */}
          <rect x="195" y="8" width="110" height="24" rx="6" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
          <text x="250" y="24" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#FBBF24">
            Resistor (R Ω)
          </text>
          {/* Ammeter Right */}
          <circle cx="430" cy="65" r="20" fill="#0F172A" stroke="#818CF8" strokeWidth="2.5" />
          <text x="430" y="69" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill="#818CF8">
            A
          </text>
          {/* Battery Bottom */}
          <rect x="205" y="96" width="90" height="26" rx="6" fill="#0F172A" stroke="#2DD4BF" strokeWidth="2" />
          <text x="250" y="113" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#2DD4BF">
            + V (Volts) -
          </text>
        </svg>
      )}

      {/* Secondary: Linear Equations / Cell / Chemistry Fallback */}
      {(concept === 'linear_equation_graph' ||
        concept === 'elimination_algebra_steps' ||
        concept === 'cramers_rule_matrix' ||
        concept === 'plant_vs_animal_cell' ||
        concept === 'mitosis_four_stages' ||
        concept === 'balanced_reaction_scale' ||
        concept === 'types_chemical_reactions') && (
        <svg viewBox="0 0 500 125" className="w-full max-w-lg h-28">
          <line x1="60" y1="105" x2="440" y2="105" stroke="#475569" strokeWidth="2" />
          <line x1="100" y1="15" x2="100" y2="115" stroke="#475569" strokeWidth="2" />
          <line x1="100" y1="95" x2="390" y2="25" stroke="#2DD4BF" strokeWidth="3.5" />
          <line x1="100" y1="30" x2="390" y2="95" stroke="#818CF8" strokeWidth="3.5" />
          <circle cx="245" cy="60" r="7" fill="#FBBF24" />
          <text x="255" y="50" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="#FBBF24">
            Intersection (x, y)
          </text>
        </svg>
      )}
    </div>
  );
};