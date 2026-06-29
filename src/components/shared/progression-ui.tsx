"use client";

export function LevelBadge({ level }: { level: number }) {
  return (
    <div className="flex items-center justify-center bg-accent-blue/10 border border-accent-blue/30 text-accent-blue px-3 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]">
      Level {level}
    </div>
  );
}

export function RankBadge({ rank }: { rank: string }) {
  const getRankColor = () => {
    switch(rank) {
      case 'SSS': case 'SS': case 'S': return 'text-accent-gold border-accent-gold/50 bg-accent-gold/10 shadow-[0_0_15px_rgba(250,204,21,0.4)]';
      case 'A': case 'B': return 'text-accent-purple border-accent-purple/50 bg-accent-purple/10';
      case 'C': case 'D': return 'text-accent-blue border-accent-blue/50 bg-accent-blue/10';
      default: return 'text-text-secondary border-border bg-bg-elevated';
    }
  };

  return (
    <div className={`flex items-center justify-center px-4 py-1 rounded-sm font-black tracking-widest ${getRankColor()}`}>
      RANK {rank}
    </div>
  );
}

export function XpBar({ current, max, showLabel = true }: { current: number, max: number, showLabel?: boolean }) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-text-secondary">
          <span>{current} XP</span>
          <span>{max} XP</span>
        </div>
      )}
      <div className="h-2 bg-bg-elevated rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
