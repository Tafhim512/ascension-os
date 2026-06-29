"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Disc, Play, Pause } from "lucide-react";

import type { Quest } from "@prisma/client";

interface FocusModeProps {
  quest: Quest;
  onComplete: () => void;
  onCancel: () => void;
}

export function FocusMode({ quest, onComplete, onCancel }: FocusModeProps) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] bg-black bg-grid-white/[0.02] flex flex-col items-center justify-center p-6 overflow-hidden"
      >
        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/10 via-transparent to-accent-cyan/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Top HUD */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 w-full max-w-6xl mx-auto px-4 md:px-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 border border-border/50 rounded-lg flex items-center justify-center bg-black/50 backdrop-blur-md">
                <Disc className="w-5 h-5 text-accent-cyan animate-[spin_4s_linear_infinite]" />
             </div>
             <div>
                <div className="text-xs font-black uppercase tracking-widest text-accent-cyan">Execution Protocol</div>
                <div className="text-[10px] text-text-muted">Deep Work Session Active</div>
             </div>
          </div>
          
          <button onClick={onCancel} className="px-4 py-2 border border-border/50 rounded-lg bg-black/50 text-text-muted hover:text-white hover:border-border transition-colors text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            Abort Protocol
          </button>
        </div>

        {/* Core Quest Context */}
        <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
          
          <div className="space-y-4">
             <span className="inline-block px-3 py-1 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 rounded-md text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                Active Objective
             </span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {quest.title}
            </h1>
            {quest.description && (
               <p className="text-lg text-text-secondary max-w-xl mx-auto">
                 {quest.description}
               </p>
            )}
          </div>

          <div className="py-8">
             <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter tabular-nums drop-shadow-2xl">
               {formatTime(seconds)}
             </div>
          </div>

          <div className="flex justify-center items-center gap-6">
            <button
               onClick={() => setIsActive(!isActive)}
               className="w-16 h-16 rounded-full border border-border/50 bg-black/50 hover:bg-white/5 flex items-center justify-center backdrop-blur-md transition-all hover:scale-105"
            >
               {isActive ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
            </button>
            <button
               onClick={onComplete}
               className="px-8 py-5 rounded-full bg-gradient-to-r from-accent-cyan to-blue-600 text-bg-primary font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
            >
               Execute Module
            </button>
          </div>
        </div>

        {/* AI Passive Monitor */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-black/80 border border-accent-purple/30 rounded-full backdrop-blur-xl">
           <Brain className="w-4 h-4 text-accent-purple" />
           <span className="text-xs font-medium text-text-secondary">The System is monitoring your focus state. Eliminate distractions.</span>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
