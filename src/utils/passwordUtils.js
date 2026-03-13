const WORD_LIST = [
  "apple", "river", "mountain", "cloud", "ocean", "forest", "desert", "stars", "planet", "galaxy",
  "tiger", "eagle", "dolphin", "wolf", "lion", "bear", "dragon", "phoenix", "falcon", "zebra",
  "coffee", "sugar", "bread", "water", "honey", "lemon", "mango", "berry", "grape", "peach",
  "guitar", "piano", "violin", "flute", "drum", "cello", "harp", "trumpet", "banjo", "chime",
  "summer", "winter", "autumn", "spring", "morning", "evening", "night", "twilight", "dawn", "dusk",
  "silver", "copper", "bronze", "iron", "steel", "gold", "crystal", "ruby", "emerald", "sapphire",
  "breeze", "storm", "thunder", "lightning", "snow", "rain", "frost", "shadow", "light", "fire",
  "circle", "square", "triangle", "sphere", "cube", "pyramid", "spiral", "curve", "line", "dot",
  "happy", "brave", "calm", "clever", "gentle", "proud", "swift", "wise", "bold", "keen",
  "castle", "bridge", "tower", "palace", "temple", "garden", "market", "harbor", "village", "city",
  "rocket", "engine", "motor", "wheel", "gear", "pixel", "laser", "radar", "sonar", "robot",
  "paper", "pencil", "book", "letter", "scroll", "canvas", "brush", "color", "paint", "draw",
  "travel", "journey", "voyage", "quest", "dream", "vision", "magic", "wonder", "secret", "mystery"
];

const USERNAME_POOLS = {
  gaming: {
    prefixes: [
      'Shadow', 'Dark', 'Cyber', 'Neon', 'Phantom', 'Rogue', 'Silent', 'Frost',
      'Blaze', 'Turbo', 'Mystic', 'Quantum', 'Nova'
    ],
    suffixes: [
      'Tiger', 'Wolf', 'Nova', 'Pixel', 'Dragon', 'Hunter', 'Raider',
      'Strike', 'Vortex', 'Titan', 'Phoenix'
    ],
    tags: ['AI', 'X', 'Pro', 'XR', 'GT']
  },
  professional: {
    prefixes: [
      'Prime', 'Apex', 'Nexus', 'Vector', 'Summit', 'Core', 'Atlas', 'Sterling',
      'Insight', 'Optima'
    ],
    suffixes: [
      'Logic', 'Works', 'Labs', 'Studio', 'Systems', 'Digital', 'Network',
      'Strategy', 'Design'
    ],
    tags: ['HQ', 'AI', 'Team', 'Ops', 'Lead']
  },
  random: {
    prefixes: [
      'Zyra', 'Kivo', 'Mexo', 'Luno', 'Vexa', 'Rivo', 'Tora', 'Navo',
      'Xilo', 'Cora', 'Zeno', 'Wexa'
    ],
    suffixes: [
      'Flux', 'Byte', 'Nova', 'Code', 'Grid', 'Wave', 'Spark', 'Shift',
      'Pulse', 'Sync'
    ],
    tags: ['Q', 'X', 'AI', 'Lab', 'One', 'Max']
  }
};

