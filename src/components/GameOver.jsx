/** GameOver — result screen shown when lives or timer run out. */
export default function GameOver({ scoreState, accuracy, onReset }) {
  const { score, correct, answered } = scoreState;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{score > 50 ? '🏆' : score > 20 ? '😊' : '😢'}</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
      <p className="text-gray-500 mb-6">Here's how you did</p>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md px-10 py-6 mb-8 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{score}</p>
          <p className="text-xs text-gray-500 mt-1">Final Score</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-500">{correct}/{answered}</p>
          <p className="text-xs text-gray-500 mt-1">Correct</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-yellow-500">{accuracy}%</p>
          <p className="text-xs text-gray-500 mt-1">Accuracy</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="px-8 py-3 rounded-xl text-white font-semibold text-base transition hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Play Again / Load New Config
      </button>
    </div>
  );
}
