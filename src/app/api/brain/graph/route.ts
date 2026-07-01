import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth';
import { buildKnowledgeGraph } from '@/lib/ai/graph-builder';

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const graphData = await buildKnowledgeGraph(profile.id);

    return NextResponse.json(graphData);
  } catch {
    return NextResponse.json({ error: 'Failed to build graph' }, { status: 500 });
  }
}
