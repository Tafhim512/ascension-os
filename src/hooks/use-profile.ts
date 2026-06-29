"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface ProfileData {
  playerName: string;
  level: number;
  hunterRank: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) {
            setProfile({ playerName: "Player 1", level: 1, hunterRank: "F" });
            setLoading(false);
          }
          return;
        }

        const res = await fetch(`/api/profile?userId=${encodeURIComponent(user.id)}`);
        if (res.ok) {
          const { profile } = await res.json();
          if (!cancelled) {
            setProfile({
              playerName: profile.playerName,
              level: profile.level,
              hunterRank: profile.hunterRank,
            });
          }
        } else if (!cancelled) {
          setProfile({ playerName: user.email?.split("@")[0] || "Player", level: 1, hunterRank: "F" });
        }
      } catch {
        if (!cancelled) {
          setProfile({ playerName: "Player 1", level: 1, hunterRank: "F" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const { data: { subscription } } = createClient().auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { profile, loading };
}
