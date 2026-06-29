import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { XpBar, LevelBadge, RankBadge } from "@/components/shared/progression-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Activity, Zap, Flame, Shield, Skull, BookOpen, TrendingUp, Coins } from "lucide-react";
import { xpRequiredForLevel } from "@/lib/engine/xp";
import { getStreakTier, getNextStreakMilestone } from "@/lib/engine/streaks";
import { getMomentumTier } from "@/lib/engine/momentum";
import { AiMentorWidget } from "@/components/mentor/ai-insight";
import { MorningBriefingWidget } from "@/components/dashboard/morning-briefing";
import { HabitsWidget } from "@/components/dashboard/habits-widget";
import Link from "next/link";
import type { Quest, Attribute, FutureSelf } from "@prisma/client";

export const dynamic = 'force-dynamic';

type ProfileWithRelations = Awaited<ReturnType<typeof getCurrentProfile>>;

export default async function Dashboard() {
  const profile = await getCurrentProfile() as ProfileWithRelations;
  const activeFutureSelf = profile.futureSelves?.find((f: FutureSelf) => f.isActive) || profile.futureSelves?.[0];

  const xpToNext = xpRequiredForLevel(profile.level);
  const streakTier = getStreakTier(profile.currentStreak);
  const nextStreakMilestone = getNextStreakMilestone(profile.currentStreak);
  const momentumTier = getMomentumTier(profile.momentum);

  // Fetch bosses for dashboard widget
interface BossWithSubTasks {
  id: string;
  name: string;
  difficulty: string;
  maxHp: number;
  currentHp: number;
  subtasks: { id: string; title: string; damage: number; isCompleted: boolean }[];
  xpReward: number;
  goldReward: number;
  description?: string | null;
}

  let activeBosses: BossWithSubTasks[] = [];
  try {
    activeBosses = await prisma.boss.findMany({
      where: { profileId: profile.id, isDefeated: false },
      include: { subtasks: true },
      take: 2,
    });
  } catch {
    // DB unavailable during build or runtime
  }

  let habits: { id: string; name: string; currentStreak: number; lastCompletedAt: Date | null }[] = [];
  try {
    habits = await prisma.habit.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'asc' }
    });
  } catch {
    // DB unavailable during build or runtime
  }

  // Active quests for feed
  const activeQuests: Quest[] = profile.quests
    .filter((q: Quest) => q.isActive && !q.isCompleted)
    .slice(0, 4);

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 animate-in fade-in duration-700">
      <MorningBriefingWidget />
      {/* ─── Header ─── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
            Greetings, {profile.playerName}
          </h1>
          <p className="text-text-secondary mt-1 max-w-lg text-sm">
            World:{" "}
            <span className="text-accent-cyan font-bold">
              {profile.currentWorld.replace(/_/g, " ")}
            </span>{" "}
            • Chapter {profile.currentChapter}: {profile.chapterTitle}
          </p>
        </div>

        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
              Gold
            </span>
            <span className="text-lg font-black text-accent-gold flex items-center gap-1">
              <Coins className="w-4 h-4" />
              {profile.gold.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
              Power Score
            </span>
            <span className="text-2xl font-black text-accent-gold">
              {profile.powerScore.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* ─── Main Stats Row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Level & Rank */}
        <Card className="col-span-1 md:col-span-2 border-border/50 bg-bg-elevated/40 backdrop-blur-md shadow-lg shadow-black/20">
          <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">
                  Identity
                </p>
                <h3 className="text-xl font-bold text-white">
                  {profile.currentTitle}
                </h3>
              </div>
              <div className="flex gap-2">
                <LevelBadge level={profile.level} />
                <RankBadge rank={profile.hunterRank} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-text-muted mb-1 font-medium">
                <span>To Next Level</span>
                <span>
                  {profile.currentXp} / {xpToNext} XP
                </span>
              </div>
              <XpBar
                current={profile.currentXp}
                max={xpToNext}
                showLabel={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
          <CardContent className="p-5 md:p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 text-accent-crimson mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Streak
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {profile.currentStreak}{" "}
              <span className="text-sm text-text-muted">Days</span>
            </div>
            <p className={`text-xs mt-1 font-bold ${streakTier.color}`}>
              {streakTier.icon} {streakTier.name} • Next: {nextStreakMilestone}d
            </p>
          </CardContent>
        </Card>

        {/* Momentum */}
        <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
          <CardContent className="p-5 md:p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className={`w-5 h-5 ${momentumTier.color}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Momentum
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {profile.momentum}
              <span className="text-sm text-text-muted">%</span>
            </div>
            <div className="mt-2 h-1.5 bg-bg-primary rounded-full overflow-hidden">
              <div
                className={`h-full ${momentumTier.bgColor} transition-all duration-1000 ease-out`}
                style={{ width: `${profile.momentum}%` }}
              />
            </div>
            <p className={`text-xs mt-1.5 font-bold ${momentumTier.color}`}>
              {momentumTier.name}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Two Column: Quests + Attributes ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quest Feed */}
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-bg-elevated/40 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-accent-cyan" />
                Active Quests
              </CardTitle>
              <Link
                href="/quests"
                className="text-xs font-bold text-accent-cyan hover:text-accent-cyan/80 transition-colors"
              >
                View All →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeQuests.length > 0 ? (
              activeQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="flex items-center justify-between p-3 bg-bg-primary/50 border border-border/30 rounded-lg hover:border-accent-cyan/20 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        quest.difficulty === "EPIC"
                          ? "bg-accent-purple"
                          : quest.difficulty === "RARE"
                          ? "bg-accent-blue"
                          : quest.difficulty === "LEGENDARY"
                          ? "bg-accent-gold"
                          : "bg-text-muted"
                      }`}
                    />
                    <span className="text-sm font-medium truncate">
                      {quest.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {quest.estimatedMinutes && (
                      <span className="text-[10px] text-text-muted font-medium">
                        {quest.estimatedMinutes}m
                      </span>
                    )}
                    <span className="text-xs font-black text-accent-gold">
                      +{quest.xpReward} XP
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-text-muted text-sm">
                No active quests. Create one to get started!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boss Status */}
        <Card className="col-span-1 border-border/50 bg-bg-elevated/40 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-accent-crimson" />
                Active Bosses
              </CardTitle>
              <Link
                href="/bosses"
                className="text-xs font-bold text-accent-crimson hover:text-accent-crimson/80 transition-colors"
              >
                View All →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeBosses.length > 0 ? (
              activeBosses.map((boss) => {
                const hpPercent = Math.max(
                  0,
                  (boss.currentHp / boss.maxHp) * 100
                );
                const completedTasks = boss.subtasks.filter(
                  (s: { isCompleted: boolean }) => s.isCompleted
                ).length;
                return (
                  <div
                    key={boss.id}
                    className="p-4 bg-bg-primary/50 border border-accent-crimson/10 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent-crimson">
                          {boss.difficulty}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {boss.name}
                        </h4>
                      </div>
                      <Skull className="w-4 h-4 text-accent-crimson/50" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span className="text-accent-crimson">
                          HP: {boss.currentHp}/{boss.maxHp}
                        </span>
                        <span className="text-text-muted">
                          {completedTasks}/{boss.subtasks.length} subtasks
                        </span>
                      </div>
                      <div className="h-2 bg-black/60 rounded-sm overflow-hidden border border-black">
                        <div
                          className="h-full bg-gradient-to-r from-red-700 to-accent-crimson transition-all duration-1000"
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-text-muted text-sm">
                <Skull className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No active bosses.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Attributes + Vision ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Attributes */}
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-bg-elevated/40 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-accent-blue" />
                Core Attributes
              </CardTitle>
              <Link
                href="/attributes"
                className="text-xs font-bold text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                View All →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {profile.attributes.slice(0, 8).map((attr: Attribute) => (
                <div key={attr.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-text-primary uppercase tracking-wide text-xs">
                      {attr.attributeId.replace(/_/g, " ")}
                    </span>
                    <span className="text-accent-cyan font-bold">
                      Lvl {attr.level}
                    </span>
                  </div>
                  <XpBar
                    current={attr.currentXp}
                    max={attr.level * 100}
                    showLabel={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 space-y-6">
          <AiMentorWidget />
          <HabitsWidget habits={habits} />
          
          <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-accent-purple" />
                The Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeFutureSelf ? (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-text-secondary italic">
                    &ldquo;{activeFutureSelf.vision}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-text-muted uppercase">
                        Alignment Score
                      </span>
                      <span className="text-sm font-black text-accent-purple">
                        {activeFutureSelf.alignmentScore}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-purple transition-all duration-1000"
                        style={{
                          width: `${activeFutureSelf.alignmentScore}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-muted py-4">Vision not set.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── Lifetime Stats Footer ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Quests", value: profile.lifetimeQuests, icon: Target },
          { label: "Bosses", value: profile.lifetimeBosses, icon: Skull },
          { label: "Books", value: profile.lifetimeBooks, icon: BookOpen },
          { label: "Projects", value: profile.lifetimeProjects, icon: Zap },
          { label: "Workouts", value: profile.lifetimeWorkouts, icon: Activity },
          { label: "Journals", value: profile.lifetimeJournals, icon: BookOpen },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 bg-bg-elevated/30 border border-border/30 rounded-xl text-center"
          >
            <stat.icon className="w-4 h-4 text-text-muted mx-auto mb-2" />
            <div className="text-xl font-black text-white">{stat.value}</div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
