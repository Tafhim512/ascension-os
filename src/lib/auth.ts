import { prisma } from './db';

const DEV_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

export async function getCurrentProfile() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project")) {
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

    if (!profile) {
      throw new Error("Development profile not found. Did you run the seed script?");
    }

    return profile;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error } = await supabase
    .from("profile")
    .select(
      `
      *,
      attributes (*),
      futureSelves (*),
      titles (*),
      achievements (*),
      quests (*)
    `
    )
    .eq("userId", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Profile not found");
  }

  return profile;
}