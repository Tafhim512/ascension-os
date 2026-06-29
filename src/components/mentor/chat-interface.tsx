"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Cpu, User } from "lucide-react";

export function ChatInterface() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "system_intro", content: "System Intelligence online. State your objective." }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: "user", content: input.trim() };
    const requestMessages = [...messages.filter(m => m.role !== "system_intro"), userMessage];
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to chat");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // Add a placeholder message for the assistant
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            lastMsg.content += chunk;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "ERROR: Connection to System Intelligence failed." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-bg-elevated/40 border border-border/50 rounded-xl backdrop-blur-md overflow-hidden relative shadow-lg shadow-accent-cyan/5">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] md:max-w-[75%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className="flex-shrink-0">
                {msg.role === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-accent-blue/20 border border-accent-blue/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-accent-blue" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan/50 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-accent-cyan" />
                  </div>
                )}
              </div>
              <div className={`p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap rounded-xl border ${
                msg.role === "user" 
                  ? "bg-accent-blue/10 border-accent-blue/30 text-white rounded-tr-none" 
                  : "bg-black/40 border-accent-cyan/20 text-text-secondary rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[75%] flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan/50 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-accent-cyan animate-pulse" />
              </div>
              <div className="p-4 bg-black/40 border border-accent-cyan/20 rounded-xl rounded-tl-none flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-black/60 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Talk to The System..."
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pr-12 focus:outline-none focus:border-accent-cyan/50 text-white font-mono text-sm resize-none h-12"
            rows={1}
            disabled={isStreaming}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 p-2 text-text-muted hover:text-accent-cyan transition-colors disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-text-muted mt-2 font-mono uppercase tracking-widest">
           RAG memory active. Context aware.
        </p>
      </div>
    </div>
  );
}
