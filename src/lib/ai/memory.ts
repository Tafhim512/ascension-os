/**
 * Memory Engine for Ascension OS
 * 
 * Provides local RAG (Retrieval-Augmented Generation) using:
 * - Ollama embeddings (nomic-embed-text or mxbai-embed-large)
 * - Cosine similarity search in pure TypeScript
 * - SQLite JSON storage for embedding vectors
 * 
 * For a personal OS with <10,000 entries, in-memory cosine search
 * is effectively instant (<10ms) and requires zero external infra.
 */

import { prisma } from "@/lib/db";
import { Ollama } from "ollama";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

const ollama = new Ollama({ host: OLLAMA_BASE_URL });

// ─── EMBEDDING GENERATION ──────────────────────────────────

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ollama.embed({
      model: EMBED_MODEL,
      input: text,
    });
    return response.embeddings[0];
  } catch (error) {
    console.error("Embedding generation failed. Is Ollama running with", EMBED_MODEL, "?", error);
    return [];
  }
}

// ─── COSINE SIMILARITY ─────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  
  return dotProduct / denominator;
}

// ─── MEMORY TYPES ───────────────────────────────────────────

export interface MemoryItem {
  id: string;
  type: "journal" | "knowledge" | "project" | "quest";
  content: string;
  date: Date;
  similarity: number;
  metadata?: Record<string, unknown>;
}

// ─── SEMANTIC SEARCH ────────────────────────────────────────

/**
 * Search all embedded memories for the most relevant context.
 * Returns top-K results sorted by cosine similarity.
 */
export async function searchMemories(
  profileId: string,
  query: string,
  topK: number = 5
): Promise<MemoryItem[]> {
  const queryEmbedding = await generateEmbedding(query);
  if (queryEmbedding.length === 0) return [];

  const results: MemoryItem[] = [];

  // Search journal entries
  const journals = await prisma.journalEntry.findMany({
    where: { profileId, embedding: { not: null } },
    select: { id: true, content: true, date: true, embedding: true, mood: true },
  });

  for (const j of journals) {
    if (!j.embedding) continue;
    const emb = JSON.parse(j.embedding) as number[];
    const sim = cosineSimilarity(queryEmbedding, emb);
    results.push({
      id: j.id,
      type: "journal",
      content: j.content.substring(0, 300),
      date: j.date,
      similarity: sim,
      metadata: { mood: j.mood },
    });
  }

  // Search knowledge items
  const knowledge = await prisma.knowledgeItem.findMany({
    where: { profileId, embedding: { not: null } },
    select: { id: true, title: true, content: true, embedding: true, category: true, createdAt: true },
  });

  for (const k of knowledge) {
    if (!k.embedding) continue;
    const emb = JSON.parse(k.embedding) as number[];
    const sim = cosineSimilarity(queryEmbedding, emb);
    results.push({
      id: k.id,
      type: "knowledge",
      content: `${k.title}: ${k.content.substring(0, 250)}`,
      date: k.createdAt,
      similarity: sim,
      metadata: { category: k.category },
    });
  }

  // Search projects
  const projects = await prisma.project.findMany({
    where: { profileId, embedding: { not: null } },
    select: { id: true, name: true, description: true, embedding: true, type: true, createdAt: true },
  });

  for (const p of projects) {
    if (!p.embedding) continue;
    const emb = JSON.parse(p.embedding) as number[];
    const sim = cosineSimilarity(queryEmbedding, emb);
    results.push({
      id: p.id,
      type: "project",
      content: `${p.name}: ${p.description || "No description"}`,
      date: p.createdAt,
      similarity: sim,
      metadata: { type: p.type },
    });
  }

  // Sort by similarity descending, return top K
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topK);
}

// ─── EMBED & STORE HELPERS ───────────────────────────────────

export async function embedJournalEntry(entryId: string, content: string) {
  const embedding = await generateEmbedding(content);
  if (embedding.length > 0) {
    await prisma.journalEntry.update({
      where: { id: entryId },
      data: { embedding: JSON.stringify(embedding) },
    });
  }
}

export async function embedKnowledgeItem(itemId: string, title: string, content: string) {
  const embedding = await generateEmbedding(`${title}. ${content}`);
  if (embedding.length > 0) {
    await prisma.knowledgeItem.update({
      where: { id: itemId },
      data: { embedding: JSON.stringify(embedding) },
    });
  }
}

export async function embedProject(projectId: string, name: string, description: string) {
  const embedding = await generateEmbedding(`${name}. ${description}`);
  if (embedding.length > 0) {
    await prisma.project.update({
      where: { id: projectId },
      data: { embedding: JSON.stringify(embedding) },
    });
  }
}

// ─── FORMAT FOR AI CONTEXT ──────────────────────────────────

/**
 * Formats search results into a string block the AI can use as context.
 */
export function formatMemoriesForPrompt(memories: MemoryItem[]): string {
  if (memories.length === 0) return "No relevant memories found.";

  return memories
    .map((m, i) => {
      const dateStr = m.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const typeLabel = m.type.charAt(0).toUpperCase() + m.type.slice(1);
      return `[Memory ${i + 1} | ${typeLabel} | ${dateStr} | Relevance: ${(m.similarity * 100).toFixed(0)}%]\n${m.content}`;
    })
    .join("\n\n");
}
