"use client";

import { useState } from "react";
import Link from "next/link";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, loading } = useSupabaseAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await signIn(email, password);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-bg-elevated/40 backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center text-white">
          System Access
        </CardTitle>
        <p className="text-xs text-center text-text-muted">
          Enter your credentials to resume your ascension.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              required
            />
          </div>
          {error && (
            <p className="text-xs text-accent-crimson">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-cyan hover:bg-accent-cyan/80 text-bg-primary font-bold"
          >
            {loading ? "Authenticating..." : "Login"}
          </Button>
          <p className="text-xs text-center text-text-muted">
            No account?{" "}
            <Link href="/signup" className="text-accent-cyan hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
