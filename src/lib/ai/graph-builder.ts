import { prisma } from "@/lib/db";

// Simple cosine similarity (copied from memory.ts to use here without triggering ollama if not needed)
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
  
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

export async function buildKnowledgeGraph(profileId: string) {
  // Fetch all items with their embeddings
  const items = await prisma.knowledgeItem.findMany({
    where: { profileId },
    select: { id: true, title: true, category: true, embedding: true }
  });

  const nodes = items.map(item => ({
    id: item.id,
    label: item.title,
    group: item.category
  }));

  const links = [];
  const SIMILARITY_THRESHOLD = 0.75;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const e1 = items[i].embedding ? JSON.parse(items[i].embedding as string) : [];
      const e2 = items[j].embedding ? JSON.parse(items[j].embedding as string) : [];
      
      const sim = cosineSimilarity(e1, e2);
      if (sim > SIMILARITY_THRESHOLD) {
        links.push({
          source: items[i].id,
          target: items[j].id,
          value: sim
        });
      }
    }
  }

  return { nodes, links };
}
