import { NextResponse } from "next/server";
import { generateQuestion } from "@/services/questionGenerator";
import type { Difficulty, GameType } from "@/types/question";

/** API sinh câu hỏi — hiện dùng engine procedural; có thể nối OpenAI sau */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    game: GameType;
    difficulty: Difficulty;
    age: number;
  };

  if (!body.game || !body.difficulty || !body.age) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const question = generateQuestion(body.game, body.difficulty, body.age);
  return NextResponse.json(question);
}
