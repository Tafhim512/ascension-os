"use client";

import { Circle, Play } from "lucide-react";
import { useState, useTransition } from "react";
import { completeQuest } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FocusMode } from "./focus-mode";

import type { Quest } from "@prisma/client";

export function QuestCompleteButton({ questId, profileId, quest }: { questId: string, profileId: string, quest: Quest }) {
  const [isPending, startTransition] = useTransition();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    startTransition(async () => {
      const result = await completeQuest(questId, profileId);
      setIsFocusMode(false);
      
      if (result.success) {
        toast.success(`Quest Completed: +${result.xpGained} XP`);
        if (result.leveledUp) {
           toast.success(`LEVEL UP! You are now Level ${result.newLevel}`, { 
             description: "Your power has grown.",
             icon: "🔥"
           });
        }
      } else {
        toast.error("Failed to complete quest");
      }
      
      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsFocusMode(true)}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg hover:bg-accent-cyan hover:text-bg-primary transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3" /> Focus
        </button>

        <button 
          onClick={handleComplete}
          disabled={isPending}
          className={`p-2 rounded-full transition-all group-hover:bg-accent-cyan/20 ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
        >
          {isPending ? (
            <div className="w-6 h-6 border-2 border-t-accent-cyan border-r-accent-cyan border-b-transparent border-l-transparent rounded-full animate-spin" />
          ) : (
            <Circle className="w-6 h-6 text-text-muted group-hover:text-accent-cyan transition-colors" />
          )}
        </button>
      </div>

      {isFocusMode && (
        <FocusMode 
          quest={quest}
          onComplete={handleComplete}
          onCancel={() => setIsFocusMode(false)}
        />
      )}
    </>
  );
}
