"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Target, Clock, Zap, ChevronDown } from "lucide-react";
import { createQuest } from "@/app/actions";

const QUEST_TYPES = ["MAIN", "DAILY", "SIDE", "ADVENTURE", "LEGENDARY"];
const DIFFICULTIES = ["COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
const IDENTITY_TAGS = ["Builder", "Athlete", "Thinker", "Leader", "Creator", "Scholar"];

const XP_PRESETS: Record<string, number> = {
  COMMON: 25,
  RARE: 50,
  EPIC: 100,
  LEGENDARY: 200,
  MYTHIC: 500,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  COMMON: "border-gray-500/30 text-gray-400",
  RARE: "border-accent-blue/30 text-accent-blue",
  EPIC: "border-accent-purple/30 text-accent-purple",
  LEGENDARY: "border-accent-gold/30 text-accent-gold",
  MYTHIC: "border-red-400/30 text-red-400",
};

interface CreateQuestModalProps {
  attributes?: { attributeId: string; }[];
}

export function CreateQuestModal({ attributes = [] }: CreateQuestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("DAILY");
  const [difficulty, setDifficulty] = useState("COMMON");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [identityTag, setIdentityTag] = useState("");
  const [targetAttribute, setTargetAttribute] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      await createQuest({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        difficulty,
        xpReward: XP_PRESETS[difficulty] || 25,
        goldReward: Math.floor((XP_PRESETS[difficulty] || 25) / 2),
        estimatedMinutes,
        identityTag: identityTag || undefined,
        attributeRewards: targetAttribute 
          ? JSON.stringify([{ attributeId: targetAttribute, xp: Math.floor((XP_PRESETS[difficulty] || 25) / 2) }])
          : undefined,
      });
      setTitle("");
      setDescription("");
      setType("DAILY");
      setDifficulty("COMMON");
      setEstimatedMinutes(30);
      setIdentityTag("");
      setTargetAttribute("");
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-primary font-bold rounded-lg
                   hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 text-sm tracking-wide"
      >
        <Plus className="w-4 h-4" />
        New Quest
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
              className="w-full max-w-lg bg-bg-secondary border border-border/50 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
                    <Target className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Create Quest</h2>
                    <p className="text-xs text-text-muted">Define your next mission</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Quest Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build the authentication system"
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/20 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this quest involve?"
                    rows={2}
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/20 transition-colors resize-none"
                  />
                </div>

                {/* Type & Difficulty */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white focus:border-accent-cyan/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {QUEST_TYPES.map((t) => (
                        <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Difficulty</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DIFFICULTIES.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`px-2.5 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${
                            difficulty === d
                              ? `${DIFFICULTY_COLORS[d]} bg-white/5`
                              : "border-border/30 text-text-muted hover:border-border"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time & Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                      <Clock className="w-3 h-3 inline mr-1" />Time (min)
                    </label>
                    <input
                      type="number"
                      value={estimatedMinutes}
                      onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
                      className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white focus:border-accent-cyan/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Identity Tag</label>
                    <select
                      value={identityTag}
                      onChange={(e) => setIdentityTag(e.target.value)}
                      className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white focus:border-accent-cyan/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">None</option>
                      {IDENTITY_TAGS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Target Attribute (Reward)</label>
                    <select
                      value={targetAttribute}
                      onChange={(e) => setTargetAttribute(e.target.value)}
                      className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white focus:border-accent-cyan/50 focus:outline-none transition-colors appearance-none cursor-pointer uppercase"
                    >
                      <option value="">None</option>
                      {attributes.map((a) => (
                        <option key={a.attributeId} value={a.attributeId}>{a.attributeId}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reward Preview */}
                <div className="bg-bg-primary border border-border/30 rounded-xl p-4">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Rewards</p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent-gold" />
                      <span className="font-black text-accent-gold">{XP_PRESETS[difficulty] || 25} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-accent-gold">🪙</span>
                      <span className="font-black text-accent-gold">{Math.floor((XP_PRESETS[difficulty] || 25) / 2)} Gold</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border/50 flex gap-3 justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-primary font-bold rounded-lg text-sm
                             hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Creating..." : "Create Quest"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
