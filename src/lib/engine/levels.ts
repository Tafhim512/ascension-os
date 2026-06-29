/**
 * Level Progression System
 * Defines what unlocks at each level and milestone rewards.
 */

export interface LevelMilestone {
  level: number;
  title: string;
  unlocks: string[];
  reward?: string;
}

export const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 1, title: "The Awakened", unlocks: ["Basic Quests", "Journal"], reward: "Welcome Pack: 100 Gold" },
  { level: 5, title: "The Initiate", unlocks: ["Daily Quests", "Streak Tracking"], reward: "New Title: Initiate" },
  { level: 10, title: "The Apprentice", unlocks: ["Boss Hunts", "Skill Trees"], reward: "New Title: Apprentice" },
  { level: 15, title: "The Journeyman", unlocks: ["Side Quests", "Enemy Tracking"], reward: "Profile Frame: Bronze" },
  { level: 20, title: "The Adept", unlocks: ["Legendary Quests", "AI Mentor"], reward: "New Title: Adept" },
  { level: 25, title: "The Expert", unlocks: ["World Bosses", "Secret Quests"], reward: "Profile Frame: Silver" },
  { level: 30, title: "The Master", unlocks: ["Identity Evolution", "Legacy System"], reward: "New Title: Master" },
  { level: 40, title: "The Grandmaster", unlocks: ["Custom Quest Types", "Mentor Mode"], reward: "Profile Frame: Gold" },
  { level: 50, title: "The Legend", unlocks: ["All Features Unlocked"], reward: "New Title: Legend" },
  { level: 75, title: "The Mythic", unlocks: ["Mythic Quests"], reward: "Particle Effect: Aura" },
  { level: 100, title: "The Transcendent", unlocks: ["Ascension Mode"], reward: "Ultimate Title: Transcendent" },
];

export function getMilestoneForLevel(level: number): LevelMilestone | undefined {
  return LEVEL_MILESTONES.find(m => m.level === level);
}

export function getNextMilestone(currentLevel: number): LevelMilestone | undefined {
  return LEVEL_MILESTONES.find(m => m.level > currentLevel);
}

export function getUnlockedFeatures(level: number): string[] {
  const features: string[] = [];
  for (const milestone of LEVEL_MILESTONES) {
    if (milestone.level <= level) {
      features.push(...milestone.unlocks);
    }
  }
  return features;
}

// Level tier classification for UI styling
export function getLevelTier(level: number): { name: string; color: string; glow: string } {
  if (level >= 100) return { name: "Transcendent", color: "text-accent-gold", glow: "shadow-[0_0_30px_rgba(250,204,21,0.6)]" };
  if (level >= 75) return { name: "Mythic", color: "text-red-400", glow: "shadow-[0_0_20px_rgba(248,113,113,0.5)]" };
  if (level >= 50) return { name: "Legendary", color: "text-accent-gold", glow: "shadow-[0_0_15px_rgba(250,204,21,0.4)]" };
  if (level >= 30) return { name: "Epic", color: "text-accent-purple", glow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]" };
  if (level >= 15) return { name: "Rare", color: "text-accent-blue", glow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]" };
  return { name: "Common", color: "text-text-secondary", glow: "" };
}
