/**
 * XP Calculation Engine
 * Handles XP requirements, calculations, and level-up logic.
 * Uses a polynomial curve so each level feels meaningful.
 */

// XP required to go from level N to N+1
export function xpRequiredForLevel(level: number): number {
  // Base: 500 XP for level 1→2, scales polynomially
  // Formula: 500 * level^1.5 (rounded)
  return Math.floor(500 * Math.pow(level, 1.5));
}

// Total XP needed from level 1 to reach a given level
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}

// Calculate what level you should be at given lifetime XP
export function calculateLevelFromXp(lifetimeXp: number): { level: number; currentXp: number; xpToNext: number } {
  let level = 1;
  let remaining = lifetimeXp;

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level++;
  }

  return {
    level,
    currentXp: remaining,
    xpToNext: xpRequiredForLevel(level),
  };
}

// XP multipliers based on quest difficulty
export const DIFFICULTY_MULTIPLIERS: Record<string, number> = {
  COMMON: 1.0,
  RARE: 1.5,
  EPIC: 2.0,
  LEGENDARY: 3.0,
  MYTHIC: 5.0,
};

// Streak bonus: consecutive days multiply XP
export function streakXpMultiplier(streak: number): number {
  if (streak >= 365) return 2.5;
  if (streak >= 100) return 2.0;
  if (streak >= 30) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.0;
}

// Calculate final XP with all modifiers applied
export function calculateFinalXp(
  baseXp: number,
  difficulty: string,
  streak: number,
  momentum: number,
): number {
  const diffMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
  const streakMultiplier = streakXpMultiplier(streak);
  const momentumBonus = 1 + (momentum / 200); // 0-50% bonus from momentum

  return Math.floor(baseXp * diffMultiplier * streakMultiplier * momentumBonus);
}

// Attribute XP required per level (simpler curve)
export function attributeXpRequired(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.3));
}
