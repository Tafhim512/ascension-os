import { callAI } from "./client";
import { searchMemories, formatMemoriesForPrompt } from "./memory";

interface ProfileContext {
  id: string;
  playerName: string;
  level: number;
  momentum: number;
  currentWorld: string;
  futureSelves?: { vision?: string; isActive?: boolean }[];
  attributes: { attributeId: string; level: number }[];
}

/**
 * V2 Quest Generator — RAG-Enhanced
 * 
 * Uses semantic memory search to ground quest generation in the
 * user's actual journal entries, projects, and knowledge base.
 * Quests are no longer generic — they reference real goals.
 */
export async function generateQuests(profile: ProfileContext) {
  // RAG: Find recent relevant memories to contextualize quests
  const activeFutureSelf = profile.futureSelves?.find(f => f.isActive) || profile.futureSelves?.[0];
  const vision = activeFutureSelf?.vision || "To become the ultimate version of myself.";
  const contextQuery = `${vision} daily goals habits struggles improvement areas`;
  
  let memoryContext = "No memories stored yet.";
  try {
    const memories = await searchMemories(profile.id, contextQuery, 5);
    memoryContext = formatMemoriesForPrompt(memories);
  } catch (e) {
    console.error("Memory search failed during quest gen:", e);
  }

  const systemPrompt = `
You are the System, an elite, hyper-intelligent AI mentor managing a real-life RPG for a user named ${profile.playerName}.
Your goal is to generate 3 highly targeted daily quests based on their stats, vision, AND their actual journal entries and knowledge.

CRITICAL: Use the user's REAL MEMORIES to generate quests that are deeply personal. If they wrote about struggling with something, create a quest to address it. If they mentioned a project, create a quest to advance it. Never generate generic "drink water" quests when you have real data.

Output your response ONLY as a JSON array of objects.
Format:
[
  {
    "title": "Actionable task name",
    "description": "Why this matters — reference their specific data",
    "type": "DAILY",
    "difficulty": "COMMON" | "RARE" | "EPIC",
    "xpReward": number (25, 50, or 100),
    "identityTag": "Builder" | "Athlete" | "Scholar" | "Leader",
    "rationale": "Explain which memory or data point inspired this quest",
    "attributeRewards": [{"attributeId": "INTELLIGENCE", "xp": 10}]
  }
]
No markdown wrapping, just the JSON string.
`;

  const lowestAttributes = [...profile.attributes]
    .sort((a: { attributeId: string; level: number }, b: { attributeId: string; level: number }) => a.level - b.level)
    .slice(0, 3)
    .map((a: { attributeId: string }) => a.attributeId)
    .join(", ");
  
  const userPrompt = `
Player Level: ${profile.level}
Momentum: ${profile.momentum}/100
Vision: ${vision}
Weakest Attributes: ${lowestAttributes}

=== USER'S REAL MEMORIES ===
${memoryContext}
=== END MEMORIES ===

Generate 3 quests:
1. An easy momentum-building task (COMMON, 25 XP) — inspired by their recent activity.
2. A focused deep-work task tied to their vision or an active project (RARE, 50 XP).
3. A challenge tied to their weakest attribute or a struggle they journaled about (EPIC, 100 XP).
`;

  try {
    const response = await callAI(systemPrompt, userPrompt, true);
    const quests = JSON.parse(response);
    return Array.isArray(quests) ? quests : [];
  } catch (err) {
    console.error("Failed to parse AI quests:", err);
    return [
      {
        title: "Re-align with Vision",
        description: "Read your future self vision and meditate on it for 5 minutes.",
        type: "DAILY",
        difficulty: "COMMON",
        xpReward: 25,
        identityTag: "Thinker",
        rationale: "Fallback quest generated due to AI offline.",
        attributeRewards: [{ attributeId: "WISDOM", xp: 10 }]
      }
    ];
  }
}
