import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Book } from "lucide-react";
import { AddKnowledgeModal } from "@/components/brain/add-knowledge-modal";
import { KnowledgeList } from "@/components/brain/knowledge-list";
import { KnowledgeGraph } from "@/components/brain/knowledge-graph";
import type { KnowledgeItem, Book as PrismaBook } from "@prisma/client";

interface KnowledgeListProps {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string;
  keyIdeas: string;
  aiReflection: string | null;
}

export const dynamic = 'force-dynamic';

export default async function BrainPage() {
  const profile = await getCurrentProfile();

  let knowledgeItems: KnowledgeItem[] = [];
  try {
    knowledgeItems = await prisma.knowledgeItem.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    // DB unavailable
  }

  let bookItems: PrismaBook[] = [];
  try {
    bookItems = await prisma.book.findMany({
      where: { profileId: profile.id },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });
  } catch {
    // DB unavailable
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-400 tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-accent-cyan" />
            The Second Brain
          </h1>
          <p className="text-text-secondary mt-1 max-w-xl">
            Your semantic knowledge graph. Notes, books, and ideas are automatically tagged, summarized, and interconnected by the AI.
          </p>
        </div>
        <AddKnowledgeModal />
      </header>

      {/* Network UI */}
      <KnowledgeGraph />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Knowledge Nodes */}
        <div className="md:col-span-2 space-y-6">
          <KnowledgeList initialItems={knowledgeItems as KnowledgeListProps[]} />
        </div>

        {/* Books & Courses Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4 border-b border-border/50 pb-2">
            <Book className="w-5 h-5 text-accent-blue" />
            <h2 className="text-lg font-bold text-white">Active Library</h2>
          </div>
          
          {bookItems.length > 0 ? (
            bookItems.map((book) => (
              <Card key={book.id} className="border-border/50 bg-bg-elevated/40">
                <CardContent className="p-4">
                  <h3 className="font-bold text-white text-sm">{book.title}</h3>
                  <p className="text-xs text-text-muted">{book.author}</p>
                  <div className="mt-3 w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-accent-blue h-full" style={{ width: `${book.progress}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-4 text-center border border-border/30 rounded-xl bg-white/5">
              <p className="text-xs text-text-muted">No active books.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
