import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { getAiInsight } from "@/lib/ai/mentor";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    const insight = await getAiInsight(profile);
    
    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error("AI Insight Error:", error);
    return NextResponse.json({ error: "Failed to get insight" }, { status: 500 });
  }
}
