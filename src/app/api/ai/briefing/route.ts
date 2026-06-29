import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth';
import { generateMorningBriefing } from '@/lib/ai/briefing';

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    const briefing = await generateMorningBriefing(profile.id);
    
    return NextResponse.json({ briefing });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate briefing' }, { status: 500 });
  }
}
