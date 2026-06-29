import { prisma } from './db';

const DEV_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

const FALLBACK_PROFILE = {
  id: "fallback",
  userId: DEV_USER_ID,
  playerName: "Player 1",
  avatarUrl: null,
  level: 1,
  currentXp: 0,
  lifetimeXp: 0,
  hunterRank: "F",
  powerScore: 10,
  currentTitle: "The Novice",
  currentWorld: "THE_WEAK",
  currentChapter: 1,
  chapterTitle: "Awakening",
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
  attributes: [],
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

export async function getCurrentProfile() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project")) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: DEV_USER_ID },
        include: {
          attributes: true,
          futureSelves: true,
          titles: true,
          achievements: true,
          quests: true,
        },
      });

      if (profile) return profile;
    } catch {
      // DB not available yet, fall through to fallback
    }

    return FALLBACK_PROFILE as any;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      try {
        const profile = await prisma.profile.findUnique({
          where: { userId: DEV_USER_ID },
          include: {
            attributes: true,
            futureSelves: true,
            titles: true,
            achievements: true,
            quests: true,
          },
        });

        if (profile) return profile;
      } catch {
        // DB not available yet
      }

      return FALLBACK_PROFILE as any;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        attributes: true,
        futureSelves: true,
        titles: true,
        achievements: true,
        quests: true,
      },
    });

    if (!profile) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/profile?userId=${encodeURIComponent(user.id)}`, {
          headers: { cookie: (globalThis as any).process?.env?.COOKIE || "" },
          // Server-side fetch can't send cookies easily; rely on the catch below to create via signed request if needed
        });
        if (res.ok) {
          const { profile: created } = await res.json();
          if (created) return created;
        }
      } catch {
        // ignore, try direct create below
      }

      const fresh = await prisma.profile.create({
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

      return fresh;
    }

    return profile;
  } catch {
    // Supabase or DB unavailable
    return FALLBACK_PROFILE as any;
  }
}