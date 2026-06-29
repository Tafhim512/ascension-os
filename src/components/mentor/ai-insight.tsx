"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Cpu, RefreshCcw, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AiMentorWidget() {
  const [insight, setInsight] = useState("Connecting to the System neural network...");
  const [loading, setLoading] = useState(true);

  async function fetchInsight(force = false) {
    if (!force) {
      const cached = localStorage.getItem("ascension_daily_insight");
      const cacheTime = localStorage.getItem("ascension_daily_insight_time");
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime) < 21600000)) {
        setInsight(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/insight");
      if (res.ok) {
        const data = await res.json();
        setInsight(data.insight);
        localStorage.setItem("ascension_daily_insight", data.insight);
        localStorage.setItem("ascension_daily_insight_time", Date.now().toString());
      } else {
        setInsight("System offline. Execute your daily protocols manually.");
      }
    } catch {
      setInsight("System offline. Execute your daily protocols manually.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Cpu className="w-24 h-24 text-accent-cyan" />
      </div>
      <CardContent className="p-6 relative z-10 space-y-4">
        <div className="flex justify-between items-center">
           <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-accent-cyan shadow-sm">
             <Sparkles className="w-3 h-3" /> System Intelligence
           </h3>
            <button onClick={() => fetchInsight(true)} disabled={loading} className="text-text-muted hover:text-accent-cyan transition-colors disabled:opacity-50">
             <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
        
         <p className="text-sm font-medium text-text-primary leading-relaxed border-l-2 border-accent-cyan/50 pl-4 py-1 italic">
            &ldquo;{insight}&rdquo;
         </p>
      </CardContent>
    </Card>
  );
}
