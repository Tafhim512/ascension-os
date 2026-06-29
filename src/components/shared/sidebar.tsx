"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Activity, Map, Settings, BookOpen, Shield, Sword, BarChart2, Brain, Cpu } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';

interface ProfileData {
  playerName: string;
  level: number;
  hunterRank: string;
}

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

export function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setProfile).catch(() => setProfile(null));
  }, []);

  return (
    <div className="w-64 h-screen border-r border-border bg-bg-secondary/50 backdrop-blur-xl flex flex-col hidden md:flex shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue tracking-widest">
          ASCENSION OS
        </h1>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-accent-blue/10 text-accent-cyan border border-accent-blue/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium tracking-wide text-sm">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </ScrollArea>
      
      <div className="px-6 py-6 border-t border-border mt-auto">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10 border border-accent-gold/40 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
            <AvatarFallback className="bg-bg-elevated text-accent-gold font-bold">
              {profile?.playerName?.substring(0, 2) || 'TF'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-text-primary">
              {profile?.playerName || 'Tafhim'}
            </p>
            <p className="text-xs text-text-muted">
              Rank {profile?.hunterRank || 'B'} • Lvl {profile?.level || 10}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
