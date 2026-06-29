import { callAI } from "./client";

export interface KnowledgeExtraction {
  summary: string;
  tags: string[];
  keyIdeas: string[];
}

/**
 * AI Knowledge Engine
 * 
 * Auto-extracts summaries, tags, and key ideas from raw user input,
 * transforming scattered notes into a structured Knowledge Graph node.
 */
export async function extractKnowledgeMetadata(content: string): Promise<KnowledgeExtraction> {
  const systemPrompt = `You are the Ascension OS Knowledge Engine.
The user has provided a raw note, article, or book excerpt.
Your job is to structure this raw data so it can be indexed into their Second Brain.

Extract:
1. A concise 1-sentence summary.
2. An array of 3-5 relevant tags (e.g., "productivity", "system_design", "stoicism").
3. An array of 1-3 bullet points representing the core "Key Ideas".

CRITICAL Output rule: You MUST output ONLY raw JSON data in the following format. Do not use Markdown backticks. Do not include introductory text.
{
  "summary": "...",
  "tags": ["...", "..."],
  "keyIdeas": ["...", "..."]
}`;

  const userPrompt = `RAW KNOWLEDGE:\n"${content}"\n\nExtract the JSON structure.`;

  try {
    const response = await callAI(systemPrompt, userPrompt, true);
    const parsed = JSON.parse(response);
    
    return {
      summary: parsed.summary || "No summary generated.",
      tags: Array.isArray(parsed.tags) ? parsed.tags : ["unsorted"],
      keyIdeas: Array.isArray(parsed.keyIdeas) ? parsed.keyIdeas : [],
    };
  } catch (error) {
    console.error("Knowledge extraction failed:", error);
    return {
      summary: content.substring(0, 100) + "...",
      tags: ["raw_note"],
      keyIdeas: [],
    };
  }
}
