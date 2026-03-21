import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

export default function AeroReps({ addPoints }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('aero_reps_highscore') || '0');
  });

  // Game Constants (Tuned for extremely slow play)
  const GRAVITY = 0.1;
  const FLAP_STRENGTH = -3.5;
  const PIPE_SPEED = 1.5;
  const PIPE_SPAWN_RATE = 3000; // 3 seconds between pipes
  const PIPE_GAP = 160; // Huge gap for easy pass
  const PIPE_WIDTH = 50;

  const gameState = useRef({
    bird: { x: 50, y: 150, width: 34, height: 24, dy: 0 },
    pipes: [],
    frameId: null,
    lastSpawn: 0,
  });

  const flap = () => {
    gameState.current.bird.dy = FLAP_STRENGTH;
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      if (!isPlaying) {
        startGame();
      } else {
        flap();
      }
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    gameState.current = {
      bird: { x: 50, y: 150, width: 34, height: 24, dy: 0 },
      pipes: [],
      frameId: null,
      lastSpawn: Date.now(),
    };
  };

  const update = () => {
    const { bird, pipes } = gameState.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Bird Physics
    bird.dy += GRAVITY;
    bird.y += bird.dy;

    // Boundary check
    if (bird.y < 0) bird.y = 0;
    if (bird.y + bird.height > canvas.height) {
      endGame();
      return;
    }

    // Spawn pipes
    const now = Date.now();
    if (now - gameState.current.lastSpawn > PIPE_SPAWN_RATE) {
      const minPipeHeight = 50;
      const maxPipeHeight = canvas.height - PIPE_GAP - minPipeHeight;
      const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
      
      pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        passed: false
      });
      gameState.current.lastSpawn = now;
    }

    // Move pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= PIPE_SPEED;

      // Collision detection
      const birdRect = { x: bird.x + 5, y: bird.y + 5, w: bird.width - 10, h: bird.height - 10 };
      
      // Top pipe
      if (
        birdRect.x < p.x + PIPE_WIDTH &&
        birdRect.x + birdRect.w > p.x &&
        birdRect.y < p.topHeight
      ) {
        endGame();
        return;
      }

      // Bottom pipe
      if (
        birdRect.x < p.x + PIPE_WIDTH &&
        birdRect.x + birdRect.w > p.x &&
        birdRect.y + birdRect.h > p.topHeight + PIPE_GAP
      ) {
        endGame();
        return;
      }

      // Score
      if (!p.passed && p.x + PIPE_WIDTH < bird.x) {
        p.passed = true;
        setScore(s => s + 1);
      }

      // Remove off-screen
      if (p.x + PIPE_WIDTH < 0) {
        pipes.splice(i, 1);
      }
    }

    draw();
    gameState.current.frameId = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const { bird, pipes } = gameState.current;

    // Clear with light theme bg
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Bird (Abstract Square for now, follows JumpGame aesthetic)
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    
    // Tiny eye for direction
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bird.x + bird.width - 8, bird.y + 6, 4, 4);

    // Draw Pipes
    ctx.fillStyle = '#334155'; // Slate 700
    pipes.forEach(p => {
      // Top pipe
      ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
      // Bottom pipe
      ctx.fillRect(p.x, p.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height - (p.topHeight + PIPE_GAP));
      
      // Pipe caps (Flat design accents)
      ctx.fillStyle = '#1e293b'; 
      ctx.fillRect(p.x - 2, p.topHeight - 15, PIPE_WIDTH + 4, 15);
      ctx.fillRect(p.x - 2, p.topHeight + PIPE_GAP, PIPE_WIDTH + 4, 15);
      ctx.fillStyle = '#334155';
    });
  };

  const endGame = () => {
    cancelAnimationFrame(gameState.current.frameId);
    setIsPlaying(false);
    setIsGameOver(true);
    
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    if (score > 0) {
      addPoints(dateStr, score);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('aero_reps_highscore', score.toString());
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(gameState.current.frameId);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      gameState.current.frameId = requestAnimationFrame(update);
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl flat-panel p-8">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-emerald-600 uppercase tracking-tight">Aero Reps</h2>
        <div className="text-2xl font-black text-slate-900">Score: {score}</div>
      </div>

      <div className="relative w-full aspect-video bg-white rounded-xl overflow-hidden border-2 border-slate-100">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-full"
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 animate-fade-in px-6 text-center">
            {isGameOver ? (
              <>
                <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Crash Landing</h3>
                <p className="text-emerald-600 font-bold mb-6">Workout Synchronized: {score} Reps</p>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Aero Reps</h2>
                <p className="text-slate-500 mb-8 font-medium">Flap every time you complete a rep!</p>
              </>
            )}

            <div className="bg-white p-4 rounded-xl border-2 border-slate-100 mb-8 inline-block px-8">
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Personal Best</p>
              <p className="text-2xl font-black text-slate-900">{highScore}</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={startGame}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-black text-xl transition-all border-b-4 border-emerald-800 tracking-wide"
              >
                {isGameOver ? 'RE-FLIGHT' : 'START MISSION'}
              </button>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Spacebar to Lift</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
        "Steady breathing. Control your ascent."
      </div>
    </div>
  );
}
