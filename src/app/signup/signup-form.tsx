"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signUp, loading } = useSupabaseAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!playerName.trim()) {
      setError("Player name is required.");
      return;
    }
    const result = await signUp(email, password, playerName.trim());
    if (result?.error) {
      setError(result.error);
    } else if (result?.needsConfirmation) {
      setSuccess("Account created! Please check your email to confirm, then come back and log in.");
    } else {
      setSuccess("Account created! Logging you in...");
      setTimeout(() => router.push("/"), 1000);
    }
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-bg-elevated/40 backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center text-white">
          Begin Ascension
        </CardTitle>
        <p className="text-xs text-center text-text-muted">
          Create your account and start your journey.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Player Name</Label>
            <Input
              id="playerName"
              placeholder="Tafhim"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              required
            />
          </div>
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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              required
              minLength={6}
            />
          </div>
          {error && (
            <p className="text-xs text-accent-crimson">{error}</p>
          )}
          {success && (
            <p className="text-xs text-accent-emerald">{success}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-purple hover:bg-accent-purple/80 text-white font-bold"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="text-xs text-center text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-cyan hover:underline">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
