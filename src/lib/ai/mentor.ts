import type { Profile } from "@prisma/client";
import { callAI } from "./client";
import { searchMemories, formatMemoriesForPrompt } from "./memory";

/**
 * The System 2.0 — RAG-Enhanced AI Mentor
 * 
 * Before speaking, The System semantically searches the user's
 * journal entries, knowledge, and projects to ground its advice
 * in the user's own lived experience and data.
 */
export async function getAiInsight(profile: Profile & { futureSelves?: { vision?: string }[] }) {
  // Build a context query from the user's current state
  const contextQuery = `${profile.playerName} level ${profile.level} momentum ${profile.momentum} streak ${profile.currentStreak} days current struggles and progress`;
  
  // RAG: Search the user's memories for relevant context
  let memoryContext = "No memories stored yet.";
  try {
    const memories = await searchMemories(profile.id, contextQuery, 3);
    memoryContext = formatMemoriesForPrompt(memories);
  } catch (e) {
    console.error("Memory search failed, proceeding without RAG:", e);
  }

  const systemPrompt = `You are the Intelligence Engine for Ascension OS.
Your objective is to provide ONE high-leverage analytical insight based on the user's data.

CRITICAL INSTRUCTIONS:
1. DO NOT give generic motivational quotes or stoic advice.
2. Read their REAL MEMORIES (Journal entries, projects) and identify a behavioral pattern. 
3. Formulate an evidence-based analytics insight (e.g., "Your journal shows you complete complex tasks when you work out in the morning, but your energy crashes on rest days. Link workouts directly before deep-work blocks.")
4. Keep it to 2-3 precise sentences.
5. If no memories exist, analyze their stats and momentum score to provide a mathematical projection of their trajectory.`;

  let momentumStatus = "";
  if (profile.momentum > 80) momentumStatus = "Operating at extreme efficiency. Watch for burnout.";
  else if (profile.momentum > 40) momentumStatus = "Moving steadily but getting comfortable. Push harder.";
  else momentumStatus = "Stagnant. Failing. Deliver a sharp wake-up call.";

  const userPrompt = `
Player: ${profile.playerName}
Level: ${profile.level}
Streak: ${profile.currentStreak} days
Momentum: ${profile.momentum}/100
Context: ${momentumStatus}

=== RELEVANT USER MEMORIES ===
${memoryContext}
=== END MEMORIES ===

Based on their stats AND their own memories above, deliver ONE precise, evidence-based behavioral insight or analytics observation. Do not greet them. Just deliver the insight.`;

  try {
    const rawResponse = await callAI(systemPrompt, userPrompt);
    return rawResponse.replace(/^["']|["']$/g, '');
  } catch {
    return "Data insufficient for full behavioral mapping. Increase operational volume.";
  }
}
