import React from 'react';
import { Calendar, Dumbbell, Trophy, Activity } from 'lucide-react';

// Renders decorative fan / arc shapes as an SVG background
function FanBackground() {
  const fans = [
    { cx: -60,  cy: -60,  r: 260, color: '#d1fae5', count: 6 },
    { cx: 110,  cy: -80,  r: 200, color: '#a7f3d0', count: 5 },
    { cx: '100%', cy: -50, r: 220, color: '#bbf7d0', count: 5, flip: true },
    { cx: -80,  cy: '100%', r: 240, color: '#d1fae5', count: 6 },
    { cx: '100%', cy: '100%', r: 260, color: '#a7f3d0', count: 6, flip: true },
    { cx: '50%', cy: '110%', r: 200, color: '#ecfdf5', count: 5 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {fans.map((fan, fi) => {
        const slices = fan.count;
        const totalAngle = 90; // degrees each fan spans
        const startAngle = fan.flip ? 180 : 0;
        return Array.from({ length: slices }).map((_, i) => {
          const a1 = startAngle + (i / slices) * totalAngle;
          const a2 = startAngle + ((i + 1) / slices) * totalAngle;
          const r = fan.r - i * 12;
          const toRad = (d) => (d * Math.PI) / 180;
          const x1 = Math.cos(toRad(a1)) * r;
          const y1 = Math.sin(toRad(a1)) * r;
          const x2 = Math.cos(toRad(a2)) * r;
          const y2 = Math.sin(toRad(a2)) * r;
          return (
            <path
              key={`${fi}-${i}`}
              d={`M ${fan.cx} ${fan.cy} L ${`${fan.cx}`.includes('%') ? fan.cx : fan.cx + x1} ${`${fan.cy}`.includes('%') ? fan.cy : fan.cy + y1} A ${r} ${r} 0 0 1 ${`${fan.cx}`.includes('%') ? fan.cx : fan.cx + x2} ${`${fan.cy}`.includes('%') ? fan.cy : fan.cy + y2} Z`}
              fill={fan.color}
              opacity={0.6 - i * 0.08}
            />
          );
        });
      })}
    </svg>
  );
}

// A simpler fan using absolute pixel coords for reliability
function FanArc({ cx, cy, maxR, slices, baseColor, startDeg, endDeg }) {
  const toRad = (d) => (d * Math.PI) / 180;
  return (
    <>
      {Array.from({ length: slices }).map((_, i) => {
        const r = maxR - i * (maxR / slices) * 0.25;
        const a1 = startDeg + (i / slices) * (endDeg - startDeg);
        const a2 = startDeg + ((i + 1) / slices) * (endDeg - startDeg);
        const x1 = cx + Math.cos(toRad(a1)) * r;
        const y1 = cy + Math.sin(toRad(a1)) * r;
        const x2 = cx + Math.cos(toRad(a2)) * r;
        const y2 = cy + Math.sin(toRad(a2)) * r;
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
            fill={baseColor}
            opacity={0.55 - i * 0.06}
          />
        );
      })}
    </>
  );
}

const TILES = [
  {
    id: 'start_exercise',
    label: 'Start Exercise',
    sub: 'Play a game, earn reps',
    Icon: Dumbbell,
    accent: '#2563eb',
    light: '#dbeafe',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    sub: 'Track your daily intensity',
    Icon: Calendar,
    accent: '#0369a1',
    light: '#e0f2fe',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    sub: 'See the community rankings',
    Icon: Trophy,
    accent: '#1d4ed8',
    light: '#eff6ff',
  },
];

export default function Home({ onNavigate }) {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col items-center justify-center px-6 py-16">
      {/* Fan SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Top-left fan */}
        <FanArc cx={0}    cy={0}    maxR={520} slices={9} baseColor="#bfdbfe" startDeg={0}   endDeg={100} />
        {/* Top-right fan */}
        <FanArc cx={1200} cy={0}    maxR={480} slices={9} baseColor="#93c5fd" startDeg={80}  endDeg={185} />
        {/* Bottom-left fan */}
        <FanArc cx={0}    cy={800}  maxR={440} slices={8} baseColor="#dbeafe" startDeg={-15} endDeg={85}  />
        {/* Bottom-right fan */}
        <FanArc cx={1200} cy={800}  maxR={480} slices={8} baseColor="#bfdbfe" startDeg={90}  endDeg={195} />
        {/* Center-bottom subtle fan */}
        <FanArc cx={600}  cy={950}  maxR={420} slices={6} baseColor="#eff6ff" startDeg={190} endDeg={350} />
        {/* Center-top subtle fan */}
        <FanArc cx={600}  cy={-100} maxR={380} slices={6} baseColor="#eff6ff" startDeg={10}  endDeg={170} />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {/* Animated GIF logo */}
        <div className="flex items-center gap-4 mb-4 animate-fade-in">
          <img
            src="/logo.gif"
            alt="Fan of Exercise logo"
            className="w-24 h-24 object-contain"
            onError={(e) => { e.currentTarget.src = '/logo.png'; }}
          />
        </div>

        <h1
          className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter text-center leading-none mb-4 animate-fade-in"
          style={{ animationDelay: '0.05s' }}
        >
          Fan of <span className="text-blue-600">Exercise</span>
        </h1>

        <p
          className="text-slate-500 text-xl font-medium text-center mb-16 animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          Consistency is key. Track your daily momentum.
        </p>

        {/* Navigation Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {TILES.map((tile, i) => (
            <button
              key={tile.id}
              onClick={() => onNavigate(tile.id)}
              className="group text-left p-8 rounded-3xl border-2 border-slate-100 bg-white hover:border-current transition-all duration-200 hover:-translate-y-1 animate-fade-in flex flex-col gap-4"
              style={{
                animationDelay: `${0.15 + i * 0.07}s`,
                '--tw-border-opacity': 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = tile.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: tile.light }}
              >
                <tile.Icon size={28} style={{ color: tile.accent }} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
                  {tile.label}
                </h2>
                <p className="text-slate-400 font-medium mt-2 text-sm">{tile.sub}</p>
              </div>

              <div
                className="mt-auto text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                style={{ color: tile.accent }}
              >
                Go →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
