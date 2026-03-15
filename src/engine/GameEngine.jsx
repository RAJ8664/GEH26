import { useReducer, useEffect, useRef } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { scoreReducer, INITIAL_STATE, isGameOver, getAccuracy } from './ScoreManager';
import Quiz from '../modules/Quiz/Quiz';
import DragDrop from '../modules/DragDrop/DragDrop';
import MemoryFlip from '../modules/MemoryFlip/MemoryFlip';
import FillBlanks from '../modules/FillBlanks/FillBlanks';
import ScoreBoard from '../components/ScoreBoard';
import GameOver from '../components/GameOver';

const MODULE_MAP = {
  quiz: Quiz,
  dragdrop: DragDrop,
  memoryflip: MemoryFlip,
  fillblanks: FillBlanks,
};

/**
 * GameEngine — master controller.
 * Reads config.gameType, mounts the correct module, and manages
 * global score / timer state via ScoreManager.
 */
export default function GameEngine({ config, onReset }) {
  const [scoreState, dispatch] = useReducer(scoreReducer, INITIAL_STATE(config));
  const timerRef = useRef(null);

  // Countdown timer (only when config.timer > 0)
  useEffect(() => {
    if (config.timer <= 0 || scoreState.timeLeft === null) return;

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [config.timer]);

  // Stop timer when game is over
  useEffect(() => {
    if (isGameOver(scoreState)) {
      clearInterval(timerRef.current);
    }
  }, [scoreState]);

  const GameModule = MODULE_MAP[config.gameType];

  if (!GameModule) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">
          Unknown game type: <strong>{config.gameType}</strong>
        </p>
      </div>
    );
  }

  const handleCorrect = () =>
    dispatch({ type: 'CORRECT', points: config.scoring.correct });

  const handleWrong = () =>
    dispatch({ type: 'WRONG', points: Math.abs(config.scoring.wrong) });

  const handleResetTimer = (seconds) =>
    dispatch({ type: 'RESET_TIMER', seconds });

  return (
    <ThemeProvider theme={config.theme}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {config.title}
          </h1>
          {config.topic && (
            <p className="text-sm text-gray-500 mt-1">Topic: {config.topic}</p>
          )}
        </div>

        {/* Score bar */}
        <ScoreBoard scoreState={scoreState} config={config} />

        {/* Game over overlay */}
        {isGameOver(scoreState) ? (
          <GameOver
            scoreState={scoreState}
            accuracy={getAccuracy(scoreState)}
            onReset={onReset}
          />
        ) : (
          <GameModule
            config={config}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            onResetTimer={handleResetTimer}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
