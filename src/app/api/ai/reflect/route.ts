import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai/client";
import { searchMemories, formatMemoriesForPrompt } from "@/lib/ai/memory";
import { getCurrentProfile } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { entryId, content } = await req.json();

    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    let memoryContext = "No previous memories.";
    try {
      const memories = await searchMemories(profile.id, content, 5);
      memoryContext = formatMemoriesForPrompt(memories);
    } catch (e) {
      console.error("Memory search failed:", e);
    }

    const systemPrompt = `You are the System, a deeply observant AI mentor inside Ascension OS.
The user just wrote a journal entry. Your job is to provide a 2-4 sentence reflection that:
1. Acknowledges what they wrote with genuine understanding
2. Connects it to patterns from their PAST MEMORIES if available
3. Offers one specific, actionable insight or question
Never use emojis. Never give fake encouragement. Be precise, honest, and strategic.`;

    const userPrompt = `
NEW JOURNAL ENTRY:
"${content}"

=== RELATED PAST MEMORIES ===
${memoryContext}
=== END MEMORIES ===

Reflect on this entry. If you see patterns across their memories, name them explicitly.`;

    const reflection = await callAI(systemPrompt, userPrompt);

    if (entryId) {
      const { prisma } = await import("@/lib/db");
      await prisma.journalEntry.update({
        where: { id: entryId },
        data: { aiReflection: reflection },
      });
    }

    return NextResponse.json({ success: true, reflection });
  } catch (error) {
    console.error("Journal reflection error:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}