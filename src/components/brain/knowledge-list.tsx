"use client";

import { useState } from "react";
import { SemanticSearchBar } from "./search-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, Link2 } from "lucide-react";

export function KnowledgeList({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchResults = (results: any[]) => {
    setIsSearchActive(true);
    // Semantic search returns mixed types (journals, knowledge, projects). We'll filter for knowledge or just display all.
    // For now, let's map search results to match knowledge item UI.
    const mappedItems = results
      .filter((r) => r.type === "knowledge")
      .map((r) => {
         return {
            id: r.id,
            title: r.metadata?.title || "Search Result",
            content: r.text,
            category: "Search Match",
            tags: "[]",
            keyIdeas: "[]",
            aiReflection: `Matched with ${(r.similarity * 100).toFixed(1)}% confidence`,
         };
      });
    setItems(mappedItems.length > 0 ? mappedItems : []);
  };

  const handleClearSearch = () => {
    setIsSearchActive(false);
    setItems(initialItems);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
         <div className="flex-1">
           <SemanticSearchBar onResults={handleSearchResults} />
         </div>
         {isSearchActive && (
           <button onClick={handleClearSearch} className="px-4 py-3 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
             Clear
           </button>
         )}
       </div>

       <div className="flex items-center gap-3 border-b border-border/50 pb-2">
         <Lightbulb className="w-5 h-5 text-accent-gold" />
         <h2 className="text-lg font-bold text-white">
            {isSearchActive ? "Semantic Search Results" : "Recent Knowledge Nodes"}
         </h2>
       </div>

      {items.length > 0 ? (
        items.map((item) => (
          <Card key={item.id} className="border-border/50 bg-bg-elevated/40 backdrop-blur-md hover:bg-bg-elevated/60 transition-colors group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-white font-black">{item.title}</CardTitle>
                <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded border border-white/5 uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
              {!isSearchActive && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {JSON.parse(item.tags).map((tag: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan text-[10px] font-bold uppercase rounded border border-accent-cyan/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-black/30 rounded-lg border-l-2 border-accent-purple/50">
                <p className="text-sm text-text-secondary italic">
                  <span className="font-bold text-accent-purple not-italic text-xs mr-2 uppercase tracking-wide">AI Summary:</span> 
                  {item.aiReflection}
                </p>
              </div>
              <div className="text-sm text-text-muted leading-relaxed line-clamp-3">
                {item.content}
              </div>
              
              {!isSearchActive && JSON.parse(item.keyIdeas).length > 0 && (
                <div className="pt-3 border-t border-border/30">
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Key Ideas</h4>
                  <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                    {JSON.parse(item.keyIdeas).map((idea: string, idx: number) => (
                      <li key={idx}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 text-xs font-bold text-accent-cyan uppercase tracking-wider">
                <Link2 className="w-3 h-3" /> Auto-Linked via Vector Semantic Search
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="py-20 text-center border border-dashed border-border/50 rounded-xl bg-bg-elevated/10">
          <Lightbulb className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-text-secondary">
             {isSearchActive ? "No matching concepts found." : "Your Brain is Empty"}
          </h3>
          <p className="text-text-muted mt-2 text-sm">
             {isSearchActive ? "Try a different search query." : "Add your first note, idea, or concept to seed the knowledge graph."}
          </p>
        </div>
      )}
    </div>
  );
}
