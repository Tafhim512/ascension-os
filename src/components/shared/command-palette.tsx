"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Command, Search, Sparkles, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Handle Quick Navigation commands
    const q = query.toLowerCase();
    if (q === "/journal") return navigateTo("/journal");
    if (q === "/quests") return navigateTo("/quests");
    if (q === "/brain") return navigateTo("/brain");
    if (q === "/projects") return navigateTo("/legacy");

    // Standard AI Query via existing Insight logic (or future universal route)
    setIsTyping(true);
    setResponse(null);
    try {
      // For V8, we can simulate universal intelligence or fetch actual AI route if we have a direct Q&A API
      // Since /api/ai/insight provides general analytics, let's just use it as a stand-in or mock response 
      // for the universal overlay until a dedicated /api/ai/chat is made.
      setTimeout(() => {
        setResponse("The System has received your query. In future versions, this will hook directly into your local vector database to provide cross-modal life intelligence across all modules.");
        setIsTyping(false);
      }, 1000);
    } catch {
      setIsTyping(false);
    }
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm p-4 flex items-start justify-center pt-[15vh]"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-bg-elevated border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleQuery} className="flex items-center gap-3 p-4 border-b border-border/30">
              <Search className="w-5 h-5 text-accent-cyan" />
              <input
                type="text"
                autoFocus
                placeholder="Ask The System, or type / to navigate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-text-muted text-lg"
              />
              <div className="flex gap-1 text-[10px] font-bold text-text-muted bg-white/5 px-2 py-1 rounded">
                <Command className="w-3 h-3" /> K
              </div>
            </form>

            <div className="p-2 max-h-[300px] overflow-y-auto">
              {!query && !response && !isTyping && (
                <div className="p-4 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Fast Travel</div>
                  {[
                    { cmd: '/quests', icon: Target, label: 'Active Quests', color: 'text-accent-emerald' },
                    { cmd: '/brain', icon: Brain, label: 'Second Brain', color: 'text-accent-cyan' },
                    { cmd: '/journal', icon: Zap, label: 'Journal', color: 'text-accent-purple' },
                  ].map((item) => (
                    <button
                      key={item.cmd}
                      onClick={() => navigateTo(item.cmd)}
                      className="w-full flex items-center gap-3 p-3 text-sm text-text-secondary hover:bg-white/5 rounded-lg group transition-colors text-left"
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="font-bold flex-1 group-hover:text-white transition-colors">{item.label}</span>
                      <span className="text-[10px] font-mono text-text-muted bg-black/50 px-2 py-1 rounded">{item.cmd}</span>
                    </button>
                  ))}
                </div>
              )}

              {isTyping && (
                <div className="p-8 text-center text-accent-cyan flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-t-accent-cyan border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Querying RAG Memory Matrix...</span>
                </div>
              )}

              {response && (
                <div className="p-6">
                   <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-cyan mb-2 flex items-center gap-2">
                         <Sparkles className="w-3 h-3" /> System Response
                      </h4>
                      <p className="text-sm leading-relaxed text-white">
                         {response}
                      </p>
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
