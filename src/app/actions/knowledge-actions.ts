"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { embedKnowledgeItem } from "@/lib/ai/memory";
import { extractKnowledgeMetadata } from "@/lib/ai/knowledge";
import { getCurrentProfile } from "@/lib/auth";

export async function createKnowledgeItem(data: {
  title: string;
  content: string;
  source?: string;
  category?: string;
}) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { success: false, error: "You must be logged in." };

    const extraction = await extractKnowledgeMetadata(data.content);

    const item = await prisma.knowledgeItem.create({
      data: {
        profileId: profile.id,
        title: data.title,
        content: data.content,
        source: data.source || null,
        category: data.category || "Notes",
        tags: JSON.stringify(extraction.tags),
        keyIdeas: JSON.stringify(extraction.keyIdeas),
        aiReflection: extraction.summary,
      },
    });

    embedKnowledgeItem(item.id, data.title, data.content).catch((e) =>
      console.error("Knowledge Embed Failed", e)
    );

    revalidatePath("/brain");
    return { success: true };
  } catch (error) {
    console.error("Error creating knowledge item:", error);
    return { success: false, error: "Failed to create knowledge item." };
  }
}
