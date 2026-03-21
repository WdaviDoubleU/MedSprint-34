import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import JumpGame from './JumpGame';
import AeroReps from './AeroReps';
import RepGotchi from './RepGotchi';

export default function StartExercise({ addPoints }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { id: 'jump', title: 'Running Challenge', desc: 'Jump over abstract obstacles to the beat of your reps.' },
    { id: 'aero', title: 'Aero Reps', desc: 'Control your altitude. Each successful pass is a rep.' },
    { id: 'gotchi', title: 'Rep-o-gotchi', desc: 'Feed your virtual pet with calories from your reps.' },
  ];

  if (selectedGame === 'jump') {
    return (
      <div className="w-full flex flex-col items-center animate-fade-in">
        <button 
          onClick={() => setSelectedGame(null)}
          className="mb-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 group transition-colors font-bold"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Menu
        </button>
        <JumpGame addPoints={addPoints} />
      </div>
    );
  }

  if (selectedGame === 'aero') {
    return (
      <div className="w-full flex flex-col items-center animate-fade-in">
        <button 
          onClick={() => setSelectedGame(null)}
          className="mb-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 group transition-colors font-bold"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Menu
        </button>
        <AeroReps addPoints={addPoints} />
      </div>
    );
  }

  if (selectedGame === 'gotchi') {
    return (
      <div className="w-full flex flex-col items-center animate-fade-in">
        <button 
          onClick={() => setSelectedGame(null)}
          className="mb-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 group transition-colors font-bold"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Menu
        </button>
        <RepGotchi addPoints={addPoints} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl flat-panel p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Choose a Game</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <div 
            key={game.id} 
            onClick={() => {
              if (game.id === 'jump') setSelectedGame('jump');
              if (game.id === 'aero') setSelectedGame('aero');
              if (game.id === 'gotchi') setSelectedGame('gotchi');
            }}
            className="p-5 rounded-2xl border-2 border-slate-100 bg-white flex flex-col items-center hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="w-full h-36 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-slate-300 border border-slate-100">
              <Activity className="text-slate-200 group-hover:text-emerald-400 transition-colors" size={48} />
            </div>
            <h3 className="font-bold text-xl text-slate-900">{game.title}</h3>
            <p className="text-sm text-slate-500 mt-2 text-center leading-relaxed">{game.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
