import { Cpu } from "lucide-react";
import { ChatInterface } from "@/components/mentor/chat-interface";

export default function MentorPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center gap-3">
        <Cpu className="w-8 h-8 text-accent-cyan" />
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-500 tracking-tight">
            System Intelligence
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Your personal mentor, chief of staff, and data analyst.</p>
        </div>
      </header>

      <ChatInterface />
    </div>
  );
}
