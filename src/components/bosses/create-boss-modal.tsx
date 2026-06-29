"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Skull, Sword } from "lucide-react";
import { createBoss } from "@/app/actions";

const DIFFICULTIES = ["RARE", "EPIC", "LEGENDARY", "MYTHIC"];

export function CreateBossModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EPIC");
  const [deadline, setDeadline] = useState("");
  const [subtasks, setSubtasks] = useState([{ title: "", damage: 100 }]);

  const totalDamage = subtasks.reduce((sum, s) => sum + s.damage, 0);

  const addSubtask = () => setSubtasks([...subtasks, { title: "", damage: 100 }]);
  const removeSubtask = (idx: number) => setSubtasks(subtasks.filter((_, i) => i !== idx));
  const updateSubtask = (idx: number, field: "title" | "damage", value: string | number) => {
    const updated = [...subtasks];
    if (field === "title") updated[idx].title = value as string;
    else updated[idx].damage = value as number;
    setSubtasks(updated);
  };

  const handleSubmit = () => {
    if (!name.trim() || subtasks.some(s => !s.title.trim())) return;
    startTransition(async () => {
      await createBoss({
        name: name.trim(),
        description: description.trim() || undefined,
        difficulty,
        maxHp: totalDamage,
        deadline: deadline || undefined,
        xpReward: totalDamage,
        goldReward: Math.floor(totalDamage / 2),
        subtasks: subtasks.map(s => ({ title: s.title.trim(), damage: s.damage })),
      });
      setName("");
      setDescription("");
      setDifficulty("EPIC");
      setDeadline("");
      setSubtasks([{ title: "", damage: 100 }]);
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-crimson to-red-700 text-white font-bold rounded-lg
                   hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105 text-sm tracking-wide"
      >
        <Plus className="w-4 h-4" />
        New Boss
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
              className="w-full max-w-lg bg-bg-secondary border border-accent-crimson/20 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-crimson/10 border border-accent-crimson/30 flex items-center justify-center">
                    <Skull className="w-5 h-5 text-accent-crimson" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Create Boss</h2>
                    <p className="text-xs text-text-muted">Define a massive challenge to conquer</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Boss Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Final Exam, Project Launch"
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-crimson/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What makes this boss fearsome?"
                    rows={2}
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-crimson/50 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Difficulty</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DIFFICULTIES.map(d => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${
                            difficulty === d ? "border-accent-crimson/50 text-accent-crimson bg-accent-crimson/10" : "border-border/30 text-text-muted hover:border-border"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white focus:border-accent-crimson/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Attack Vectors */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                      <Sword className="w-3 h-3" /> Attack Vectors (Subtasks)
                    </label>
                    <button onClick={addSubtask} className="text-xs text-accent-cyan hover:text-accent-cyan/80 font-bold">
                      + Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {subtasks.map((s, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={s.title}
                          onChange={(e) => updateSubtask(idx, "title", e.target.value)}
                          placeholder="Subtask name"
                          className="flex-1 bg-bg-primary border border-border/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-text-muted/50 focus:border-accent-crimson/50 focus:outline-none transition-colors"
                        />
                        <input
                          type="number"
                          value={s.damage}
                          onChange={(e) => updateSubtask(idx, "damage", parseInt(e.target.value) || 0)}
                          className="w-20 bg-bg-primary border border-border/50 rounded-lg px-3 py-2.5 text-sm text-accent-crimson font-bold text-center focus:outline-none transition-colors"
                        />
                        {subtasks.length > 1 && (
                          <button onClick={() => removeSubtask(idx)} className="p-2 text-text-muted hover:text-accent-crimson transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Boss Preview */}
                <div className="bg-bg-primary border border-accent-crimson/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Boss Stats</p>
                  <div className="flex gap-6 text-sm">
                    <span className="text-accent-crimson font-black">HP: {totalDamage}</span>
                    <span className="text-accent-gold font-black">XP: {totalDamage}</span>
                    <span className="text-accent-gold font-black">🪙 {Math.floor(totalDamage / 2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex gap-3 justify-end">
                <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!name.trim() || subtasks.some(s => !s.title.trim()) || isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-accent-crimson to-red-700 text-white font-bold rounded-lg text-sm
                             hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Summoning..." : "Summon Boss"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
