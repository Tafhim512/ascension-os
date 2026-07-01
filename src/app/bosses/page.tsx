import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Shield, Skull, Sword, Sparkles } from "lucide-react";
import { CreateBossModal } from "@/components/bosses/create-boss-modal";
import { BossSubtaskItem } from "@/components/bosses/boss-subtask-item";
import type { Boss, BossSubtask } from "@prisma/client";

type BossWithSubtasks = Boss & { subtasks: BossSubtask[] };

export const dynamic = 'force-dynamic';

export default async function BossesPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <div className="p-10 text-text-secondary">Please sign in to view bosses.</div>;
  }

  let profileWithBosses: { bosses: BossWithSubtasks[] } | null = null;
  try {
    profileWithBosses = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: { bosses: { include: { subtasks: true } } },
    });
  } catch {
    // DB unavailable
  }

  const allBosses: BossWithSubtasks[] = profileWithBosses?.bosses || [];
  const activeBosses: BossWithSubtasks[] = allBosses.filter((b) => !b.isDefeated);
  const defeatedBosses: BossWithSubtasks[] = allBosses.filter((b) => b.isDefeated).sort((a, b) => new Date(b.defeatedAt!).getTime() - new Date(a.defeatedAt!).getTime());

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-crimson to-accent-gold tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-accent-crimson" />
            Boss Hunts
          </h1>
          <p className="text-text-secondary mt-1">Take down massive projects and fearsome enemies by completing subtasks.</p>
        </div>
        <CreateBossModal />
      </header>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Active Bosses <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{activeBosses.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeBosses.map((boss) => {
             const percentHp = Math.max(0, (boss.currentHp / boss.maxHp) * 100);
             const completedCount = boss.subtasks.filter((s: BossSubtask) => s.isCompleted).length;
             
             return (
              <Card key={boss.id} className="border-accent-crimson/30 bg-bg-elevated/60 backdrop-blur-md overflow-hidden relative group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-crimson/5 to-transparent z-0 pointer-events-none"></div>
                
                <div className="relative z-10 p-6 flex flex-col h-full space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-black/50 border mb-3 inline-block ${
                        boss.difficulty === 'MYTHIC' ? 'border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                        boss.difficulty === 'LEGENDARY' ? 'border-accent-gold text-accent-gold shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                        'border-accent-crimson text-accent-crimson shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                      }`}>
                        {boss.difficulty} BOSS
                      </span>
                      <h2 className="text-2xl font-black text-white">{boss.name}</h2>
                      {boss.description && (
                        <p className="text-sm text-text-secondary mt-2">{boss.description}</p>
                      )}
                    </div>
                    <div className="bg-black/40 p-3 rounded-full border border-accent-crimson/30 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                      <Skull className="w-8 h-8 text-accent-crimson drop-shadow-xl" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between text-xs font-bold font-mono">
                      <span className="text-accent-crimson flex items-center gap-2">
                        HP <span className="text-white bg-black/50 px-2 py-0.5 rounded">{boss.currentHp} / {boss.maxHp}</span>
                      </span>
                      <span className="text-white">{percentHp.toFixed(1)}%</span>
                    </div>
                    <div className="h-4 w-full bg-black rounded-sm overflow-hidden border border-white/10 shadow-[inner_0_2px_4px_rgba(0,0,0,0.8)]">
                      <div 
                        className="h-full bg-gradient-to-r from-red-800 via-red-600 to-accent-crimson transition-all duration-1000 relative"
                        style={{ width: `${percentHp}%` }}
                      >
                         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-text-muted uppercase flex items-center gap-2">
                        <Sword className="w-4 h-4 text-accent-cyan" /> Attack Vectors
                      </h4>
                      <span className="text-text-secondary font-medium">{completedCount} / {boss.subtasks.length} Complete</span>
                    </div>
                    <div className="space-y-2">
                       {boss.subtasks.map((task: BossSubtask) => (
                        <BossSubtaskItem key={task.id} subtask={task} bossId={boss.id} />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/30 flex gap-4 text-xs font-bold">
                    <span className="text-accent-gold">XP Reward: +{boss.xpReward}</span>
                    <span className="text-accent-gold">Gold Reward: +{boss.goldReward}</span>
                  </div>
                </div>
              </Card>
            );
          })}
          
          {activeBosses.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-border/50 rounded-xl bg-bg-elevated/10">
              <Skull className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold text-text-secondary">No active bosses</h3>
              <p className="text-text-muted mt-2 text-sm">The realm is safe for now.</p>
            </div>
          )}
        </div>
      </div>

      {defeatedBosses.length > 0 && (
        <div className="space-y-6 pt-8 mt-8 border-t border-border/30">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Defeated Bosses <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{defeatedBosses.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defeatedBosses.map((boss: BossWithSubtasks) => (
              <div key={boss.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-accent-gold/5 border border-accent-gold/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <Sparkles className="w-5 h-5 text-accent-gold shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{boss.name}</span>
                    <span className="text-xs text-text-muted">Defeated on {new Date(boss.defeatedAt!).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex bg-black/40 px-3 py-1.5 rounded items-center gap-4 text-xs font-black">
                  <span className="text-accent-gold">+{boss.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
