import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Heart, Zap, RotateCcw } from 'lucide-react';

// Trophy inline SVG (avoids import issues)
const TrophyIcon = ({ size = 20, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.45.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default function RepGotchi({ addPoints }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [satisfaction, setSatisfaction] = useState(50);
  const [reps, setReps] = useState(0);
  const [petState, setPetState] = useState('happy'); // 'happy' | 'hungry' | 'eating'
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('repgotchi_highscore') || '0')
  );

  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const satRef = useRef(50); // keep satisfaction in a ref so the interval can see it

  // Sync ref with state
  useEffect(() => { satRef.current = satisfaction; }, [satisfaction]);

  // Keep video looping silently in background
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    if (isPlaying) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setSatisfaction(50);
    satRef.current = 50;
    setReps(0);
    setPetState('happy');

    timerRef.current = setInterval(() => {
      const next = satRef.current - 2;
      if (next <= 20) setPetState('hungry');
      if (next <= 0) {
        endGame(0);
        return;
      }
      setSatisfaction(next);
      satRef.current = next;
    }, 1000);
  };

  const handleRep = () => {
    if (!isPlaying) return;
    const newReps = reps + 1;
    setReps(newReps);
    const newSat = Math.min(100, satRef.current + 15);
    setSatisfaction(newSat);
    satRef.current = newSat;
    setPetState('eating');

    // Pulse the video brightness
    if (videoRef.current) {
      videoRef.current.style.filter = 'brightness(1.4)';
      setTimeout(() => { if (videoRef.current) videoRef.current.style.filter = ''; }, 300);
    }

    if (animRef.current) clearTimeout(animRef.current);
    animRef.current = setTimeout(() => {
      setPetState(satRef.current > 20 ? 'happy' : 'hungry');
    }, 500);
  };

  const endGame = (forcedReps) => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsGameOver(true);
    const finalReps = forcedReps !== undefined ? forcedReps : reps;
    if (finalReps > 0) {
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      addPoints(dateStr, finalReps);
      if (finalReps > highScore) {
        setHighScore(finalReps);
        localStorage.setItem('repgotchi_highscore', finalReps.toString());
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!isPlaying) startGame();
      else handleRep();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(timerRef.current);
      if (animRef.current) clearTimeout(animRef.current);
    };
  });

  const satColor = satisfaction > 60 ? '#10b981' : satisfaction > 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center w-full max-w-2xl flat-panel p-8">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            Rep-o-gotchi <Zap className="text-yellow-500 fill-yellow-500" size={20} />
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Status: <span className={petState === 'hungry' ? 'text-red-500' : petState === 'eating' ? 'text-emerald-500' : 'text-slate-400'}>{petState}</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-slate-900">{reps}</div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Reps</p>
        </div>
      </div>

      {/* Satisfaction bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full mb-8 overflow-hidden border border-slate-200">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${satisfaction}%`, backgroundColor: satColor }}
        />
      </div>

      {/* Video pet window */}
      <div className={`relative rounded-2xl overflow-hidden border-4 mb-8 transition-all ${
        petState === 'hungry' ? 'border-red-400' : petState === 'eating' ? 'border-emerald-400 scale-105' : 'border-slate-900'
      }`} style={{ width: 260, height: 180 }}>
        <video
          ref={videoRef}
          src="/teams-video.mp4"
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Overlay tint when hungry */}
        {petState === 'hungry' && (
          <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse pointer-events-none" />
        )}
        {petState === 'eating' && (
          <div className="absolute inset-0 bg-emerald-400 opacity-20 pointer-events-none" />
        )}

        {/* Hunger icon */}
        {petState === 'hungry' && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 animate-bounce">
            <span className="text-lg">🍽️</span>
          </div>
        )}
        {petState === 'eating' && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
            <span className="text-lg">✅</span>
          </div>
        )}
      </div>

      {/* Controls / Game Over */}
      {!isPlaying ? (
        <div className="flex flex-col items-center gap-4 text-center w-full">
          {isGameOver ? (
            <>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Feed Over!</h3>
              <p className="text-slate-500 font-medium italic">"Great session. {reps} reps recorded."</p>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Pet Care Mode</h3>
              <p className="text-slate-500 font-medium italic">"Each rep feeds your digital companion."</p>
            </>
          )}

          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 w-full max-w-xs mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Best Score</span>
              <TrophyIcon size={16} className="text-yellow-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{highScore} <span className="text-sm font-bold text-slate-400">Reps</span></div>
          </div>

          <button
            onClick={startGame}
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white px-12 py-4 rounded-xl font-black text-xl transition-all uppercase tracking-wide"
          >
            {isGameOver ? <span className="flex items-center gap-2"><RotateCcw size={20} /> Revive</span> : 'Start Caring'}
          </button>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Spacebar or tap to feed</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleRep}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-16 py-5 rounded-2xl font-black text-2xl transition-all uppercase tracking-wide select-none"
          >
            <Heart className="inline mr-2 fill-white" size={24} /> Feed!
          </button>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">or press <kbd className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono text-slate-700">Space</kbd></p>
          <button onClick={() => endGame(reps)} className="text-slate-400 hover:text-slate-600 text-xs underline mt-2">End session</button>
        </div>
      )}
    </div>
  );
}
