import { PrismaClient } from "@prisma/client";
import { callAI } from "./client";

const prisma = new PrismaClient();

export async function generateMorningBriefing(profileId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      quests: {
        where: { isActive: true },
        take: 3
      },
      habits: {
        where: { currentStreak: { gt: 0 } },
        take: 3,
        orderBy: { currentStreak: 'desc' }
      },
      bosses: {
        where: { isDefeated: false },
        take: 1
      },
      futureSelves: true
    }
  });

  if (!profile) throw new Error("Profile not found");

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  const activeFutureSelf = profile.futureSelves.find(fs => fs.isActive);

  const questTitles = profile.quests.map(q => q.title).join(", ") || "No active quests.";
  const habitStreaks = profile.habits.map(h => `${h.name} (${h.currentStreak} day streak)`).join(", ") || "No active habit streaks.";
  const bossTarget = profile.bosses[0] ? profile.bosses[0].name : "No active boss.";
  
  const systemPrompt = `You are The System, an advanced highly intelligent AI Mentor for Ascension OS.
It is the ${timeOfDay}. Your job is to output a single, powerful 3-4 sentence briefing for the user (${profile.playerName}).
Do NOT use markdown, lists, or line breaks. Keep it as one continuous, punchy paragraph.

Context:
- Current level: ${profile.level}, Momentum: ${profile.momentum}
- Target Vision: ${activeFutureSelf?.vision || "Ascension"}
- Active Quests: ${questTitles}
- Best Habits: ${habitStreaks}
- Current Focus Boss: ${bossTarget}

Your tone: Analytical, slightly intense, motivating. Acknowledge their time of day, summarize their target priorities, and give a specific command or reflection to fuel their momentum.`;

  try {
    const response = await callAI(systemPrompt, "Provide my briefing.", true);
    const parsed = JSON.parse(response);
    return typeof parsed?.briefing === "string" ? parsed.briefing : response;
  } catch (error) {
    console.error("Failed to generate briefing", error);
    return `System offline. Execute your daily protocols manually.`;
  }
}
