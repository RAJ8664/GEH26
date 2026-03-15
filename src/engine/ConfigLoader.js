/**
 * ConfigLoader — validates and normalises the incoming JSON config.
 * Returns the parsed config object on success, throws a descriptive Error on failure.
 */

const VALID_GAME_TYPES = ['quiz', 'dragdrop', 'memoryflip', 'fillblanks'];

function assertField(obj, key, type, label) {
  if (obj[key] === undefined || obj[key] === null) {
    throw new Error(`Missing required field: "${key}" in ${label}`);
  }
  if (type && typeof obj[key] !== type) {
    throw new Error(`Field "${key}" must be of type ${type} in ${label}`);
  }
}

function validateQuiz(config) {
  if (!Array.isArray(config.questions) || config.questions.length === 0) {
    throw new Error('"questions" must be a non-empty array for game type "quiz"');
  }
  config.questions.forEach((q, i) => {
    assertField(q, 'question', 'string', `questions[${i}]`);
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`questions[${i}].options must be an array with at least 2 items`);
    }
    if (q.answer === undefined) {
      throw new Error(`questions[${i}] is missing "answer"`);
    }
  });
}

function validateDragDrop(config) {
  if (!Array.isArray(config.pairs) || config.pairs.length === 0) {
    throw new Error('"pairs" must be a non-empty array for game type "dragdrop"');
  }
  config.pairs.forEach((p, i) => {
    assertField(p, 'term', 'string', `pairs[${i}]`);
    assertField(p, 'match', 'string', `pairs[${i}]`);
  });
}

function validateMemoryFlip(config) {
  if (!Array.isArray(config.cards) || config.cards.length === 0) {
    throw new Error('"cards" must be a non-empty array for game type "memoryflip"');
  }
  config.cards.forEach((c, i) => {
    assertField(c, 'id', undefined, `cards[${i}]`);
    assertField(c, 'content', 'string', `cards[${i}]`);
    assertField(c, 'pairId', undefined, `cards[${i}]`);
  });
}

function validateFillBlanks(config) {
  if (!Array.isArray(config.questions) || config.questions.length === 0) {
    throw new Error('"questions" must be a non-empty array for game type "fillblanks"');
  }
  config.questions.forEach((q, i) => {
    assertField(q, 'sentence', 'string', `questions[${i}]`);
    assertField(q, 'answer', 'string', `questions[${i}]`);
  });
}

const VALIDATORS = {
  quiz: validateQuiz,
  dragdrop: validateDragDrop,
  memoryflip: validateMemoryFlip,
  fillblanks: validateFillBlanks,
};

export function loadConfig(raw) {
  let config;

  if (typeof raw === 'string') {
    try {
      config = JSON.parse(raw);
    } catch {
      throw new Error('Invalid JSON — could not parse the config file.');
    }
  } else if (typeof raw === 'object' && raw !== null) {
    config = raw;
  } else {
    throw new Error('Config must be a JSON string or object.');
  }

  assertField(config, 'gameType', 'string', 'root');
  assertField(config, 'title', 'string', 'root');

  const type = config.gameType.toLowerCase();
  if (!VALID_GAME_TYPES.includes(type)) {
    throw new Error(
      `Unknown gameType "${config.gameType}". Supported types: ${VALID_GAME_TYPES.join(', ')}`
    );
  }
  config.gameType = type;

  // Apply defaults
  config.timer = typeof config.timer === 'number' ? config.timer : 0;
  config.topic = config.topic || '';
  config.theme = {
    primary: '#4F46E5',
    font: 'Inter',
    ...(config.theme || {}),
  };
  config.scoring = {
    correct: 10,
    wrong: -5,
    ...(config.scoring || {}),
  };

  VALIDATORS[type](config);

  return config;
}