const FUN_WORD_BANK = {
  animals: [
    { word: 'tiger', emoji: 0x1f42f },
    { word: 'panda', emoji: 0x1f43c },
    { word: 'dragon', emoji: 0x1f409 },
    { word: 'eagle', emoji: 0x1f985 },
    { word: 'dolphin', emoji: 0x1f42c },
    { word: 'wolf', emoji: 0x1f43a }
  ],
  food: [
    { word: 'pizza', emoji: 0x1f355 },
    { word: 'coffee', emoji: 0x2615 },
    { word: 'cookie', emoji: 0x1f36a },
    { word: 'cake', emoji: 0x1f370 },
    { word: 'burger', emoji: 0x1f354 },
    { word: 'tea', emoji: 0x1f375 }
  ],
  nature: [
    { word: 'moon', emoji: 0x1f319 },
    { word: 'ocean', emoji: 0x1f30a },
    { word: 'forest', emoji: 0x1f332 },
    { word: 'river', emoji: 0x1f3de },
    { word: 'cloud', emoji: 0x2601 },
    { word: 'sun', emoji: 0x1f31e }
  ],
  objects: [
    { word: 'laptop', emoji: 0x1f4bb },
    { word: 'rocket', emoji: 0x1f680 },
    { word: 'camera', emoji: 0x1f4f7 },
    { word: 'keyboard', emoji: 0x2328 },
    { word: 'telescope', emoji: 0x1f52d },
    { word: 'engine', emoji: 0x2699 }
  ],
  space: [
    { word: 'galaxy', emoji: 0x1f30c },
    { word: 'planet', emoji: 0x1fa90 },
    { word: 'cosmic', emoji: 0x2728 },
    { word: 'nebula', emoji: 0x1f4ab },
    { word: 'orbit', emoji: 0x1f6f0 },
    { word: 'star', emoji: 0x2b50 }
  ],
  fantasy: [
    { word: 'wizard', emoji: 0x1f9d9 },
    { word: 'phoenix', emoji: 0x1f525 },
    { word: 'knight', emoji: 0x1f6e1 },
    { word: 'castle', emoji: 0x1f3f0 },
    { word: 'mythic', emoji: 0x1fa84 },
    { word: 'legend', emoji: 0x1f4dc }
  ]
};

const FUN_THEME_CATEGORIES = {
  mixed: ['animals', 'food', 'nature', 'objects', 'space', 'fantasy'],
  animals: ['animals'],
  food: ['food'],
  nature: ['nature'],
  space: ['space'],
  fantasy: ['fantasy'],
  story: ['animals', 'food', 'nature', 'objects', 'space', 'fantasy']
};

const MEMORY_WORDS = Array.from(new Set([
  ...WORD_LIST,
  ...Object.values(FUN_WORD_BANK).flatMap((group) => group.map((entry) => entry.word))
]))
  .filter((word) => word.length >= 3)
  .sort((a, b) => b.length - a.length);

const FUN_SYMBOLS = ['!', '@', '#', '$', '%', '&'];
const FUN_STORY_VERBS = ['Drinks', 'Finds', 'Builds', 'Guards', 'Chases', 'Sees'];
const FUN_STORY_LINKERS = ['On', 'Near', 'Beyond', 'Inside', 'Under'];
const PATTERN_TOKEN_MAP = {
  A: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  a: 'abcdefghijklmnopqrstuvwxyz',
  9: '0123456789',
  '@': '!@#$%^&*()_+~|}{[]:;?><,./-='
};
const SMART_PRIMARY_SYMBOLS = ['$', '@', '#', '&'];
const SMART_SECONDARY_SYMBOLS = ['!', '?', '#', '%'];
const MUTATION_SYMBOLS = ['!', '@', '#', '$', '%', '&', '?'];
const MUTATION_FILLER = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const MUTATION_LEET_MAP = {
  a: ['@', '4'],
  e: ['3'],
  i: ['1', '!'],
  o: ['0'],
  s: ['5', '$'],
  t: ['7']
};
const ROTATION_SYMBOLS = ['!', '@', '#', '$', '%', '&', '?', '*'];

function getCryptoRandomInt(max) {
  if (max <= 0) return 0;
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  return randomValues[0] % max;
}

function pickRandom(items) {
  return items[getCryptoRandomInt(items.length)];
}

function toEmoji(codePoint) {
  return String.fromCodePoint(codePoint);
}

export function copyText(text) {
  if (!navigator.clipboard) return false;
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function generatePassword({ length, options }) {
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
  };

  let validChars = '';
  Object.keys(options).forEach((key) => {
    if (options[key]) {
      validChars += charSets[key];
    }
  });

  if (!validChars) return '';

  let generated = '';
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    generated += validChars[randomValues[i] % validChars.length];
  }

  return generated;
}

