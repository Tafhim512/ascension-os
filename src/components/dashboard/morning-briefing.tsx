"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Cpu, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MorningBriefingWidget() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchBriefing(force = false) {
    if (!force) {
      const cached = localStorage.getItem("ascension_briefing");
      const cacheTime = localStorage.getItem("ascension_briefing_time");
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime) < 10800000)) {
        setBriefing(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/briefing");
      if (res.ok) {
        const data = await res.json();
        const parsedBriefing = typeof data.briefing === 'string' ? data.briefing : JSON.stringify(data.briefing);
        setBriefing(parsedBriefing);
        localStorage.setItem("ascension_briefing", parsedBriefing);
        localStorage.setItem("ascension_briefing_time", Date.now().toString());
      } else {
        setBriefing("System offline. Execute your daily protocols manually.");
      }
    } catch {
      setBriefing("System offline. Execute your daily protocols manually.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBriefing();
  }, []);

  if (loading) {
     return (
        <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md mb-6 animate-pulse">
           <CardContent className="p-4 flex items-center gap-4">
              <Cpu className="w-8 h-8 text-accent-cyan/50" />
              <div className="h-4 bg-bg-primary/50 rounded w-full"></div>
           </CardContent>
        </Card>
     );
  }

  return (
    <Card className="border-accent-cyan/20 bg-bg-elevated/40 backdrop-blur-md relative overflow-hidden group mb-6 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan"></div>
      <CardContent className="p-4 md:p-6 relative z-10 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-shrink-0">
           <div className="w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center relative">
              <Cpu className="w-6 h-6 text-accent-cyan" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-accent-emerald rounded-full border-2 border-bg-elevated animate-pulse"></div>
           </div>
        </div>
        
        <div className="flex-1">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-accent-cyan mb-1 flex items-center gap-2">
              System Briefing
           </h3>
            <p className="text-sm font-medium text-white leading-relaxed">
              &ldquo;{briefing}&rdquo;
            </p>
        </div>

        <button 
           onClick={() => fetchBriefing(true)} 
           disabled={loading} 
           className="absolute top-4 right-4 text-text-muted hover:text-accent-cyan transition-colors disabled:opacity-50"
        >
           <RefreshCcw className="w-4 h-4" />
        </button>
      </CardContent>
    </Card>
  );
}
