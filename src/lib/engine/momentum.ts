/**
 * Momentum Engine
 * Momentum is a 0-100 score representing how "in the zone" you are.
 * It increases with consistent deep work and quest completions,
 * and decays with inactivity.
 */

export interface MomentumState {
  value: number;        // 0-100
  tier: MomentumTier;
  trend: "rising" | "falling" | "stable";
  description: string;
}

export interface MomentumTier {
  name: string;
  minValue: number;
  color: string;
  bgColor: string;
  description: string;
}

export const MOMENTUM_TIERS: MomentumTier[] = [
  { name: "Stagnant", minValue: 0, color: "text-gray-500", bgColor: "bg-gray-500", description: "Start moving. Any action counts." },
  { name: "Warming Up", minValue: 20, color: "text-blue-400", bgColor: "bg-blue-400", description: "Building momentum. Keep going." },
  { name: "In Motion", minValue: 40, color: "text-accent-cyan", bgColor: "bg-accent-cyan", description: "You're moving. Don't stop now." },
  { name: "Flowing", minValue: 60, color: "text-accent-emerald", bgColor: "bg-accent-emerald", description: "In the flow. Peak performance zone." },
  { name: "Unstoppable", minValue: 80, color: "text-accent-gold", bgColor: "bg-accent-gold", description: "Unstoppable force. Keep the fire alive." },
  { name: "Ascension", minValue: 95, color: "text-accent-gold", bgColor: "bg-accent-gold", description: "Peak human state. You are ascending." },
];

export function getMomentumTier(value: number): MomentumTier {
  let current = MOMENTUM_TIERS[0];
  for (const tier of MOMENTUM_TIERS) {
    if (value >= tier.minValue) current = tier;
  }
  return current;
}

export function calculateMomentumState(
  currentMomentum: number,
  previousMomentum?: number,
): MomentumState {
  const clamped = Math.max(0, Math.min(100, currentMomentum));
  const tier = getMomentumTier(clamped);
  
  let trend: "rising" | "falling" | "stable" = "stable";
  if (previousMomentum !== undefined) {
    if (clamped > previousMomentum + 2) trend = "rising";
    else if (clamped < previousMomentum - 2) trend = "falling";
  }

  return {
    value: clamped,
    tier,
    trend,
    description: tier.description,
  };
}

// Calculate momentum change after completing a quest
export function momentumGainFromQuest(difficulty: string): number {
  switch (difficulty) {
    case "MYTHIC": return 8;
    case "LEGENDARY": return 6;
    case "EPIC": return 4;
    case "RARE": return 3;
    case "COMMON": return 2;
    default: return 1;
  }
}

// Daily momentum decay (if no quests completed)
export function dailyMomentumDecay(currentMomentum: number): number {
  // Decay 5-15% per inactive day, more at higher momentum
  const decayRate = 0.05 + (currentMomentum / 1000);
  return Math.max(0, currentMomentum - (currentMomentum * decayRate));
}
