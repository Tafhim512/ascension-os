export const dynamic = 'force-dynamic';

import { getCurrentProfile } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Map, Star, GitBranch, Activity, Smartphone, CheckCircle2 } from "lucide-react";

const WORLDS = [
  { id: "THE_WEAK", name: "The Weak", level: 1, color: "text-gray-500", bg: "bg-gray-500/20" },
  { id: "THE_STUDENT", name: "The Student", level: 5, color: "text-blue-400", bg: "bg-blue-400/20" },
  { id: "THE_BUILDER", name: "The Builder", level: 10, color: "text-cyan-400", bg: "bg-cyan-400/20" },
  { id: "THE_ENGINEER", name: "The Engineer", level: 20, color: "text-emerald-400", bg: "bg-emerald-400/20" },
  { id: "THE_FOUNDER", name: "The Founder", level: 35, color: "text-purple-400", bg: "bg-purple-400/20" },
  { id: "THE_VISIONARY", name: "The Visionary", level: 50, color: "text-red-400", bg: "bg-red-400/20" },
  { id: "THE_MASTER", name: "The Master", level: 100, color: "text-yellow-400", bg: "bg-yellow-400/20" },
];

export default async function WorldMapPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <div className="p-10 text-text-secondary">Please sign in to view the world map.</div>;
  }

  const worlds = WORLDS;
  const currentWorldId = profile.currentWorld;

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight flex items-center gap-3">
            <Map className="w-8 h-8 text-emerald-400" />
            The Living World
          </h1>
          <p className="text-text-secondary mt-1">Your reality, synchronized with Ascension OS.</p>
        </div>
      </header>

      {/* V6: Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
           <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h3 className="font-bold text-white">GitHub</h3>
                    <p className="text-xs text-text-muted">Commits map to XP.</p>
                 </div>
              </div>
              <button className="px-3 py-1.5 bg-accent-cyan/10 text-accent-cyan text-xs font-bold uppercase tracking-wider rounded border border-accent-cyan/30">Connect</button>
           </CardContent>
        </Card>
        <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
           <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-accent-emerald" />
                 </div>
                 <div>
                    <h3 className="font-bold text-white">Apple Health</h3>
                    <p className="text-xs text-text-muted">Steps to Stamina.</p>
                 </div>
              </div>
              <button className="px-3 py-1.5 bg-white/5 text-text-muted text-xs font-bold uppercase tracking-wider rounded border border-border/50">Coming Soon</button>
           </CardContent>
        </Card>
        <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
           <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-accent-purple" />
                 </div>
                 <div>
                    <h3 className="font-bold text-white">Oura Ring</h3>
                    <p className="text-xs text-text-muted">Sleep to Energy.</p>
                 </div>
              </div>
              <button className="px-3 py-1.5 bg-white/5 text-text-muted text-xs font-bold uppercase tracking-wider rounded border border-border/50">Coming Soon</button>
           </CardContent>
        </Card>
      </div>

      <div className="relative py-10 max-w-4xl mx-auto">
         {/* Connecting Line */}
         <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-border/50 -translate-x-1/2 z-0"></div>

         <div className="space-y-16">
          {worlds.map((world, idx) => {
             const isUnlocked = profile.level >= world.level;
             const isCurrent = world.id === currentWorldId;
               const isPast = isUnlocked && !isCurrent;

               return (
                  <div key={world.id} className={`relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                     
                     {/* Node */}
                     <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center bg-bg-primary transition-all duration-500
                           ${isCurrent ? 'w-12 h-12 border-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.6)]' :
                             isPast ? 'border-accent-emerald shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                             'border-border/50'}`}
                        >
                           {isCurrent ? <Star className="w-5 h-5 text-accent-cyan animate-pulse" /> : 
                            isPast ? <CheckCircle2 className="w-4 h-4 text-accent-emerald" /> : 
                            <div className="w-2 h-2 rounded-full bg-border/50" />}
                        </div>
                     </div>

                     {/* Content Card */}
                     <div className={`w-full pl-20 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                        <Card className={`border transition-all duration-500 shadow-xl
                           ${isCurrent ? 'border-accent-cyan/50 bg-accent-cyan/5 -translate-y-2' : 
                             isPast ? 'border-accent-emerald/30 bg-bg-elevated/40' : 
                             'border-border/20 bg-bg-primary/50 opacity-50 grayscale'}`}
                        >
                           <CardContent className="p-6">
                              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">
                                Lvl {world.level} Requirement
                              </span>
                              <h3 className={`text-2xl font-black mb-2 ${isCurrent ? 'text-accent-cyan' : isPast ? 'text-white' : 'text-text-muted'}`}>
                                 {world.name}
                              </h3>
                              {isCurrent && (
                                <p className="text-sm font-medium text-text-secondary leading-relaxed">
                                   You are currently traversing this realm. Master your skills and complete epic quests to break through to the next reality.
                                </p>
                              )}
                              {!isUnlocked && (
                                <p className="text-sm font-medium text-text-muted flex items-center gap-2 mt-4 justify-start md:justify-end">
                                   Locked <Map className="w-4 h-4" />
                                </p>
                              )}
                           </CardContent>
                        </Card>
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
    </div>
  );
}

// CheckCircle2 is used as an icon in the world map timeline
