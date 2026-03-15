/**
 * ScoreManager — pure utility functions for score, lives, and timer logic.
 * All functions are stateless; state lives in the calling component via useReducer.
 */

export const INITIAL_STATE = (config) => ({
  score: 0,
  lives: config.lives ?? 3,
  timeLeft: config.timer > 0 ? config.timer : null,
  streak: 0,
  answered: 0,
  correct: 0,
});

export function scoreReducer(state, action) {
  switch (action.type) {
    case 'CORRECT': {
      const pts = action.points ?? 10;
      return {
        ...state,
        score: state.score + pts,
        streak: state.streak + 1,
        answered: state.answered + 1,
        correct: state.correct + 1,
      };
    }
    case 'WRONG': {
      const deduct = action.points ?? 5;
      return {
        ...state,
        score: Math.max(0, state.score - deduct),
        lives: state.lives - 1,
        streak: 0,
        answered: state.answered + 1,
      };
    }
    case 'TICK':
      if (state.timeLeft === null) return state;
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
    case 'RESET_TIMER':
      return { ...state, timeLeft: action.seconds };
    case 'RESET':
      return INITIAL_STATE(action.config);
    default:
      return state;
  }
}

export function isGameOver(state) {
  return state.lives <= 0 || state.timeLeft === 0;
}

export function getAccuracy(state) {
  if (state.answered === 0) return 0;
  return Math.round((state.correct / state.answered) * 100);
}
