/** QuestionCard — renders a single MCQ question with selectable options. */
export default function QuestionCard({ question, selected, submitted, isMulti, onSelect }) {
  const correctAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];

  const getOptionStyle = (option) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition cursor-pointer ';
    const isSelected = selected.includes(option);

    if (!submitted) {
      return base + (isSelected
        ? 'border-[var(--color-primary)] bg-indigo-50 text-indigo-700'
        : 'border-gray-200 bg-white hover:border-gray-400 text-gray-700');
    }

    // After submit
    const isCorrect = correctAnswers.includes(option);
    if (isCorrect) return base + 'border-green-500 bg-green-50 text-green-700';
    if (isSelected && !isCorrect) return base + 'border-red-400 bg-red-50 text-red-600';
    return base + 'border-gray-200 bg-white text-gray-400';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* Hint for multi-select */}
      {isMulti && (
        <p className="text-xs text-indigo-500 font-medium mb-2">Select all that apply</p>
      )}

      <p className="text-lg font-semibold text-gray-800 mb-5">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button key={i} className={getOptionStyle(option)} onClick={() => onSelect(option)}>
            <span className="inline-flex items-center gap-3">
              <span
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ borderColor: selected.includes(option) && !submitted ? 'var(--color-primary)' : undefined }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>

      {/* Explanation after submit */}
      {submitted && question.explanation && (
        <p className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
          💡 {question.explanation}
        </p>
      )}
    </div>
  );
}
