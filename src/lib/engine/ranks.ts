/**
 * Hunter Rank Algorithm
 * Rank is determined by a weighted composite of level, attributes, streaks, and achievements.
 */

export const RANKS = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"] as const;
export type HunterRank = (typeof RANKS)[number];

export interface RankThreshold {
  rank: HunterRank;
  minScore: number;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glow: string;
}

export const RANK_THRESHOLDS: RankThreshold[] = [
  { rank: "F", minScore: 0, title: "Unranked", color: "text-gray-400", bgColor: "bg-gray-400/10", borderColor: "border-gray-400/30", glow: "" },
  { rank: "E", minScore: 1000, title: "Novice Hunter", color: "text-gray-300", bgColor: "bg-gray-300/10", borderColor: "border-gray-300/30", glow: "" },
  { rank: "D", minScore: 3000, title: "Skilled Hunter", color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/30", glow: "" },
  { rank: "C", minScore: 7000, title: "Veteran Hunter", color: "text-accent-blue", bgColor: "bg-accent-blue/10", borderColor: "border-accent-blue/30", glow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]" },
  { rank: "B", minScore: 15000, title: "Elite Hunter", color: "text-accent-purple", bgColor: "bg-accent-purple/10", borderColor: "border-accent-purple/30", glow: "shadow-[0_0_12px_rgba(168,85,247,0.3)]" },
  { rank: "A", minScore: 30000, title: "Champion Hunter", color: "text-accent-crimson", bgColor: "bg-accent-crimson/10", borderColor: "border-accent-crimson/30", glow: "shadow-[0_0_15px_rgba(220,38,38,0.4)]" },
  { rank: "S", minScore: 60000, title: "Supreme Hunter", color: "text-accent-gold", bgColor: "bg-accent-gold/10", borderColor: "border-accent-gold/30", glow: "shadow-[0_0_20px_rgba(250,204,21,0.4)]" },
  { rank: "SS", minScore: 120000, title: "Mythic Hunter", color: "text-accent-gold", bgColor: "bg-accent-gold/10", borderColor: "border-accent-gold/30", glow: "shadow-[0_0_25px_rgba(250,204,21,0.5)]" },
  { rank: "SSS", minScore: 250000, title: "Transcendent", color: "text-accent-gold", bgColor: "bg-accent-gold/10", borderColor: "border-accent-gold/30", glow: "shadow-[0_0_30px_rgba(250,204,21,0.6)]" },
];

export function calculateRank(powerScore: number): RankThreshold {
  let current = RANK_THRESHOLDS[0];
  for (const threshold of RANK_THRESHOLDS) {
    if (powerScore >= threshold.minScore) {
      current = threshold;
    }
  }
  return current;
}

export function getNextRank(currentRank: HunterRank): RankThreshold | null {
  const idx = RANKS.indexOf(currentRank);
  if (idx < RANKS.length - 1) {
    return RANK_THRESHOLDS[idx + 1];
  }
  return null;
}

export function getRankInfo(rank: string): RankThreshold {
  return RANK_THRESHOLDS.find(r => r.rank === rank) || RANK_THRESHOLDS[0];
}
