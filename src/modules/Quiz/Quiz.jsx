import { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

/**
 * Quiz module — MCQ with single/multi answer support.
 * Reads config.questions and fires onCorrect / onWrong per answer.
 */
export default function Quiz({ config, onCorrect, onWrong, onResetTimer }) {
  const { questions, timer, scoring } = config;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]); // { correct: bool } per question

  const question = questions[index];
  const isMulti = Array.isArray(question?.answer);

  // Reset per-question timer when question changes
  useEffect(() => {
    if (timer > 0) onResetTimer(timer);
  }, [index]);

  const handleSelect = (option) => {
    if (submitted) return;
    if (isMulti) {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    } else {
      setSelected([option]);
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);

    const correctAnswers = Array.isArray(question.answer)
      ? question.answer
      : [question.answer];

    const isCorrect =
      selected.length === correctAnswers.length &&
      selected.every((s) => correctAnswers.includes(s));

    if (isCorrect) {
      onCorrect();
    } else {
      onWrong();
    }
    setResults((prev) => [...prev, { correct: isCorrect }]);
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected([]);
      setSubmitted(false);
    }
  };

  if (finished) {
    const correct = results.filter((r) => r.correct).length;
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className="text-gray-500">
          You answered <strong>{correct}</strong> out of <strong>{questions.length}</strong> correctly.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>Question {index + 1} of {questions.length}</span>
        <span className="text-xs text-gray-400">{config.topic}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{
            width: `${((index + 1) / questions.length) * 100}%`,
            backgroundColor: 'var(--color-primary)',
          }}
        />
      </div>

      <QuestionCard
        question={question}
        selected={selected}
        submitted={submitted}
        isMulti={isMulti}
        onSelect={handleSelect}
      />

      <div className="mt-5 flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className="px-6 py-2.5 rounded-xl text-white font-semibold disabled:opacity-40 transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl text-white font-semibold transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {index + 1 < questions.length ? 'Next Question →' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
