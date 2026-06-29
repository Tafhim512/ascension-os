import { Ollama } from "ollama";
import { searchMemories, formatMemoriesForPrompt } from "./memory";
import type { Profile } from "@prisma/client";

type ChatProfile = Profile & {
  futureSelves?: { vision?: string }[];
};

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.1";
const ollama = new Ollama({ host: OLLAMA_BASE_URL });

async function* fallbackStream(profile: ChatProfile, messages: { role: string; content: string }[]) {
  const userMessage = messages[messages.length - 1]?.content || "";
  const memoryContext = "No memories stored yet.";
  const reply = `System fallback active.\n\nOllama is offline. Operational mode: limited.\nLast user message: "${userMessage}"\nMemory context: ${memoryContext}`;
  const words = reply.split(" ");
  for (const word of words) {
    yield { message: { content: word + " " } };
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}

export async function* chatStream(profile: ChatProfile, messages: { role: string; content: string }[]) {
  const lastMsg = messages[messages.length - 1]?.content || "";

  let memoryContext = "No memories stored yet.";
  try {
    const memories = await searchMemories(profile.id, lastMsg, 3);
    memoryContext = formatMemoriesForPrompt(memories);
  } catch (e) {
    console.error("Memory search failed in chat:", e);
  }

  const systemPrompt = `You are The System, an advanced AI Mentor and Chief of Staff for Ascension OS.
The user is ${profile.playerName}, Level ${profile.level}, Momentum ${profile.momentum}/100.
Streak: ${profile.currentStreak} days.
Current Archetype Vision: ${profile.futureSelves?.[0]?.vision || "Unknown"}

Your style:
- Highly intelligent, direct, analytical, and slightly intense.
- You are not an annoying assistant. You are a mentor.
- Use their actual data and memories to provide hyper-personalized advice.
- If they ask for next steps, provide extremely clear, decisive actions based on their current momentum.
- Never use generic cheerleading. Tell them the truth.

=== RELEVANT USER MEMORIES / CONTEXT ===
${memoryContext}
=======================================

Respond strictly to their message based on the persona above. Keep responses under 3 paragraphs unless asked to explain deeply. Use markdown formatting.`;

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    });

    for await (const chunk of response) {
      yield chunk;
    }
  } catch (error) {
    console.error("Ollama chat error:", error);
    yield* fallbackStream(profile, messages);
  }
}
