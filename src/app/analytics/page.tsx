import { getCurrentProfile } from "@/lib/auth";
import { Activity } from "lucide-react";
import { XpChart, AttributeRadar } from "@/components/analytics/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
        <header>
           <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 tracking-tight flex items-center gap-3">
             <Activity className="w-8 h-8 text-blue-400" />
             Analytics
           </h1>
           <p className="text-text-secondary mt-1">Please sign in to view your analytics.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            Analytics
          </h1>
          <p className="text-text-secondary mt-1">Data-driven insights into your performance.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <XpChart />
        <AttributeRadar profile={profile} />
        
        <Card className="col-span-1 lg:col-span-2 border-border/50 bg-bg-elevated/40 backdrop-blur-md">
           <CardHeader>
              <CardTitle className="text-lg">Power Score Breakdown</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary">Base Stats (Levels)</span>
                 <span className="font-bold text-accent-cyan">{(profile.level * 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary">Momentum Multiplier</span>
                 <span className="font-bold text-accent-purple">+{Math.floor(profile.momentum * 10)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-secondary">Consistency Bonus (Streak)</span>
                 <span className="font-bold text-accent-emerald">+{profile.currentStreak * 50}</span>
              </div>
              <div className="border-t border-border/50 pt-2 flex justify-between items-center mt-2">
                 <span className="font-bold text-white uppercase tracking-wider text-xs">Total Power Level</span>
                 <span className="text-xl font-black text-accent-gold">{profile.powerScore.toLocaleString()}</span>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
