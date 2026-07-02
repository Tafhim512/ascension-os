"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Brain } from "lucide-react";
import { createAttribute } from "@/app/actions";

export function AddAttributeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [attributeName, setAttributeName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!attributeName.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await createAttribute(attributeName.trim());
        if (result?.error) {
          setError(result.error);
          return;
        }
        setAttributeName("");
        setIsOpen(false);
      } catch (e) {
        console.error(e);
        setError("Unexpected error. Please try again.");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-primary font-bold rounded-lg
                   hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 text-sm"
      >
        <Plus className="w-4 h-4" />
        New Attribute
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
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-sm bg-bg-secondary border border-border/50 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <h2 className="text-md font-black text-white">Create Attribute</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Attribute Name</label>
                <input
                  type="text"
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  placeholder="e.g. MUSIC, SAAS SALES, MEDITATION"
                  className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/20 transition-colors uppercase"
                />
                {error && (
                  <p className="text-xs text-red-400 mt-2">{error}</p>
                )}
                <p className="text-xs text-text-muted mt-3 leading-relaxed">
                  Spaces will be replaced with underscores. Attributes start at Level 1 and can be leveled up by assigning them as rewards for custom quests.
                </p>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border/50 flex gap-3 justify-end bg-bg-elevated/20">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!attributeName.trim() || isPending}
                  className="px-5 py-2 bg-accent-cyan text-bg-primary font-bold rounded-lg text-sm
                             hover:bg-cyan-400 transition-all disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
