"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, BrainCircuit, Sparkles } from "lucide-react";
import { createKnowledgeItem } from "@/app/actions/knowledge-actions";
import { useRouter } from "next/navigation";

export function AddKnowledgeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Framework");
  const router = useRouter();

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    startTransition(async () => {
      await createKnowledgeItem({
        title,
        content,
        category,
      });
      setTitle("");
      setContent("");
      setCategory("Framework");
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-cyan to-blue-600 text-bg-primary font-bold rounded-lg
                   hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-105 text-sm tracking-wide"
      >
        <Plus className="w-4 h-4" />
        Inject Knowledge
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
              className="w-full max-w-xl bg-bg-secondary border border-accent-cyan/20 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      New Knowledge Node 
                      <span className="bg-accent-purple/20 text-accent-purple text-[9px] px-1.5 py-0.5 rounded border border-accent-purple/30 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Summarized
                      </span>
                    </h2>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Title / Concept Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cognitive Reappraisal"
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-cyan/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white focus:border-accent-cyan/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {["Framework", "Mental Model", "Quote", "Article Summary", "Raw Note", "Startup Idea"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Raw Brain Dump</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the raw text, notes, or thoughts here. The OS will auto-summarize, extract key ideas, tag it, and map it into your semantic knowledge graph..."
                    rows={6}
                    className="w-full bg-bg-primary border border-border/50 rounded-lg px-4 py-3 text-sm text-white placeholder-text-muted/50 focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/20 transition-colors resize-none leading-relaxed"
                  />
                </div>
                
                <div className="p-3 border border-accent-purple/20 bg-accent-purple/5 rounded-lg">
                  <p className="text-xs text-accent-purple/80 italic leading-relaxed">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    When you click inject, your local AI model will read this block, extract 3 core ideas, assign global tags, and embed it for RAG search.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex gap-3 justify-end">
                <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !content.trim() || isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-accent-cyan to-blue-600 text-bg-primary font-bold rounded-lg text-sm
                             hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Indexing..." : "Inject Node"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
