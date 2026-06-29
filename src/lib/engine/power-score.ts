/**
 * Power Score Computation
 * A single number that represents your overall strength.
 * Weighted composite of all progression metrics.
 */

interface PowerScoreInput {
  level: number;
  attributes: { level: number; consistencyScore: number }[];
  currentStreak: number;
  longestStreak: number;
  momentum: number;
  lifetimeQuests: number;
  lifetimeBosses: number;
  lifetimeBooks: number;
  lifetimeProjects: number;
}

export function calculatePowerScore(input: PowerScoreInput): number {
  // Level contribution (40% weight)
  const levelScore = input.level * 200;

  // Attribute contribution (30% weight) — average attribute level * multiplier
  const avgAttrLevel = input.attributes.length > 0
    ? input.attributes.reduce((sum, a) => sum + a.level, 0) / input.attributes.length
    : 1;
  const attrScore = avgAttrLevel * 150;

  // Consistency bonus — average consistency across attributes
  const avgConsistency = input.attributes.length > 0
    ? input.attributes.reduce((sum, a) => sum + a.consistencyScore, 0) / input.attributes.length
    : 0;
  const consistencyBonus = avgConsistency * 10;

  // Streak contribution (10%)
  const streakScore = (input.currentStreak * 15) + (input.longestStreak * 5);

  // Momentum contribution (5%)
  const momentumScore = input.momentum * 5;

  // Lifetime achievements (15%)
  const lifetimeScore =
    (input.lifetimeQuests * 10) +
    (input.lifetimeBosses * 100) +
    (input.lifetimeBooks * 50) +
    (input.lifetimeProjects * 75);

  const total = Math.floor(
    levelScore + attrScore + consistencyBonus + streakScore + momentumScore + lifetimeScore
  );

  return Math.max(0, total);
}

// Power score trend categories
export function getPowerTrend(currentScore: number, previousScore: number): {
  direction: "up" | "down" | "stable";
  change: number;
  percentage: number;
} {
  const change = currentScore - previousScore;
  const percentage = previousScore > 0 ? (change / previousScore) * 100 : 0;

  return {
    direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
    change: Math.abs(change),
    percentage: Math.round(Math.abs(percentage) * 10) / 10,
  };
}
