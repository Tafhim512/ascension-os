import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateQuests } from "@/lib/ai/quest-generator";

export async function POST() {
  try {
    const profile = await getCurrentProfile();
    
    // Check if we already generated quests today to save AI compute
    // In a real app we'd track generation timestamps
    
    const newQuests = await generateQuests(profile);
    
    // Save to DB
    for (const q of newQuests) {
      await prisma.quest.create({
        data: {
          profileId: profile.id,
          title: q.title,
          description: q.description,
          type: q.type,
          difficulty: q.difficulty,
          xpReward: q.xpReward,
          goldReward: Math.floor(q.xpReward / 2),
          identityTag: q.identityTag,
          attributeRewards: JSON.stringify(q.attributeRewards),
          isAiGenerated: true,
          aiContext: q.rationale,
          isActive: true
        }
      });
    }

    return NextResponse.json({ success: true, count: newQuests.length });
  } catch (error) {
    console.error("AI Quest Gen Error:", error);
    return NextResponse.json({ error: "Failed to generate quests" }, { status: 500 });
  }
}
