"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Activity, Map, Settings, BookOpen, Shield, Sword, BarChart2, Brain, Cpu, Menu } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: 'Command Center', href: '/' },
  { icon: Target, label: 'Quests', href: '/quests' },
  { icon: Activity, label: 'Attributes', href: '/attributes' },
  { icon: Target, label: 'Future Self', href: '/future-self' },
  { icon: Brain, label: 'Second Brain', href: '/brain' },
  { icon: Cpu, label: 'System Mentor', href: '/mentor' },
  { icon: Shield, label: 'Bosses', href: '/bosses' },
  { icon: Sword, label: 'Journal', href: '/journal' },
  { icon: BookOpen, label: 'Legacy', href: '/legacy' },
  { icon: Map, label: 'World Map', href: '/world' },
  { icon: BarChart2, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { profile, loading } = useProfile();

  return (
    <>
      <div className="p-4 md:p-6">
        <h1 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue tracking-widest">
          ASCENSION OS
        </h1>
      </div>

      <ScrollArea className="flex-1 px-3 md:px-4">
        <div className="space-y-1 md:space-y-2 py-3 md:py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate}>
                <div className={`flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-cyan border border-accent-blue/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
                }`}>
                  <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="font-medium tracking-wide text-xs md:text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-4 md:px-6 py-4 md:py-6 border-t border-border mt-auto">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-accent-gold/40 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
            <AvatarFallback className="bg-bg-elevated text-accent-gold font-bold">
              {loading ? '...' : (profile?.playerName?.substring(0, 2) || 'TF')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs md:text-sm font-bold text-text-primary">
              {loading ? 'Loading...' : (profile?.playerName || 'Player 1')}
            </p>
            <p className="text-[10px] md:text-xs text-text-muted">
              Rank {profile?.hunterRank || 'F'} • Lvl {profile?.level ?? 1}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bg-primary/90 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="text-text-primary hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue tracking-widest">
            ASCENSION OS
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full bg-bg-primary border-r border-border flex flex-col shadow-2xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 h-screen border-r border-border bg-bg-secondary/50 backdrop-blur-xl flex-col shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
