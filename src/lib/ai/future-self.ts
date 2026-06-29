import { PrismaClient } from "@prisma/client";
import { callAI } from "./client";

const prisma = new PrismaClient();

export async function calculateAlignmentScore(profileId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      attributes: true,
      futureSelves: true,
      habits: true,
    }
  });

  if (!profile) return 0;
  const activeFutureSelf = profile.futureSelves.find(fs => fs.isActive) || profile.futureSelves[0];
  if (!activeFutureSelf) return 0;

  let score = 0;
  
  // 1. Attribute Alignment (50% max)
  let attributeScore = 0;
  try {
    const targetAttrs = JSON.parse(activeFutureSelf.targetAttributes);
    const targetKeys = Object.keys(targetAttrs);
    if (targetKeys.length > 0) {
      let totalAttrPercent = 0;
      targetKeys.forEach(attrId => {
        const currentAttr = profile.attributes.find(a => a.attributeId === attrId);
        const currentLevel = currentAttr ? currentAttr.level : 1;
        const targetLevel = targetAttrs[attrId];
        totalAttrPercent += Math.min(100, (currentLevel / targetLevel) * 100);
      });
      attributeScore = (totalAttrPercent / targetKeys.length) * 0.5;
    } else {
      // Default: base it on player level vs target level
      attributeScore = Math.min(100, (profile.level / activeFutureSelf.targetLevel) * 100) * 0.5;
    }
  } catch (e) {
    attributeScore = Math.min(100, (profile.level / activeFutureSelf.targetLevel) * 100) * 0.5;
  }

  // 2. Momentum & Consistency Alignment (25% max)
  const momentumScore = profile.momentum * 0.15; // up to 15%
  
  let habitScore = 0;
  if (profile.habits.length > 0) {
    const activeHabits = profile.habits.filter(h => h.currentStreak > 0);
    habitScore = (activeHabits.length / profile.habits.length) * 10; // up to 10%
  } else {
    habitScore = 5; // Default if no habits
  }

  // 3. Quests & Action Alignment (25% max)
  // Proxy using recent streaks
  const streakScore = Math.min(25, profile.currentStreak * 2);

  score = Math.round(attributeScore + momentumScore + habitScore + streakScore);
  
  // Update DB
  await prisma.futureSelf.update({
    where: { id: activeFutureSelf.id },
    data: { alignmentScore: score }
  });

  return score;
}

export async function generateGapAnalysis(profileId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      attributes: true,
      futureSelves: true,
    }
  });

  if (!profile) return null;
  const activeFutureSelf = profile.futureSelves.find(fs => fs.isActive) || profile.futureSelves[0];
  if (!activeFutureSelf) return null;

  const lowestAttributes = [...profile.attributes]
    .sort((a, b) => a.level - b.level)
    .slice(0, 3)
    .map(a => `${a.attributeId} (Lvl ${a.level})`)
    .join(", ");

  const systemPrompt = `You are the Ascension OS Intelligence Engine.
Analyze the gap between the user's current self and their target Future Self.
Provide a JSON array of 3 actionable "Gap Analysis" insights.

Format strictly as JSON without markdown wrappers:
[
  {
    "category": "String (e.g. 'Attributes', 'Habits', 'Projects')",
    "insight": "1-2 sentences identifying the specific gap",
    "recommendation": "1 sentence with a specific actionable next step"
  }
]`;

  const userPrompt = `
Current Level: ${profile.level}
Target Level: ${activeFutureSelf.targetLevel}
Archetype: ${activeFutureSelf.archetype}
Vision: ${activeFutureSelf.vision}
Weakest Current Attributes: ${lowestAttributes}
Current Alignment Score: ${activeFutureSelf.alignmentScore}%

Analyze the gap and provide JSON recommendations.`;

  try {
    const response = await callAI(systemPrompt, userPrompt, true);
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) return parsed;
    return [
      {
        category: "System",
        insight: "AI response was not in expected format.",
        recommendation: "Verify Ollama is running.",
      },
    ];
  } catch (error) {
    console.error("Failed to generate gap analysis:", error);
    return [
      {
        category: "System",
        insight: "AI Engine offline or processing failure.",
        recommendation: "Verify Ollama is running.",
      },
    ];
  }
}
