import React, { useState, useEffect, useRef } from 'react';

export default function JumpGame({ addPoints }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('jump_game_highscore') || '0');
  });

  // Game Constants
  const GRAVITY = 0.15;
  const JUMP_STRENGTH = -5.5;
  const OBSTACLE_SPEED = 2.5; // Slowed down for "rep" pacing
  const SPAWN_RATE = 2000; // 2 seconds between obstacles approx

  // Game State Refs (for the loop)
  const gameState = useRef({
    player: { x: 50, y: 150, width: 30, height: 30, dy: 0, jumping: false },
    obstacles: [],
    frameId: null,
    lastSpawn: 0,
  });

  const jump = () => {
    if (!gameState.current.player.jumping) {
      gameState.current.player.dy = JUMP_STRENGTH;
      gameState.current.player.jumping = true;
    }
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      if (!isPlaying) {
        startGame();
      } else {
        jump();
      }
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    gameState.current = {
      player: { x: 50, y: 150, width: 30, height: 30, dy: 0, jumping: false },
      obstacles: [],
      frameId: null,
      lastSpawn: Date.now(),
    };
  };

  const update = () => {
    const { player, obstacles } = gameState.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Player Physics
    player.dy += GRAVITY;
    player.y += player.dy;

    // Ground collision
    const groundY = canvas.height - player.height - 20;
    if (player.y > groundY) {
      player.y = groundY;
      player.dy = 0;
      player.jumping = false;
    }

    // Spawn obstacles
    const now = Date.now();
    if (now - gameState.current.lastSpawn > (Math.random() + 1) * SPAWN_RATE) {
      obstacles.push({
        x: canvas.width,
        y: groundY + 5,
        width: 20,
        height: 25,
        type: Math.random() > 0.5 ? 'triangle' : 'rect'
      });
      gameState.current.lastSpawn = now;
    }

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= OBSTACLE_SPEED;

      // Collision detection
      if (
        player.x < obstacles[i].x + obstacles[i].width &&
        player.x + player.width > obstacles[i].x &&
        player.y < obstacles[i].y + obstacles[i].height &&
        player.y + player.height > obstacles[i].y
      ) {
        endGame();
        return;
      }

      // Remove off-screen and update score
      if (obstacles[i].x + obstacles[i].width < 0) {
        obstacles.splice(i, 1);
        setScore(s => s + 1);
      }
    }

    draw();
    gameState.current.frameId = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const { player, obstacles } = gameState.current;

      // Clear canvas with light color
      ctx.fillStyle = '#f8fafc'; // Slate 50;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Floor
      ctx.strokeStyle = '#cbd5e1'; // Slate 300
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20); // Adjusted to use groundY logic
      ctx.lineTo(canvas.width, canvas.height - 20); // Adjusted to use groundY logic
      ctx.stroke();

      // Draw Player (Dino-ish)
      ctx.fillStyle = '#0f172a'; // Slate 900
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Draw Obstacles
      ctx.fillStyle = '#334155'; // Slate 700
      obstacles.forEach(obs => {
        if (obs.type === 'rect') { // Changed 'square' to 'rect' for consistency
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        } else {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
        }
      });
  };

  const endGame = () => {
    cancelAnimationFrame(gameState.current.frameId);
    setIsPlaying(false);
    setIsGameOver(true);
    
    // Persist scores to calendar
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    if (score > 0) {
      addPoints(dateStr, score);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('jump_game_highscore', score.toString());
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
        <h2 className="text-xl font-black text-emerald-600 uppercase tracking-tight">Jump Reps</h2>
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 animate-fade-in px-6">
            <div className="text-center w-full">
              {isGameOver ? (
                <>
                  <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">WORKOUT OVER</h3>
                  <p className="text-emerald-600 font-bold mb-6">Earned {score} Points</p>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Running Challenge</h2>
                  <p className="text-slate-500 mb-8 font-medium">Jump each time you complete a rep!</p>
                </>
              )}
              
              <div className="bg-white p-4 rounded-xl border-2 border-slate-100 mb-8 inline-block px-8">
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">High Score</p>
                <p className="text-2xl font-black text-slate-900">{highScore}</p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={startGame}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-black text-xl transition-all border-b-4 border-emerald-800 tracking-wide"
                >
                  {isGameOver ? 'PLAY AGAIN' : 'START WORKOUT'}
                </button>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Spacebar to Jump</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
        "Focus on your form. Each jump is a rep."
      </div>
    </div>
  );
}
