# Proposed Solution approach (checkout Proposed_Solution.pdf)

A **JSON-driven, React-based learning game engine** that renders multiple distinct game types from a single codebase by swapping the JSON config file.

## 🏗️ Architecture

```
src/
├── engine/
│   ├── ConfigLoader.js      # Validates & normalises JSON config
│   ├── ScoreManager.js      # Score / lives / timer state (useReducer)
│   └── GameEngine.jsx       # Master controller — routes gameType → module
├── modules/
│   ├── Quiz/
│   │   ├── Quiz.jsx         # MCQ game (single + multi-answer)
│   ├── DragDrop/
│   │   └── DragDrop.jsx     # Pair-matching via HTML5 Drag API
│   |--- we might be adding more game types/
├── components/
│   ├── ScoreBoard.jsx       # Live score / timer / lives bar
│   └── GameOver.jsx         # End-of-game result screen
│
└── App.jsx                  # Landing page — JSON file upload + paste UI
configs/
├── quiz-demo.json           # Sample MCQ config (This will show how the input json should looks like for quiz based games)
└── dragdrop-demo.json       # Sample drag-and-drop config (for drag and drop based games)
```

### Layer Model

| Layer                    | Role                                              |
| ------------------------ | ------------------------------------------------- |
| **Config Layer** (JSON)  | Defines game type, content, rules, timer, scoring |
| **Engine Core** (React)  | GameEngine → ConfigLoader → ScoreManager          |
| **Game Modules** (React) | Quiz, DragDrop, we will add more                  |

---

## 📄 JSON Config Schema

### Quiz config — add a `questions` array

```json
{
  "gameType": "quiz",
  "topic": "Science",
  "questions": [
    {
      "question": "How many bones are in the adult human body?",
      "options": ["206", "208", "185", "196"],
      "answer": "206"
    }
  ]
}
```

- `answer` → string (single correct) or array of strings (multi-select)

### Drag & Drop config — add a `pairs` array

```json
{
  "gameType": "dragdrop",
  "topic": "Geography",
  "pairs": [
    { "term": "India", "match": "New Delhi" },
    { "term": "France", "match": "Paris" }
  ]
}
```

---

## 🎮 Supported Game Types

| `gameType` | Description                          | Status   |
| ---------- | ------------------------------------ | -------- |
| `quiz`     | MCQ, single or multi-answer, timer   | ✅ Ready |
| `dragdrop` | Drag terms onto matching definitions | ✅ Ready |

---

## 📦 Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| UI Framework     | React 18                        |
| Build Tool       | Vite                            |
| Styling          | Tailwind CSS v4                 |
| State Management | React `useState` / `useReducer` |
| Drag & Drop      | HTML5 Drag API                  |

---

## 🔌 Adding a New Game Type

1. Create `src/modules/YourGame/YourGame.jsx` accepting `{ config, onCorrect, onWrong }` props
2. Register it in `src/engine/GameEngine.jsx` inside `MODULE_MAP`
3. Add a validator function in `src/engine/ConfigLoader.js` under `VALIDATORS`
