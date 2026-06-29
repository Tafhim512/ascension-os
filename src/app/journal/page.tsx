import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Zap, Smile } from "lucide-react";
import { CreateJournalModal } from "@/components/journal/create-journal-modal";

export default async function JournalPage() {
  const profile = await getCurrentProfile();
  
  const entries = await prisma.journalEntry.findMany({
    where: { profileId: profile.id },
    orderBy: { date: 'desc' },
  });

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-purple-400 tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent-purple" />
            Journal
          </h1>
          <p className="text-text-secondary mt-1">Document your journey, reflect on your growth, and feed the AI Mentor context.</p>
        </div>
        <CreateJournalModal />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <Card key={entry.id} className="border-border/50 bg-bg-elevated/40 backdrop-blur-md hover:bg-bg-elevated/60 transition-colors group">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                      <Calendar className="w-4 h-4 text-text-muted" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">
                        {entry.date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </CardTitle>
                      <p className="text-xs text-text-muted">{entry.date.toLocaleTimeString("en-US", { hour: '2-digit', minute:'2-digit' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {entry.mood && (
                      <span className="px-2.5 py-1 bg-black/40 border border-white/5 rounded-md text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                        Mood: {entry.mood}
                      </span>
                    )}
                    {entry.energyLevel !== null && (
                      <span className="px-2.5 py-1 bg-black/40 border border-emerald-500/20 rounded-md text-xs font-bold uppercase tracking-wider text-accent-emerald flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {entry.energyLevel}%
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert prose-p:text-text-secondary prose-p:leading-relaxed max-w-none text-sm">
                    {entry.content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                  
                  {entry.aiReflection && (
                    <div className="mt-6 pt-4 border-t border-border/30 bg-accent-purple/5 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-accent-purple" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-accent-purple">The System Reflects</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-accent-purple/30 pl-3">
                        {entry.aiReflection}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="py-20 text-center border border-dashed border-border/50 rounded-xl bg-bg-elevated/10">
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold text-text-secondary">No Journal Entries</h3>
              <p className="text-text-muted mt-2 text-sm">Start documenting your journey today.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-sm font-medium text-text-secondary">Total Entries</span>
                <span className="text-lg font-black text-white">{profile.lifetimeJournals}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <span className="text-sm font-medium text-text-secondary">Current Mood</span>
                <span className="text-sm font-bold text-white capitalize">{profile.currentMood || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
