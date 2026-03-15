import { useState, useCallback } from 'react';

/**
 * DragDrop module — two-column pair-matching game using the HTML5 Drag API.
 * Left column: shuffled "terms". Right column: shuffled "matches" as drop targets.
 * Config shape: { pairs: [{ term, match }], topic }
 */

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function DragDrop({ config, onCorrect, onWrong }) {
  const { pairs } = config;

  const [terms] = useState(() => shuffle(pairs.map((p) => p.term)));
  const [targets] = useState(() => shuffle(pairs.map((p) => p.match)));

  // Map: match → term dropped onto it (or null)
  const [dropped, setDropped] = useState(() =>
    Object.fromEntries(targets.map((t) => [t, null]))
  );
  // Terms that have been placed already
  const [placed, setPlaced] = useState(new Set());
  // Feedback per match slot: 'correct' | 'wrong' | null
  const [feedback, setFeedback] = useState({});
  const [dragItem, setDragItem] = useState(null);
  const [finished, setFinished] = useState(false);

  const handleDragStart = useCallback((term) => {
    setDragItem(term);
  }, []);

  const handleDrop = useCallback(
    (match) => {
      if (!dragItem || placed.has(dragItem)) return;

      // Find the correct pair
      const pair = pairs.find((p) => p.match === match);
      const isCorrect = pair?.term === dragItem;

      setDropped((prev) => ({ ...prev, [match]: dragItem }));
      setPlaced((prev) => new Set([...prev, dragItem]));
      setFeedback((prev) => ({ ...prev, [match]: isCorrect ? 'correct' : 'wrong' }));

      if (isCorrect) {
        onCorrect();
      } else {
        onWrong();
      }

      setDragItem(null);

      // Check if all slots are filled
      setDropped((prev) => {
        const updated = { ...prev, [match]: dragItem };
        if (Object.values(updated).every((v) => v !== null)) {
          setTimeout(() => setFinished(true), 600);
        }
        return updated;
      });
    },
    [dragItem, pairs, placed, onCorrect, onWrong]
  );

  const correctCount = Object.values(feedback).filter((f) => f === 'correct').length;

  if (finished) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Pairs Matched!</h2>
        <p className="text-gray-500">
          <strong>{correctCount}</strong> of <strong>{pairs.length}</strong> correct matches.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-5">
        Drag each <strong>term</strong> from the left and drop it onto the correct <strong>match</strong> on the right.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Terms column */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Terms</h3>
          {terms.map((term) => (
            <DragItem
              key={term}
              label={term}
              placed={placed.has(term)}
              onDragStart={() => handleDragStart(term)}
            />
          ))}
        </div>

        {/* Drop targets column */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Matches</h3>
          {targets.map((match) => (
            <DropZone
              key={match}
              label={match}
              dropped={dropped[match]}
              feedback={feedback[match]}
              onDrop={() => handleDrop(match)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DragItem({ label, placed, onDragStart }) {
  return (
    <div
      draggable={!placed}
      onDragStart={onDragStart}
      className={`px-4 py-3 rounded-xl border-2 font-medium text-sm transition select-none
        ${placed
          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
          : 'border-[var(--color-primary)] bg-indigo-50 text-indigo-700 cursor-grab hover:shadow-md active:opacity-70'
        }`}
    >
      {placed ? '✓ ' : '⠿ '}{label}
    </div>
  );
}

function DropZone({ label, dropped, feedback, onDrop }) {
  const borderColor =
    feedback === 'correct' ? 'border-green-500 bg-green-50' :
    feedback === 'wrong'   ? 'border-red-400 bg-red-50'   :
    dropped                ? 'border-gray-400 bg-gray-50'  :
                             'border-dashed border-gray-300 bg-white hover:border-gray-400';

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition min-h-[48px]
        flex items-center justify-between gap-2 ${borderColor}`}
    >
      <span className="text-gray-700 font-semibold">{label}</span>
      {dropped ? (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {dropped} {feedback === 'correct' ? '✓' : '✗'}
        </span>
      ) : (
        <span className="text-xs text-gray-300">Drop here</span>
      )}
    </div>
  );
}
