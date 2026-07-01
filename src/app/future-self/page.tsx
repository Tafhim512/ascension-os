import { getCurrentProfile } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, ArrowUpCircle } from "lucide-react";
import { VisionEditor } from "@/components/future-self/vision-editor";
import { GapAnalysisWidget } from "@/components/future-self/gap-analysis";
import type { FutureSelf } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function FutureSelfPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="p-4 md:p-10">
        <p className="text-text-secondary">Please sign in to view your Future Self Engine.</p>
      </div>
    );
  }

  const futureSelves = profile.futureSelves || [];
  const activeFutureSelf = futureSelves.find((fs: FutureSelf) => fs.isActive) || futureSelves[0];

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-pink-500 tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-accent-purple" />
            The Future Self Engine
          </h1>
          <p className="text-text-secondary mt-1">Define who you are becoming. Measure the gap. Evolve.</p>
        </div>
        <VisionEditor />
      </header>

      {activeFutureSelf ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-accent-purple/30 bg-bg-elevated/40 backdrop-blur-md overflow-hidden relative shadow-lg shadow-accent-purple/10">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                 <ArrowUpCircle className="w-32 h-32 text-accent-purple" />
               </div>
               <CardHeader className="relative z-10 pb-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 block">Active Archetype</span>
                  <CardTitle className="text-2xl font-black text-white">{activeFutureSelf.archetype}</CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 mt-6 pb-8">
                  <div className="space-y-4">
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 block">Core Vision</span>
                        <p className="text-sm font-medium text-text-secondary italic">&ldquo;{activeFutureSelf.vision}&rdquo;</p>
                     </div>
                     <div className="pt-4 border-t border-border/50">
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Target Level</span>
                           <span className="text-xl font-black text-white">{activeFutureSelf.targetLevel}</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
               <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary">Alignment Score</h3>
                  <div className="relative w-40 h-40 flex items-center justify-center">
                     <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="45" fill="none" strokeWidth="10" className="stroke-black/50" />
                        <circle 
                           cx="50" cy="50" r="45" 
                           fill="none" 
                           strokeWidth="10" 
                           strokeDasharray={`${activeFutureSelf.alignmentScore * 2.827} 282.7`}
                           strokeLinecap="round"
                           className="stroke-accent-purple transition-all duration-1500 ease-out drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                        />
                     </svg>
                     <div className="flex flex-col items-center justify-center z-10">
                        <span className="text-4xl font-black text-white">{Math.round(activeFutureSelf.alignmentScore)}<span className="text-lg">%</span></span>
                     </div>
                  </div>
                  <p className="text-xs text-text-muted">Calculated from Attributes, Habits, and Momentum.</p>
               </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center gap-3">
               <Target className="w-5 h-5 text-accent-purple" />
               <h2 className="text-xl font-bold text-white">AI Gap Analysis</h2>
             </div>
             <GapAnalysisWidget />
          </div>
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-border/50 rounded-xl bg-bg-elevated/10">
          <Target className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-text-secondary">No Future Self Defined</h3>
          <p className="text-text-muted mt-2 text-sm">Define your vision to begin the journey of transformation.</p>
        </div>
      )}
    </div>
  );
}
