import { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, Flame, Activity } from 'lucide-react';

const DEMO = {
  kpis: {
    todayPoints: 47,
    weekTotal: 312,
    monthTotal: 1284,
    bestDay: 'Wednesday',
    avgMinutes: 38,
    goldDays: 9,
  },
  weekBars: [
    { label: 'Mon', pts: 42 },
    { label: 'Tue', pts: 55 },
    { label: 'Wed', pts: 38 },
    { label: 'Thu', pts: 62 },
    { label: 'Fri', pts: 48 },
    { label: 'Sat', pts: 71 },
    { label: 'Sun', pts: 59 },
  ],
  monthBars: [
    { label: 'W1', pts: 280 },
    { label: 'W2', pts: 310 },
    { label: 'W3', pts: 265 },
    { label: 'W4', pts: 429 },
  ],
  dayHourly: [
    { h: '6a', v: 12 },
    { h: '9a', v: 28 },
    { h: '12p', v: 45 },
    { h: '3p', v: 22 },
    { h: '6p', v: 58 },
    { h: '9p', v: 35 },
  ],
  trendLine: [120, 132, 118, 145, 139, 156, 148, 162, 155, 170, 168, 175],
};

/** Dots with dashed connecting lines — values use `.pts` */
function ScatterLineChart({ items, max }) {
  const W = 420;
  const H = 168;
  const chartTop = 14;
  const chartBottom = 118;
  const chartH = chartBottom - chartTop;
  const padX = 32;
  const m = max ?? Math.max(...items.map((i) => i.pts), 1);
  const n = items.length;
  const pts = items.map((row, i) => {
    const x = n === 1 ? W / 2 : padX + (i / (n - 1)) * (W - 2 * padX);
    const y = chartBottom - (row.pts / m) * chartH;
    return { x, y, label: row.label };
  });
  const linePts = pts.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl h-52 mx-auto" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {pts.map((p, i) => (
        <text
          key={`l-${i}`}
          x={p.x}
          y={H - 4}
          textAnchor="middle"
          fill="#64748b"
          style={{ fontSize: '11px', fontWeight: 700 }}
        >
          {p.label}
        </text>
      ))}
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeDasharray="8 6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePts}
      />
      {pts.map((p, i) => (
        <circle key={`d-${i}`} cx={p.x} cy={p.y} r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
      ))}
    </svg>
  );
}

/** Same style for simple number arrays (monthly trend) */
function ScatterTrend({ values }) {
  const W = 420;
  const H = 140;
  const chartTop = 12;
  const chartBottom = 108;
  const chartH = chartBottom - chartTop;
  const padX = 24;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const n = values.length;
  const pts = values.map((v, i) => {
    const x = n === 1 ? W / 2 : padX + (i / (n - 1)) * (W - 2 * padX);
    const y = chartBottom - ((v - min) / span) * chartH;
    return { x, y };
  });
  const linePts = pts.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl h-40 mx-auto" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeDasharray="8 6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePts}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function StatsSummary() {
  const [tab, setTab] = useState('week');

  return (
    <div className="w-full max-w-4xl flat-panel p-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={28} />
            Stats
          </h2>
          <p className="text-slate-500 text-sm mt-1">Demo numbers for illustration — not tied to your saved calendar.</p>
        </div>
        <div className="flex rounded-xl border-2 border-slate-200 p-1 bg-slate-50">
          {[
            { id: 'day', label: 'Daily' },
            { id: 'week', label: 'Weekly' },
            { id: 'month', label: 'Monthly' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                tab === t.id ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Activity size={12} /> Today
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">{DEMO.kpis.todayPoints}</p>
          <p className="text-xs text-slate-500">points</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Calendar size={12} /> This week
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">{DEMO.kpis.weekTotal}</p>
          <p className="text-xs text-slate-500">points total</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <TrendingUp size={12} /> Month
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">{DEMO.kpis.monthTotal}</p>
          <p className="text-xs text-slate-500">points total</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <Flame size={12} /> Gold days
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">{DEMO.kpis.goldDays}</p>
          <p className="text-xs text-slate-500">30+ pts</p>
        </div>
      </div>

      {tab === 'day' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Today — intensity by time block</h3>
          <p className="text-sm text-slate-500">Relative effort across the day (demo).</p>
          <ScatterLineChart items={DEMO.dayHourly.map((d) => ({ label: d.h, pts: d.v }))} max={60} />
        </div>
      )}

      {tab === 'week' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Last 7 days — points per day</h3>
          <ScatterLineChart items={DEMO.weekBars} />
          <div className="flex flex-wrap gap-6 text-sm text-slate-600 border-t border-slate-100 pt-4">
            <span>
              <strong className="text-slate-900">{DEMO.kpis.avgMinutes}</strong> avg. active min / day
            </span>
            <span>
              Best day: <strong className="text-slate-900">{DEMO.kpis.bestDay}</strong>
            </span>
          </div>
        </div>
      )}

      {tab === 'month' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">This month — weekly totals</h3>
            <ScatterLineChart items={DEMO.monthBars} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Rolling momentum (demo trend)</h4>
            <ScatterTrend values={DEMO.trendLine} />
            <p className="text-xs text-slate-400 text-center mt-2">Last 12 checkpoints · arbitrary units</p>
          </div>
        </div>
      )}
    </div>
  );
}
