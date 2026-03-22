import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { Heart, Zap, RotateCcw } from 'lucide-react';

const FEEDS = ['/Feed1.mp4', '/Feed2.mp4'];
const POSTER = '/thumb-gotchi.png';
const XP_PER_REP = 10;
const XP_PER_LEVEL = 100;
const NAME_KEY = 'repgotchi_pet_name';
const XP_KEY = 'repgotchi_total_xp';

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

function levelFromTotalXp(total) {
  return Math.floor(total / XP_PER_LEVEL) + 1;
}

function xpProgressInLevel(total) {
  const inLevel = total % XP_PER_LEVEL;
  return { fillPct: (inLevel / XP_PER_LEVEL) * 100, inLevel, nextLevelAt: XP_PER_LEVEL - inLevel };
}

export default function RepGotchi({ addPoints }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [satisfaction, setSatisfaction] = useState(50);
  const [reps, setReps] = useState(0);
  const [petState, setPetState] = useState('happy');
  const [petName, setPetName] = useState(() => localStorage.getItem(NAME_KEY) || '');
  const [totalXp, setTotalXp] = useState(() =>
    parseInt(localStorage.getItem(XP_KEY) || '0', 10)
  );
  const [highScore, setHighScore] = useState(() =>
    parseInt(localStorage.getItem('repgotchi_highscore') || '0', 10)
  );
  const [slotOpacity, setSlotOpacity] = useState([1, 0]);

  const videoRef0 = useRef(null);
  const videoRef1 = useRef(null);
  const videoRefs = [videoRef0, videoRef1];
  const activeSlotRef = useRef(0);
  const loadedUrlRef = useRef(['', '']);
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const satRef = useRef(50);
  const repsRef = useRef(0);
  const nextClipRef = useRef(0);

  useEffect(() => { satRef.current = satisfaction; }, [satisfaction]);
  useEffect(() => { repsRef.current = reps; }, [reps]);

  const persistName = (name) => {
    setPetName(name);
    localStorage.setItem(NAME_KEY, name);
  };

  const playClipAt = useCallback((clipIndex) => {
    const url = FEEDS[clipIndex % 2];
    const a = activeSlotRef.current;
    const vAct = videoRefs[a].current;
    if (!vAct) return;

    const playActiveFromStart = () => {
      vAct.currentTime = 0;
      const p = vAct.play();
      if (p !== undefined) p.catch(() => {});
    };

    if (loadedUrlRef.current[a] === url && vAct.readyState >= 2) {
      playActiveFromStart();
      return;
    }

    const slot = 1 - a;
    const vNext = videoRefs[slot].current;
    const vPrev = vAct;
    if (!vNext) return;

    vNext.onended = () => {
      vNext.pause();
    };
    vNext.muted = true;
    vNext.playsInline = true;
    vNext.loop = false;
    vNext.src = url;
    vNext.load();
    loadedUrlRef.current[slot] = url;

    const onCanPlay = () => {
      const p = vNext.play();
      if (p !== undefined) p.catch(() => {});
      vPrev.pause();
      activeSlotRef.current = slot;
      setSlotOpacity(slot === 0 ? [1, 0] : [0, 1]);
      vNext.removeEventListener('canplay', onCanPlay);
    };
    vNext.addEventListener('canplay', onCanPlay, { once: true });
  }, []);

  const endGame = useCallback((forcedReps) => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsPlaying(false);
    setIsGameOver(true);
    videoRefs.forEach((r) => {
      const v = r.current;
      if (v) {
        v.pause();
        v.onended = null;
      }
    });
    const finalReps = forcedReps !== undefined ? forcedReps : repsRef.current;
    if (finalReps > 0) {
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      addPoints(dateStr, finalReps);
      setHighScore((hs) => {
        if (finalReps > hs) {
          localStorage.setItem('repgotchi_highscore', finalReps.toString());
          return finalReps;
        }
        return hs;
      });
    }
  }, [addPoints]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setSatisfaction(50);
    satRef.current = 50;
    setReps(0);
    repsRef.current = 0;
    setPetState('happy');
    nextClipRef.current = 0;

    const v0 = videoRef0.current;
    const v1 = videoRef1.current;
    activeSlotRef.current = 0;
    loadedUrlRef.current = ['', ''];
    setSlotOpacity([1, 0]);
    if (v0) {
      v0.pause();
      v0.onended = () => {
        v0.pause();
      };
      v0.muted = true;
      v0.playsInline = true;
      v0.loop = false;
      v0.src = FEEDS[0];
      v0.load();
      loadedUrlRef.current[0] = FEEDS[0];
      const onReady = () => {
        v0.currentTime = 0;
        v0.pause();
        v0.removeEventListener('loadeddata', onReady);
      };
      v0.addEventListener('loadeddata', onReady, { once: true });
    }
    if (v1) {
      v1.pause();
      v1.onended = null;
      v1.removeAttribute('src');
      v1.load();
      loadedUrlRef.current[1] = '';
    }

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
  }, [endGame]);

  const handleRep = useCallback(() => {
    if (!isPlaying) return;
    setReps((r) => {
      const newReps = r + 1;
      repsRef.current = newReps;
      return newReps;
    });
    const newSat = Math.min(100, satRef.current + 15);
    setSatisfaction(newSat);
    satRef.current = newSat;
    setPetState('eating');

    setTotalXp((tx) => {
      const next = tx + XP_PER_REP;
      localStorage.setItem(XP_KEY, String(next));
      return next;
    });

    const clip = nextClipRef.current;
    nextClipRef.current = (clip + 1) % 2;
    playClipAt(clip);

    if (animRef.current) clearTimeout(animRef.current);
    animRef.current = setTimeout(() => {
      setPetState(satRef.current > 20 ? 'happy' : 'hungry');
    }, 500);
  }, [isPlaying, playClipAt]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPlaying) startGame();
        else handleRep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(timerRef.current);
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [isPlaying, startGame, handleRep]);

  const satColor = satisfaction > 60 ? '#10b981' : satisfaction > 30 ? '#f59e0b' : '#ef4444';
  const { fillPct, inLevel } = xpProgressInLevel(totalXp);
  const displayLevel = levelFromTotalXp(totalXp);
  const displayName = petName.trim() || 'Your pet';

  return (
    <div className="flex flex-col items-center w-full max-w-2xl flat-panel p-8">
      <div className="w-full mb-6">
        <label htmlFor="pet-name" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          Name your pet
        </label>
        <input
          id="pet-name"
          type="text"
          value={petName}
          onChange={(e) => persistName(e.target.value)}
          placeholder="e.g. Repzilla"
          maxLength={32}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            {displayName} <Zap className="text-yellow-500 fill-yellow-500" size={20} />
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Status: <span className={petState === 'hungry' ? 'text-red-500' : petState === 'eating' ? 'text-blue-500' : 'text-slate-400'}>{petState}</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-slate-900">{reps}</div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Reps</p>
        </div>
      </div>

      {/* Level / XP */}
      <div className="w-full mb-6 space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
          <span>Level {displayLevel}</span>
          <span>{inLevel} / {XP_PER_LEVEL} XP</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full rounded-full transition-all duration-300 bg-indigo-500"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      {/* Satisfaction bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full mb-8 overflow-hidden border border-slate-200">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${satisfaction}%`, backgroundColor: satColor }}
        />
      </div>

      <div
        className={`relative w-full max-w-sm rounded-2xl overflow-hidden border-4 mb-8 transition-all bg-black ${
          petState === 'hungry' ? 'border-red-400' : petState === 'eating' ? 'border-blue-400 scale-105' : 'border-slate-900'
        }`}
        style={{ aspectRatio: '16/9' }}
      >
        <img
          src={POSTER}
          alt=""
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none select-none"
          aria-hidden
        />
        <video
          ref={videoRef0}
          className="absolute inset-0 z-[1] w-full h-full object-cover"
          style={{ opacity: slotOpacity[0] }}
          muted
          playsInline
          preload="auto"
        />
        <video
          ref={videoRef1}
          className="absolute inset-0 z-[1] w-full h-full object-cover"
          style={{ opacity: slotOpacity[1] }}
          muted
          playsInline
          preload="auto"
        />

        {petState === 'hungry' && (
          <div className="absolute inset-0 z-10 bg-red-500 opacity-20 animate-pulse pointer-events-none" />
        )}
        {petState === 'eating' && (
          <div className="absolute inset-0 z-10 bg-blue-400 opacity-20 pointer-events-none" />
        )}

        {petState === 'hungry' && (
          <div className="absolute top-2 right-2 z-20 bg-white rounded-full p-1 animate-bounce">
            <span className="text-lg">🍽️</span>
          </div>
        )}
        {petState === 'eating' && (
          <div className="absolute top-2 right-2 z-20 bg-white rounded-full p-1">
            <span className="text-lg">✅</span>
          </div>
        )}
      </div>

      {!isPlaying ? (
        <div className="flex flex-col items-center gap-4 text-center w-full">
          {isGameOver ? (
            <>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Feed Over!</h3>
              <p className="text-slate-500 font-medium italic">&quot;Great session. {reps} reps recorded.&quot;</p>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Pet Care Mode</h3>
              <p className="text-slate-500 font-medium italic">&quot;Each rep feeds your digital companion.&quot;</p>
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
            type="button"
            onClick={startGame}
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white px-12 py-4 rounded-xl font-black text-xl transition-all uppercase tracking-wide"
          >
            {isGameOver ? <span className="flex items-center gap-2 justify-center"><RotateCcw size={20} /> Revive</span> : 'Start Caring'}
          </button>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Spacebar or tap to feed</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleRep}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-16 py-5 rounded-2xl font-black text-2xl transition-all uppercase tracking-wide select-none"
          >
            <Heart className="inline mr-2 fill-white" size={24} /> Feed!
          </button>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">or press <kbd className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono text-slate-700">Space</kbd></p>
          <button type="button" onClick={() => endGame()} className="text-slate-400 hover:text-slate-600 text-xs underline mt-2">End session</button>
        </div>
      )}
    </div>
  );
}
