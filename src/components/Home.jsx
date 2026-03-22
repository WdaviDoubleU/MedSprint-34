import React from 'react';
import { Calendar, Dumbbell, Trophy } from 'lucide-react';

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
    <div className="relative z-10 w-full flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center px-6 py-12 md:py-16 bg-transparent">
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-4 animate-fade-in">
          <img
            src="/LogoGif.gif"
            alt="Fan of Exercise logo"
            className="w-24 h-24 object-contain"
            onError={(e) => { e.currentTarget.src = '/LogoPNG.png'; }}
          />
        </div>

        <h1
          className="text-7xl sm:text-8xl md:text-9xl font-black text-slate-900 tracking-tighter text-center leading-[0.95] mb-4 animate-fade-in px-2"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {TILES.map((tile, i) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => onNavigate(tile.id)}
              className="group relative text-left p-8 rounded-3xl border-2 border-slate-100 bg-white/95 hover:border-current opacity-0 animate-fade-in-opacity flex flex-col gap-4 backdrop-blur-[1px] will-change-transform transition-transform duration-300 ease-out motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-md motion-safe:active:translate-y-0"
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
