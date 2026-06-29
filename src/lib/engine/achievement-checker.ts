import { prisma } from "@/lib/db";
import { checkAchievements } from "./achievements";

export async function processAchievements(profileId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      achievements: true,
      quests: true,
      bosses: true,
      projects: true,
    }
  });

  if (!profile) return [];

  const stats = {
    level: profile.level,
    lifetimeQuests: profile.lifetimeQuests,
    lifetimeBosses: profile.lifetimeBosses,
    lifetimeBooks: profile.lifetimeBooks,
    lifetimeProjects: profile.lifetimeProjects,
    lifetimeWorkouts: profile.lifetimeWorkouts,
    lifetimeJournals: profile.lifetimeJournals,
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    powerScore: profile.powerScore,
    gold: profile.gold
  };

  const unlockedIds = profile.achievements.map(a => a.achievementId);
  const newAchievements = checkAchievements(stats, unlockedIds);

  const unlockedNow = [];

  for (const ach of newAchievements) {
    await prisma.userAchievement.create({
      data: {
        profileId,
        achievementId: ach.id,
        unlockedAt: new Date()
      }
    });

    unlockedNow.push(ach);

    // Give some gold or XP reward for achievement
    let rewardXp = 0;
    let rewardGold = 0;
    if (ach.rarity === "COMMON") { rewardXp = 100; rewardGold = 50; }
    if (ach.rarity === "RARE") { rewardXp = 500; rewardGold = 250; }
    if (ach.rarity === "EPIC") { rewardXp = 1500; rewardGold = 1000; }
    if (ach.rarity === "LEGENDARY") { rewardXp = 5000; rewardGold = 5000; }
    if (ach.rarity === "MYTHIC") { rewardXp = 10000; rewardGold = 15000; }

    await prisma.profile.update({
      where: { id: profileId },
      data: {
        currentXp: profile.currentXp + rewardXp,
        lifetimeXp: profile.lifetimeXp + rewardXp,
        gold: profile.gold + rewardGold
      }
    });
  }

  return unlockedNow;
}
