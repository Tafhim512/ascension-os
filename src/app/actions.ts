"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { xpRequiredForLevel } from "@/lib/engine/xp";
import { momentumGainFromQuest } from "@/lib/engine/momentum";
import { embedJournalEntry, embedProject } from "@/lib/ai/memory";
import { processAchievements } from "@/lib/engine/achievement-checker";
import { getCurrentProfile } from "@/lib/auth";
import type { Attribute } from "@prisma/client";

const DEV_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

async function getProfileId(): Promise<string> {
  const profile = await getCurrentProfile();
  if (!profile || profile.userId === DEV_USER_ID) {
    throw new Error("AUTH_REQUIRED");
  }
  return profile.id;
}

// ─── QUEST ACTIONS ─────────────────────────────────────────

export async function completeQuest(questId: string, profileId: string) {
  try {
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) throw new Error("Quest not found");
    if (quest.isCompleted) return { success: true, alreadyCompleted: true };

    // Mark quest completed
    await prisma.quest.update({
      where: { id: questId },
      data: { isCompleted: true, completedAt: new Date(), isActive: false },
    });

    // Update profile
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { attributes: true },
    });
    if (!profile) throw new Error("Profile not found");

    const xpGained = quest.xpReward;
    let newXp = profile.currentXp + xpGained;
    let newLevel = profile.level;
    let leveledUp = false;

    // Level up engine
    while (newXp >= xpRequiredForLevel(newLevel)) {
      newXp -= xpRequiredForLevel(newLevel);
      newLevel++;
      leveledUp = true;
    }

    // Momentum gain
    const momentumGain = momentumGainFromQuest(quest.difficulty);
    const newMomentum = Math.min(100, profile.momentum + momentumGain);

    // Streak update
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let newStreak = profile.currentStreak;
    let newLongestStreak = profile.longestStreak;

    if (profile.lastActiveDate) {
      const lastActive = new Date(profile.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak++;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    if (newStreak > newLongestStreak) newLongestStreak = newStreak;

    await prisma.profile.update({
      where: { id: profileId },
      data: {
        currentXp: newXp,
        level: newLevel,
        lifetimeXp: profile.lifetimeXp + xpGained,
        lifetimeQuests: profile.lifetimeQuests + 1,
        gold: profile.gold + quest.goldReward,
        momentum: newMomentum,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: new Date(),
      },
    });

    // Update attributes
    let attributeRewardsArray: { attributeId: string; xp: number }[] = [];
    try { attributeRewardsArray = JSON.parse(quest.attributeRewards); } catch {}

    for (const reward of attributeRewardsArray) {
      const attr = profile.attributes.find((a: Attribute) => a.attributeId === reward.attributeId);
      if (attr) {
        let attrNewXp = attr.currentXp + (reward.xp || 0);
        let attrNewLevel = attr.level;
        while (attrNewXp >= attrNewLevel * 100) {
          attrNewXp -= attrNewLevel * 100;
          attrNewLevel++;
        }
        await prisma.attribute.update({
          where: { id: attr.id },
          data: { currentXp: attrNewXp, level: attrNewLevel, lifetimeXp: attr.lifetimeXp + (reward.xp || 0) },
        });
      }
    }

// Log XP event
    await prisma.xpEvent.create({
      data: {
        profileId,
        amount: xpGained,
        source: "quest",
        sourceId: questId,
        description: `Completed quest: ${quest.title}`,
        levelBefore: profile.level,
        levelAfter: newLevel,
      },
    });

    // Check for achievements
    await processAchievements(profileId);

    revalidatePath("/");
    revalidatePath("/quests");
    revalidatePath("/attributes");

    return { success: true, xpGained, newLevel, leveledUp, goldEarned: quest.goldReward };
  } catch (error) {
    console.error("Error completing quest:", error);
    return { success: false, error: "Failed to complete quest." };
  }
}

