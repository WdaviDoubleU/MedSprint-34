import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';

const MOCK_LEADERS = {
  daily: [
    { id: 1, name: "David (You)", score: 124, rank: 1, isUser: true },
    { id: 2, name: "Alex Rivers", score: 98, rank: 2 },
    { id: 3, name: "Sarah Chen", score: 85, rank: 3 },
    { id: 4, name: "Mike Ross", score: 72, rank: 4 },
    { id: 5, name: "Jess Pearson", score: 64, rank: 5 },
  ],
  weekly: [
    { id: 2, name: "Alex Rivers", score: 840, rank: 1 },
    { id: 1, name: "David (You)", score: 756, rank: 2, isUser: true },
    { id: 3, name: "Sarah Chen", score: 620, rank: 3 },
    { id: 6, name: "Harvey Specter", score: 580, rank: 4 },
    { id: 7, name: "Donna Paulsen", score: 540, rank: 5 },
  ],
  monthly: [
    { id: 3, name: "Sarah Chen", score: 3240, rank: 1 },
    { id: 2, name: "Alex Rivers", score: 3100, rank: 2 },
    { id: 8, name: "Louis Litt", score: 2850, rank: 3 },
    { id: 1, name: "David (You)", score: 2432, rank: 4, isUser: true },
    { id: 9, name: "Rachel Zane", score: 2100, rank: 5 },
  ]
};

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly');

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={20} />;
      case 2: return <Medal className="text-slate-400" size={20} />;
      case 3: return <Medal className="text-amber-600" size={20} />;
      default: return <span className="text-slate-400 font-bold">{rank}</span>;
    }
  };

  return (
    <div className="leaderboard-container flat-panel p-8 animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
            <Users className="text-emerald-500" size={32} />
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
                ? 'bg-white text-emerald-600 border-2 border-emerald-500' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_LEADERS[timeframe].map((leader) => (
          <div 
            key={leader.id} 
            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
              leader.isUser 
              ? 'bg-emerald-50 border-emerald-500 scale-[1.02]' 
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
                <h3 className={`font-black text-lg ${leader.isUser ? 'text-emerald-900' : 'text-slate-900'}`}>
                  {leader.name}
                  {leader.isUser && <span className="ml-2 py-0.5 px-2 bg-emerald-500 text-white text-[10px] uppercase rounded-full tracking-widest">You</span>}
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

      <div className="mt-12 bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-xl text-white">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase tracking-tight">Consistency Award</h4>
            <p className="text-sm text-slate-500 font-medium">You the top 5% of active users this week!</p>
          </div>
        </div>
        <button className="bg-white border-2 border-slate-200 text-slate-700 font-black px-6 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors uppercase tracking-widest">
          View All Stats
        </button>
      </div>
    </div>
  );
}
