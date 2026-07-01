export const dynamic = 'force-dynamic';

import { getCurrentProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Dumbbell, Speech, Zap, Crown, Rocket } from "lucide-react";
import { AddAttributeModal } from "@/components/attributes/add-attribute-modal";
import type { Attribute } from "@prisma/client";

// Helper to map attribute IDs to icons
const getAttributeIcon = (id: string, className: string) => {
  switch (id) {
    case "BODY": return <Dumbbell className={className} />;
    case "INTELLIGENCE": return <Brain className={className} />;
    case "COMMUNICATION": return <Speech className={className} />;
    case "LEADERSHIP": return <Crown className={className} />;
    case "PRODUCT_BUILDING": return <Rocket className={className} />;
    default: return <Zap className={className} />;
  }
};

export default async function AttributesPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="p-4 md:p-10">
        <p className="text-text-secondary">Please sign in to view attributes.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-cyan tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-accent-blue" />
            Skill Tree & Attributes
          </h1>
          <p className="text-text-secondary mt-1 max-w-2xl">Your real-world skill tree. Complete quests aligned to these attributes to gain XP and level them up.</p>
        </div>
        <AddAttributeModal />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(profile.attributes as Attribute[]).map((attr) => {
          const isHighLevel = attr.level >= 20;

          return (
            <Card key={attr.id} className={`border bg-bg-elevated/40 backdrop-blur-md overflow-hidden group ${
              isHighLevel ? 'border-accent-cyan/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-border/50 hover:border-border'
            }`}>
              <CardHeader className="pb-3 border-b border-border/30 bg-black/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getAttributeIcon(attr.attributeId, `w-4 h-4 ${isHighLevel ? 'text-accent-cyan' : 'text-text-muted'}`)}
                    <CardTitle className="text-sm text-white uppercase tracking-wider font-bold">
                      {attr.attributeId.replace(/_/g, ' ')}
                    </CardTitle>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${
                    isHighLevel ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'bg-white/5 text-text-secondary border border-white/10'
                  }`}>
                    LVL {attr.level}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div className="space-y-1.5">
                   <div className="flex justify-between text-[10px] font-bold text-text-muted">
                    <span>{attr.currentXp} XP</span>
                    <span>{attr.level * 100} XP</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-1000 ${isHighLevel ? 'bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-accent-blue'}`} 
                      style={{ width: `${Math.min(100, (attr.currentXp / (attr.level * 100)) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                   <div className="bg-black/30 p-2 rounded border border-white/5 text-center">
                     <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Lifetime XP</div>
                     <div className="text-xs font-black text-white">{attr.lifetimeXp}</div>
                   </div>
                   <div className="bg-black/30 p-2 rounded border border-white/5 text-center">
                     <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Consistency</div>
                     <div className={`text-xs font-black ${attr.consistencyScore > 80 ? 'text-accent-emerald' : 'text-white'}`}>
                       {attr.consistencyScore}%
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
