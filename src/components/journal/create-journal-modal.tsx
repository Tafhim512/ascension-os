"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, BookOpen } from "lucide-react";
import { createJournalEntry } from "@/app/actions";

const MOODS = [
  { value: "great", label: "Great", icon: "😊", color: "text-accent-emerald border-accent-emerald/30" },
  { value: "good", label: "Good", icon: "🙂", color: "text-accent-cyan border-accent-cyan/30" },
  { value: "neutral", label: "Neutral", icon: "😐", color: "text-text-secondary border-border" },
  { value: "low", label: "Low", icon: "😔", color: "text-accent-blue border-accent-blue/30" },
  { value: "bad", label: "Bad", icon: "😞", color: "text-accent-crimson border-accent-crimson/30" },
];

  import { useRouter } from "next/navigation";

  export function CreateJournalModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("");
    const [energyLevel, setEnergyLevel] = useState(70);
    const router = useRouter();

    const handleSubmit = () => {
      if (!content.trim()) return;
      startTransition(async () => {
        const res = await createJournalEntry({
          content: content.trim(),
          mood: mood || undefined,
          energyLevel,
        });
        
        setContent("");
        setMood("");
        setEnergyLevel(70);
        setIsOpen(false);

        // Background AI Reflection
        if (res.success && res.entryId) {
          fetch("/api/ai/reflect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entryId: res.entryId, content }),
          }).then(() => {
            router.refresh();
          }).catch(console.error);
        }
      });
    };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-purple to-purple-700 text-white font-bold rounded-lg
                   hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300 hover:scale-105 text-sm tracking-wide"
      >
        <Plus className="w-4 h-4" />
        New Entry
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-bg-secondary border border-accent-purple/20 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-accent-purple" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Journal Entry</h2>
                    <p className="text-xs text-text-muted">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Mood */}
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">How are you feeling?</label>
                  <div className="flex gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setMood(m.value)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${
                          mood === m.value ? `${m.color} bg-white/5` : "border-border/30 text-text-muted hover:border-border"
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy */}
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                    Energy Level: <span className="text-accent-emerald">{energyLevel}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full accent-accent-emerald"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Your thoughts</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? Reflect on your day, wins, losses, and lessons..."
                    rows={6}
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-purple/50 focus:outline-none focus:ring-1 focus:ring-accent-purple/20 transition-colors resize-none leading-relaxed"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex gap-3 justify-end">
                <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-accent-purple to-purple-700 text-white font-bold rounded-lg text-sm
                             hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
