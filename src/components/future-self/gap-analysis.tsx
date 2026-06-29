"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Repeat, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function GapAnalysisWidget() {
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/ai/future-self/gap");
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data.analysis);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  if (loading) {
    return <div className="text-sm text-text-muted animate-pulse">The System is analyzing your gap...</div>;
  }

  if (analysis.length === 0) {
    return <div className="text-sm text-text-muted">No gap analysis available.</div>;
  }

  return (
    <div className="space-y-4">
      {analysis.map((item, idx) => (
        <Card key={idx} className="border-border/50 bg-bg-primary/50 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-purple/50"></div>
          <CardContent className="p-4 pl-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-accent-purple mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Gap: {item.category}
            </h4>
            <p className="text-sm text-text-secondary mb-3">{item.insight}</p>
            <div className="flex items-start gap-2 bg-black/40 p-3 rounded-lg border border-white/5">
              <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-0.5">Recommendation</span>
                <span className="text-sm font-medium text-white">{item.recommendation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
