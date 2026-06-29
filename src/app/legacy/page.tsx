import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FolderGit2, Code } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LegacyPage() {
  const profile = await getCurrentProfile();

  let projects: { id: string; name: string; type: string; description: string | null; status: string; progress: number }[] = [];
  try {
    projects = await prisma.project.findMany({
      where: { profileId: profile.id },
      orderBy: { updatedAt: 'desc' },
    });
  } catch {
    // DB unavailable
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-200 tracking-tight flex items-center gap-3">
          <FolderGit2 className="w-8 h-8 text-accent-gold" />
          Legacy
        </h1>
        <p className="text-text-secondary mt-1">The vault of your completed projects, acquired knowledge, and permanent impact.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Projects Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Code className="w-5 h-5 text-accent-cyan" /> Projects
            </h2>
            {/* Create Project button would go here */}
          </div>
          
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="border-accent-cyan/20 bg-bg-elevated/40 backdrop-blur-md cursor-pointer hover:bg-accent-cyan/5 hover:border-accent-cyan/40 transition-all hover:-translate-y-1 group">
                    <CardHeader className="pb-3 border-b border-border/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/30 mb-2 inline-block">
                            {project.type.replace(/_/g, ' ')}
                          </span>
                          <CardTitle className="text-lg text-white group-hover:text-accent-cyan transition-colors">{project.name}</CardTitle>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${project.status === 'completed' ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-accent-gold/10 text-accent-gold'}`}>
                          {project.status.toUpperCase()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {project.description && (
                        <p className="text-sm text-text-secondary">{project.description}</p>
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-text-muted">
                           <span>PROGRESS</span>
                           <span className="text-accent-cyan">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                          <div className="h-full bg-accent-cyan transition-all" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-border/50 rounded-xl bg-bg-elevated/10">
                <FolderGit2 className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-30" />
                <p className="text-sm text-text-secondary font-medium">No projects yet. Build something amazing.</p>
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-purple" /> Knowledge Base
          </h2>
          
          <div className="space-y-4">
             <div className="p-8 text-center border border-dashed border-border/50 rounded-xl bg-bg-elevated/10">
                <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-30" />
                <p className="text-sm text-text-secondary font-medium">Knowledge tracking module coming soon.</p>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
}