export async function createQuest(data: {
  title: string;
  description?: string;
  type: string;
  difficulty: string;
  xpReward: number;
  goldReward?: number;
  estimatedMinutes?: number;
  identityTag?: string;
  attributeRewards?: string;
}) {
  try {
    const profileId = await getProfileId();
    await prisma.quest.create({
      data: {
        profileId,
        title: data.title,
        description: data.description || null,
        type: data.type,
        difficulty: data.difficulty,
        xpReward: data.xpReward,
        goldReward: data.goldReward || 0,
        estimatedMinutes: data.estimatedMinutes || null,
        identityTag: data.identityTag || null,
        attributeRewards: data.attributeRewards || "[]",
        isActive: true,
        isCompleted: false,
      },
    });
    revalidatePath("/quests");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating quest:", error);
    return { success: false, error: "Failed to create quest." };
  }
}

// ==========================================
// ATTRIBUTES
// ==========================================

export async function createAttribute(attributeId: string) {
  try {
    const profileId = await getProfileId();
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { attributes: true }
    });
    if (!profile) throw new Error("Profile not found");
    
    const formattedId = attributeId.toUpperCase().replace(/\s+/g, '_');
    
    const exists = profile.attributes.find(a => a.attributeId === formattedId);
    if (exists) {
      throw new Error("Attribute already exists.");
    }
    
    await prisma.attribute.create({
      data: {
        profileId: profile.id,
        attributeId: formattedId,
        level: 1,
        currentXp: 0
      }
    });
    
    revalidatePath('/attributes');
    revalidatePath('/analytics');
    revalidatePath('/quests');
    return { success: true };
  } catch (error) {
    console.error("Error creating attribute:", error);
    const message = error instanceof Error ? error.message : "Failed to create attribute.";
    return { success: false, error: message };
  }
}

// ─── BOSS ACTIONS ──────────────────────────────────────────

export async function completeBossSubtask(subtaskId: string, bossId: string) {
  try {
    const subtask = await prisma.bossSubtask.findUnique({ where: { id: subtaskId } });
    if (!subtask || subtask.isCompleted) return { success: true };

    await prisma.bossSubtask.update({
      where: { id: subtaskId },
      data: { isCompleted: true, completedAt: new Date() },
    });

    const boss = await prisma.boss.findUnique({
      where: { id: bossId },
      include: { subtasks: true },
    });
    if (!boss) throw new Error("Boss not found");

    const newHp = Math.max(0, boss.currentHp - subtask.damage);
    const isDefeated = newHp <= 0;

    await prisma.boss.update({
      where: { id: bossId },
      data: {
        currentHp: newHp,
        isDefeated,
        defeatedAt: isDefeated ? new Date() : null,
      },
    });

    // If boss defeated, give rewards
    if (isDefeated) {
      const profileId = boss.profileId;
      const profile = await prisma.profile.findUnique({ where: { id: profileId } });
      if (profile) {
        await prisma.profile.update({
          where: { id: profileId },
          data: {
            gold: profile.gold + boss.goldReward,
            lifetimeXp: profile.lifetimeXp + boss.xpReward,
            lifetimeBosses: profile.lifetimeBosses + 1,
            currentXp: profile.currentXp + boss.xpReward,
          },
        });

        await prisma.xpEvent.create({
          data: {
            profileId,
            amount: boss.xpReward,
            source: "boss",
            sourceId: bossId,
            description: `Defeated boss: ${boss.name}`,
            levelBefore: profile.level,
            levelAfter: profile.level,
          },
        });
        
        await processAchievements(profileId);
      }
    }

    revalidatePath("/bosses");
    revalidatePath("/");
    return { success: true, isDefeated, damage: subtask.damage, newHp };
  } catch (error) {
    console.error("Error completing boss subtask:", error);
    return { success: false, error: "Failed to complete subtask." };
  }
}

export async function createBoss(data: {
  name: string;
  description?: string;
  difficulty: string;
  maxHp: number;
  deadline?: string;
  xpReward: number;
  goldReward?: number;
  subtasks: { title: string; damage: number }[];
}) {
  try {
    const profileId = await getProfileId();
    await prisma.boss.create({
      data: {
        profileId,
        name: data.name,
        description: data.description || null,
        difficulty: data.difficulty,
        maxHp: data.maxHp,
        currentHp: data.maxHp,
        xpReward: data.xpReward,
        goldReward: data.goldReward || 0,
        deadline: data.deadline ? new Date(data.deadline) : null,
        subtasks: {
          create: data.subtasks.map((s) => ({
            title: s.title,
            damage: s.damage,
          })),
        },
      },
    });
    revalidatePath("/bosses");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating boss:", error);
    return { success: false, error: "Failed to create boss." };
  }
}

