"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, RefreshCw } from "lucide-react";

interface GraphData {
  nodes: { id: string; label: string; group: string; x?: number; y?: number; vx?: number; vy?: number }[];
  links: { source: string; target: string; value: number }[];
}

export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brain/graph");
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple custom force-directed graph layout
    const width = canvas.width;
    const height = canvas.height;
    
    // Initialize random positions
    data.nodes.forEach(n => {
      n.x = n.x ?? Math.random() * width;
      n.y = n.y ?? Math.random() * height;
      n.vx = 0;
      n.vy = 0;
    });

    let animationFrame: number;
    let alpha = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Forces Simulation
      if (alpha > 0.01) {
         // Repulsion
         for (let i = 0; i < data.nodes.length; i++) {
            for (let j = i + 1; j < data.nodes.length; j++) {
               const n1 = data.nodes[i];
               const n2 = data.nodes[j];
               
               let dx = n2.x! - n1.x!;
               let dy = n2.y! - n1.y!;
               let dist = Math.sqrt(dx * dx + dy * dy);
               if (dist === 0) dist = 0.01;
               
               // Repulsion force
               const force = (100 / dist) * alpha;
               const ax = (dx / dist) * force;
               const ay = (dy / dist) * force;
               
               n1.vx! -= ax; n1.vy! -= ay;
               n2.vx! += ax; n2.vy! += ay;
            }
         }

         // Attraction (Links)
         data.links.forEach(link => {
            const source = data.nodes.find(n => n.id === link.source);
            const target = data.nodes.find(n => n.id === link.target);
            if (source && target) {
               let dx = target.x! - source.x!;
               let dy = target.y! - source.y!;
               let dist = Math.sqrt(dx * dx + dy * dy);
               if (dist === 0) dist = 0.01;

               // Attraction force
               const force = (dist - 50) * 0.05 * alpha;
               const ax = (dx / dist) * force;
               const ay = (dy / dist) * force;
               
               source.vx! += ax; source.vy! += ay;
               target.vx! -= ax; target.vy! -= ay;
            }
         });

         // Center gravity
         data.nodes.forEach(n => {
            let dx = (width / 2) - n.x!;
            let dy = (height / 2) - n.y!;
            n.vx! += dx * 0.02 * alpha;
            n.vy! += dy * 0.02 * alpha;

            // Apply velocity friction & update
            n.vx! *= 0.8;
            n.vy! *= 0.8;
            n.x! += n.vx!;
            n.y! += n.vy!;
         });
         
         alpha *= 0.98;
      }

      // Draw Links
      ctx.lineWidth = 1;
      data.links.forEach(link => {
         const source = data.nodes.find(n => n.id === link.source);
         const target = data.nodes.find(n => n.id === link.target);
         if (source && target && source.x && source.y && target.x && target.y) {
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${link.value * 0.3})`;
            ctx.stroke();
         }
      });

      // Draw Nodes
      data.nodes.forEach(node => {
         if (node.x && node.y) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = node.group === 'Notes' ? '#a855f7' : '#06b6d4'; // purple / cyan
            ctx.fill();
            
            // Label
            if (alpha < 0.1) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.font = '10px Inter, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label, node.x, node.y + 15);
            }
         }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [data]);

  return (
    <div className="relative w-full h-[400px] border border-border/50 rounded-xl bg-bg-elevated/40 backdrop-blur-md overflow-hidden flex flex-col shadow-lg shadow-accent-cyan/5">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.1) 0%, transparent 70%)' }}></div>
      
      <div className="flex justify-between items-center p-4 relative z-10 border-b border-border/30 bg-black/20">
         <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Semantic Topology Array</h3>
            <p className="text-[10px] text-text-muted font-mono mt-0.5">Vector proximity mappings active</p>
         </div>
         <div className="flex gap-2">
            <button onClick={fetchGraph} className="p-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors" title="Recalculate Topology">
               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent-cyan' : ''}`} />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 text-white rounded transition-colors" title="Expand Graph">
               <Maximize2 className="w-4 h-4" />
            </button>
         </div>
      </div>

      <div className="flex-1 relative">
         {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-bg-primary/50 backdrop-blur-sm">
               <div className="text-accent-cyan font-mono text-sm animate-pulse flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-t-accent-cyan border-white/10 rounded-full animate-spin" />
                  Processing Vector Embeddings...
               </div>
            </div>
         )}
         <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            className="w-full h-full cursor-grab active:cursor-grabbing absolute inset-0 z-10"
            style={{ imageRendering: 'pixelated' }}
         />
      </div>
    </div>
  );
}
