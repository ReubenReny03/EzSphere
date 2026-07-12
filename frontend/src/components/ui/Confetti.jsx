import { useEffect, useState } from 'react';

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f97316', '#f59e0b'];
const PIECE_COUNT = 40;

// Dependency-free celebratory burst — mounts, animates for ~1.6s, then
// removes itself. Triggered on BADGE_UNLOCKED so the win feels immediate.
export const Confetti = ({ onDone }) => {
  const [pieces] = useState(() =>
    Array.from({ length: PIECE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1 + Math.random() * 0.8,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    })),
  );

  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
          className="confetti-piece absolute top-[-10px] h-2.5 w-2.5 rounded-sm"
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .confetti-piece { animation-name: confetti-fall; animation-timing-function: ease-in; animation-fill-mode: forwards; }
      `}</style>
    </div>
  );
};
