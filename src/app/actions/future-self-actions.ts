"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { calculateAlignmentScore } from "@/lib/ai/future-self";
import { getCurrentProfile } from "@/lib/auth";

export async function createFutureSelf(data: {
  archetype: string;
  vision: string;
  targetLevel: number;
}) {
  try {
    const profile = await getCurrentProfile();

    await prisma.futureSelf.updateMany({
      where: { profileId: profile.id },
      data: { isActive: false },
    });

    await prisma.futureSelf.create({
      data: {
        profileId: profile.id,
        archetype: data.archetype,
        vision: data.vision,
        targetLevel: data.targetLevel,
        isActive: true,
      },
    });

    await calculateAlignmentScore(profile.id);

    revalidatePath("/future-self");
    revalidatePath("/");
    return { success: true };
  } catch {
    console.error("Failed to create future self");
    return { success: false };
  }
}

export async function setActiveFutureSelf(id: string) {
  try {
    const profile = await getCurrentProfile();

    await prisma.futureSelf.updateMany({
      where: { profileId: profile.id },
      data: { isActive: false },
    });

    await prisma.futureSelf.update({
      where: { id },
      data: { isActive: true },
    });

    await calculateAlignmentScore(profile.id);

    revalidatePath("/future-self");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false };
  }
}
