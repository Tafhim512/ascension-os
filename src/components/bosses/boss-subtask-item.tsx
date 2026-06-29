"use client";

import { useTransition } from "react";
import { Sword, CheckCircle2 } from "lucide-react";
import { completeBossSubtask } from "@/app/actions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface BossSubtaskItemProps {
  subtask: {
    id: string;
    title: string;
    damage: number;
    isCompleted: boolean;
  };
  bossId: string;
}

export function BossSubtaskItem({ subtask, bossId }: BossSubtaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleComplete = () => {
    if (subtask.isCompleted) return;
    startTransition(async () => {
      const result = await completeBossSubtask(subtask.id, bossId);
      
      if (result.success) {
         toast.success(`DEALT ${result.damage} DAMAGE!`);
         if (result.isDefeated) {
            toast.success("BOSS DEFEATED!", {
               description: "You have conquered this challenge.",
               icon: "💀"
            });
         }
      } else {
         toast.error("Failed to attack boss");
      }
      
      router.refresh();
    });
  };

  return (
    <motion.div
      whileHover={{ scale: subtask.isCompleted ? 1 : 1.01 }}
      className={`flex items-center justify-between p-3 border rounded transition-all cursor-pointer group/task ${
        subtask.isCompleted
          ? "bg-accent-emerald/5 border-accent-emerald/20"
          : "bg-black/40 border-white/5 hover:border-accent-gold/40"
      }`}
      onClick={handleComplete}
    >
      <div className="flex items-center gap-3">
        {subtask.isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
        ) : isPending ? (
          <div className="w-5 h-5 border-2 border-t-accent-crimson border-r-accent-crimson border-b-transparent border-l-transparent rounded-full animate-spin" />
        ) : (
          <Sword className="w-5 h-5 text-text-muted group-hover/task:text-accent-crimson transition-colors" />
        )}
        <span className={`text-sm font-medium ${subtask.isCompleted ? "line-through text-text-muted" : "text-text-primary"}`}>
          {subtask.title}
        </span>
      </div>
      {!subtask.isCompleted && (
        <span className="text-xs font-black text-accent-crimson bg-accent-crimson/10 px-2 py-1 rounded">
          -{subtask.damage} HP
        </span>
      )}
    </motion.div>
  );
}
