import type {
  Difficulty,
  GameType,
  LogicQuestion,
  MemoryQuestion,
  PatternQuestion,
  Question,
} from "@/types/question";

const SHAPES = ["🔴", "🔵", "🟢", "🟡", "⭐", "🌙", "🟣", "🟠"];
const ANIMALS = ["🐶", "🐱", "🐻", "🐰", "🦁", "🐸", "🐼", "🦊", "🐨", "🐷"];
const LOGIC_ANIMALS = ["🐘", "🐶", "🐥", "🐱", "🐻", "🦁"];

function pickRandom<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildPatternUnit(difficulty: Difficulty): string[] {
  if (difficulty === 1) {
    const [a, b] = pickRandom(SHAPES, 2);
    return [a, b];
  }
  if (difficulty === 2) {
    return pickRandom(SHAPES, 3);
  }
  const [a, b, c] = pickRandom(SHAPES, 3);
  return [a, b, b, c];
}

function buildShuffledOptions(answer: string, distractors: string[]): string[] {
  const options = shuffle([answer, ...distractors]);
  if (options.length > 1 && options[0] === answer) {
    const swapWith = 1 + Math.floor(Math.random() * (options.length - 1));
    [options[0], options[swapWith]] = [options[swapWith], options[0]];
  }
  return options;
}

function generatePattern(difficulty: Difficulty, age: number): PatternQuestion {
  const unit = buildPatternUnit(difficulty);
  const pool: string[] = [];
  while (pool.length < unit.length * 3) pool.push(...unit);

  // Cắt giữa chu kỳ để đáp án không luôn trùng icon đầu tiên
  const minLen = unit.length + 1;
  const maxLen = unit.length * 2 - 1;
  const showLen = minLen + Math.floor(Math.random() * (maxLen - minLen + 1));
  const sequence = pool.slice(0, showLen);
  const answer = pool[showLen];

  const shownItems = [...new Set([...sequence, answer])];
  const distractors = pickRandom(
    shownItems.filter((s) => s !== answer),
    Math.min(2, shownItems.length - 1)
  );
  const options = buildShuffledOptions(answer, distractors);

  return {
    type: "pattern",
    difficulty,
    sequence,
    options,
    answer,
    promptText: `Tìm hình tiếp theo trong chuỗi. Độ tuổi ${age} tuổi.`,
  };
}

function generateMemory(difficulty: Difficulty, age: number): MemoryQuestion {
  const itemCount = difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8;
  const showSeconds = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const items = pickRandom(ANIMALS, itemCount);
  const answer = items[Math.floor(Math.random() * items.length)];
  const distractors = pickRandom(
    ANIMALS.filter((a) => !items.includes(a)),
    2
  );
  const options = shuffle([answer, ...distractors]);

  return {
    type: "memory",
    difficulty,
    items,
    options,
    answer,
    showSeconds,
    promptText: `Nhớ ${itemCount} hình trong ${showSeconds} giây.`,
  };
}

function generateLogic(difficulty: Difficulty, _age: number): LogicQuestion {
  const comparisonCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const animalCount = comparisonCount + 1;
  const animals = pickRandom(LOGIC_ANIMALS, animalCount);
  const bySize = shuffle(animals);
  const answer = bySize[0];

  const truePairs: [string, string][] = [];
  for (let i = 0; i < bySize.length; i++) {
    for (let j = i + 1; j < bySize.length; j++) {
      truePairs.push([bySize[i], bySize[j]]);
    }
  }

  const selected = new Set<string>();
  const comparisons: string[] = [];
  const addPair = ([larger, smaller]: [string, string]) => {
    const key = `${larger}>${smaller}`;
    if (selected.has(key)) return;
    selected.add(key);
    comparisons.push(`${larger} > ${smaller}`);
  };

  // Đảm bảo suy ra được con lớn nhất (mỗi con nhỏ hơn có ít nhất một so sánh với con lớn hơn nó)
  for (let i = 1; i < bySize.length; i++) {
    const largerIdx = Math.floor(Math.random() * i);
    addPair([bySize[largerIdx], bySize[i]]);
  }

  // Thêm cặp giữa các con ở giữa để con hiện trên cùng không luôn là lớn nhất
  const middlePairs = truePairs.filter(([larger]) => larger !== answer);
  for (const pair of shuffle(middlePairs)) {
    if (comparisons.length >= comparisonCount) break;
    addPair(pair);
  }

  for (const pair of shuffle(truePairs)) {
    if (comparisons.length >= comparisonCount) break;
    addPair(pair);
  }

  const others = animals.filter((a) => a !== answer);
  const distractors = pickRandom(others, Math.min(2, others.length));
  const options = shuffle([answer, ...distractors]);

  return {
    type: "logic",
    difficulty,
    comparisons: shuffle(comparisons).slice(0, comparisonCount),
    options,
    answer,
    promptText: "Ai là con lớn nhất?",
  };
}

/** Procedural "AI" generator — có thể thay bằng LLM qua /api/generate-question */
export function generateQuestion(
  game: GameType,
  difficulty: Difficulty,
  age: number
): Question {
  switch (game) {
    case "pattern":
      return generatePattern(difficulty, age);
    case "memory":
      return generateMemory(difficulty, age);
    case "logic":
      return generateLogic(difficulty, age);
  }
}

export async function generateQuestionWithAI(
  game: GameType,
  difficulty: Difficulty,
  age: number
): Promise<Question> {
  return generateQuestion(game, difficulty, age);
}
