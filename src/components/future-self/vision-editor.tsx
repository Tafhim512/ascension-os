"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Target } from "lucide-react";
import { createFutureSelf } from "@/app/actions/future-self-actions";

export function VisionEditor() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [archetype, setArchetype] = useState("");
  const [vision, setVision] = useState("");
  const [targetLevel, setTargetLevel] = useState("50");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await createFutureSelf({
      archetype,
      vision,
      targetLevel: parseInt(targetLevel) || 50,
    });
    
    setLoading(false);
    setOpen(false);
    
    // Reset
    setArchetype("");
    setVision("");
    setTargetLevel("50");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="inline-block">
        <Button 
          onClick={() => setOpen(true)}
          className="bg-accent-purple hover:bg-accent-purple/80 text-white font-bold tracking-wide"
        >
          <Plus className="w-4 h-4 mr-2" /> Defines New Future
        </Button>
      </div>
      <DialogContent className="sm:max-w-[425px] border-border/50 bg-bg-secondary/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-purple" />
            Define Future Self
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Archetype / Title</Label>
            <Input 
              placeholder="e.g. The Visionary Founder" 
              value={archetype} 
              onChange={(e) => setArchetype(e.target.value)}
              required
              className="bg-black/50 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Target Level</Label>
            <Input 
              type="number"
              placeholder="50" 
              value={targetLevel} 
              onChange={(e) => setTargetLevel(e.target.value)}
              required
              className="bg-black/50 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Core Vision</Label>
            <Textarea 
              placeholder="I am..." 
              value={vision} 
              onChange={(e) => setVision(e.target.value)}
              required
              className="bg-black/50 border-white/10 text-white h-24"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-accent-purple hover:bg-accent-purple/80">
              {loading ? "Forging..." : "Manifest Future"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
