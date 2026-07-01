import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth';
import { generateGapAnalysis } from '@/lib/ai/future-self';

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const analysis = await generateGapAnalysis(profile.id);

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: 'Failed to generate gap analysis' }, { status: 500 });
  }
}
