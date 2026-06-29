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
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id, playerName }),
        });
      } catch {
        // profile will be created later on login if needed
      }
    }

    setLoading(false);
    return { success: true, needsConfirmation: !data.session };
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
        return { error: "Please verify your email before logging in." };
      }
      return { error: error.message };
    }

    if (data.user) {
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id, playerName: email.split("@")[0] }),
        });
      } catch {
        // continue anyway
      }
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