export function generatePassphrase({ wordCount = 4, separator = '-', capitalize = false, includeNumber = false }) {
  let passphraseWords = [];
  const randomIndices = new Uint32Array(wordCount);
  window.crypto.getRandomValues(randomIndices);

  for (let i = 0; i < wordCount; i++) {
    let word = WORD_LIST[randomIndices[i] % WORD_LIST.length];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    passphraseWords.push(word);
  }

  let finalPhrase = passphraseWords.join(separator);

  if (includeNumber) {
    const randomNum = new Uint32Array(1);
    window.crypto.getRandomValues(randomNum);
    const num = (randomNum[0] % 90) + 10;
    finalPhrase += `${separator ? separator : ''}${num}`;
  }

  return finalPhrase;
}

export function generateUsername({
  mode = 'random',
  includeNumber = true,
  includeTag = true
} = {}) {
  const config = USERNAME_POOLS[mode] || USERNAME_POOLS.random;

  let username = `${pickRandom(config.prefixes)}${pickRandom(config.suffixes)}`;

  if (includeTag) {
    username += pickRandom(config.tags);
  }

  if (includeNumber) {
    const numberDigits = mode === 'professional' ? 2 : 2 + getCryptoRandomInt(2);
    const min = numberDigits === 2 ? 10 : 100;
    const range = numberDigits === 2 ? 90 : 900;
    username += String(min + getCryptoRandomInt(range));
  }

  return username;
}

export function generatePin({ length = 4 } = {}) {
  const normalizedLength = length === 6 ? 6 : 4;
  const randomValues = new Uint32Array(normalizedLength);
  window.crypto.getRandomValues(randomValues);

  let pin = '';
  for (let i = 0; i < normalizedLength; i += 1) {
    pin += String(randomValues[i] % 10);
  }

  return pin;
}

export function generatePasswordRotations({
  currentPassword = '',
  method = 'mixed',
  count = 4,
  startAt = 1
} = {}) {
  const source = String(currentPassword || '').trim();
  if (!source) return [];

  const safeCount = Math.max(1, Math.min(24, Number(count) || 4));
  const safeStart = Math.max(1, Number(startAt) || 1);
  const safeMethod = ['year', 'number', 'symbol', 'mixed'].includes(method) ? method : 'mixed';

  const yearMatches = Array.from(source.matchAll(/(19|20)\d{2}/g));
  const lastYearMatch = yearMatches[yearMatches.length - 1];
  const hasYear = Boolean(lastYearMatch);
  const yearValue = hasYear ? Number(lastYearMatch[0]) : new Date().getFullYear();

  const numberMatches = Array.from(source.matchAll(/\d+/g));
  const lastNumberMatch = numberMatches[numberMatches.length - 1];
  const hasNumber = Boolean(lastNumberMatch);
  const numberStart = hasNumber ? lastNumberMatch.index : -1;
  const numberEnd = hasNumber ? numberStart + lastNumberMatch[0].length : -1;
  const numberValue = hasNumber ? Number(lastNumberMatch[0]) : 0;
  const numberWidth = hasNumber ? lastNumberMatch[0].length : 2;

  const symbolMatches = Array.from(source.matchAll(/[^A-Za-z0-9]/g));
  const lastSymbolMatch = symbolMatches[symbolMatches.length - 1];
  const hasSymbol = Boolean(lastSymbolMatch);
  const symbolStart = hasSymbol ? lastSymbolMatch.index : -1;
  const baseSymbolIndex = hasSymbol
    ? Math.max(0, ROTATION_SYMBOLS.indexOf(lastSymbolMatch[0]))
    : 0;

  const applyYear = (value, step) => {
    const nextYear = String(yearValue + step);
    if (!hasYear) {
      return `${value}${nextYear}`;
    }
    const yearStart = lastYearMatch.index;
    const yearEnd = yearStart + lastYearMatch[0].length;
    return `${value.slice(0, yearStart)}${nextYear}${value.slice(yearEnd)}`;
  };

  const applyNumber = (value, step) => {
    const nextNumber = String(numberValue + step).padStart(numberWidth, '0');
    if (!hasNumber) {
      return `${value}${String(step).padStart(2, '0')}`;
    }
    return `${value.slice(0, numberStart)}${nextNumber}${value.slice(numberEnd)}`;
  };

  const applySymbol = (value, step) => {
    const symbol = ROTATION_SYMBOLS[(baseSymbolIndex + step) % ROTATION_SYMBOLS.length];
    if (!hasSymbol) {
      return `${value}${symbol}`;
    }
    return `${value.slice(0, symbolStart)}${symbol}${value.slice(symbolStart + 1)}`;
  };

  const rotations = [];
  const seen = new Set();

  for (let i = safeStart; rotations.length < safeCount; i += 1) {
    let next = source;

    if (safeMethod === 'year' || safeMethod === 'mixed') {
      next = applyYear(next, i);
    }

    if (safeMethod === 'number') {
      next = applyNumber(next, i);
    }

    if (safeMethod === 'symbol' || safeMethod === 'mixed') {
      next = applySymbol(next, i);
    }

    if (!seen.has(next)) {
      seen.add(next);
      rotations.push(next);
    }

    if (i > safeStart + safeCount + 24) {
      break;
    }
  }

  return rotations;
}

