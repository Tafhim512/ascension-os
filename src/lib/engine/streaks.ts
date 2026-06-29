/**
 * Streak Tracking Engine
 * Manages daily activity streaks with grace periods and rewards.
 */

export interface StreakStatus {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  isAtRisk: boolean; // True if no activity today yet
  streakTier: StreakTier;
  nextMilestone: number;
  daysToNextMilestone: number;
}

export interface StreakTier {
  name: string;
  minDays: number;
  color: string;
  icon: string; // flame emoji/icon variant
  multiplier: number;
}

export const STREAK_TIERS: StreakTier[] = [
  { name: "Spark", minDays: 0, color: "text-gray-400", icon: "🔥", multiplier: 1.0 },
  { name: "Ember", minDays: 3, color: "text-orange-400", icon: "🔥", multiplier: 1.1 },
  { name: "Flame", minDays: 7, color: "text-orange-500", icon: "🔥🔥", multiplier: 1.25 },
  { name: "Blaze", minDays: 14, color: "text-red-400", icon: "🔥🔥", multiplier: 1.3 },
  { name: "Inferno", minDays: 30, color: "text-red-500", icon: "🔥🔥🔥", multiplier: 1.5 },
  { name: "Hellfire", minDays: 60, color: "text-accent-crimson", icon: "🔥🔥🔥", multiplier: 1.75 },
  { name: "Solar", minDays: 100, color: "text-accent-gold", icon: "☀️", multiplier: 2.0 },
  { name: "Eternal", minDays: 365, color: "text-accent-gold", icon: "⭐", multiplier: 2.5 },
];

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 60, 90, 100, 150, 200, 365, 500, 1000];

export function getStreakTier(days: number): StreakTier {
  let current = STREAK_TIERS[0];
  for (const tier of STREAK_TIERS) {
    if (days >= tier.minDays) current = tier;
  }
  return current;
}

export function getNextStreakMilestone(currentStreak: number): number {
  return STREAK_MILESTONES.find(m => m > currentStreak) || currentStreak + 100;
}

export function calculateStreakStatus(
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: Date | null,
): StreakStatus {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let isActive = false;
  let isAtRisk = true;

  if (lastActiveDate) {
    const lastActive = new Date(lastActiveDate);
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    const diffMs = today.getTime() - lastActiveDay.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    isActive = diffDays <= 1;
    isAtRisk = diffDays === 1; // Active yesterday but not today yet
  }

  const tier = getStreakTier(currentStreak);
  const nextMilestone = getNextStreakMilestone(currentStreak);

  return {
    currentStreak,
    longestStreak,
    isActive,
    isAtRisk,
    streakTier: tier,
    nextMilestone,
    daysToNextMilestone: nextMilestone - currentStreak,
  };
}

// Streak gold rewards at milestones
export function getStreakMilestoneReward(streak: number): number {
  if (streak >= 365) return 5000;
  if (streak >= 100) return 2000;
  if (streak >= 60) return 1000;
  if (streak >= 30) return 500;
  if (streak >= 14) return 200;
  if (streak >= 7) return 100;
  if (streak >= 3) return 50;
  return 0;
}
