import { prisma } from './db';

const DEV_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

function makeFallbackProfile() {
  return {
    id: DEV_USER_ID,
    userId: DEV_USER_ID,
    playerName: "Player 1",
    avatarUrl: null,
    level: 1,
    currentXp: 0,
    lifetimeXp: 0,
    hunterRank: "F",
    powerScore: 0,
    currentTitle: "The Beginner",
    currentWorld: "THE_WEAK",
    currentChapter: 1,
    chapterTitle: "The Awakening",
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    gold: 0,
    reputation: 0,
    legacyScore: 0,
    knowledgePoints: 0,
    builderPoints: 0,
    momentum: 0,
    energy: 100,
    focusScore: 0,
    healthScore: 0,
    currentMood: null,
    lifetimeQuests: 0,
    lifetimeBosses: 0,
    lifetimeBooks: 0,
    lifetimeWorkouts: 0,
    lifetimeCodingHrs: 0,
    lifetimeDeepWork: 0,
    lifetimeJournals: 0,
    lifetimeLearning: 0,
    lifetimeProjects: 0,
    profileFrame: null,
    backgroundTheme: null,
    particleEffect: null,
    soundTheme: null,
    settings: "{}",
    createdAt: new Date(),
    updatedAt: new Date(),
    attributes: [] as { attributeId: string; level: number }[],
    quests: [],
    bosses: [],
    enemies: [],
    projects: [],
    books: [],
    courses: [],
    journalEntries: [],
    knowledgeItems: [],
    achievements: [],
    titles: [],
    identities: [],
    futureSelves: [],
    xpHistory: [],
    streakHistory: [],
    notifications: [],
    rewards: [],
    habits: [],
  };
}

async function getDevProfile() {
  try {
    const existing = await prisma.profile.findUnique({
      where: { userId: DEV_USER_ID },
      include: {
        attributes: true,
        futureSelves: true,
        titles: true,
        achievements: true,
        quests: true,
      },
    });

    if (existing) return existing;

    return await prisma.profile.create({
      data: {
        userId: DEV_USER_ID,
        playerName: "Player 1",
        attributes: {
          create: [
            { attributeId: "BODY", level: 1, currentXp: 0 },
            { attributeId: "INTELLIGENCE", level: 1, currentXp: 0 },
            { attributeId: "DISCIPLINE", level: 1, currentXp: 0 },
            { attributeId: "WISDOM", level: 1, currentXp: 0 },
            { attributeId: "COMMUNICATION", level: 1, currentXp: 0 },
            { attributeId: "AI_ENGINEERING", level: 1, currentXp: 0 },
            { attributeId: "SOFTWARE_ENGINEERING", level: 1, currentXp: 0 },
            { attributeId: "PRODUCT_BUILDING", level: 1, currentXp: 0 },
            { attributeId: "BUSINESS", level: 1, currentXp: 0 },
            { attributeId: "LEADERSHIP", level: 1, currentXp: 0 },
            { attributeId: "CREATIVITY", level: 1, currentXp: 0 },
            { attributeId: "RELATIONSHIPS", level: 1, currentXp: 0 },
            { attributeId: "FINANCE", level: 1, currentXp: 0 },
            { attributeId: "EMOTIONAL_CONTROL", level: 1, currentXp: 0 },
          ],
        },
        futureSelves: {
          create: {
            vision: "I am ready to transform.",
            alignmentScore: 0,
          },
        },
      },
      include: {
        attributes: true,
        futureSelves: true,
        titles: true,
        achievements: true,
        quests: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getCurrentProfile() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isSupabaseConfigured =
    !!url &&
    !!key &&
    !url.includes("your-project") &&
    !url.includes("example") &&
    url.includes("supabase.co");

  // ── DEV / LOCAL MODE ──────────────────────────────────────
  if (!isSupabaseConfigured) {
    const devProfile = await getDevProfile();
    if (devProfile) return devProfile;
    return makeFallbackProfile();
  }

  // ── PRODUCTION MODE ───────────────────────────────────────
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // No active session — return null so callers know auth is required
      return null;
    }

    // Try to find existing profile for this real authenticated user
    let profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        attributes: true,
        futureSelves: true,
        titles: true,
        achievements: true,
        quests: true,
      },
    });

    // Auto-create if missing
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          playerName: user.email?.split("@")[0] || "Player",
          attributes: {
            create: [
              { attributeId: "BODY", level: 1, currentXp: 0 },
              { attributeId: "INTELLIGENCE", level: 1, currentXp: 0 },
              { attributeId: "DISCIPLINE", level: 1, currentXp: 0 },
              { attributeId: "WISDOM", level: 1, currentXp: 0 },
              { attributeId: "COMMUNICATION", level: 1, currentXp: 0 },
              { attributeId: "AI_ENGINEERING", level: 1, currentXp: 0 },
              { attributeId: "SOFTWARE_ENGINEERING", level: 1, currentXp: 0 },
              { attributeId: "PRODUCT_BUILDING", level: 1, currentXp: 0 },
              { attributeId: "BUSINESS", level: 1, currentXp: 0 },
              { attributeId: "LEADERSHIP", level: 1, currentXp: 0 },
              { attributeId: "CREATIVITY", level: 1, currentXp: 0 },
              { attributeId: "RELATIONSHIPS", level: 1, currentXp: 0 },
              { attributeId: "FINANCE", level: 1, currentXp: 0 },
              { attributeId: "EMOTIONAL_CONTROL", level: 1, currentXp: 0 },
            ],
          },
          futureSelves: {
            create: {
              vision: "I am ready to transform.",
              alignmentScore: 0,
            },
          },
        },
        include: {
          attributes: true,
          futureSelves: true,
          titles: true,
          achievements: true,
          quests: true,
        },
      });
    }

    return profile;
  } catch (error) {
    console.error("getCurrentProfile error:", error);
    // In ALL environments, return null on error instead of throwing.
    // Server components should handle null gracefully rather than crashing.
    // The real error is logged to console for debugging.
    return null;
  }
}