export function buildRotationSchedule(rotations = [], { intervalDays = 90, startDate = new Date() } = {}) {
  const safeInterval = [30, 60, 90].includes(Number(intervalDays)) ? Number(intervalDays) : 90;
  const anchor = startDate instanceof Date ? startDate : new Date(startDate);

  return rotations.map((password, index) => {
    const date = new Date(anchor);
    date.setDate(date.getDate() + safeInterval * (index + 1));

    return {
      password,
      dateLabel: date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
  });
}

export function assessRotationPredictability(basePassword = '', rotations = []) {
  const source = String(basePassword || '');
  if (!source || !Array.isArray(rotations) || rotations.length === 0) {
    return { predictable: false, message: '', averageDiff: 0 };
  }

  const stripCore = (value) => String(value).replace(/[0-9]|[^A-Za-z0-9]/g, '').toLowerCase();
  const baseCore = stripCore(source);
  const sameCore = rotations.every((item) => stripCore(item) === baseCore);

  const countDiff = (a, b) => {
    const minLength = Math.min(a.length, b.length);
    let diff = Math.abs(a.length - b.length);

    for (let i = 0; i < minLength; i += 1) {
      if (a[i] !== b[i]) diff += 1;
    }

    return diff;
  };

  const averageDiff = rotations.reduce((sum, item) => sum + countDiff(source, item), 0) / rotations.length;

  let predictable = false;
  let message = '';

  if (sameCore && averageDiff <= 3) {
    predictable = true;
    message = 'Your rotation pattern may be predictable. Consider adding another word or changing structure.';
  } else if (averageDiff <= 1.5) {
    predictable = true;
    message = 'Generated passwords are very close to each other. Add more variation for better security.';
  }

  return {
    predictable,
    message,
    averageDiff: Math.round(averageDiff * 10) / 10
  };
}

export function mutateWeakPassword(weakPassword = '') {
  const source = String(weakPassword || '').trim();
  const normalized = (source || pickRandom(WORD_LIST)).replace(/\s+/g, '');

  const chars = normalized.split('').map((char, index) => {
    const mapped = MUTATION_LEET_MAP[char.toLowerCase()];
    if (!mapped) return char;

    const shouldReplace = index % 2 === 0 || getCryptoRandomInt(100) < 60;
    return shouldReplace ? pickRandom(mapped) : char;
  });

  const uppercaseFrom = (startIndex) => {
    for (let i = Math.max(0, startIndex); i < chars.length; i += 1) {
      if (/[a-zA-Z]/.test(chars[i])) {
        chars[i] = chars[i].toUpperCase();
        return true;
      }
    }
    return false;
  };

  uppercaseFrom(0);
  uppercaseFrom(2);
  uppercaseFrom(Math.floor(chars.length * 0.6));

  const hasLower = chars.some((char) => /[a-z]/.test(char));
  const hasUpper = chars.some((char) => /[A-Z]/.test(char));
  const hasNumber = chars.some((char) => /[0-9]/.test(char));
  const hasSymbol = chars.some((char) => /[^A-Za-z0-9]/.test(char));

  if (!hasLower) {
    chars.push(String.fromCharCode(97 + getCryptoRandomInt(26)));
  }
  if (!hasUpper) {
    chars.push(String.fromCharCode(65 + getCryptoRandomInt(26)));
  }
  if (!hasNumber) {
    chars.push(String(getCryptoRandomInt(10)));
  }
  if (!hasSymbol) {
    chars.push(pickRandom(MUTATION_SYMBOLS));
  }

  if (chars.length < 10) {
    const targetLength = 10 + getCryptoRandomInt(3);
    while (chars.length < targetLength) {
      chars.push(MUTATION_FILLER[getCryptoRandomInt(MUTATION_FILLER.length)]);
    }
  }

  let mutated = chars.join('');
  if (mutated.toLowerCase() === normalized.toLowerCase()) {
    mutated = mutated + pickRandom(MUTATION_SYMBOLS) + String(getCryptoRandomInt(10));
  }

  return mutated;
}

export function generatePatternPassword(pattern = 'AA-999-@@') {
  if (!pattern || typeof pattern !== 'string') return '';

  let generated = '';
  let hasToken = false;

  for (const char of pattern) {
    const tokenSet = PATTERN_TOKEN_MAP[char];
    if (tokenSet) {
      hasToken = true;
      generated += tokenSet[getCryptoRandomInt(tokenSet.length)];
    } else {
      generated += char;
    }
  }

  return hasToken ? generated : '';
}

export function generateSmartPassword({
  favoriteWord = 'Tiger',
  year = '',
  keyword = 'Secure'
} = {}) {
  const sanitizeText = (value) => String(value || '').replace(/[^A-Za-z0-9]/g, '');
  const toTitle = (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  const cleanFavorite = sanitizeText(favoriteWord) || 'Tiger';
  const cleanKeyword = sanitizeText(keyword) || 'Secure';

  const cleanYearRaw = String(year || '').replace(/[^0-9]/g, '');
  const cleanYear = cleanYearRaw
    ? cleanYearRaw.slice(-4)
    : String(new Date().getFullYear());

  const firstSymbol = pickRandom(SMART_PRIMARY_SYMBOLS);
  const secondSymbol = pickRandom(SMART_SECONDARY_SYMBOLS);

  const formattedFavorite = toTitle(cleanFavorite);
  const formattedKeyword = toTitle(cleanKeyword);

  const templates = [
    `${formattedFavorite}${firstSymbol}${cleanYear}${secondSymbol}${formattedKeyword}`,
    `${formattedKeyword}${firstSymbol}${formattedFavorite}${cleanYear}${secondSymbol}`,
    `${formattedFavorite}${cleanYear}${firstSymbol}${formattedKeyword}${secondSymbol}`
  ];

  return pickRandom(templates);
}
export function generateFunPassword({
  mode = 'fun',
  wordCount = 3,
  theme = 'mixed',
  includeNumber = true,
  includeSymbol = false,
  capitalizeWords = true,
  includeEmoji = false,
  storyMode = false
} = {}) {
  if (mode === 'strong') {
    const strongPassword = generatePassword({
      length: 18,
      options: {
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
      }
    });

    return {
      password: strongPassword,
      words: [strongPassword],
      label: 'Strong Password'
    };
  }

  const normalizedCount = Math.max(3, Math.min(5, wordCount));
  const categoryKeys = FUN_THEME_CATEGORIES[theme] || FUN_THEME_CATEGORIES.mixed;

  const selectedWords = [];
  for (let i = 0; i < normalizedCount; i += 1) {
    const category = categoryKeys[getCryptoRandomInt(categoryKeys.length)];
    selectedWords.push(pickRandom(FUN_WORD_BANK[category]));
  }

  const formatWord = (entry) => {
    const core = capitalizeWords
      ? entry.word.charAt(0).toUpperCase() + entry.word.slice(1)
      : entry.word;

    return includeEmoji ? `${core}${toEmoji(entry.emoji)}` : core;
  };

  let composedWords = selectedWords.map((entry) => formatWord(entry));

  if (storyMode && composedWords.length >= 3) {
    const storyStart = capitalizeWords
      ? composedWords[0]
      : composedWords[0].charAt(0).toUpperCase() + composedWords[0].slice(1);

    composedWords = [
      storyStart,
      pickRandom(FUN_STORY_VERBS),
      composedWords[1],
      pickRandom(FUN_STORY_LINKERS),
      ...composedWords.slice(2)
    ];
  }

  let password = composedWords.join('');

  if (includeNumber) {
    const randomNum = new Uint32Array(1);
    window.crypto.getRandomValues(randomNum);
    password += String((randomNum[0] % 90) + 10);
  }

  if (includeSymbol) {
    password += pickRandom(FUN_SYMBOLS);
  }

  return {
    password,
    words: composedWords,
    label: 'Fun Password'
  };
}

export function analyzeMemorability(password) {
  if (!password) {
    return {
      score: 0,
      level: 'Very Hard',
      levelKey: 'very-hard',
      words: [],
      coverage: 0,
      feedback: ['Enter a password to evaluate memorability.']
    };
  }

  const value = String(password);
  const lowerValue = value.toLowerCase();
  const length = value.length;

  const digits = (value.match(/[0-9]/g) || []).length;
  const symbols = (value.match(/[^A-Za-z0-9]/g) || []).length;
  const uniqueRatio = new Set(value).size / Math.max(length, 1);

  const occupied = new Array(length).fill(false);
  const matchedWords = [];

  for (const word of MEMORY_WORDS) {
    let start = lowerValue.indexOf(word);
    while (start !== -1) {
      const end = start + word.length;
      let overlaps = false;

      for (let i = start; i < end; i += 1) {
        if (occupied[i]) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        matchedWords.push(word);
        for (let i = start; i < end; i += 1) {
          occupied[i] = true;
        }
      }

      start = lowerValue.indexOf(word, start + 1);
    }
  }

  const coveredCount = occupied.filter(Boolean).length;
  const coverageRatio = coveredCount / Math.max(length, 1);

  let score = 20;
  const feedback = [];

  if (matchedWords.length >= 3) {
    score += 35;
    feedback.push('Great word sequence. It is easy to picture and remember.');
  } else if (matchedWords.length === 2) {
    score += 24;
    feedback.push('Two recognizable words improve memorability.');
  } else if (matchedWords.length === 1) {
    score += 12;
    feedback.push('One recognizable word found. Add one more for easier recall.');
  } else {
    feedback.push('Try combining 2-3 simple words, like CoffeeTigerMoon.');
  }

  if (coverageRatio >= 0.65) {
    score += 15;
  } else if (coverageRatio >= 0.45) {
    score += 8;
  } else if (coverageRatio < 0.2) {
    score -= 10;
  }

  if (length >= 12 && length <= 24) {
    score += 12;
    feedback.push('Length is strong and still practical to remember.');
  } else if (length >= 8) {
    score += 6;
    feedback.push('Good length. Adding a few more characters improves security.');
  } else {
    score -= 8;
    feedback.push('Very short passwords are easy to forget and easy to crack.');
  }

  const numbersAtEnd = /\d{1,4}$/.test(value);
  if (digits > 0 && numbersAtEnd) {
    score += 8;
    feedback.push('Numbers at the end are easier to remember.');
  } else if (digits > 0) {
    score -= 5;
    feedback.push('Scattered numbers reduce readability.');
  } else {
    feedback.push('Add 1-2 digits at the end to boost security.');
  }

  const symbolAtEnd = /[^A-Za-z0-9]{1,2}$/.test(value);
  if (symbols > 0 && symbolAtEnd) {
    score += 5;
    feedback.push('Ending symbol keeps complexity without hurting memory much.');
  } else if (symbols > 0) {
    score -= 8;
    feedback.push('Symbols in the middle are harder to recall.');
  } else {
    feedback.push('Add one symbol at the end, such as ! or @.');
  }

  const randomLike = matchedWords.length === 0 && symbols >= 2 && digits >= 2 && uniqueRatio > 0.75;
  if (randomLike) {
    score -= 14;
    feedback.push('This pattern looks random, so it may be difficult to memorize.');
  }

  const caseTransitions = (value.match(/[a-z][A-Z]/g) || []).length;
  if (caseTransitions >= 2 && matchedWords.length >= 2) {
    score += 6;
  } else if (caseTransitions >= 4 && matchedWords.length === 0) {
    score -= 4;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let level = 'Very Hard';
  if (score >= 80) level = 'Very Easy';
  else if (score >= 60) level = 'Easy';
  else if (score >= 40) level = 'Medium';
  else if (score >= 20) level = 'Hard';

  return {
    score,
    level,
    levelKey: level.toLowerCase().replace(/\s+/g, '-'),
    words: Array.from(new Set(matchedWords)).slice(0, 4),
    coverage: Math.round(coverageRatio * 100),
    feedback
  };
}

export function analyzePassword(password) {
  if (!password) {
    return {
      score: 0,
      level: 'weak',
      label: 'None',
      crackTime: 'Instant',
      feedback: ['Enter a password to analyze'],
      metrics: { length: false, lower: false, upper: false, number: false, symbol: false }
    };
  }

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  const entropy = length * Math.log2(poolSize || 1);

  let score = 0;
  let level = 'weak';
  let label = 'Very Weak';
  let crackTime = 'Instant';
  const feedback = [];

  if (length < 8) {
    feedback.push('Password is too short. Try at least 12 characters.');
  } else {
    score += 25;
    if (length >= 12) score += 15;
    if (length >= 16) score += 10;
  }

  if (!hasLower) feedback.push('Add lowercase letters.');
  else score += 10;

  if (!hasUpper) feedback.push('Add uppercase letters.');
  else score += 15;

  if (!hasNumber) feedback.push('Include at least one number.');
  else score += 10;

  if (!hasSymbol) feedback.push('Include special characters (e.g., !@#$%).');
  else score += 15;

  if (/^[a-zA-Z]+$/.test(password) && length > 0) {
    feedback.push('Using only letters is highly vulnerable to dictionary attacks.');
    score -= 15;
  }
  if (/^[0-9]+$/.test(password) && length > 0) {
    feedback.push('Using only numbers makes cracks instantaneous.');
    score -= 20;
  }

  score = Math.max(0, Math.min(100, score));

  if (entropy < 40) {
    level = 'weak';
    label = entropy < 25 ? 'Very Weak' : 'Weak';
    crackTime = entropy < 25 ? 'Instant' : 'A few minutes';
  } else if (entropy < 60) {
    level = 'medium';
    label = 'Decent';
    crackTime = 'A few days';
  } else if (entropy < 80) {
    level = 'strong';
    label = 'Strong';
    crackTime = 'Several years';
  } else {
    level = 'strong';
    label = 'Excellent';
    crackTime = 'Centuries';
  }

  return {
    score,
    level,
    label,
    crackTime,
    entropy: Math.round(entropy),
    feedback: feedback.length > 0 ? feedback : ['Your password is highly secure!'],
    metrics: {
      length: length >= 12,
      lower: hasLower,
      upper: hasUpper,
      number: hasNumber,
      symbol: hasSymbol
    }
  };
}

export function scorePassword(password) {
  const result = analyzePassword(password);
  return {
    score: result.score,
    level: result.level,
    label: result.label
  };
}

export function formatHistoryTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}








