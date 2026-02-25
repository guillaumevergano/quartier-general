"use client";

import { useEffect, useState } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import { Action } from "@/types/database";

export function useRealtimeActions(initialActions: Action[] = []) {
  const [actions, setActions] = useState<Action[]>(initialActions);

  useEffect(() => {
    setActions(initialActions);
  }, [initialActions]);

  useEffect(() => {
    let channel: any | null = null;
    const client = getSupabasePublic(); if (!client) return;
    try {
      channel = client
        .channel("realtime-actions")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "actions" },
          (payload) => {
            setActions((prev) => [payload.new as Action, ...prev]);
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "actions" },
          (payload) => {
            setActions((prev) =>
              prev.map((a) => (a.id === (payload.new as Action).id ? (payload.new as Action) : a))
            );
          }
        )
        .subscribe();
    } catch {
      // Realtime unavailable — static data only
    }

    return () => {
      if (channel) {
        try { client.removeChannel(channel); } catch {}
      }
    };
  }, []);

  return actions;
}
