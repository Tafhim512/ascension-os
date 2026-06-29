/**
 * Achievement Engine
 * Defines and checks achievement conditions.
 */

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  icon: string;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  level: number;
  lifetimeQuests: number;
  lifetimeBosses: number;
  lifetimeBooks: number;
  lifetimeProjects: number;
  lifetimeWorkouts: number;
  lifetimeJournals: number;
  currentStreak: number;
  longestStreak: number;
  powerScore: number;
  gold: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Quest Achievements
  { id: "first_quest", name: "First Steps", description: "Complete your first quest", category: "quests", rarity: "COMMON", icon: "🎯", condition: (s) => s.lifetimeQuests >= 1 },
  { id: "quest_10", name: "Quest Hunter", description: "Complete 10 quests", category: "quests", rarity: "COMMON", icon: "🎯", condition: (s) => s.lifetimeQuests >= 10 },
  { id: "quest_50", name: "Quest Master", description: "Complete 50 quests", category: "quests", rarity: "RARE", icon: "⚔️", condition: (s) => s.lifetimeQuests >= 50 },
  { id: "quest_100", name: "Century Warrior", description: "Complete 100 quests", category: "quests", rarity: "EPIC", icon: "🏆", condition: (s) => s.lifetimeQuests >= 100 },
  { id: "quest_500", name: "Legendary Questor", description: "Complete 500 quests", category: "quests", rarity: "LEGENDARY", icon: "👑", condition: (s) => s.lifetimeQuests >= 500 },

  // Streak Achievements
  { id: "streak_7", name: "Week Warrior", description: "Maintain a 7-day streak", category: "streaks", rarity: "COMMON", icon: "🔥", condition: (s) => s.longestStreak >= 7 },
  { id: "streak_30", name: "Monthly Machine", description: "Maintain a 30-day streak", category: "streaks", rarity: "RARE", icon: "🔥", condition: (s) => s.longestStreak >= 30 },
  { id: "streak_100", name: "Centurion", description: "Maintain a 100-day streak", category: "streaks", rarity: "EPIC", icon: "☀️", condition: (s) => s.longestStreak >= 100 },
  { id: "streak_365", name: "Year of Steel", description: "Maintain a 365-day streak", category: "streaks", rarity: "LEGENDARY", icon: "⭐", condition: (s) => s.longestStreak >= 365 },

  // Boss Achievements
  { id: "first_boss", name: "Dragon Slayer", description: "Defeat your first boss", category: "bosses", rarity: "RARE", icon: "🐉", condition: (s) => s.lifetimeBosses >= 1 },
  { id: "boss_10", name: "Boss Crusher", description: "Defeat 10 bosses", category: "bosses", rarity: "EPIC", icon: "💀", condition: (s) => s.lifetimeBosses >= 10 },

  // Knowledge Achievements
  { id: "first_book", name: "The Reader", description: "Complete your first book", category: "knowledge", rarity: "COMMON", icon: "📚", condition: (s) => s.lifetimeBooks >= 1 },
  { id: "book_10", name: "Scholar", description: "Complete 10 books", category: "knowledge", rarity: "RARE", icon: "📖", condition: (s) => s.lifetimeBooks >= 10 },

  // Level Achievements
  { id: "level_10", name: "The Apprentice", description: "Reach level 10", category: "progression", rarity: "COMMON", icon: "⬆️", condition: (s) => s.level >= 10 },
  { id: "level_25", name: "The Expert", description: "Reach level 25", category: "progression", rarity: "RARE", icon: "⬆️", condition: (s) => s.level >= 25 },
  { id: "level_50", name: "The Legend", description: "Reach level 50", category: "progression", rarity: "LEGENDARY", icon: "👑", condition: (s) => s.level >= 50 },

  // Power Score
  { id: "power_10k", name: "Rising Power", description: "Reach 10,000 power score", category: "power", rarity: "RARE", icon: "⚡", condition: (s) => s.powerScore >= 10000 },
  { id: "power_50k", name: "Overwhelming Force", description: "Reach 50,000 power score", category: "power", rarity: "EPIC", icon: "⚡", condition: (s) => s.powerScore >= 50000 },
  { id: "power_100k", name: "Godlike Power", description: "Reach 100,000 power score", category: "power", rarity: "LEGENDARY", icon: "💎", condition: (s) => s.powerScore >= 100000 },
];

export function checkAchievements(stats: AchievementStats, unlockedIds: string[]): AchievementDef[] {
  return ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id) && a.condition(stats));
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "MYTHIC": return "text-red-400";
    case "LEGENDARY": return "text-accent-gold";
    case "EPIC": return "text-accent-purple";
    case "RARE": return "text-accent-blue";
    default: return "text-gray-400";
  }
}

export function getRarityBg(rarity: string): string {
  switch (rarity) {
    case "MYTHIC": return "bg-red-400/10 border-red-400/30";
    case "LEGENDARY": return "bg-accent-gold/10 border-accent-gold/30";
    case "EPIC": return "bg-accent-purple/10 border-accent-purple/30";
    case "RARE": return "bg-accent-blue/10 border-accent-blue/30";
    default: return "bg-gray-400/10 border-gray-400/30";
  }
}
