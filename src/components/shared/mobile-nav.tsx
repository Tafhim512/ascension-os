"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Activity, Shield, BookOpen, Settings, Brain, BarChart2, Map } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/" },
  { icon: Target, label: "Quests", href: "/quests" },
  { icon: Activity, label: "Skills", href: "/attributes" },
  { icon: Shield, label: "Bosses", href: "/bosses" },
  { icon: Brain, label: "Brain", href: "/brain" },
  { icon: BookOpen, label: "Journal", href: "/journal" },
  { icon: Map, label: "World", href: "/world" },
  { icon: BarChart2, label: "Stats", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Gradient fade above nav */}
      <div className="h-6 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
      <nav className="bg-bg-secondary/90 backdrop-blur-xl border-t border-border/50 px-1 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
               <Link key={item.href} href={item.href}>
                 <div className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 min-w-[56px] ${
                  isActive
                    ? "text-accent-cyan"
                    : "text-text-muted hover:text-text-secondary"
                }`}>
                  <div className={`relative ${isActive ? "drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : ""}`}>
                    <item.icon className="w-5 h-5" />
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-cyan" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
