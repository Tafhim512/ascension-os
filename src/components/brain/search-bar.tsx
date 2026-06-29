"use client";

import { useState } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";

interface SearchResult {
  similarity: number;
  type: string;
  id: string;
  text: string;
  metadata: Record<string, unknown>;
}

export function SemanticSearchBar({ onResults }: { onResults: (res: SearchResult[]) => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/brain/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        onResults(data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {loading ? (
          <Loader2 className="w-5 h-5 text-accent-cyan animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-text-muted group-focus-within:text-accent-cyan transition-colors" />
        )}
      </div>
      <input
        type="text"
        placeholder="Semantic search (e.g., 'ideas about artificial intelligence')..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-bg-elevated/40 border border-border/50 text-white rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all font-mono text-sm placeholder:text-text-muted/50"
      />
      <button 
        type="submit"
        disabled={loading || !query.trim()}
        className="absolute inset-y-0 right-2 flex items-center justify-center p-2 text-text-muted hover:text-accent-cyan disabled:opacity-30 disabled:hover:text-text-muted transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}
