import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, X, BarChart2 } from 'lucide-react';

const MOCK_LEADERS = {
  daily: [
    { id: 1, name: "David (You)",      score: 124, rank: 1, isUser: true },
    { id: 2, name: "Isaac Wasti",      score: 98,  rank: 2 },
    { id: 3, name: "Catherine Li",     score: 85,  rank: 3 },
    { id: 4, name: "Anthony Trang",    score: 72,  rank: 4 },
    { id: 5, name: "Vanessa Shelly",   score: 64,  rank: 5 },
  ],
  weekly: [
    { id: 2, name: "Isaac Wasti",      score: 840, rank: 1 },
    { id: 1, name: "David (You)",      score: 756, rank: 2, isUser: true },
    { id: 3, name: "Catherine Li",     score: 620, rank: 3 },
    { id: 4, name: "Anthony Trang",    score: 580, rank: 4 },
    { id: 5, name: "Vanessa Shelly",   score: 540, rank: 5 },
  ],
  monthly: [
    { id: 3, name: "Catherine Li",     score: 3240, rank: 1 },
    { id: 2, name: "Isaac Wasti",      score: 3100, rank: 2 },
    { id: 4, name: "Anthony Trang",    score: 2850, rank: 3 },
    { id: 1, name: "David (You)",      score: 2432, rank: 4, isUser: true },
    { id: 5, name: "Vanessa Shelly",   score: 2100, rank: 5 },
  ]
};

// All athletes for the full stats panel
const ALL_ATHLETES = [
  { id: 1, name: "David (You)", isUser: true },
  { id: 2, name: "Isaac Wasti" },
  { id: 3, name: "Catherine Li" },
  { id: 4, name: "Anthony Trang" },
  { id: 5, name: "Vanessa Shelly" },
].map((a) => {
  const daily   = MOCK_LEADERS.daily.find(x => x.id === a.id)?.score   ?? 0;
  const weekly  = MOCK_LEADERS.weekly.find(x => x.id === a.id)?.score  ?? 0;
  const monthly = MOCK_LEADERS.monthly.find(x => x.id === a.id)?.score ?? 0;
  return { ...a, daily, weekly, monthly };
}).sort((a, b) => b.monthly - a.monthly);

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [showAllStats, setShowAllStats] = useState(false);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={20} />;
      case 2: return <Medal className="text-slate-400" size={20} />;
      case 3: return <Medal className="text-amber-600" size={20} />;
      default: return <span className="text-slate-400 font-bold w-5 text-center">{rank}</span>;
    }
  };

  return (
    <div className="leaderboard-container flat-panel p-8 animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
            <Users className="text-blue-500" size={32} />
            Community Rankings
          </h2>
          <p className="text-slate-500 font-medium mt-1">See how you stack up against the exercise elite.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border-2 border-slate-200 self-start">
          {['daily', 'weekly', 'monthly'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all uppercase tracking-wider ${
                timeframe === t
                ? 'bg-white text-blue-600 border-2 border-blue-500'
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 list */}
      <div className="grid grid-cols-1 gap-4">
        {MOCK_LEADERS[timeframe].map((leader) => (
          <div
            key={leader.id}
            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
              leader.isUser
              ? 'bg-blue-50 border-blue-500 scale-[1.02]'
              : 'bg-white border-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 flex items-center justify-center">
                {getRankIcon(leader.rank)}
              </div>

              <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-500 font-black italic">
                {leader.name.charAt(0)}
              </div>

              <div>
                <h3 className={`font-black text-lg ${leader.isUser ? 'text-blue-900' : 'text-slate-900'}`}>
                  {leader.name}
                  {leader.isUser && <span className="ml-2 py-0.5 px-2 bg-blue-500 text-white text-[10px] uppercase rounded-full tracking-widest">You</span>}
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  <TrendingUp size={12} />
                  Trending Up
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">{leader.score.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reps</div>
            </div>
          </div>
        ))}
      </div>

      {/* Full stats panel */}
      {showAllStats && (
        <div className="mt-8 border-2 border-slate-200 rounded-2xl overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b-2 border-slate-200">
            <h3 className="font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-500" />
              Full Community Stats
            </h3>
            <button
              onClick={() => setShowAllStats(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b-2 border-slate-100">
                <th className="text-left px-6 py-3 font-black text-slate-400 uppercase tracking-widest text-xs">Athlete</th>
                <th className="text-right px-4 py-3 font-black text-slate-400 uppercase tracking-widest text-xs">Daily</th>
                <th className="text-right px-4 py-3 font-black text-slate-400 uppercase tracking-widest text-xs">Weekly</th>
                <th className="text-right px-6 py-3 font-black text-slate-400 uppercase tracking-widest text-xs">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {ALL_ATHLETES.map((a, i) => (
                <tr
                  key={a.id}
                  className={`border-b border-slate-100 transition-colors ${
                    a.isUser ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="px-6 py-3 font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">{a.name.charAt(0)}</span>
                    {a.name}
                    {a.isUser && <span className="py-0.5 px-2 bg-blue-500 text-white text-[10px] uppercase rounded-full tracking-widest">You</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-700">{a.daily}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-700">{a.weekly.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right font-black text-slate-900">{a.monthly.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Consistency award footer */}
      <div className="mt-8 bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 p-3 rounded-xl text-white">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-tight">Consistency Award</h4>
            <p className="text-sm text-slate-500 font-medium">You're in the top 5% of active users this week!</p>
          </div>
        </div>
        <button
          onClick={() => setShowAllStats(v => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2 rounded-xl text-sm transition-colors uppercase tracking-widest"
        >
          {showAllStats ? 'Hide Stats' : 'View All Stats'}
        </button>
      </div>
    </div>
  );
}
