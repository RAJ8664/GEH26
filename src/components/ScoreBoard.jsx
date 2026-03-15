/** ScoreBoard — persistent top bar showing score, lives, and timer. */
export default function ScoreBoard({ scoreState, config }) {
  const { score, lives, timeLeft, streak } = scoreState;
  const timerActive = config.timer > 0 && timeLeft !== null;
  const timerDanger = timerActive && timeLeft <= 10;

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 shadow-sm text-sm font-medium">
      {/* Score */}
      <div className="flex items-center gap-1">
        <span className="text-gray-500">Score</span>
        <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
          {score}
        </span>
        {streak >= 3 && (
          <span className="ml-1 text-orange-500 text-xs font-bold">🔥 ×{streak}</span>
        )}
      </div>

      {/* Timer */}
      {timerActive && (
        <div className={`font-mono text-base font-bold ${timerDanger ? 'text-red-500' : 'text-gray-700'}`}>
          ⏱ {timeLeft}s
        </div>
      )}

      {/* Lives */}
      <div className="flex gap-0.5 text-base">
        {Array.from({ length: Math.max(config.lives ?? 3, 0) }).map((_, i) => (
          <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
        ))}
      </div>
    </div>
  );
}
