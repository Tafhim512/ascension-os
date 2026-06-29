import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const DEV_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
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
          return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({ profile });
      }

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

      return NextResponse.json({ profile });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        attributes: true,
        futureSelves: true,
        titles: true,
        achievements: true,
        quests: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, playerName } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existing) {
      return NextResponse.json({ profile: existing });
    }

    const profile = await prisma.profile.create({
      data: {
        userId: userId || DEV_USER_ID,
        playerName: playerName || "Player 1",
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
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}