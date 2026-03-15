import { useState } from 'react';
import { loadConfig } from './engine/ConfigLoader';
import GameEngine from './engine/GameEngine';

const SAMPLE_QUIZ = JSON.stringify(
  {
    gameType: 'quiz',
    title: 'Human Body — Science',
    topic: 'Science',
    timer: 30,
    lives: 3,
    theme: { primary: '#4F46E5', font: 'Inter' },
    scoring: { correct: 10, wrong: -5 },
    questions: [
      {
        question: 'How many bones are in the adult human body?',
        options: ['206', '208', '185', '196'],
        answer: '206',
        explanation: 'An adult human body has 206 bones.',
      },
      {
        question: 'Which organ pumps blood throughout the body?',
        options: ['Liver', 'Kidney', 'Heart', 'Lung'],
        answer: 'Heart',
      },
      {
        question: 'What is the largest organ in the human body?',
        options: ['Brain', 'Liver', 'Skin', 'Lungs'],
        answer: 'Skin',
        explanation: 'Skin is the largest organ by surface area.',
      },
    ],
  },
  null,
  2
);

const SAMPLE_DRAGDROP = JSON.stringify(
  {
    gameType: 'dragdrop',
    title: 'Capital Cities — Geography',
    topic: 'Geography',
    timer: 0,
    lives: 3,
    theme: { primary: '#10B981', font: 'Inter' },
    scoring: { correct: 10, wrong: -5 },
    pairs: [
      { term: 'India', match: 'New Delhi' },
      { term: 'France', match: 'Paris' },
      { term: 'Japan', match: 'Tokyo' },
      { term: 'Brazil', match: 'Brasília' },
      { term: 'Australia', match: 'Canberra' },
    ],
  },
  null,
  2
);

export default function App() {
  const [jsonText, setJsonText] = useState('');
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');

  const handleLoad = (text) => {
    setError('');
    try {
      const parsed = loadConfig(text);
      setConfig(parsed);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setJsonText(text);
      handleLoad(text);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setConfig(null);
    setJsonText('');
    setError('');
  };

  if (config) {
    return <GameEngine config={config} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          🎮 TaPTaP <span className="text-indigo-600">Game Engine</span>
        </h1>
        <p className="mt-2 text-gray-500 text-base max-w-md mx-auto">
          Drop in a JSON config and instantly play a quiz or drag-and-drop game — no code changes needed.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        {/* File upload */}
        <label className="block mb-4">
          <span className="text-sm font-semibold text-gray-700 block mb-1">Upload JSON config file</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </label>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or paste JSON below</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Text area */}
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='{ "gameType": "quiz", "title": "My Game", ... }'
          rows={10}
          className="w-full font-mono text-xs border border-gray-300 rounded-xl p-3 resize-y
            focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800 bg-gray-50"
        />

        {/* Error */}
        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            ⚠️ {error}
          </div>
        )}

        {/* Load button */}
        <button
          onClick={() => handleLoad(jsonText)}
          disabled={!jsonText.trim()}
          className="mt-4 w-full py-3 rounded-xl text-white font-semibold text-base
            bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 transition"
        >
          Launch Game →
        </button>

        {/* Quick-load samples */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Try a sample config
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => { setJsonText(SAMPLE_QUIZ); handleLoad(SAMPLE_QUIZ); }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700
                hover:bg-indigo-100 transition border border-indigo-100"
            >
              📝 Quiz — Human Body
            </button>
            <button
              onClick={() => { setJsonText(SAMPLE_DRAGDROP); handleLoad(SAMPLE_DRAGDROP); }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700
                hover:bg-emerald-100 transition border border-emerald-100"
            >
              🔗 Drag & Drop — Capitals
            </button>
          </div>
        </div>
      </div>

      {/* Schema hint */}
      <div className="mt-8 w-full max-w-2xl text-xs text-gray-400">
        <p className="font-semibold text-gray-500 mb-1">JSON Schema quick reference</p>
        <div className="grid grid-cols-2 gap-3">
          <pre className="bg-white border border-gray-200 rounded-xl p-3 overflow-auto">{`// Quiz
{
  "gameType": "quiz",
  "title": "My Quiz",
  "topic": "Science",       // optional
  "timer": 30,              // 0 = no timer
  "lives": 3,
  "theme": {
    "primary": "#4F46E5",
    "font": "Inter"
  },
  "scoring": {
    "correct": 10,
    "wrong": -5
  },
  "questions": [
    {
      "question": "...",
      "options": ["A","B","C","D"],
      "answer": "A",
      "explanation": "..."  // optional
    }
  ]
}`}</pre>
          <pre className="bg-white border border-gray-200 rounded-xl p-3 overflow-auto">{`// Drag & Drop
{
  "gameType": "dragdrop",
  "title": "My Game",
  "topic": "Geography",
  "timer": 0,
  "lives": 3,
  "theme": {
    "primary": "#10B981",
    "font": "Inter"
  },
  "scoring": {
    "correct": 10,
    "wrong": -5
  },
  "pairs": [
    {
      "term": "India",
      "match": "New Delhi"
    },
    {
      "term": "France",
      "match": "Paris"
    }
  ]
}`}</pre>
        </div>
      </div>
    </div>
  );
}
