import { prisma } from './db';

const DEV_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

async function getDevProfile() {
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
}

export async function getCurrentProfile() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Local/dev mode when Supabase is not properly configured
  const isSupabaseConfigured =
    !!url &&
    !!key &&
    !url.includes("your-project") &&
    !url.includes("example") &&
    url.includes("supabase.co");

  if (!isSupabaseConfigured) {
    return getDevProfile();
  }

  // Production: try Supabase session
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
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

      if (profile) return profile;

      // Auto-create profile for new Supabase users
      return await prisma.profile.create({
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
  } catch {
    // DB or Supabase unavailable, use dev profile
  }

  return getDevProfile();
}
