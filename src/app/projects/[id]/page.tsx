import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ArrowLeft, Rocket, Code2, Users, DollarSign, Brain, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

import type { Project } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await getCurrentProfile();
  const { id } = await params;

  let project: Project | null = null;
  try {
    project = await prisma.project.findUnique({
      where: { id },
    });
  } catch {
    // DB unavailable
  }

  if (!project || project.profileId !== profile.id) {
    notFound();
  }

  const metrics = JSON.parse(project.metrics || "{}");
  const tech = JSON.parse(project.technologies || "[]");

  return (
    <div className="flexh-screen flex-col animate-in fade-in duration-700">
      {/* Workspace Header */}
      <header className="border-b border-border bg-bg-secondary p-4 md:p-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/legacy" className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-border">
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
            {project.type === "STARTUP" ? <Rocket className="w-5 h-5 text-accent-gold" /> : <Code2 className="w-5 h-5 text-accent-cyan" />}
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{project.name}</h1>
            <div className="flex items-center gap-2 text-xs">
              <span className={`uppercase font-bold tracking-wider ${project.status === 'active' ? 'text-accent-emerald' : 'text-text-muted'}`}>
                {project.status}
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary uppercase">{project.type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-colors">
            Ask AI Coach
          </button>
        </div>
      </header>

      {/* Workspace Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview */}
            <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  {project.description || "No description provided."}
                </p>
                
                {tech.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tech.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-bold text-text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Advisor Context */}
            {project.embedding && (
              <Card className="border-accent-purple/30 bg-accent-purple/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-wider text-accent-purple flex items-center gap-2">
                    <Brain className="w-4 h-4" /> Cognitive Link Established
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    This workspace is mapped into your Second Brain graph. The AI Mentor is actively monitoring 
                    its context to provide strategic advice during your daily insights.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Placeholder for Tasks/Checklists */}
            <Card className="border-border/50 bg-bg-elevated/40 border-dashed">
              <CardContent className="p-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full border border-border/50 flex items-center justify-center mb-4">
                  <Plus className="w-5 h-5 text-text-muted" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Workspace Tasks</h3>
                <p className="text-sm text-text-muted">Add milestones, validation tickets, and design specs.</p>
              </CardContent>
            </Card>

          </div>

          {/* Right Sidebar (Startup Metrics & Status) */}
          <div className="space-y-6">
            
            {/* Progress */}
            <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">Progress Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-text-muted">Completion</span>
                    <span className="text-accent-cyan">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                    <div className="bg-accent-cyan h-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Startup OS Module */}
            <Card className="border-accent-gold/20 bg-bg-elevated/40 backdrop-blur-md relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-gold" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-black/30 rounded-lg border border-border/30 text-center">
                    <Users className="w-4 h-4 text-text-muted mx-auto mb-1" />
                    <div className="text-lg font-black text-white">{metrics.users || 0}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Active Users</div>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg border border-border/30 text-center">
                    <DollarSign className="w-4 h-4 text-accent-emerald mx-auto mb-1" />
                    <div className="text-lg font-black text-white">{metrics.mrr || 0}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold">MRR ($)</div>
                  </div>
                </div>
                
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-text-secondary rounded-lg border border-border/50 transition-colors">
                  Update Metrics
                </button>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
}
