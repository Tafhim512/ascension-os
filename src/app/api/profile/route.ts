import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth';

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    return NextResponse.json({
      playerName: profile.playerName,
      level: profile.level,
      hunterRank: profile.hunterRank
    });
  } catch (error) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
}