"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const data = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 300 },
  { name: 'Wed', xp: 550 },
  { name: 'Thu', xp: 200 },
  { name: 'Fri', xp: 700 },
  { name: 'Sat', xp: 900 },
  { name: 'Sun', xp: 850 },
];

export function XpChart() {
  return (
    <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg">XP Output (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="xp" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AttributeRadar({ profile }: { profile: { attributes: { attributeId: string; level: number }[] } }) {
  // Format attributes for Recharts
  const formatData = profile.attributes
    .slice(0, 6) // Radar charts get messy with too many points
    .map((a: { attributeId: string; level: number }) => ({
      subject: a.attributeId.substring(0, 3), // short name
      full: a.attributeId,
      A: a.level,
      fullMark: 100
    }));

  return (
    <Card className="border-border/50 bg-bg-elevated/40 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg">Skill Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full flex items-center justify-center">
          {formatData.length >= 3 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formatData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Level" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelFormatter={(v) => formatData.find((d: { subject: string; full: string }) => d.subject === v)?.full || v}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-text-muted text-center">Need at least 3 attributes to map radar.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
