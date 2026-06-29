"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSupabaseAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signUp(email: string, password: string, playerName: string) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
      },
    });

    if (error) {
      setLoading(false);
      return { error: error.message };
    }

    if (data.user) {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id, playerName }),
      });
    }

    setLoading(false);
    router.push("/login?message=Check your email to confirm");
    return { success: true };
  }

  async function signIn(email: string, password: string) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        return { error: "Please verify your email address before logging in. Check your inbox." };
      }
      return { error: error.message };
    }

    if (data.user) {
      // Fallback: If for some reason the profile wasn't created during signup, try now
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id, playerName: email.split("@")[0] }),
      });
    }

    router.push("/");
    router.refresh();
    return { success: true };
  }

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/login");
  }

  return { signUp, signIn, signOut, loading };
}