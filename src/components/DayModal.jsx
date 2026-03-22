import { X } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import './DayModal.css';

function intensityLabel(points) {
  if (points <= 0) return { label: 'No intensity logged', tier: 0 };
  if (points < 15) return { label: 'Light activity', tier: 1 };
  if (points < 30) return { label: 'Moderate activity', tier: 2 };
  if (points < 60) return { label: 'Intense workout', tier: 3 };
  return { label: 'Very intense', tier: 4 };
}

/** Deterministic fake metrics for demo calendar */
function demoExtras(date, points) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  let h = d * 131542391 + m * 19349663;
  h ^= h >>> 13;
  h = Math.imul(h, 1540483477);
  const seed = Math.abs(h) % 1000;
  const activeMin = points > 0 ? Math.round(points * 0.72 + (seed % 18)) : 0;
  const calories = points > 0 ? Math.round(points * 3.1 + (seed % 40)) : 0;
  const sessions = points > 0 ? 1 + Math.floor(seed % 4) + (points >= 30 ? 1 : 0) : 0;
  const topGame = ['Rep-o-gotchi', 'Running Challenge', 'Aero Reps'][(seed + d) % 3];
  const avgHr = points > 0 ? 108 + (seed % 35) : '—';
  return { activeMin, calories, sessions, topGame, avgHr };
}

export default function DayModal({ isOpen, onClose, date, rawPoints, isExample }) {
  if (!isOpen || !date) return null;

  const dateStr = format(date, 'MMMM d, yyyy');
  const points = Math.max(0, rawPoints ?? 0);
  const missed =
    (isExample && rawPoints < 0) ||
    (!isExample && points === 0 && isPast(date) && !isToday(date));
  const future = !isPast(date) && !isToday(date) && points === 0;
  const emptyToday = points === 0 && isToday(date) && !isExample;
  const { label: intensityName, tier } = intensityLabel(points);
  const realExtras = isExample
    ? demoExtras(date, points)
    : {
        activeMin: points > 0 ? Math.round(points * 0.65 + 8) : 0,
        calories: points > 0 ? Math.round(points * 2.8) : 0,
        sessions: points > 0 ? Math.max(1, Math.ceil(points / 22)) : 0,
        topGame: points > 40 ? 'Running Challenge' : points > 15 ? 'Rep-o-gotchi' : 'Aero Reps',
        avgHr: points > 0 ? Math.round(102 + (points % 28)) : '—',
      };

  return (
    <div className="modal-backdrop animate-fade-in-opacity" onClick={onClose}>
      <div
        className="modal-content flat-panel modal-stats"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex justify-between items-start gap-4 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily stats</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{dateStr}</h3>
            {isExample && (
              <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Demo data
              </span>
            )}
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-800 transition-colors shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {missed && (
          <div className="rounded-xl border-2 border-red-100 bg-red-50 px-4 py-6 text-center">
            <p className="font-bold text-red-800">No activity logged</p>
            <p className="text-sm text-red-600/90 mt-2">This day counts as missed on your calendar.</p>
          </div>
        )}

        {future && !missed && (
          <div className="rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-6 text-center">
            <p className="font-bold text-slate-700">Upcoming day</p>
            <p className="text-sm text-slate-500 mt-2">Log a workout when the day arrives.</p>
          </div>
        )}

        {emptyToday && (
          <div className="rounded-xl border-2 border-amber-100 bg-amber-50 px-4 py-5 text-center mb-4">
            <p className="font-bold text-amber-900">Nothing logged yet today</p>
            <p className="text-sm text-amber-800/90 mt-1">Start an exercise from the menu to earn points.</p>
          </div>
        )}

        {!missed && !future && !emptyToday && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Points</p>
                <p className="text-2xl font-black text-slate-900">{points}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Intensity</p>
                <p className="text-sm font-bold text-slate-900 leading-tight mt-1">{intensityName}</p>
              </div>
            </div>

            <div className="h-2 rounded-full mb-4 overflow-hidden flex bg-slate-200">
              {[
                { t: 1, bg: '#fb923c' },
                { t: 2, bg: '#facc15' },
                { t: 3, bg: '#4ade80' },
                { t: 4, bg: '#15803d' },
              ].map(({ t, bg }) => (
                <div
                  key={t}
                  className="flex-1 border-r border-white/30 last:border-0"
                  style={{ backgroundColor: tier >= t ? bg : '#e2e8f0' }}
                />
              ))}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Est. active minutes</span>
                <span className="font-bold text-slate-900">{realExtras.activeMin} min</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Sessions</span>
                <span className="font-bold text-slate-900">{realExtras.sessions}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Top mini-game</span>
                <span className="font-bold text-slate-900">{realExtras.topGame}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Est. calories</span>
                <span className="font-bold text-slate-900">{realExtras.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg. heart rate</span>
                <span className="font-bold text-slate-900">
                  {typeof realExtras.avgHr === 'number' ? `${realExtras.avgHr} bpm` : realExtras.avgHr}
                </span>
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-slate-900 text-white font-bold py-3 hover:bg-slate-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
