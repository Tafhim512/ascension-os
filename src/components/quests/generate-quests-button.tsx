"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function GenerateQuestsButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-quests", { method: "POST" });
      if (res.ok) {
        router.refresh();
      } else {
        console.error("Failed to generate quests");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-accent-cyan/30 text-accent-cyan font-bold rounded-lg
                 hover:bg-accent-cyan/10 transition-all duration-300 hover:scale-105 text-sm tracking-wide disabled:opacity-50"
    >
      <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating ? "Consulting System..." : "AI Generate"}
    </button>
  );
}
