export type Difficulty = 1 | 2 | 3;
export type GameType = "pattern" | "memory" | "logic";

export interface PatternQuestion {
  type: "pattern";
  difficulty: Difficulty;
  sequence: string[];
  options: string[];
  answer: string;
  promptText: string;
}

export interface MemoryQuestion {
  type: "memory";
  difficulty: Difficulty;
  items: string[];
  options: string[];
  answer: string;
  showSeconds: number;
  promptText: string;
}

export interface LogicQuestion {
  type: "logic";
  difficulty: Difficulty;
  comparisons: string[];
  options: string[];
  answer: string;
  promptText: string;
}

export type Question = PatternQuestion | MemoryQuestion | LogicQuestion;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  1: "Dễ",
  2: "Trung bình",
  3: "Khó",
};
