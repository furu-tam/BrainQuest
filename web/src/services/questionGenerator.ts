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

function generatePattern(difficulty: Difficulty, age: number): PatternQuestion {
  const unit = buildPatternUnit(difficulty);
  const repeats = difficulty === 1 ? 2 : 2;
  const sequence: string[] = [];
  for (let i = 0; i < repeats; i++) sequence.push(...unit);
  const answer = unit[sequence.length % unit.length];

  const distractors = pickRandom(
    SHAPES.filter((s) => s !== answer),
    2
  );
  const options = shuffle([answer, ...distractors]);

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

function generateLogic(difficulty: Difficulty, age: number): LogicQuestion {
  const comparisonCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const pool = pickRandom(LOGIC_ANIMALS, comparisonCount + 1);
  const comparisons: string[] = [];
  for (let i = 0; i < comparisonCount; i++) {
    comparisons.push(`${pool[i]} > ${pool[i + 1]}`);
  }
  const answer = pool[0];
  const others = pool.filter((p) => p !== answer);
  const distractors = pickRandom(others, Math.min(2, others.length));
  const options = shuffle([answer, ...distractors]);

  return {
    type: "logic",
    difficulty,
    comparisons,
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
