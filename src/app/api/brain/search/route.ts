import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth';
import { searchMemories } from '@/lib/ai/memory';

export async function POST(req: Request) {
  try {
    const { query, limit = 10 } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const profile = await getCurrentProfile();
    const results = await searchMemories(profile.id, query, limit);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Semantic search failed:", error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
