"use client";

import { useState, useTransition } from "react";
import { Clock, Plus, Flame, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createHabit, completeHabit } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Habit {
  id: string;
  name: string;
  currentStreak: number;
  lastCompletedAt: Date | null;
}

export function HabitsWidget({ habits }: { habits: Habit[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAdd = () => {
    if (!newHabit.trim()) return;
    startTransition(async () => {
      await createHabit({ name: newHabit.trim() });
      setNewHabit("");
      setIsAdding(false);
      router.refresh();
    });
  };

  const handleComplete = (id: string, isAlreadyDone: boolean) => {
    if (isAlreadyDone) return;
    startTransition(async () => {
      await completeHabit(id);
      router.refresh();
    });
  };

  return (
    <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-accent-gold" />
            Chronos Habits
          </CardTitle>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-6 h-6 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {isAdding && (
          <div className="flex gap-2">
            <input 
              type="text" 
              autoFocus
              className="flex-1 bg-black/50 border border-border/50 rounded-lg px-3 py-1 text-sm outline-none focus:border-accent-gold/50"
              placeholder="E.g., Read 10 Pages..."
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button 
              onClick={handleAdd}
              disabled={isPending || !newHabit.trim()}
              className="px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs font-bold rounded-lg border border-accent-gold/30 hover:bg-accent-gold/30"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-3">
          {habits.length > 0 ? (
            habits.map((habit) => {
              const now = new Date();
              const last = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;
              // Very basic check if completed today (within last 16 hours for a lazy timezone check)
              const isCompletedToday = Boolean(last && (now.getTime() - last.getTime() < 16 * 60 * 60 * 1000));

              return (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-black/30 border border-border/30 rounded-xl group hover:border-accent-gold/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleComplete(habit.id, !!isCompletedToday)}
                      disabled={isPending || isCompletedToday}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors
                        ${isCompletedToday 
                          ? 'bg-accent-emerald border-accent-emerald text-black' 
                          : 'border-border/50 bg-transparent hover:border-accent-gold text-transparent hover:text-accent-gold/50'
                        }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <span className={`text-sm font-medium ${isCompletedToday ? 'text-text-muted line-through' : 'text-text-secondary'}`}>
                      {habit.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent-gold/10 text-accent-gold rounded border border-accent-gold/20 text-xs font-bold">
                    <Flame className="w-3 h-3" />
                    {habit.currentStreak}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-text-muted text-center py-4">No routines established.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