// ─── JOURNAL ACTIONS ───────────────────────────────────────

export async function createJournalEntry(data: {
  content: string;
  mood?: string;
  energyLevel?: number;
  tags?: string[];
}) {
  try {
    const profileId = await getProfileId();
    const profile = await prisma.profile.findUnique({ where: { id: profileId } });
    
    const entry = await prisma.journalEntry.create({
      data: {
        profileId,
        content: data.content,
        mood: data.mood || null,
        energyLevel: data.energyLevel || null,
        tags: JSON.stringify(data.tags || []),
      },
    });

    // Update lifetime journals count
    if (profile) {
      await prisma.profile.update({
        where: { id: profileId },
        data: { lifetimeJournals: profile.lifetimeJournals + 1, currentMood: data.mood || profile.currentMood },
      });
    }

    // V2: Auto-embed journal entry for RAG (fire-and-forget, don't block UI)
    embedJournalEntry(entry.id, data.content).catch(e => console.error("Embed failed:", e));

    revalidatePath("/journal");
    revalidatePath("/");
    return { success: true, entryId: entry.id };
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return { success: false, error: "Failed to save journal entry." };
  }
}

// ─── PROJECT ACTIONS ───────────────────────────────────────

export async function createProject(data: {
  name: string;
  description?: string;
  type: string;
  technologies?: string[];
  repositoryUrl?: string;
}) {
  try {
    const profileId = await getProfileId();
    const project = await prisma.project.create({
      data: {
        profileId,
        name: data.name,
        description: data.description || null,
        type: data.type,
        technologies: JSON.stringify(data.technologies || []),
        repositoryUrl: data.repositoryUrl || null,
      },
    });

    // V2: Auto-embed project for RAG
    embedProject(project.id, data.name, data.description || "").catch(e => console.error("Embed failed:", e));

    revalidatePath("/legacy");
    return { success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project." };
  }
}

export async function updateProjectProgress(projectId: string, progress: number) {
  try {
    const isComplete = progress >= 100;
    const profileId = await getProfileId();

    await prisma.project.update({
      where: { id: projectId },
      data: {
        progress: Math.min(100, progress),
        status: isComplete ? "completed" : "active",
        completionDate: isComplete ? new Date() : null,
      },
    });

    if (isComplete) {
      const profile = await prisma.profile.findUnique({ where: { id: profileId } });
      if (profile) {
        await prisma.profile.update({
          where: { id: profileId },
          data: {
            lifetimeProjects: profile.lifetimeProjects + 1,
            gold: profile.gold + 200,
            lifetimeXp: profile.lifetimeXp + 500,
            currentXp: profile.currentXp + 500,
          },
        });
      }
    }

    revalidatePath("/legacy");
    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project." };
  }
}

// ─── SECOND BRAIN / KNOWLEDGE ACTIONS ────────────────────

// ─── CHRONOS ENGINE ACTIONS (V9) ──────────────────────────

export async function createHabit(data: { name: string, identityTag?: string }) {
  try {
    const profileId = await getProfileId();
    await prisma.habit.create({
      data: {
        profileId,
        name: data.name,
        identityTag: data.identityTag || null,
        frequency: "DAILY"
      }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating habit:", error);
    return { success: false };
  }
}

export async function completeHabit(habitId: string) {
  try {
    const habit = await prisma.habit.findUnique({ where: { id: habitId } });
    if (!habit) return { success: false };

    // Basic timezone naive 24h streak logic 
    const now = new Date();
    const last = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;
    let newStreak = habit.currentStreak;
    
    if (!last || (now.getTime() - last.getTime() > 24 * 60 * 60 * 1000)) {
       // Reset if more than 24h passed, otherwise increment
       newStreak = last && (now.getTime() - last.getTime() > 48 * 60 * 60 * 1000) ? 1 : newStreak + 1;
    } else {
       // Already completed recently, ignore
       return { success: true, ignored: true };
    }

    await prisma.habit.update({
      where: { id: habitId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, habit.longestStreak),
        totalCompletions: habit.totalCompletions + 1,
        lastCompletedAt: now,
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error completing habit:", error);
    return { success: false };
  }
}
