/**
 * Gold Economy Engine
 * In-game currency earned through quests, bosses, and milestones.
 * Can be spent on rewards, cosmetics, and features.
 */

export interface GoldTransaction {
  amount: number;
  source: string;
  description: string;
  timestamp: Date;
}

// Gold rewards for different activities
export const GOLD_REWARDS = {
  QUEST_COMPLETE: {
    COMMON: 10,
    RARE: 25,
    EPIC: 50,
    LEGENDARY: 100,
    MYTHIC: 250,
  },
  BOSS_DEFEAT: 500,
  STREAK_MILESTONE: {
    7: 100,
    14: 200,
    30: 500,
    60: 1000,
    100: 2000,
    365: 5000,
  },
  LEVEL_UP: 50,
  ACHIEVEMENT_UNLOCK: 100,
  BOOK_COMPLETE: 75,
  PROJECT_COMPLETE: 200,
} as const;

export function getQuestGoldReward(difficulty: string): number {
  return GOLD_REWARDS.QUEST_COMPLETE[difficulty as keyof typeof GOLD_REWARDS.QUEST_COMPLETE] || 10;
}

// Reward shop items (cosmetic unlocks)
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "frame" | "theme" | "particle" | "sound" | "reward";
  rarity: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "frame_bronze", name: "Bronze Frame", description: "A sturdy bronze profile frame", cost: 500, category: "frame", rarity: "COMMON" },
  { id: "frame_silver", name: "Silver Frame", description: "A polished silver profile frame", cost: 1500, category: "frame", rarity: "RARE" },
  { id: "frame_gold", name: "Gold Frame", description: "A legendary golden profile frame", cost: 5000, category: "frame", rarity: "LEGENDARY" },
  { id: "theme_cyber", name: "Cyberpunk Theme", description: "Neon-drenched cyberpunk background", cost: 2000, category: "theme", rarity: "EPIC" },
  { id: "particle_ember", name: "Ember Particles", description: "Floating ember particles on your profile", cost: 3000, category: "particle", rarity: "EPIC" },
  { id: "reward_break", name: "Guilt-Free Break", description: "Take a 30-min guilt-free break. You earned it.", cost: 100, category: "reward", rarity: "COMMON" },
  { id: "reward_treat", name: "Treat Yourself", description: "Permission to buy that thing you've been eyeing.", cost: 500, category: "reward", rarity: "RARE" },
];
