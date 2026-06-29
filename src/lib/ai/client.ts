import { Ollama } from "ollama";
import type { Profile, Attribute } from "@prisma/client";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.1";
const ollama = new Ollama({ host: OLLAMA_BASE_URL });

function fallbackReply(systemPrompt: string, userPrompt: string): string {
  const lines = systemPrompt.split("\n").filter((l) => l.startsWith("- ")).slice(0, 3).map((l) => l.slice(2)).join("; ");
  return `[System fallback] ${userPrompt}\n\nOllama is offline. ${lines || "The system is operating in limited mode."}`;
}

export async function callAI(systemPrompt: string, userPrompt: string, jsonFormat = false): Promise<string> {
  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      format: jsonFormat ? "json" : undefined,
      options: { temperature: 0.7 },
    });

    return response.message.content;
  } catch (error) {
    console.error("Ollama connection error. Ensure Ollama is running locally:", error);
    return fallbackReply(systemPrompt, userPrompt);
  }
}
