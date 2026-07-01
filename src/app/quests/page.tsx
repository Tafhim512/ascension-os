export const dynamic = 'force-dynamic';

import { getCurrentProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, Zap, CheckCircle2, Cpu } from "lucide-react";
import { CreateQuestModal } from "@/components/quests/create-quest-modal";
import { QuestCompleteButton } from "@/components/quests/complete-button";
import { GenerateQuestsButton } from "@/components/quests/generate-quests-button";
import type { Quest } from "@prisma/client";

export default async function QuestsPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <div className="p-10 text-text-secondary">Please sign in to view quests.</div>;
  }

  const activeQuests = profile.quests.filter((q: Quest) => q.isActive && !q.isCompleted);
  const completedQuests = profile.quests.filter((q: Quest) => q.isCompleted).sort((a: Quest, b: Quest) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-white tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-accent-cyan" />
            Quests
          </h1>
          <p className="text-text-secondary mt-1">Complete quests to earn XP, gold, and increase your attributes.</p>
        </div>
        <div className="flex gap-3">
          <GenerateQuestsButton />
          <CreateQuestModal attributes={profile.attributes} />
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Active Missions <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{activeQuests.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeQuests.map((quest: Quest) => (
            <Card key={quest.id} className="border-accent-cyan/30 bg-bg-elevated/40 backdrop-blur-md hover:bg-bg-elevated/60 transition-all group shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-sm border ${
                    quest.difficulty === 'MYTHIC' ? 'bg-red-400/10 text-red-400 border-red-400/30' :
                    quest.difficulty === 'LEGENDARY' ? 'bg-accent-gold/10 text-accent-gold border-accent-gold/30' :
                    quest.difficulty === 'EPIC' ? 'bg-accent-purple/10 text-accent-purple border-accent-purple/30' :
                    quest.difficulty === 'RARE' ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/30' :
                    'bg-white/5 text-text-secondary border-border/50'
                  }`}>
                    {quest.difficulty}
                  </span>
                  <div className="flex items-center gap-3">
                    {quest.identityTag && (
                      <span className="text-[10px] font-bold text-text-muted bg-black/30 px-2 py-1 rounded">
                        {quest.identityTag}
                      </span>
                    )}
                    {quest.estimatedMinutes && (
                      <span className="flex items-center text-xs text-text-muted font-medium bg-black/20 px-2 py-1 rounded">
                        <Clock className="w-3 h-3 mr-1" />
                        {quest.estimatedMinutes}m
                      </span>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-accent-cyan transition-colors flex items-center gap-2">
                  {quest.title}
                  {quest.isAiGenerated && (
                    <span title="AI Generated">
                      <Cpu className="w-4 h-4 text-accent-purple" />
                    </span>
                  )}
                </CardTitle>
                {quest.description && (
                   <p className="text-sm text-text-secondary mt-2 line-clamp-2">{quest.description}</p>
                )}
                {quest.aiContext && (
                   <p className="text-xs text-accent-purple/80 mt-2 italic border-l-2 border-accent-purple/30 pl-2">
                      &ldquo;{quest.aiContext}&rdquo;
                   </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center font-black text-accent-gold drop-shadow-[0_0_5px_rgba(250,204,21,0.3)] bg-accent-gold/5 px-2 py-1 rounded">
                      <Zap className="w-4 h-4 mr-1 text-accent-gold" />
                      +{quest.xpReward}
                    </span>
                    <span className="flex items-center font-black text-accent-gold bg-accent-gold/5 px-2 py-1 rounded">
                      🪙 +{quest.goldReward}
                    </span>
                  </div>
                  <QuestCompleteButton questId={quest.id} profileId={profile.id} quest={quest} />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {activeQuests.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-border/50 rounded-xl bg-bg-elevated/10">
              <Target className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold text-text-secondary">No active quests</h3>
              <p className="text-text-muted mt-2 text-sm">Create a new quest to start earning XP.</p>
            </div>
          )}
        </div>
      </div>

      {completedQuests.length > 0 && (
        <div className="space-y-6 pt-8 mt-8 border-t border-border/30">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Completed <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{completedQuests.length}</span>
          </h2>
          <div className="space-y-3">
            {completedQuests.slice(0, 10).map((quest: Quest) => (
              <div key={quest.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-elevated/20 border border-border/30 rounded-lg opacity-70">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
                  <span className="font-medium">{quest.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold pl-8 sm:pl-0">
                  <span className="text-accent-gold">+{quest.xpReward} XP</span>
                  <span className="text-text-muted">{new Date(quest.completedAt!).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
